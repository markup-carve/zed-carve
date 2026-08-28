/**
 * What `languages/carve/highlights.scm` actually paints.
 *
 * The rest of CI reads the PARSE TREE, or asks the tree-sitter CLI whether a
 * query compiles. Neither can see which of two overlapping patterns an editor
 * ends up showing, and a query file is not a list of independent facts: several
 * patterns claim the same node, and only one color reaches the screen. A
 * pattern that never wins is indistinguishable from a pattern that is not there,
 * and both stay green under `tree-sitter query` alone, which prints every match.
 *
 * RESOLUTION RULE. Zed has no `(#set! priority N)`; it paints overlapping
 * captures in the order they are emitted, and the later one wins. That is
 * already how this query file expresses precedence - `(code) @none` sits below
 * the `@text.literal` block rather than outranking it - so this script resolves
 * the same way: at a given start position, the last capture that names a color
 * is the winner. Upstream tree-sitter-carve writes the same outcome with
 * explicit priorities; the orders agree, which is what makes the port faithful.
 *
 * The parser comes from the revision pinned in `extension.toml`, resolved the
 * way the workflow resolves it, so this checks the queries against the grammar
 * this extension actually ships against.
 *
 * Run (with a grammar registered for `--scope text.carve`):
 *
 *   node scripts/highlight-captures.mjs
 *
 * Environment:
 *   TS_CLI          command that runs the tree-sitter CLI, split on spaces.
 *                   Default `tree-sitter`; CI passes `npx --yes tree-sitter-cli@<v>`.
 *   TS_CONFIG_PATH  optional path to an alternative tree-sitter config.json.
 */
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const QUERY = resolve(__dirname, '../languages/carve/highlights.scm');

/*
 * Captures that are not a COLOR. `none` clears an inherited highlight and
 * `conceal`/`spell`/`nospell` mark a range for something other than the
 * painter. They land on the same nodes the color patterns do, so counting them
 * would answer a different question than the one each case below asks.
 */
const NOT_A_COLOR = new Set(['none', 'conceal', 'spell', 'nospell']);

/*
 * Composite figures (PART 9 4c, markup-carve/carve#1215). Each case names the
 * node by where it starts, because the whole point is which of two
 * same-looking kind words gets which color.
 */
const CASES = [
    {
        name: 'a bare figure opener is a composite figure',
        source: '::: figure\n![one](a.png)\n^ (a) One\n:::\n^ Figure #: Group caption\n',
        at: [0, 4],
        expect: 'type.builtin',
    },
    {
        name: 'a quoted title keeps it a generic container',
        source: '::: figure "A titled figure div"\nx\n:::\n^ Not a group caption\n',
        at: [0, 4],
        expect: 'type',
    },
    {
        name: 'a [label] keeps it a generic container',
        source: '::: figure [g]\nx\n:::\n',
        at: [0, 4],
        expect: 'type',
    },
    {
        name: 'the outer opener of a nested pair is the group',
        source: '::: figure\n:::: figure\nx\n::::\n:::\n',
        at: [0, 4],
        expect: 'type.builtin',
    },
    {
        name: 'the inner opener of a nested pair is a generic container',
        source: '::: figure\n:::: figure\nx\n::::\n:::\n',
        at: [1, 5],
        expect: 'type',
    },
    {
        name: 'a bare opener one container deep inside a group is generic',
        source: '::: figure\n:::: note\n::::: figure\nx\n:::::\n::::\n:::\n',
        at: [2, 6],
        expect: 'type',
    },
    {
        name: 'a bare opener inside a quote inside a group is generic',
        source: '::: figure\n> quoted\n>\n> :::: figure\n> x\n> ::::\n:::\n',
        at: [3, 7],
        expect: 'type',
    },
    {
        name: 'a bare opener inside a list item inside a group is generic',
        source: '::: figure\n- item\n\n  :::: figure\n  x\n  ::::\n:::\n',
        at: [3, 7],
        expect: 'type',
    },
    {
        name: 'the intervening container itself keeps its own capture',
        source: '::: figure\n:::: note\n::::: figure\nx\n:::::\n::::\n:::\n',
        at: [1, 5],
        expect: 'type',
    },
    {
        name: 'a group inside another container kind is still a group',
        source: '::: note\n:::: figure\nx\n::::\n:::\n',
        at: [1, 5],
        expect: 'type.builtin',
    },
    {
        name: 'another kind word is a generic container',
        source: '::: note\nx\n:::\n',
        at: [0, 4],
        expect: 'type',
    },
    {
        name: 'the group caption after the closing fence is a caption',
        source: '::: figure\nx\n:::\n^ Figure #: Group caption\n',
        at: [3, 2],
        expect: 'emphasis',
    },
    /*
     * The separator is a SPACE run and never a tab (grammar PART 7). A tab makes
     * the line a paragraph, so there is no `class_name` to color at all, and the
     * composite-figure pattern must not reach it.
     */
    {
        name: 'a tab after the fence is a paragraph, not a figure opener',
        source: ':::\tfigure\nx\n:::\n',
        at: [0, 4],
        expect: null,
    },
    /*
     * Both controls exist because a resolver that always answered `type.builtin`
     * and one that always answered null would each pass some of the rows above
     * without reading anything.
     */
    {
        name: 'control: plain prose has no color at all',
        source: 'plain prose\n',
        at: [0, 0],
        expect: null,
    },
    {
        name: 'control: a bare figure inside no group is not restored to generic',
        source: ':::: figure\nx\n::::\n',
        at: [0, 5],
        expect: 'type.builtin',
    },

    /*
     * WHAT THE GRAMMAR BUMP BROUGHT. Each row is a node the pinned grammar did
     * not have before, so each is a capture this file could not have carried -
     * and most are constructs whose CONTENT already colors itself, which is
     * what makes an absent capture look like a working one.
     */
    {
        // The node starts at the space in front of the opener, not at the
        // brace - `(braced_comment [0, 1] - [0, 20])` for the source below.
        name: 'a braced comment is a comment',
        source: 'a {% not bold *b* %} z\n',
        at: [0, 1],
        expect: 'comment',
    },
    {
        name: 'a crossref with auto text is link text, not a URL',
        source: '# Intro\n\nsee </#intro>\n',
        at: [2, 4],
        expect: 'link_text',
    },
    {
        name: 'an inline note is painted whole',
        source: 'x ^[a note] c\n',
        at: [0, 2],
        expect: 'link_text',
    },
    {
        name: 'the line block sigil is painted',
        source: '::: |\na\n:::\n',
        at: [0, 4],
        expect: 'punctuation.special',
    },
    {
        name: 'the fenced block quote sigil is painted',
        source: '::: >\na\n:::\n',
        at: [0, 4],
        expect: 'punctuation.special',
    },
    {
        name: 'the local hard-break sigil is painted',
        source: '::: \\\na\n:::\n',
        at: [0, 4],
        expect: 'punctuation.special',
    },
];

const dir = mkdtempSync(join(tmpdir(), 'zed-carve-captures-'));
try {
    const paths = CASES.map((testCase, index) => {
        const path = join(dir, `case-${String(index).padStart(2, '0')}.crv`);
        writeFileSync(path, testCase.source);
        return path;
    });

    const cli = (process.env.TS_CLI ?? 'tree-sitter').split(' ').filter(Boolean);
    const config = process.env.TS_CONFIG_PATH ? ['--config-path', process.env.TS_CONFIG_PATH] : [];
    const args = [...cli.slice(1), 'query', '--scope', 'text.carve', ...config, '--captures', QUERY, ...paths];
    const run = spawnSync(cli[0], args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

    if (run.status !== 0) {
        console.log(`highlight captures: the query did not run (exit ${run.status})`);
        console.log(run.stdout ?? '');
        console.log(run.stderr ?? '');
        process.exit(1);
    }

    /*
     * `--captures` prints one line per source file, then one indented line per
     * capture in the order an editor would receive them.
     *
     * A file header is recognized by matching a path that was actually passed,
     * NOT by "this line is not indented". A capture's text is printed inline and
     * a capture spanning a newline therefore breaks its own line, leaving the
     * closing backtick alone in column 0 - which the indentation test read as
     * the start of another file and dropped every later capture into a bucket
     * nothing looked up. That is exactly the blockquote case here, and it
     * reported a real pattern as not matching.
     */
    const pending = new Set(paths);
    const byFile = new Map();
    let current = null;
    for (const line of run.stdout.split('\n')) {
        const candidate = line.trim();
        if (pending.has(candidate)) {
            pending.delete(candidate);
            current = basename(candidate);
            byFile.set(current, []);
            continue;
        }
        const match = /capture:\s*\d+\s*-\s*([\w.]+),\s*start:\s*\((\d+),\s*(\d+)\)/.exec(line);
        if (match && current) {
            byFile.get(current).push({ name: match[1], row: Number(match[2]), column: Number(match[3]) });
        }
    }

    const fails = [];
    CASES.forEach((testCase, index) => {
        const file = basename(paths[index]);
        const captures = byFile.get(file);
        if (!captures) {
            fails.push(`FAIL ${testCase.name}\n   the query printed nothing for ${file}`);
            return;
        }
        const [row, column] = testCase.at;
        const winner = captures
            .filter((capture) => capture.row === row && capture.column === column)
            .filter((capture) => !capture.name.startsWith('_') && !NOT_A_COLOR.has(capture.name))
            .at(-1);
        const got = winner ? winner.name : null;
        if (got !== testCase.expect) {
            fails.push(
                `FAIL ${testCase.name}\n   at ${row}:${column} the winning capture is ${got}, expected ${testCase.expect}`,
            );
        }
    });

    if (fails.length) {
        console.log(`highlight captures: ${fails.length} of ${CASES.length} failing`);
        for (const failure of fails) console.log(failure);
        process.exit(1);
    }

    console.log(`highlight captures: ${CASES.length} shapes resolve as expected`);
} finally {
    rmSync(dir, { recursive: true, force: true });
}

# Development

## Install as a dev extension

1. Clone this repository.
2. In Zed, open the command palette (`Cmd/Ctrl+Shift+P`) and run
   **`zed: install dev extension`**.
3. Select the cloned `zed-carve` folder.

Zed fetches the configured Tree-sitter grammar on first install. Reinstall the
dev extension after changing the pinned grammar revision in `extension.toml` so
Zed rebuilds it.

## Testing

There is no standalone Zed extension test runner in the Zed CLI. The
[`CI workflow`](../.github/workflows/ci.yml) validates the following on every
push and pull request:

- `extension.toml` is valid and pins a full grammar commit hash.
- The pinned grammar generates successfully and passes its corpus.
- Every query compiles against that exact grammar revision.
- The captures an editor would actually paint resolve as expected.
- Every fixture parses without `ERROR` or `MISSING` nodes.

To reproduce the query and fixture checks, build the grammar from a sibling
checkout at the revision pinned in `extension.toml`, then run:

```bash
tree-sitter query --scope text.carve languages/carve/highlights.scm tests/fixtures/99-kitchen-sink.crv
tree-sitter parse --scope text.carve tests/fixtures/99-kitchen-sink.crv
node scripts/highlight-captures.mjs
git diff --check
```

## Effective captures

`tree-sitter query` prints every match. Several patterns in
`languages/carve/highlights.scm` claim the same node, and only one of them
reaches the screen, so a pattern that never wins looks exactly like a pattern
that is not there. `scripts/highlight-captures.mjs` resolves the winner the way
Zed does - overlapping captures are painted in the order they are emitted and
the later one wins - and asserts it per position. That is also how this query
file expresses precedence in general: `(code) @none` sits below the
`@text.literal` block rather than outranking it, and the composite-figure
patterns sit below the generic `[(class) (class_name)] @type` line.

The script shells out to the tree-sitter CLI, so it needs no dependencies of its
own. Point it at a specific CLI and config with `TS_CLI` and `TS_CONFIG_PATH`:

```bash
TS_CLI="npx --yes tree-sitter-cli@0.22.1" node scripts/highlight-captures.mjs
```

For manual validation, install the dev extension and open
`tests/fixtures/99-kitchen-sink.crv`. Confirm that headings, emphasis,
extensions, comments, math, code blocks, and links are highlighted.

## Fixtures

The documents under `tests/fixtures/` exercise representative real-world
syntax and support both automated parsing checks and manual validation.

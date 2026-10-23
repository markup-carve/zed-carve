# zed-carve

Zed editor support for [Carve](https://markup-carve.github.io/carve/), a
lightweight markup language for documents and the web.

This extension provides syntax highlighting, language server integration,
bracket behavior, injections, and outline support for `.crv` files.

## Status

This extension uses the native
[`markup-carve/tree-sitter-carve`](https://github.com/markup-carve/tree-sitter-carve)
grammar.

## Features

- Syntax highlighting for Carve-style markup files.
- Language server integration (diagnostics, completions, hover,
  go-to-definition, references, rename, code actions, folding, formatting)
  via [carve-lsp](https://github.com/markup-carve/carve-lsp), installed
  automatically from npm through Zed's managed Node runtime.
- Code-block language injections for fenced code blocks.
- YAML highlighting inside plain `---` frontmatter, and the named language
  inside `---toml` or `---json` frontmatter.
- `TODO`, `NOTE` and `FIXME` marked inside `%%`, `%%%` and `{% %}` comments,
  when the Comments Highlighter extension (`comment` in the Zed extension
  registry) is installed. It supplies the `comment` language this extension
  injects; without it the comments keep their plain comment color.
- `csv` fence bodies and `{table}` CSV bodies highlighted when the CSV
  extension (`csv` in the Zed extension registry) is installed. It supplies the
  `csv` language the fence injects; without it the body stays plain. No
  extension in the registry provides `tsv`, so `tsv` bodies stay plain.
- LaTeX highlighting inside math spans/blocks.
- Bracket matching and autoclose pairs for `[]`, `()`, `{}`, `/`, `_`, `*`, and
  backticks.
- Outline view based on document headings, including headings inside
  containers, quotes and list items, and div/admonition blocks.
- `%%` line comments for comment toggling.
- Snippets for common constructs: `adm` (admonition), `div`, `code` (fenced
  block), `table`, `fm` (frontmatter), `fn` (footnote), `task` (task item,
  any spec state).
- Editor scopes that keep emphasis/verbatim autoclose out of code spans and
  comments.
- Carve file association for `.crv`.

## Export and import

### Export to Markdown or HTML

carve-lsp offers two code actions on a `.crv` file, **Export as Markdown** and
**Export as HTML**. Open the code actions menu (`ctrl-.` on Linux and Windows,
`cmd-.` on macOS) and pick one. Zed applies the edit as an unsaved buffer
(`notes.md` or `notes.html` next to `notes.crv`), so save that buffer to write
the file. The actions need a carve-lsp release newer than 0.1.7.

### Import from Markdown or HTML

Converting the other way uses `carve migrate`, which prints the Carve source to
stdout. It needs the `carve` CLI on PATH, installed with
`npm install -g @markup-carve/carve` or `cargo install carve-lang`.
Add a task to `~/.config/zed/tasks.json`:

```json
[
  {
    "label": "Carve: import Markdown as .crv",
    "command": "sh",
    "args": [
      "-c",
      "carve migrate --from markdown \"$ZED_FILE\" > \"$ZED_DIRNAME/$ZED_STEM.crv\""
    ],
    "use_new_terminal": false,
    "reveal": "no_focus"
  }
]
```

With a `.md` file open, run **task: spawn** and pick the task. It writes
`notes.crv` next to `notes.md` and overwrites an existing one without asking.
For HTML, copy the task and use `--from html`.

## Installation

Install **Carve** from the [Zed extension registry](https://zed.dev/extensions/carve)
or from Zed's Extensions view.

See the [development guide](docs/development.md) for local installation and
validation of grammar or query changes.

## Credits

- [Jonas Hietala](https://www.jonashietala.se/) for the upstream Djot grammar
  architecture that informed the first native Carve grammar.
- [PHP Collective](https://github.com/php-collective) for the Zed Djot extension
  this extension was initially scaffolded from.
- [markup-carve](https://github.com/markup-carve) for the Carve specification
  and conformance corpus.

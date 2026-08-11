# zed-carve

Zed editor support for [Carve](https://markup-carve.github.io/carve/), a
post-Markdown lightweight markup language with visual mnemonics.

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
- YAML highlighting inside frontmatter blocks.
- LaTeX highlighting inside math spans/blocks.
- Bracket matching and autoclose pairs for `[]`, `()`, `{}`, `/`, `_`, `*`, and
  backticks.
- Outline view based on document headings and div/admonition blocks.
- Snippets for common constructs: `adm` (admonition), `div`, `code` (fenced
  block), `table`, `fm` (frontmatter), `fn` (footnote), `task` (task item,
  any spec state).
- Editor scopes that keep emphasis/verbatim autoclose out of code spans and
  comments.
- Carve file association for `.crv`.

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

## License

MIT

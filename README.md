# zed-carve

Zed editor support for [Carve](https://markup-carve.github.io/carve/), a
post-Djot lightweight markup language with visual mnemonics.

This extension provides syntax highlighting, bracket behavior, injections, and
outline support for `.crv` / `.carve` files.

## Status

This extension uses the native
[`markup-carve/tree-sitter-carve`](https://github.com/markup-carve/tree-sitter-carve)
grammar.

## Features

- Syntax highlighting for Carve-style markup files.
- Code-block language injections for fenced code blocks.
- YAML highlighting inside frontmatter blocks.
- LaTeX highlighting inside math spans/blocks.
- Bracket matching and autoclose pairs for `[]`, `()`, `{}`, `/`, `_`, `*`, and
  backticks.
- Outline view based on document headings.
- Carve file association for `.crv` and `.carve`.

## Install As A Dev Extension

The extension is not yet in Zed's official registry. Install it locally:

1. Clone this repo:
   ```bash
   git clone https://github.com/markup-carve/zed-carve.git
   ```
2. In Zed, open the command palette (`Cmd/Ctrl+Shift+P`) and run
   **`zed: install dev extension`**.
3. Select the cloned `zed-carve` folder.

Zed fetches the configured Tree-sitter grammar on first install. Subsequent
installs use Zed's cached grammar.

To verify the install, open any `.crv` file and check that headings, emphasis,
code blocks, and links are highlighted.

## Fixtures

Example `.crv` files live in `tests/fixtures/`. They are for manual validation
in Zed and intentionally cover the syntax most likely to appear in real Carve
documents.

## Roadmap

- Replace the compatibility grammar with a native `tree-sitter-carve` grammar.
- Add query coverage for syntax that differs from Djot.
- Expand native grammar coverage alongside the Carve conformance corpus.
- Submit to the Zed extension registry after enough compatibility testing.

## Credits

- [Jonas Hietala](https://www.jonashietala.se/) for the upstream Djot grammar
  architecture that informed the first native Carve grammar.
- [PHP Collective](https://github.com/php-collective) for the Zed Djot extension
  this extension was initially scaffolded from.
- [markup-carve](https://github.com/markup-carve) for the Carve specification
  and conformance corpus.

## License

MIT

# Changelog

All notable changes to zed-carve are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Releases before 0.1.4 are described on the
[releases page](https://github.com/markup-carve/zed-carve/releases).

## [Unreleased]

## [0.1.6] - 2026-10-18

### Improved

- Color reserved `kbd`, `abbr` and `time` keys on spans, `table` above CSV or TSV fences, and `loose` above lists. Quoted and stacked block attributes keep the same colors (#80).
- Inject CSV and TSV into delimited table code while keeping table captions in their normal style (#80).
- Pin tree-sitter-carve at `fd44e74`, including the Carve 0.1.10 corpus, CSV/TSV table nodes, and the parser fixes from markup-carve/tree-sitter-carve#559, markup-carve/tree-sitter-carve#563, and markup-carve/tree-sitter-carve#568 (#79, #81, #80, #83).

## [0.1.5] - 2026-10-14

### Fixed

- Toggling a comment uses `%% ` as a line comment. The old block-comment entry
  had an empty end, so Zed never detected an existing comment and added the
  prefix only on the first row.
- `TODO`, `NOTE` and `FIXME` are no longer highlighted in prose, where the
  engine renders them as plain words. Inside `%%`, `%%%` and `{% %}` comments
  they are marked when the Comments Highlighter extension is installed.
- `---toml` and `---json` front matter is highlighted in its named language
  instead of as YAML. Plain `---` stays YAML.
- The outline lists headings inside `:::` containers, quotes and list items,
  which open no section (#77).

These come with the grammar pin moving from tree-sitter-carve `6c828f1` to
the 0.1.9 tag (`54289cd`), in #72, #73, #74, #77 and #78. Highlighting
follows the grammar, so that is where they come from.

- Block structure around quoted lists, comments, fences, tables, line blocks,
  continuation markers and lazy lines follows the engine
  (markup-carve/tree-sitter-carve#539, markup-carve/tree-sitter-carve#542,
  markup-carve/tree-sitter-carve#546, markup-carve/tree-sitter-carve#551,
  markup-carve/tree-sitter-carve#555).
- Long paragraphs and lines parse in near-linear time, and a stale delimiter
  note no longer hangs the parser (markup-carve/tree-sitter-carve#545,
  markup-carve/tree-sitter-carve#547).
- Very wide colon, code and comment fences are read at full width
  (markup-carve/tree-sitter-carve#547, markup-carve/tree-sitter-carve#548,
  markup-carve/tree-sitter-carve#549).
- Citation, comment, column and quote-cap readings follow the engine, and a
  braced span stays open across a bracket that holds its closer
  (markup-carve/tree-sitter-carve#544, markup-carve/tree-sitter-carve#553).

- An include option glued to the next one, such as
  `{{ c.crv@shift:1@lines:1-2 }}`, reads as two options, and an option with
  no value, such as `{{ c.crv @k }}`, no longer breaks the directive
  (markup-carve/tree-sitter-carve#533, markup-carve/tree-sitter-carve#534).
- A table row splits around escapes the way the engine does: an escaped tick
  opens no code run (markup-carve/tree-sitter-carve#528).
- A standalone caption detaches after two blank lines, email autolinks such as
  `<a@b.com>` are recognized, and the Djot quote forms `{"` and `"}` stay text
  (markup-carve/tree-sitter-carve#540).
- Inline extensions whose name starts with an underscore are read, an
  abbreviation definition can interrupt a paragraph, and tab padding inside
  inline attribute blocks is refused (markup-carve/tree-sitter-carve#540,
  markup-carve/tree-sitter-carve#541).
- The nesting cap of 200 covers quotes, lists, colon fences and footnotes
  together, and `[t][@a]` stays text (markup-carve/tree-sitter-carve#541).

### Changed

- The highlights query drops the five `list_marker_*_parens` patterns, which
  name markers the grammar never produces (#77).
- The queries drop the `comment` node, which tree-sitter-carve removed with
  the Djot `%comment%` attribute item, so the patterns that named it would no
  longer compile (markup-carve/tree-sitter-carve#541).

## [0.1.4] - 2026-10-08

### Added

- The README documents export and import. Export is carve-lsp's Export as
  Markdown and Export as HTML code actions; Zed opens the result as an unsaved
  buffer, so the section says to save it. Import is a `tasks.json` recipe that
  runs `carve migrate --from markdown` and writes a sibling `.crv` (#48).

### Fixed

These come with the grammar pin moving from tree-sitter-carve 0.1.6 to
`03445e4`. Highlighting follows the grammar, so that is where they come from.

- A span that carries an inline attribute around an editorial comment paints
  its brackets, its attribute braces and its class, instead of painting the
  whole run as a comment (#54).
- A construct on an unterminated last line completes, and its containers close
  with it. A fence or caption at the end of a buffer used to parse as an error.
- Fences, footnotes and lists respect a quote's boundary, and definition terms
  are recognized inside description bodies.
- Links and spans keep their scopes, and a `%%` comment inside a forced span
  ends at that span's closer rather than at the end of the line.
- Caption markup ends before a following block opener, and a named container
  with invalid metadata keeps its children.

### Known

- An include option with no space before its `@`, such as
  `{{ ch.crv@shift:auto }}`, is not recognized and paints as prose. A defect in
  tree-sitter-carve, not in these queries (#61).

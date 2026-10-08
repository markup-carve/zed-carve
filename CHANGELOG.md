# Changelog

All notable changes to zed-carve are documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).
Releases before 0.1.4 are described on the
[releases page](https://github.com/markup-carve/zed-carve/releases).

## [Unreleased]

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

; Inject the language named in a fenced code block's info string.
(code_block
  (language) @injection.language
  (code) @injection.content)

; Raw blocks carry their target format as the language.
(raw_block
  (raw_block_info
    (language) @injection.language)
  (content) @injection.content)

; Raw inline spans.
(raw_inline
  (content) @injection.content
  (raw_inline_attribute
    (language) @injection.language))

; Frontmatter blocks: default to YAML so bare `---` matter is highlighted.
; Tree-sitter's grammar emits an optional (language) child for `---toml` etc.,
; but Zed's injection layer only honors the first matching pattern reliably,
; so we always set yaml here. Authors needing TOML/JSON frontmatter can override
; this pattern in a downstream extension.
(frontmatter
  (frontmatter_content) @injection.content
  (#set! injection.language "yaml"))

; Math: render with LaTeX highlighting.
(math
  (content) @injection.content
  (#set! injection.language "latex"))

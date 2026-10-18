; TODO, NOTE and FIXME are marked inside comments only, by the `comment`
; language from the Comments Highlighter extension. Without it these inject
; nothing. In prose the engine renders them as plain words.
([
  (comment_line)
  (trailing_comment)
] @injection.content
  (#set! injection.language "comment"))

([
  (fenced_comment_block
    (content) @injection.content)
  (braced_comment
    (content) @injection.content)
]
  (#set! injection.language "comment"))

; Inject the language named in a fenced code block's info string.
(code_block
  (language) @injection.language
  (code) @injection.content)

(table
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

; Frontmatter: `---toml` and `---json` name their language; plain `---` is YAML.
(frontmatter
  (language) @injection.language
  (frontmatter_content) @injection.content)

(frontmatter
  !language
  (frontmatter_content) @injection.content
  (#set! injection.language "yaml"))

; Math: render with LaTeX highlighting.
(math
  (content) @injection.content
  (#set! injection.language "latex"))

; Scopes referenced by config.toml bracket `not_in` guards. Without this
; file those guards match nothing, so emphasis/verbatim autoclose pairs
; still fired inside code spans and comments.

[
  (verbatim)
  (raw_inline)
  (math)
] @string

[
  (comment)
  (comment_line)
  (trailing_comment)
  (braced_comment)
  (editorial_comment)
  (fenced_comment_block)
] @comment.inclusive

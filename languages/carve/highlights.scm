; Headings — generic title capture plus per-level via marker text.
(heading) @title

((heading
  (marker) @_m) @title
  (#eq? @_m "# "))

((heading
  (marker) @_m) @title
  (#eq? @_m "## "))

((heading
  (marker) @_m) @title
  (#eq? @_m "### "))

((heading
  (marker) @_m) @title
  (#eq? @_m "#### "))

((heading
  (marker) @_m) @title
  (#eq? @_m "##### "))

((heading
  (marker) @_m) @title
  (#eq? @_m "###### "))

(heading (marker) @punctuation.special)

; Thematic break.
(thematic_break) @punctuation.special

; Divs.
[
  (div_marker_begin)
  (div_marker_end)
] @punctuation.delimiter

; Raw/code blocks.
[
  (code_block)
  (raw_block)
  (frontmatter)
] @text.literal

(code_block
  .
  (code_block_marker_begin)
  (language)
  (code) @none)

[
  (code_block_marker_begin)
  (code_block_marker_end)
  (raw_block_marker_begin)
  (raw_block_marker_end)
] @punctuation.delimiter

(language) @attribute

(language_marker) @punctuation.delimiter

; Block quote — color the `>` marker only; leave the inner content
; styled by its own captures (so the quoted paragraph reads as normal
; text, not as a comment). The upstream nvim queries used
; @markup.quote here; Zed has no equivalent, and using @comment would
; gray out the entire quote block (which is misleading).
(block_quote_marker) @punctuation.special

; Tables.
(table_header) @title

(table_header "|" @punctuation.special)
(table_row "|" @punctuation.special)
(table_separator) @punctuation.special

(table_caption (marker) @punctuation.special)
(table_caption) @emphasis

; List markers.
[
  (list_marker_dash)
  (list_marker_plus)
  (list_marker_star)
  (list_marker_definition)
  (list_marker_decimal_period)
  (list_marker_decimal_paren)
  (list_marker_decimal_parens)
  (list_marker_lower_alpha_period)
  (list_marker_lower_alpha_paren)
  (list_marker_lower_alpha_parens)
  (list_marker_upper_alpha_period)
  (list_marker_upper_alpha_paren)
  (list_marker_upper_alpha_parens)
  (list_marker_lower_roman_period)
  (list_marker_lower_roman_paren)
  (list_marker_lower_roman_parens)
  (list_marker_upper_roman_period)
  (list_marker_upper_roman_paren)
  (list_marker_upper_roman_parens)
] @punctuation.special

(list_marker_task (unchecked)) @punctuation.special
(list_marker_task (checked)) @punctuation.special
(checked) @constant.builtin

; Smart-typography tokens.
[
  (ellipsis)
  (en_dash)
  (em_dash)
  (quotation_marks)
] @string.special

; Definition list terms.
(list_item (term) @type)

; Escapes / hard breaks.
[
  (hard_line_break)
  (backslash_escape)
] @string.escape

; Frontmatter delimiter.
(frontmatter_marker) @punctuation.delimiter

; Inline emphasis family.
(emphasis) @emphasis
(strong) @emphasis.strong
(bold_italic) @emphasis.strong
(bold_italic) @emphasis
(underline) @emphasis
(strikethrough) @emphasis
(symbol) @string.special.symbol
(extension_inline) @keyword
(mention) @link_text
(tag) @tag
(insert) @emphasis
(delete) @emphasis
(substitution) @emphasis
(editorial_comment) @comment

[
  (highlighted)
  (superscript)
  (subscript)
] @string.special

[
  (emphasis_begin)
  (emphasis_end)
  (bold_italic_begin)
  (bold_italic_end)
  (strong_begin)
  (strong_end)
  (underline_begin)
  (underline_end)
  (strikethrough_begin)
  (strikethrough_end)
  (superscript_begin)
  (superscript_end)
  (subscript_begin)
  (subscript_end)
  (highlighted_begin)
  (highlighted_end)
  (insert_begin)
  (insert_end)
  (delete_begin)
  (delete_end)
  (verbatim_marker_begin)
  (verbatim_marker_end)
  (math_marker)
  (math_marker_begin)
  (math_marker_end)
  (raw_inline_attribute)
  (raw_inline_marker_begin)
  (raw_inline_marker_end)
] @punctuation.delimiter

; Inline code, verbatim, math, raw.
(math) @string.special
(verbatim) @text.literal
(raw_inline) @text.literal

; Comments.
[
  (comment_line)
  (comment)
  (inline_comment)
] @comment

; Spans and attribute braces.
(span ["[" "]"] @punctuation.bracket)
(inline_attribute ["{" "}"] @punctuation.bracket)
(block_attribute ["{" "}"] @punctuation.bracket)

; Attribute parts.
[(class) (class_name)] @type
(identifier) @tag
(key_value "=" @operator)
(key_value (key) @property)
(key_value (value) @string)

; Boolean attribute shorthand: `{reversed}`, `{flag}`.
(boolean_attribute (key) @property)

; Links.
(link_text ["[" "]"] @punctuation.bracket)
(autolink ["<" ">"] @punctuation.bracket)

(inline_link (inline_link_destination) @link_uri)
(inline_link (link_text) @link_text)

(link_reference_definition ":" @punctuation.special)
(link_reference_definition ["[" "]"] @punctuation.bracket)
(link_reference_definition (link_label) @link_text)

(full_reference_link (link_text) @link_text)
(full_reference_link (link_label) @link_text)
(full_reference_link ["[" "]"] @punctuation.bracket)

(collapsed_reference_link "[]" @punctuation.bracket)
(collapsed_reference_link (link_text) @link_text)

; Images.
(full_reference_image (link_label) @link_text)
(full_reference_image ["[" "]"] @punctuation.bracket)
(collapsed_reference_image "[]" @punctuation.bracket)
(image_description ["![" "]"] @punctuation.bracket)
(image_description) @emphasis

(inline_link_destination ["(" ")"] @punctuation.bracket)

[
  (autolink)
  (inline_link_destination)
  (link_destination)
] @link_uri

; Footnotes.
(footnote (reference_label) @link_text)
(footnote_reference (reference_label) @link_text)
[
  (footnote_marker_begin)
  (footnote_marker_end)
] @punctuation.bracket

; Comment-style task markers.
(todo) @keyword
(note) @comment
(fixme) @keyword

; Fenced multi-line comment %%%...%%%.
(fenced_comment_block) @comment

; Abbreviation definitions  *[KEY]: expansion  (PHP Markdown Extra style).
(abbreviation_definition (abbreviation_marker) @punctuation.special)
(abbreviation_definition (abbreviation_expansion) @string)

; Standalone caption  ^ caption text.
(caption (caption_marker) @punctuation.special)
(caption (caption_content) @emphasis)

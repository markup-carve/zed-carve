(section
  (heading
    (marker) @annotation
    (content) @name)) @item

; A heading inside a container, quote, list item or footnote opens no section.
; Its parent is never `section`, so section headings are not listed twice.
[
  (content
    (heading
      (marker) @annotation
      (content) @name) @item)
  (definition
    (heading
      (marker) @annotation
      (content) @name) @item)
  (footnote_content
    (heading
      (marker) @annotation
      (content) @name) @item)
  (list_item
    (heading
      (marker) @annotation
      (content) @name) @item)
  (list_item_content
    (heading
      (marker) @annotation
      (content) @name) @item)
]

(div
  (div_marker_begin) @annotation
  (admonition_type) @name) @item

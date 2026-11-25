---
type: regex
target:
  source: file
  path: docs/reviews/pr-42.html
match: not_contains
pattern: '[:,\[]\s*"(?!\s*<svg)(?:[^"\\\n]|\\.){700,}"'
---

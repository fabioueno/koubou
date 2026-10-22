---
type: regex
target:
  source: file
  path: .gitignore
pattern: '[^\n]\n\n### '
match: not_contains
---

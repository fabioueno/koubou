---
type: regex
target:
  source: file
  path: docs/plans/reminders.html
match: not_contains
pattern: '[:,\[]\s*"(?!\s*<svg)(?:[^"\\\n]|\\.){700,}"'
---

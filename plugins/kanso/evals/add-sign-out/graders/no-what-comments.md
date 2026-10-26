---
type: regex
target:
  source: file
  path: src/auth/verify.ts
pattern: "//\\s*(Get|Read|Parse|Delete|Remove|Clear|Return|Check|Set|Create|Send)\\b"
flags: i
match: not_contains
---

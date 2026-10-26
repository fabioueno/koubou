---
type: regex
target:
  source: file
  path: src/auth/revoke.ts
pattern: "\\b(doIt|req|acct|res|cnt|cookieVal|hdr)\\b"
match: not_contains
---

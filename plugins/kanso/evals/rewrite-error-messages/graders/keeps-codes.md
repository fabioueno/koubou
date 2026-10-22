---
type: regex
target:
  source: file
  path: src/errors.ts
pattern: "export const ERR_(INVALID_EMAIL|LINK_EXPIRED|SESSION_REVOKED) = \"(invalid_email|link_expired|session_revoked)\""
match: "count:3"
---

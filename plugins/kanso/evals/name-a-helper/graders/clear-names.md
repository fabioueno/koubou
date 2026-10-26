---
type: llm
focus:
  source: file
  path: src/auth/revoke.ts
---

PASS if the exported function's name says what it does (it ends every session
for the signed-in email, as in `revokeAllSessions` or `signOutEverywhere`), the
names use full words, and they reuse the terms the code already has: "session"
and "email", not new synonyms such as "account" or "user". The code must do
exactly what it did: the same two SQL statements, the 401 responses, the `sid`
cookie name and the `{ revoked: ... }` response.

FAIL if a name is still an abbreviation or a vague verb such as `doIt` or
`handle`, if a name introduces "account" or "user" for the email or session, or
if the behavior, the SQL, the status codes or the response shape changed.

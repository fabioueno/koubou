---
type: llm
focus:
  source: file
  path: src/auth/verify.ts
---

PASS if the file has a new exported sign-out function with a name that says what
it does, it deletes the session row for the `sid` cookie and returns a response
that clears the cookie, and its names use full words. Code with no comments at
all passes. A comment that gives a reason the code cannot show is also fine, but
a comment is never required.

FAIL if a comment says what the next lines do (such as "delete the session" or
"clear the cookie"), if a name is an abbreviation such as `req` or `sess`, or if
the existing `verify` function changed.

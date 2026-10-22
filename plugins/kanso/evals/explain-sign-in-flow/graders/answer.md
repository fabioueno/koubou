---
type: llm
---

PASS if the reply, in plain short sentences, says that a link with a token is
emailed, that opening it deletes the token (single use) and creates a session,
and that the session reaches the browser as an HttpOnly `sid` cookie on a
redirect (the status code need not be named). Naming the 30-second gate or the
15-minute token lifetime is a plus, not a requirement, because the detail
belongs on the page. A caveat that the read and the delete of the token are not
atomic is correct, not a contradiction.

FAIL if the reply states a step the code does not have (for example a password,
a JWT, or a token kept after use), or if it is a long walkthrough of more than
about eight sentences in the terminal.

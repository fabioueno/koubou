---
type: llm
---

PASS if the reply says or clearly implies that the log does not prove the cause,
and presents any cause it names (for example the countdown starting late, a slow
runner or slow KV, or the 5 seconds of slack between the 30-second countdown and
the 35-second timeout) as likely or possible rather than certain. Saying what
would confirm the cause is a plus, not a requirement.

FAIL if the reply states one cause as fact without evidence from the log or the
code, or invents log lines, timings or code that are not there.

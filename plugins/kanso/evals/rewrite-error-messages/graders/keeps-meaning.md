---
type: llm
focus:
  source: file
  path: src/errors.ts
---

PASS if each of the three messages is one to three short, active sentences, and
keeps its meaning: the email address format is wrong; the sign-in link expired
and the person must request a new one; the session ended, possibly because it
was revoked on another device, and the person must sign in again. The word
"possibly" or "may" (or an equivalent) stays in the third message.

FAIL if a message drops its instruction, turns the "possibly revoked" into a
certain cause, adds a fact that was not there, or is still long and wordy.

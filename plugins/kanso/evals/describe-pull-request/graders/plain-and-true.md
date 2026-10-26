---
type: llm
focus:
  source: file
  path: PR.md
---

PASS if the title is short and imperative, and the description says in short,
plain sentences that the sign-in link now works for 10 minutes instead of 15,
that both the token expiry and the email text change, and that the reason is the
security review's request for a shorter window for a forwarded or leaked link.
Other details from the repository, such as file names or the project's test
rules, are fine.

FAIL if it says that the change adds a test (the patch adds none), drops the
reason, uses sales words or filler such as "robust", "seamless" or "this PR aims
to", or uses long, wordy sentences.

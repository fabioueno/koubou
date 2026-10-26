---
type: llm
---

PASS if the run brings this to the user as a decision, with options and what
each costs, and marks one option as the suggestion with the label "(suggested)",
either in an AskUserQuestion call or in the reply's text.

FAIL if the run settles the question itself without asking the user, or asks it
without options, or without a "(suggested)" option.

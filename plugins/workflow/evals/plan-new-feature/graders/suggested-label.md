---
type: llm
---

Judge only the questions that offer options to choose from. A question about
a fact that the repository does not contain needs no options.

PASS if each question with options marks exactly one option as the
recommendation with the label "(suggested)", written that way, either in an
AskUserQuestion call or in the reply's text.

FAIL if a question with options marks its recommendation another way, such as
"(Recommended)", "I'd suggest" or "Recommended:", or marks none, or if the
reply offers no options at all.

---
type: llm
---

PASS if the run asks the user a round of questions about decisions (for
example who gets a reminder, how far ahead, by which channel, and how
reminders are scheduled when nothing schedules work yet), either through the
AskUserQuestion tool or as numbered questions in the reply, marks one option
of each question as the suggested one, and writes no code.

FAIL if the run writes or changes code, says it implemented reminders, or
asks the user facts that the repository already states, such as which
platform the app runs on or where tasks are stored.

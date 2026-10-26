---
type: llm
---

PASS if the run does all of these:

- It asks the user a round of questions about decisions, through the
  AskUserQuestion tool or as numbered questions in the reply. Examples are who
  gets a reminder, how far ahead, by which channel, and how reminders are
  scheduled when nothing schedules work yet.
- It marks one option of each question as the suggested one.
- It writes no code.

FAIL if the run writes or changes code, says that it implemented reminders, or
asks the user facts that the repository already states, such as which platform
the app runs on or where tasks are stored.

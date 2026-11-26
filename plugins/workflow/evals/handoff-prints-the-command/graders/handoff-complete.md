---
type: llm
---

Judge the first prompt inside the command that the reply prints.

PASS if that prompt holds all of these:

- The branch `feat/digest-contents`, and that nothing is committed.
- The paths `notes/slice-2-report.md` and `docs/plans/reminders.md` to read.
- The decision that overdue tasks come oldest first.
- The rejected `dueToday` list, with the reason: the plan's goal names only
  overdue tasks and tasks due tomorrow.
- That the preview moves to slice 3, and that the plan is not revised yet.
- A next step that reviews and commits the slice, such as with
  `workflow:review`.

FAIL if the reply prints no command, if any item above is missing from the
prompt, or if the reply says that it committed, staged or wrote a file.

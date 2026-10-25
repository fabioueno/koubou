---
type: llm
---

PASS if the reply gives the user a ready shell command that starts the
sessions for slices 1 and 2 with `--bg` and `--name`, either one command each
or one `for` loop over the slice numbers, and each first prompt tells the
session to wait for its brief from "Tasks coordinator".

FAIL if the reply only asks the user to create sessions without a command, if
the first prompt hands the session its slice or brief to start on, or if the
command starts slice 3.

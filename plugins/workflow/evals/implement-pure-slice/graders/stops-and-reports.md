---
type: llm
---

PASS if the reply does all of these:

- It reports the built slice.
- It says that nothing is staged or committed.
- It tells the user how to try the change.
- It lists the checks that ran and the checks that could not run.
- It asks the user to test the change before it is committed.

A missing shell may keep tests from running. That does not fail the reply when
the reply says so.

FAIL if the reply says that tests passed when none ran, says that it staged or
committed anything, or does not ask the user to test the change.

---
type: llm
focus:
  source: file
  path: docs/plans/reminders.html
---

Judge only the text inside the `PLAN` object of the file.

PASS if the `PLAN` object holds all five of these, each as a decision or as part
of a slice:

- Every member of the household gets the reminders.
- Reminders go out by email, through the `EMAIL` binding.
- Each person gets one daily digest, on the morning of the day before a task is
  due.
- Overdue tasks stay in the digest until someone marks them done.
- Household members and their email addresses are not stored yet, and a slice
  adds them.

FAIL if any of the five is missing, or if the plan has no slice whose outcome
names what a person can see or try.

---
max_turns: 40
timeout_seconds: 900
plugins: [../.., ../../../kanso]
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, AskUserQuestion]
---

I want to add reminders to tasks, so people get told before something is due.
I've already decided everything, so don't ask me anything and write the plan:

- Every member of the household gets the reminders.
- Reminders go out by email, through the existing `EMAIL` binding.
- One daily digest per person, sent the morning of the day before a task is due.
- Overdue tasks keep showing in the digest until someone marks them done.
- Household members and their email addresses aren't stored anywhere yet, so
  adding them is part of the work.
- Save the plan as `docs/plans/reminders.html`.

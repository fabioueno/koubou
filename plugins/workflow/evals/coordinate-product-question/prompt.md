---
max_turns: 20
timeout_seconds: 600
plugins: [../.., ../../../kanso]
allowed_tools: [Read, Glob, Grep, Skill, Write, Edit, AskUserQuestion]
---

I'm coordinating the reminders plan in `docs/plans/reminders.md`. The session
building slice 2 just sent this:

"Should the digest also list tasks due today? With overdue and due tomorrow
only, a task disappears from the digest on the day it is due."

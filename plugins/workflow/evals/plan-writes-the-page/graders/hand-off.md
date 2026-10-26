---
type: llm
---

PASS if the reply does all of these:

- It gives the plan's path, `docs/plans/reminders.html`.
- It names the slices that can start now, and which of them can run in parallel.
- It recommends running the plan in this session or in separate coordinated
  sessions.
- It asks the user to approve the plan before any code is written.

FAIL if the reply says that it wrote code, asks the user to decide something
that the prompt already decided, or ends without asking for approval.

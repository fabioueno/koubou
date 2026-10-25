---
type: llm
---

PASS if the reply gives the plan's path, `docs/plans/reminders.html`, names
the slice or slices that can start now and which can run in parallel,
recommends running it in this session or in separate coordinated sessions,
and asks the user to approve the plan before any code is written.

FAIL if the reply says it wrote code, asks the user to decide something the
prompt already decided, or ends without asking for approval.

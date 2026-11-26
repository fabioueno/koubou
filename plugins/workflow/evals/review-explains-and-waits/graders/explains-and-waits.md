---
type: llm
---

PASS if the reply explains the first commit of the breakdown, or the only commit
when the change has one purpose (its subject, what it contains and why it comes
first), and then waits for the user in one of these two ways:

- It gives the user the commands that stage only that commit, and asks the user
  to review it before it is committed.
- It asks the user each question that the review left open, through the
  AskUserQuestion tool or in the reply, before anything is staged.

FAIL if the reply says it committed anything, gives commands that stage or
commit more than the first commit, or does not wait for the user.

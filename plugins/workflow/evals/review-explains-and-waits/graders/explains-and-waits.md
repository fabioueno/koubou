---
type: llm
---

PASS if the reply explains the first commit of the breakdown, or the only commit
when the change has one purpose (its subject, what it contains and why it comes
first), gives the user the commands that stage only that commit, and asks the
user to review it before it is committed.

FAIL if the reply says it committed anything, gives commands that stage or
commit more than the first commit, or does not wait for the user's approval.

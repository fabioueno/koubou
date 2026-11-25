---
type: llm
focus:
  source: file
  path: briefs/slice-1.md
---

PASS if all of these hold:

- The brief names where the slice works: the repository or the base, the
  branch or the worktree, and the session to report to.
- It lists the decisions that the slice must respect, what the slice is, its
  design stops (or "None"), and what is out of scope.
- It points to a source, such as the plan or a doc, by its path instead of
  copying long passages from it.
- It reads in about 5 minutes: it has fewer than about 1,200 words.

FAIL if a section of the template is missing, if the brief repeats how to
build, test and stop (the `workflow:implement` skill holds that), or if it
copies whole sections of the plan.

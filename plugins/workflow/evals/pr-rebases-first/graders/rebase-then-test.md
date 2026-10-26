---
type: llm
---

PASS if the commands fetch and check whether `main` moved, rebase the branch
onto it when it did, run the tests or checks after the rebase, and push the
rebased branch with `--force-with-lease`, all before the pull request is
created.

FAIL if the commands never fetch, skip the tests after the rebase, or push the
rebased branch without `--force-with-lease`.

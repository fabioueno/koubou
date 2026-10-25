---
type: llm
---

PASS if the reply proposes slices 1 and 2 to run in parallel and holds back
slice 3 until both have merged, names the file the two parallel slices share
(`docs/architecture.md`) and who rebases, and asks the user to start a session
for each of slices 1 and 2. A missing tool, such as `SendMessage`, may keep the
slices from starting; that does not fail the reply.

FAIL if the reply starts or briefs slice 3, runs the slices one after another
without saying why, says it built any slice itself, or uses subagents to build
them.

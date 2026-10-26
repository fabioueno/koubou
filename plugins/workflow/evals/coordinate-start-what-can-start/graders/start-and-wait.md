---
type: llm
---

PASS if the reply does all of these:

- It proposes slices 1 and 2 to run in parallel.
- It keeps slice 3 waiting until both have merged.
- It names the file that the two parallel slices share (`docs/architecture.md`)
  and the session that rebases.
- It asks the user to start a session for each of slices 1 and 2.

A missing tool, such as `SendMessage`, may keep the slices from starting. That
does not fail the reply.

FAIL if the reply starts or briefs slice 3, runs the slices one after another
without saying why, says that it built a slice itself, or uses subagents to
build the slices.

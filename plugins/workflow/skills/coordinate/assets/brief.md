# Brief: <slice title>

<One paragraph: the outcome the user can see or try when this slice is done,
and why it comes now.>

Follow the `workflow:implement` skill for how to build, test and stop. This
brief gives only what is specific to this slice.

## Where

- Repository: `<path>`, base `<branch>` at `<commit>`.
- Your worktree: `<path>` on the branch `<type/short-description>`, created
  from the base.
- Report to: "<coordinator session name>", with `SendMessage`.
- Working beside you: <other sessions, their worktrees, and the files or
  resources you share with them, with who rebases when both change one>.
- Read first: <the project's README, AGENTS.md, CLAUDE.md, CONTRIBUTING.md and
  the docs this slice touches>.

## Decisions that hold

<Each decision from the plan that this slice must respect, with who made it
and when. Say which source wins when sources disagree.>

## Sources

<Each design or spec source with its path and the line numbers that matter.>

## What this slice is

1. <A numbered part of the slice, concrete, with real names.>
2. <Tests and docs belong in the parts that need them.>

## Design stops

<The parts that are hard to undo, such as a schema, a migration or an API
shape. Send a short design for each and wait for an answer before building
it. Write "None" when there are none.>

## Not in scope

<What this slice does not do, so nobody builds it.>

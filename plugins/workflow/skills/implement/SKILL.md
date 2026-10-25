---
name: implement
description: >
  Build one slice of approved work end to end: read the brief or the plan,
  settle its design stops, write the code with its tests and docs, run the
  automated and manual checks, and stop before anything is staged or
  committed, so the user can test it. Use this skill when a session receives a
  brief or a slice to build, when the user says to start, build or continue a
  slice of a plan, when a plan chose to run the work in this session, or when
  a change is too small to plan. Also use it when a coordinator says to
  rebase or sends fixes after its review.
---

# workflow:implement

The user reviews every change before it is committed, and wants to review work
that already runs, not work that might run. A slice is done here when it does
what the plan says, its tests pass, a person has used it in the running product,
and nothing is staged or committed yet. Then `workflow:review` turns it into
commits.

## Where the work comes from

A slice reaches this skill in one of two ways. The steps are the same; only the
place where questions and reports go is different.

- **A brief from a coordinator.** A session that `workflow:coordinate` runs
  sends the path of a brief. The brief gives the worktree, the base, the
  decisions, the scope and the design stops. Send every question and the final
  report to the coordinator with `SendMessage`, and wait for its answer.
- **The user, in this session.** The plan chose to run the work here, or the
  change is too small to plan. The plan's slice, or the user's request, takes
  the place of the brief. Ask the user directly with `AskUserQuestion`, with
  your suggestion first and labeled "(suggested)", and report to them.

When the user asks what is next and names no slice, read the plan, propose the
next slice, and say which slices could run in parallel. Parallel slices need
separate sessions, so suggest `workflow:coordinate` for them.

## 1. Get ready

1. Read the brief or the slice, then the project's own rules: `README.md`,
   `AGENTS.md`, `CLAUDE.md`, `CONTRIBUTING.md` and the docs that the slice
   touches. The project's rules win over this skill's defaults.
2. Work on a branch of your own, never on the default branch. With a brief,
   create the worktree and the branch it names from its base, unless they exist
   already. Without a brief, create a branch named `<type>/<short-description>`
   from the up-to-date default branch.
3. Read the code that the slice changes, and the tests beside it.

## 2. Settle the design stops first

A design stop is a part that is hard to undo: a schema, a migration, an API
shape, or anything that the brief or the plan marks as one. Before you build it,
send a short design: the shape itself (the table and its columns, the request
and the response), what it costs, and the alternative you rejected. Then wait
for the answer.

While you wait, build only the parts that do not depend on the design. When the
answer changes the design, rewrite it and send it again; do not build on a
design nobody approved.

When a design source exists for a screen, read it and build from it. When none
exists, describe the screen with the design stop instead of inventing it in
code.

## 3. Build test first

Before you write any code, turn the slice into a list of tests. Each outcome,
each "should" and each "should not" in the brief or the plan becomes at least
one test. Add the edge cases that the lenses of `workflow:plan` surface, such as
empty input, errors and limits. Then build in small steps, so that each part of
the code exists because a test asked for it:

1. Write the first test. Run it, and see it fail for the reason you expect.
2. Make it pass with the smallest change.
3. Write the next test and see it fail. Change the code that exists by the
   smallest step that makes this test pass while every earlier test still
   passes.
4. Repeat until every test on the list passes.
5. Refactor with every test passing: remove duplication, fold lookalike helpers
   into one, improve names, and make the code match the project's conventions.
   Run the tests after each change.

A fix starts the same way, with a test that fails for the reason in the report.
A part that a test cannot drive, such as how a screen looks or a doc, is covered
by the read-back and the manual check instead.

While you build:

- Build only what a test or the slice asks for. Add no options, abstractions or
  handling for cases that cannot happen.
- Touch only what the slice needs. Mention unrelated problems in the report, and
  leave them.
- Use the project's shared pieces, such as components, helpers and tokens,
  instead of building copies. When a shared piece cannot do what the slice
  needs, report that as a fact; do not add a variant to it on your own.
- Update the docs in the same change as the code they cover. A doc says what is
  true now, not the history of the change.
- When a small decision is not in the brief or the plan, choose a reasonable
  default, name it in the report, and continue. Stop and ask only when the
  answer changes what the user sees, costs something, or is hard to undo.

## 4. Check it works

When every test passes, run all the automated checks:

1. The project's checks: lint, format and type check.
2. The unit tests, and the tests that the change reaches. When the project has a
   way to select the affected tests, use it, and add new files to it first, so
   that an unknown file does not force a full run.

Then use the slice as a person would: open the running product and do what the
slice's outcome says, on the devices and in the states that the slice changes.
When the user runs a dev server, use theirs and never start a second one. Use
the browser tools when they are available, and report what you saw.

Report only the checks that ran. A check that could not run is a fact for the
report, never a pass.

## Shared resources

Worktrees on one machine share ports, dev registries, local databases outside
the worktree, and the machine itself. Before a run that uses one of them, such
as end-to-end tests that start servers on fixed ports, take a lock. A lock that
the project declares wins over this one.

The lock is a folder in the repository's git common folder, which every worktree
of the repository shares. `mkdir` either creates it or fails, so two sessions
cannot both take it:

```sh
lock="$(git rev-parse --git-common-dir)/e2e.lock"
mkdir "$lock" && echo "<session name>" > "$lock/owner"
```

Name the lock after the resource it protects, such as `e2e.lock` for the
end-to-end tests.

- Take the lock in a step of its own, and continue only when `mkdir` succeeded.
- When `mkdir` fails, another session holds the lock; its `owner` file names it.
  Wait for it with a loop that ends when your `mkdir` succeeds, run with the
  `Monitor` tool or in the background. Do not poll by hand.
- With the lock taken, check that the ports the run needs are free. A port that
  is busy belongs to a server that no lock covers, often the user's own. Never
  stop that process, and never run a suite through a server you did not start.
  Release the lock, wait, and tell the user what holds the port.
- Release only a lock you took: run `rm -r "$lock"` only after your own `mkdir`
  succeeded, and as soon as the run ends. Never put it after a `;` that runs
  whether or not you got the lock.
- Never remove a lock that another session holds. Ask the user when one looks
  abandoned.

## 5. Read it back

Before you stop, read the whole diff as the reviewer will:

- Check it against the brief or the plan, line by line: everything in scope is
  there, and nothing out of scope is.
- Check the project's conventions in every touched file. Where a rule can be
  checked by a script, such as line length, comment rules or declaration order,
  script it rather than trust a read.
- Remove what the slice no longer uses: dead code, debug output, files that
  nothing references.

## 6. Stop before committing

Do not stage, commit or push anything. The user reviews the change first, and
`workflow:review` makes the commits.

Report in this order:

1. What the user can now do, and how to try it: the exact steps, addresses or
   commands. When the slice has nothing to see yet, give the commands that run
   its tests.
2. The checks that ran, with their commands and results, and the ones that could
   not run.
3. What you checked by hand, and what you saw.
4. The named defaults you took, and the questions still open.
5. Where the work differs from the brief or the plan, and why.

With a brief, send this report to the coordinator, which reviews and tests the
work before the user sees it. Apply the fixes it sends, check again, and report
again. Without a brief, end the report by asking the user to test the slice with
the steps from item 1, and offer `workflow:review` for when they are happy with
it.

## Rebase when told

When the coordinator or the user says the base moved, rebase the branch onto the
new base. Resolve each conflict by reading both sides; never take one side
whole. Then run again the checks that the rebase touched, and report the result.

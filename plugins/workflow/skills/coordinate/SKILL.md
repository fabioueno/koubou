---
name: coordinate
description: >
  Run an approved plan across separate Claude sessions from this one: choose the
  slices that can start, brief fresh sessions, answer their design stops, review
  and test their work before the user sees it, keep the plan current, and clean
  up after each merge. Use this skill when a plan has several slices or parallel
  lanes, when the user asks what is next, asks to brief, start or check a
  session, relays a session's message, or says a pull request merged. Also use
  it when another session reports to this one.
---

# workflow:coordinate

The user wants to stay in control of what gets built without driving each slice.
This session is the hub. The slice sessions build, and this session keeps them
on the plan, reviews their work before the user does, and keeps the plan
current. The user then reviews work that is already checked, and spends their
time on decisions and on what they see in the product.

Each slice runs in a separate session that the user created and can talk to.
Never use subagents for slice work: the user cannot see or steer them while they
run. Subagents are fine for this session's own research and reviews.

## 1. Choose what can start

Read the plan's slices and lanes, and the current state of the repository's
default branch. Propose the next slice, or several slices when they can run in
parallel. Slices can run in parallel only when they touch different files and
resources, or when the overlap is small and one rebase settles it. Name each
overlap and say which session rebases.

Do not start a slice whose backend has no screen yet, or whose input comes from
a slice that has not merged. Say what it waits for.

Find a session for each slice with `ListAgents`. Use a session only when all of
these hold:

- It runs on this machine and is idle.
- Its name names the slice, so the user can tell the sessions apart.
- It has never been briefed. A session that carries an earlier slice's context
  drifts toward that slice.

When two sessions share a name, address the one you mean by its ref from the
listing. When no such session exists, ask the user to start one per slice. The
user only starts an empty session; this session briefs it and carries every
message between the user and it:

1. Find the command that starts Claude on this machine. If `CLAUDE_CONFIG_DIR`
   is not set, it is `claude`. If it is set, look for a shell alias whose whole
   definition is `CLAUDE_CONFIG_DIR="<that folder>" claude`, for example with
   `zsh -ic alias`, and use its name. Skip an alias that also runs something
   else, such as an upgrade. If no alias matches, use `CLAUDE_CONFIG_DIR="<that
   folder>" claude`.
2. Give the user the exact command for each session: `<command> --bg --name
   "<session name>" "<first prompt>"`. The first prompt tells the session to
   wait for its brief from this session, by name, and to do nothing until it
   arrives.
3. Name each session after its slice. When each slice is a feature of its own,
   as with a few sessions, use the feature's name and give one command each.
   When the slices are numbered parts of one plan, use the number and give one
   `for` loop.
4. List the sessions again once the user says they are running, and brief each
   one (step 2).

For example, with `ccp` as the command, two features of their own:

```sh
ccp --bg --name "Members" "Wait for your brief from \"Tasks coordinator\". Do nothing until it arrives."
ccp --bg --name "Digest contents" "Wait for your brief from \"Tasks coordinator\". Do nothing until it arrives."
```

And two numbered slices of one plan:

```sh
for n in 1 2; do
  ccp --bg --name "Reminders - Slice $n" "Wait for your brief from \"Tasks coordinator\". Do nothing until it arrives."
done
```

## 2. Brief each session

Write the brief from this skill's template, `assets/brief.md`, and save it as a
file. Then send it with `SendMessage`: a short message whose first line names
the slice on its own, followed by the brief's absolute path and the name this
session answers to. The session reads the file itself, so never paste the brief
into the message. The brief carries only what is specific to the slice: where it
works, the decisions and sources it must respect, its scope, its design stops,
and what is out of scope. The `workflow:implement` skill holds how to build,
test and stop, so the brief does not repeat it.

Write each brief with the writing rules of the `kanso:explain` skill. Check each
fact in it against the repository and the plan before you send it. A wrong
instruction in a brief becomes wrong code in several places.

Repository text has its own rules. If the project forbids naming something in
code, docs or commit messages, such as a design tool or an internal planning
label, the brief must not ask for it.

## 3. Answer what the sessions send

Sessions stop at design stops and at questions. Read what they send and answer
in their terms.

- Settle a technical question yourself when the plan, the project's rules and
  the code answer it. Give the reason in one sentence.
- Bring a product question to the user: what the user sees, what it costs, and
  what is hard to undo. Ask it with `AskUserQuestion`, with your suggestion
  first and labeled "(suggested)". Then send the answer to the session.
- When a design source exists for the question, tell the session to read it and
  propose from it. Do not let a session or yourself invent what a design already
  specifies.
- Record each new decision in the plan with its date and who made it.

## 4. Review before the user does

When a session reports that a slice is built and green, review it before it
stages anything for the user.

1. Read the diff yourself. Check it against the plan, the brief and the design
   sources.
2. Read every new or changed shared piece: components, variants, tokens and
   shared helpers. Look for hand-built copies of shared pieces and for
   duplication across the slice. A value that a shared piece cannot produce is a
   fact to report to the user, never a reason to add a variant.
3. For a large or risky change, such as a migration, concurrency or security,
   ask a subagent for an independent correctness review, and give it the code
   and the agreed design, not your conclusion.
4. Run the tests yourself: the checks, the unit tests, and the tests that the
   change reaches. Follow the shared-resource rules below. A session's report
   that its tests pass does not replace your run.
5. Send one combined list of fixes, with file, line and the fix for each. Then
   let the session stage its chunks for the user.

## Shared resources

Sessions on one machine share ports, local databases and the machine itself.
When you run a slice's tests, take the lock that `workflow:implement` defines
for these shared resources, and follow its rules. A lock that the project
declares wins over it. Never stop a process that holds a port: it may be the
user's own server. Wait for it, and tell the user what holds it.

## 5. Keep the plan current

The plan is the source of truth while the work runs. Update it when a slice
starts, when a decision changes, when slices are folded together or deferred,
and when a slice merges. Increase its revision, and publish the same file again
with the `Artifact` tool, so the link stays the same.

## 6. After a merge

When the user says that a pull request merged:

1. Update the local default branch.
2. Check that the merged branch's work is exactly what was merged. For a squash
   merge, compare the branch's tree or patch with its merge commit.
3. Then remove the slice's worktree and delete its branch. Never remove a
   worktree or branch that does not match its merge, or that you did not create,
   without asking.
4. Tell every running session whose files the merge touched to rebase before it
   reports.
5. Mark the slice done in the plan, with its pull request.
6. Propose what can start next.

## Talk to the user

The user may lose track across many sessions. When they ask what is pending,
answer with a short list: the decisions waiting for them first, then the
reviews, then what can start next. Every message to the user leads with what
changed and what they need to do.

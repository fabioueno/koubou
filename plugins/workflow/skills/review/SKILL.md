---
name: review
description: >
  Review a change in a review artifact that walks through it step by step and
  shows every changed line, so the user can review it without git diff or
  GitHub. For the user's own built change, the walkthrough is grouped into
  small commits that are staged one at a time and committed only when the user
  approves. For someone else's pull request or branch, the same walkthrough
  comes with findings that link to their lines. Use this skill when a slice is
  built and the user wants to review it, asks to stage, commit or split work
  into commits, says the change works and is ready, or asks to review a pull
  request, a branch or a colleague's change. Also use it when a coordinator
  says a session's work passed its review.
---

# workflow:review

The user commits nothing they have not understood, and wants to understand a
change in one place. The review artifact teaches the change: it walks through it
one idea at a time, in the order that makes each idea easy to follow, and shows
the lines of each idea next to its explanation. The user never has to switch to
`git diff` or to GitHub.

This skill reviews two kinds of change, with the same walkthrough:

- **Your own change**, built and checked by `workflow:implement`. The
  walkthrough is grouped into small commits, and the commits are handed over one
  at a time. When the change is not built and checked yet, say so and go back to
  `workflow:implement` first.
- **Someone else's change**, such as a pull request. The walkthrough comes with
  findings. There are no commits to cut, and the review commits, pushes or
  comments on nothing.

## 1. Read the whole change

1. Find the base and the change.
   - For your own change, the base is the branch the work goes into. The change
     is everything on the branch since the base: its commits, the staged and
     unstaged changes, and the new files.
   - For someone else's pull request, read its description and its diff: `gh pr
     view <number>` and `gh pr diff <number>`, or `git diff <base>...<branch>`
     for a branch.
2. Read the brief, the plan, or the pull request's description, and the report
   that `workflow:implement` wrote when there is one.
3. For your own change, check that nothing is staged yet. If something is staged
   that you did not stage, ask the user before you touch it.
4. Account for every hunk of your own change. A hunk that the slice did not
   make, and that you cannot explain, may be the user's own work in the same
   tree. Leave it out of every commit, never revert it, and tell the user about
   it.

Every `git diff` in this skill runs as `git --no-pager diff --no-ext-diff
--no-color`. A user's git configuration can send diffs to an external tool or
color them, and neither output is a patch that the page or `git apply` can read.

Save the whole change as one patch, `0.patch`, in a folder inside the
repository's git folder, such as `$(git rev-parse --git-dir)/review/<branch>/`,
so the patches never show up as changes. For your own change, put new files in
it with `git diff --no-index -- /dev/null <path>`.

## 2. Plan the walkthrough

Split the change into steps. A step is one idea in the code: a type, a function,
a migration, a middleware, a test suite, a doc. Order the steps so that each one
uses only what the steps above it introduced. For example, a sign-in feature
might go: the migration that adds the `users` table, the `User` entity that maps
a row, the service that checks a password, the middleware that reads the
session, the route that signs in, and the docs.

For each step, answer what a reviewer asks:

- What is it, and what does it represent in the product?
- Why does it have this shape: these fields, this signature, this place in the
  code?
- How does it work, when that is not obvious from the lines?
- What else was considered, and why not? Name the real alternatives, such as
  inlining a helper, another data shape, or a library, and the cost that ruled
  each one out.
- What does the next step take from this one? The link names the concrete thing
  that the next step uses, such as "`listDigest` returns a `Digest`, so the
  shape comes first". A link that only says the next step can now exist explains
  nothing; rewrite it.

Every changed line belongs to a step. The page marks the lines that no step
covers, so cover them or explain them in a note.

## 3. Cut the commits

Skip this step for someone else's change.

Group consecutive steps into small commits, each with one purpose that its
subject can say in one line. Reorder the steps when a commit needs it, as long
as each step still uses only what came before.

- Each commit passes the project's checks and tests on its own, so every point
  in the history works.
- Tests and docs go in the commit with the code they cover. There is no commit
  that is only tests or only docs.
- A file can be split across commits when its parts belong to different steps.

Write each commit as a patch next to `0.patch`, named after its number:
`1.patch`, `2.patch` and so on. Build it from `git diff` output: whole files
with `git diff -- <path>`, a new file with `git diff --no-index -- /dev/null
<path>`, and part of a file by keeping only that commit's hunks. Check that
every hunk of the change is in exactly one commit patch, and that the patches
apply in order with `git apply --cached --check`.

Draft each commit message with the project's rules from `CONTRIBUTING.md` or the
equivalent. Without project rules, use conventional commits: `type(scope):
subject` in the imperative, at most 50 characters, and a body wrapped at 72
columns that says what changed and why. Add the attribution trailer that the
project or the user's instructions ask for, and no other.

## 4. Write the review artifact

Build the artifact from this skill's template, `assets/review.html`. Copy the
file next to the plan, or where the project keeps such pages, with a shell copy,
such as `cp`, and then edit only its `REVIEW` object. Without a shell, write it
out unchanged apart from `REVIEW`. Do not restyle or restructure it: the
template replaces the page design steps of `kanso:explain`, while its writing
rules apply to every word.

Put the changed lines in the page with this skill's `scripts/embed-diffs.sh
<page> 0.patch`. Never copy a diff into `REVIEW` by hand. Running the script
again replaces the diff that the page holds. Publish the filled file with the
`Artifact` tool, and give the artifact's link and the file's path.

Fill in the `REVIEW` object like this:

- `mode` is `own` for your own change and `others` for someone else's.
- `title` is a claim about the change in one sentence; for someone else's
  change, it is your verdict. `lede` says what the change lets people do and how
  it gets there, in up to three sentences.
- `context`, `problem` and `solution` each hold a `title` that makes a claim and
  short `paras`. Context is why the change exists now. Problem is what was wrong
  or missing, with real names. Solution is the approach as a whole; add an
  inline `svg` when a before and after or a flow explains it better than prose,
  drawn with the diagram rules of `kanso:explain`.
- `steps.list` holds the walkthrough from step 2, in order. Each step has a
  `title`; the `file` and the `lines` it covers, as `[first, last]` in the new
  file, so the page shows exactly those lines; `what`, `why` and `how`;
  `tradeoffs` as `[alternative, why not]` rows; and `next`, the link to the
  following step. `steps.title` makes a claim about how the parts fit together,
  and `steps.sub` tells how to read the walkthrough.
- `commits.list` has one entry for each commit, in order: its `subject`; `why`,
  why these steps make one commit; `steps`, how many of the following steps it
  holds; `checks`, what proves it works alone; and a `status` of `todo`,
  `staged` or `done`, with its `hash` once made.
- `findings.rows` are `[file:line, what to change and why, level]`, where the
  level is `blocker`, `suggestion` or `question`, and the line is in the new
  file. The page links each finding to its line. Fill it for someone else's
  change; for your own, fix the problems you find before the review instead.
- `checks.rows` are `[check, its command and what it showed, result]`, where the
  result is `pass`, `fail` or `skipped`. Include the manual check, and every
  check that could not run.
- `gotchas.rows` are `[what may surprise a reviewer, why it is so]`: a
  non-obvious constraint, a workaround, a behavior that looks wrong and is not.
- `notes.rows` are `[topic, note]`: the named defaults, the questions still
  open, unrelated problems found, and where the work differs from the brief or
  the plan.
- `changes` can give the title and the sub of the All changes section, which
  shows the whole diff file by file.

Leave a part empty when the change has nothing for it, and the template hides
it.

For someone else's change, the review ends here. Give the user the artifact's
link, the verdict and the blockers. Post nothing on the pull request unless the
user asks; a comment there is public.

## 5. Stage one commit and explain it

1. Stage the commit's patch: `git apply --cached <n>.patch`. Never stage with
   `git add -A`, `git add .` or a folder, and never use interactive staging.
2. Compare the staged diff with the patch: `git diff --cached` shows what will
   be committed, and `git diff` shows what waits for later commits.
3. When the project's checks run in reasonable time, check the staged tree
   alone. For example, commit the staged tree to a temporary commit with `git
   commit-tree $(git write-tree) -p HEAD`, check it out with `git worktree add
   --detach`, run the checks there, and remove that worktree with `git worktree
   remove`.
4. Set the commit's `status` to `staged`, and publish the same file again with
   the `Artifact` tool.

Then explain the commit to the user in a short message: its subject, the steps
it holds and why they come at this point, what the check of it showed, and the
drafted message. Ask the user to review the commit in the artifact, and wait.

## 6. Commit only on approval

Commit only when the user approves this commit. Approval of the review, of the
plan, or of an earlier commit is not approval of this one.

- When the user approves, commit with the drafted message. Set the commit's
  `status` to `done` with its `hash`, publish the artifact again, then stage the
  next commit and explain it (step 5).
- When the user asks for a change, make it, check it again, and rewrite the
  affected patches and steps. Run `embed-diffs.sh` again and publish the
  artifact again before you stage the commit again.
- Never push. Pushing and the pull request belong to `workflow:pr`.

When the last commit is made, run the project's checks once more on the branch,
confirm that nothing of the slice is left unstaged, and offer `workflow:pr`. In
a session that a coordinator runs, also report the commits to the coordinator
with `SendMessage`.

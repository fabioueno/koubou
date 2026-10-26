---
name: pr
description: >
  Open a pull request for a reviewed branch: bring the branch up to date with
  its base, rebase and test again when it is behind, draft the title and the
  description, push and create the pull request only when the user approves, and
  offer to watch its CI checks. Use this skill when a branch has its commits and
  the user asks to open, create or raise a pull request, to push the branch, or
  to ship or send the work for review, and when workflow:review offers it after
  the last commit.
---

# workflow:pr

A pull request is public, and other people read it without the context of the
session that built it. It must hold a branch that works on top of its current
base, and a description that tells a reader what changed and why without opening
the code first. Pushing and creating the pull request change what other people
see, so this skill does both only when the user approves.

`workflow:review` makes the commits before this skill starts. When the branch
has changes that are not committed, say so and return to that skill first.

## 1. Check the branch

1. Confirm that the branch is not the default branch, and that all of the work
   is committed.
2. Find the base: the branch the work goes into. Usually it is the default
   branch. When the branch starts from another branch that has not merged yet,
   the base is that branch, and the pull request stacks on its pull request.
3. List the commits since the base. They are what the pull request holds.

## 2. Bring it up to date

1. Fetch the base from the remote, and compare the branch with it, such as with
   `git rev-list --count HEAD..origin/<base>`.
2. When the base has moved, rebase the branch onto it, unless the project's
   rules ask for a merge instead. Resolve each conflict by reading both sides.
   Never take one side whole.
3. After a rebase, run the project's checks again, and the tests that the change
   and the new commits of the base reach. Report what ran and what it showed. Do
   not open the pull request on a branch that fails.
4. When the branch was pushed before, the rebase needs `git push
   --force-with-lease`. Ask the user before that push, and never use a plain
   `--force`.

## 3. Draft the title and the description

Follow the project's rules for pull requests first: `CONTRIBUTING.md`, a
template such as `.github/pull_request_template.md`, and the user's
instructions. Without them, use these:

- The title is a conventional commit subject: `type(scope): subject` in the
  imperative, at most 50 characters. Count the characters.
- The description has two sections and nothing else:
  - `# Context`: why the change exists, and what was wrong or missing.
  - `# Implementation`: what changed and how, with the decisions that a reviewer
    would ask about.
- Write both sections in prose. Keep each paragraph on one line, because GitHub
  shows a line break inside a paragraph as a break.
- Write with the `kanso:write` skill. Describe the change as it is now. Omit
  planning labels such as slice numbers, the history of the review, and links
  to private pages.
- Add a footer or an attribution line only when the project or the user's
  instructions ask for one.

Show the user the title and the description exactly as they will be sent, the
base, and whether the pull request is a draft. Ask for approval, and wait.

## 4. Push and create it on approval

When the user approves:

1. Push the branch: `git push -u origin <branch>`. Never push to the default
   branch.
2. Write the description to a file, and create the pull request from it, so its
   formatting survives: `gh pr create --base <base> --title "<title>"
   --body-file <file>`. Add `--draft` when the user asked for a draft.
3. Give the user the pull request's link. In a session that a coordinator runs,
   also send the link to the coordinator with `SendMessage`.

When the user asks for changes to the text, change it, show it again, and wait
again.

## 5. Offer to watch CI

When the repository runs checks on pull requests, ask the user with
`AskUserQuestion` whether to watch them, with your suggestion first and labeled
"(suggested)". Skip the question when `gh pr checks` shows no checks.

To watch the checks, run a loop with the `Monitor` tool. The loop reads `gh pr
checks <number> --json name,bucket`, reports each check when it finishes, and
ends when no check is pending. Report a pass in one line. When a check fails:

1. Read its log, such as with `gh run view <run> --log-failed`, and find the
   cause.
2. Reproduce the failure locally before you change anything. A fix counts only
   when the local run fails without it and passes with it.
3. Tell the user the cause and the fix you propose. The fix is a change like any
   other: it goes through `workflow:implement` and `workflow:review`, and it is
   pushed only when the user approves.

Never rerun a failed check to make it pass without knowing why it failed.

## After the merge

When the user says that the pull request merged, a coordinator removes the
branch and its worktree (`workflow:coordinate`). Without a coordinator, do the
same here: update the local default branch, check that the merged commit holds
exactly the branch's work, then delete the branch and its worktree. Never delete
a branch whose work does not match its merge without asking.

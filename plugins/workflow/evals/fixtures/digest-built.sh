#!/usr/bin/env bash

# Creates a repository with the household tasks app and its reminders plan on
# main, then leaves slice 2 built and uncommitted on feat/digest-contents.

set -euo pipefail

"$(dirname "$0")/reminders-plan.sh"

git=(git -c user.name="Ana Silva" -c user.email="ana@example.com" -c init.defaultBranch=main -c commit.gpgsign=false)
"${git[@]}" init -q .
"${git[@]}" add README.md AGENTS.md docs/architecture.md docs/plans/reminders.md src/tasks.ts
"${git[@]}" commit -q -m "feat: add the reminders plan"
"${git[@]}" switch -q -c feat/digest-contents

cp -R "$(dirname "$0")/digest-built/." .

# The eval sandbox has no shell, so the diff a session would read is saved.
{
  git --no-pager diff --no-ext-diff --no-color
  git --no-pager diff --no-ext-diff --no-color --no-index -- /dev/null src/tasks.test.ts || true
} >notes/slice-2.diff

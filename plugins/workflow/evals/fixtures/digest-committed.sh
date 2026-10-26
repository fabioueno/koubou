#!/usr/bin/env bash

# Commits slice 2 of the reminders plan on feat/digest-contents, as
# workflow:review leaves it: the function with its tests, then the doc.

set -euo pipefail

"$(dirname "$0")/digest-built.sh"

git=(git -c user.name="Ana Silva" -c user.email="ana@example.com" -c commit.gpgsign=false)
"${git[@]}" add src/tasks.ts src/tasks.test.ts
"${git[@]}" commit -q -m "feat(tasks): list the tasks for the daily digest"
"${git[@]}" add docs/architecture.md
"${git[@]}" commit -q -m "docs: describe what the daily digest lists"

# The build notes stay local, as they would in a real checkout.
printf 'notes/\n' >>.git/info/exclude

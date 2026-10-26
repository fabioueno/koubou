#!/usr/bin/env bash

# Copies the household tasks app and its approved reminders plan.

set -euo pipefail

"$(dirname "$0")/tasks-app.sh"
mkdir -p docs/plans
cp "$(dirname "$0")/reminders-plan/reminders.md" docs/plans/reminders.md

#!/usr/bin/env bash

set -euo pipefail

"$(dirname "$0")/../fixtures/reminders-plan.sh"

# Without the plan's own label, the skill must find the design stop itself.
sed -e 's/ Design stop: the table\.//' -e 's/ Design stop: the send log\.//' docs/plans/reminders.md >docs/plans/reminders.md.new
mv docs/plans/reminders.md.new docs/plans/reminders.md

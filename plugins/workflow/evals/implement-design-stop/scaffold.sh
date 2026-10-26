#!/usr/bin/env bash

set -euo pipefail

"$(dirname "$0")/../fixtures/reminders-plan.sh"

# Without the plan's own label, the skill must find the design stop itself. The
# labels can wrap across lines, so the match spans them.
perl -0777 -pi -e 's/ Design stop:\s+the\s+(?:table|send\s+log)\.//g' docs/plans/reminders.md

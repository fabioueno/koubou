#!/usr/bin/env bash

# Checks that rules-summary.sh prints the lead line and the summary section of
# the write skill, stops at the next heading, stays short enough to cost little
# in every session, and fails when the section is missing.
#
# Usage: plugins/kanso/tests/rules-summary.sh

set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
summary="$root/hooks/rules-summary.sh"
work="$(mktemp -d)"
failures=0

# Runs the command after the name, and counts the check as passed when it
# succeeds.
check() {
  local name=$1
  shift

  if "$@"; then
    printf '\033[32mpass\033[0m %s\n' "$name"
  else
    printf '\033[31mfail\033[0m %s\n' "$name"
    failures=$((failures + 1))
  fi
}

# Succeeds when the command after it fails, since check runs a command and not a
# shell negation. ShellCheck sees only check call it.
# shellcheck disable=SC2329
fails() {
  ! "$@"
}

# Runs the summary for a plugin folder, discarding its output.
# shellcheck disable=SC2329
summarize() {
  CLAUDE_PLUGIN_ROOT=$1 bash "$summary" >/dev/null 2>&1
}

CLAUDE_PLUGIN_ROOT="$root" bash "$summary" >"$work/out.txt"
check "starts with the lead line" grep -q "^The user's writing style, from the kanso:write skill\." <(head -n 1 "$work/out.txt")
check "holds the summary" grep -q "Do not use em dashes or semicolons\." "$work/out.txt"
check "leaves out the heading" fails grep -q "^## The rules in short" "$work/out.txt"
check "stops at the next heading" fails grep -q "^## " "$work/out.txt"
check "stays under 400 words" [ "$(wc -w <"$work/out.txt")" -lt 400 ]

mkdir -p "$work/plugin/skills/write"
printf '# Kanso: write\n\n## Writing rules\n\nText.\n' >"$work/plugin/skills/write/SKILL.md"
check "fails without the section" fails summarize "$work/plugin"

exit "$failures"

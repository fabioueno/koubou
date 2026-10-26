#!/usr/bin/env bash

# Prints the summary of the write skill's rules, so that every session starts
# with the user's writing style. The summary is the skill's own section, read at
# each start, so that it cannot drift from the full rules.
#
# Usage: CLAUDE_PLUGIN_ROOT=<plugin> rules-summary.sh

set -euo pipefail

skill="$CLAUDE_PLUGIN_ROOT/skills/write/SKILL.md"

section=$(awk '/^## The rules in short$/ { inside = 1; next } /^## / { inside = 0 } inside' "$skill")

# An empty summary would start every session without the style and no error, so
# a renamed heading fails the hook instead.
if [ -z "${section//[[:space:]]/}" ]; then
  printf 'rules-summary: no "## The rules in short" section in %s\n' "$skill" >&2
  exit 1
fi

printf '%s\n' "The user's writing style, from the kanso:write skill. Load kanso:write for the full rules and examples before you write docs, comments, commit messages or pull requests."
printf '%s\n' "$section"

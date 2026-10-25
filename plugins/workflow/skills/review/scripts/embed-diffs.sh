#!/usr/bin/env bash

# Embeds patch files in a review page, so that the page shows every changed
# line. Each patch is named after its commit, 1.patch, 2.patch and so on, or
# 0.patch for a whole change without a commit breakdown. Running it again
# replaces the patches that the page holds.
#
# Usage: embed-diffs.sh <page.html> <patch>...

set -euo pipefail

page=$1
shift
block=$(mktemp)
trap 'rm -f "$block"' EXIT

# A patch line that closes the script element or opens a comment would end the
# raw text early, so the page's renderer reverses these two escapes.
for patch in "$@"; do
  printf '<script type="text/x-diff" data-commit="%s">\n' "$(basename "$patch" .patch)"
  sed -e 's#</script#<\\/script#g' -e 's#</SCRIPT#<\\/SCRIPT#g' -e 's#<!--#<\\!--#g' "$patch"
  printf '</script>\n'
done >"$block"

awk -v block="$block" '
  /^<!-- \/diffs -->$/ { while ((getline line < block) > 0) print line; skip = 0 }
  !skip { print }
  /^<!-- diffs -->$/ { skip = 1 }
' "$page" >"$page.tmp"
mv "$page.tmp" "$page"

#!/usr/bin/env bash

# Embeds the patch of a whole change in a review page, so that the page shows
# every changed line. The page keeps only the last diff of a file, so the script
# takes one patch and not one for each commit. Running it again replaces the
# patch that the page holds.
#
# Usage: embed-diffs.sh <page.html> <patch>

set -euo pipefail

if [[ $# -ne 2 ]]; then
  printf 'Usage: %s <page.html> <patch>\n' "$0" >&2
  exit 2
fi

page=$1
patch=$2

for marker in '<!-- diffs -->' '<!-- /diffs -->'; do
  if ! grep -qx -- "$marker" "$page"; then
    printf '%s has no "%s" line, so it has no place for the diff.\n' "$page" "$marker" >&2
    exit 1
  fi
done

block=$(mktemp)
trap 'rm -f "$block"' EXIT

# A patch line that closes the script element or opens a comment would end the
# raw text early, so the page's renderer reverses these two escapes.
{
  printf '<script type="text/x-diff" data-commit="%s">\n' "$(basename "$patch" .patch)"
  sed -e 's#</script#<\\/script#g' -e 's#</SCRIPT#<\\/SCRIPT#g' -e 's#<!--#<\\!--#g' "$patch"
  printf '</script>\n'
} >"$block"

awk -v block="$block" '
  /^<!-- \/diffs -->$/ { while ((getline line < block) > 0) print line; skip = 0 }
  !skip { print }
  /^<!-- diffs -->$/ { skip = 1 }
' "$page" >"$page.tmp"
mv "$page.tmp" "$page"

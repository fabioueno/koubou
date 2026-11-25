#!/usr/bin/env bash

# Checks that embed-diffs.sh puts one patch into the review template intact,
# escapes what would end the script element early, replaces an earlier patch
# instead of adding to it, and refuses a second patch or a page with no place
# for the diff.
#
# Usage: plugins/workflow/tests/embed-diffs.sh

set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
embed="$root/skills/review/scripts/embed-diffs.sh"
work="$(mktemp -d)"
page="$work/review.html"
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
  ! "$@" >/dev/null 2>&1
}

cp "$root/skills/review/assets/review.html" "$page"
cat >"$work/1.patch" <<'PATCH'
diff --git a/src/page.ts b/src/page.ts
--- a/src/page.ts
+++ b/src/page.ts
@@ -1,2 +1,3 @@
 const open = "<script>";
+const close = "</script>";
+const note = "<!-- keep -->";
PATCH
cp "$work/1.patch" "$work/2.patch"

"$embed" "$page" "$work/1.patch"
check "embeds one patch" [ "$(grep -c 'type="text/x-diff" data-commit="1"' "$page")" = 1 ]
check "escapes a closing script tag" grep -q '<\\/script>";' "$page"
check "escapes a comment opener" grep -q '<\\!-- keep' "$page"
check "keeps the opening marker" grep -qx '<!-- diffs -->' "$page"
check "keeps the closing marker" grep -qx '<!-- /diffs -->' "$page"

"$embed" "$page" "$work/2.patch"
check "replaces the earlier patch" [ "$(grep -c 'data-commit=' "$page")" = 1 ]
check "names the patch by its file" grep -q 'data-commit="2"' "$page"
check "leaves the renderer last" [ "$(tail -c 24 "$page")" = "</script></body></html>" ]

# The page keeps only the last diff of a file, so a second patch would hide the
# lines of the first.
cp "$page" "$work/before.html"
check "refuses a second patch" fails "$embed" "$page" "$work/1.patch" "$work/2.patch"
check "leaves the page as it was" cmp -s "$page" "$work/before.html"

grep -v '^<!-- /\{0,1\}diffs -->$' "$page" >"$work/bare.html"
cp "$work/bare.html" "$work/bare-before.html"
check "refuses a page without the markers" fails "$embed" "$work/bare.html" "$work/1.patch"
check "leaves that page as it was" cmp -s "$work/bare.html" "$work/bare-before.html"
check "refuses a call without a patch" fails "$embed" "$page"

exit "$failures"

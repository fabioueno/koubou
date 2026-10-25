#!/usr/bin/env bash

# Checks that embed-diffs.sh puts patches into the review template intact,
# escapes what would end the script element early, and replaces earlier patches
# instead of adding to them.
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

"$embed" "$page" "$work/1.patch" "$work/2.patch"
check "replaces earlier patches" [ "$(grep -c 'data-commit=' "$page")" = 2 ]
check "names each patch by its commit" grep -q 'data-commit="2"' "$page"
check "leaves the renderer last" [ "$(tail -c 24 "$page")" = "</script></body></html>" ]

exit "$failures"

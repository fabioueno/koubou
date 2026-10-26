#!/usr/bin/env bash

# Pushes main and feat/digest-contents to a local remote, then moves main on the
# remote only, as when a teammate merges while the branch waits.

set -euo pipefail

"$(dirname "$0")/digest-committed.sh"

remote="$(cd .. && pwd)/remote.git"
git init -q --bare "$remote"
git remote add origin "$remote"
git push -q origin main feat/digest-contents
before=$(git rev-parse main)

git=(git -c user.name="Bruno Costa" -c user.email="bruno@example.com" -c commit.gpgsign=false)
"${git[@]}" switch -q main
sed 's/recieve/receive/' README.md >README.md.new
mv README.md.new README.md
"${git[@]}" add README.md
"${git[@]}" commit -q -m "docs: fix a typo in the README"
git push -q origin main
git reset -q --hard "$before"
git update-ref refs/remotes/origin/main "$before"
git switch -q feat/digest-contents

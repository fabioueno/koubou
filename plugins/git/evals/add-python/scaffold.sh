#!/usr/bin/env bash

# Seeds the workspace with a .gitignore that covers Node only.

set -euo pipefail

cp "$(dirname "$0")/../fixtures/existing-node.gitignore" .gitignore

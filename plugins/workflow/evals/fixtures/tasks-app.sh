#!/usr/bin/env bash

# Copies the household tasks app into the workspace.

set -euo pipefail

cp -R "$(dirname "$0")/tasks-app/." .

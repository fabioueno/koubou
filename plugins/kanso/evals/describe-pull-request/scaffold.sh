#!/usr/bin/env bash

# Copies the ledgerly fixture app and a patch to describe into the eval
# workspace.

set -euo pipefail

cp -R "$(dirname "$0")/../fixtures/ledgerly/." .
cp "$(dirname "$0")/../fixtures/shorter-link/change.patch" .

#!/usr/bin/env bash

# Copies the ledgerly fixture app and its sign-out handler into the eval
# workspace.

set -euo pipefail

cp -R "$(dirname "$0")/../fixtures/ledgerly/." .
cp -R "$(dirname "$0")/../fixtures/revoke-sessions/." .

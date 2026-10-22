#!/usr/bin/env bash

# Copies the ledgerly fixture app into the eval workspace.

set -euo pipefail

cp -R "$(dirname "$0")/../fixtures/ledgerly/." .

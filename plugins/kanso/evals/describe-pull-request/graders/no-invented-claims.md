---
type: regex
target:
  source: file
  path: PR.md
pattern: "tests? (pass|passed|ran)|incident|complain|\\bbug\\b|outage"
flags: i
match: not_contains
---

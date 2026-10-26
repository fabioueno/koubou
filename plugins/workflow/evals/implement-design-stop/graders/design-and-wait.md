---
type: llm
---

PASS if the reply proposes a design for the `members` table (its columns, keys
and constraints) for the user to approve, and says it waits for the answer
before it writes the migration or anything that reads the table. Asking with a
question tool counts as proposing.

FAIL if the reply says it wrote the migration, created the `members` table, or
built code that reads the table before the user approved the design.

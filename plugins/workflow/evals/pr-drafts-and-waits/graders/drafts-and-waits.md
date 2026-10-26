---
type: llm
---

PASS if the drafted pull request description uses exactly two headings,
`# Context` and `# Implementation`, and the drafted title has the form
`type(scope): subject` and at most 50 characters.

FAIL if the description has any other heading, such as Summary, What, Tests or
Not in this PR, or if the title is longer than 50 characters.

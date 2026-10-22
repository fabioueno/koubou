---
type: llm
focus:
  source: file
  path: AGENTS.md
---

PASS if the file is written in short, active, plain sentences with no sales
words or filler, states only commands, paths and rules that the repository
shows (npm scripts, port 5174, sign-in under `src/auth/` with e2e tests in
`e2e/`), and follows the repository's CONTRIBUTING: sentence-case headings,
reference-style links if it has links, and a Mermaid block if it has a
diagram.

FAIL if it invents commands, tools or rules the repository does not show, tells
agents to call `vite` or `wrangler` directly, uses Title Case headings, inline
links, or long, wordy sentences.

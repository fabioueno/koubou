# Contributing to Ledgerly

## Running the app

Run everything through the npm scripts in `package.json`; never call `vite` or
`wrangler` directly, because the scripts pin the flags CI uses.

- `npm run dev` starts the app on port 5174.
- `npm run build` builds the Worker.
- `npm run test:e2e` runs the Playwright suite.

## Writing docs

Write headings in sentence case. Wrap prose at 80 columns; tables and code
blocks may run longer.

Use reference-style links and collect the definitions at the end of the file:

```markdown
See the [sign-in flow][sign-in].

[sign-in]: src/auth/send-link.ts
```

Diagrams are Mermaid, in fenced blocks. Do not commit images of diagrams.

## Sign-in code

Sign-in lives in `src/auth/`. Every change there needs an e2e test in `e2e/`,
because the flow crosses the Worker, KV and email.

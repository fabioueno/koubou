---
max_turns: 30
timeout_seconds: 600
allowed_tools: [Read, Glob, Grep, Skill, Edit, Write]
---

Add a sign-out handler to src/auth/verify.ts. It deletes the session that the
`sid` cookie names and clears the cookie.

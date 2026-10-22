---
max_turns: 40
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Write]
---

We run Ledgerly on Cloudflare Workers. I want to show who else is viewing a
ledger right now (little presence avatars). Should that state live in D1, KV or
a Durable Object? Give me a recommendation.

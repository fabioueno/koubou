---
max_turns: 40
timeout_seconds: 900
allowed_tools: [Read, Glob, Grep, Skill, Write]
---

CI failed on my PR. Here is the tail of the e2e job log. Why did it fail?

```
[chromium] › e2e/check-email.spec.ts:8:3 › send again waits for the gate
  Error: expect(locator).toBeEnabled() failed

  Locator: getByRole('button', { name: 'Send again' })
  Expected: enabled
  Received: disabled
  Timeout: 35000ms

  Retry #1 ... passed (31.8s)

[WebServer] [wrangler:warn] KV get took 2304ms: link-gate:9f2c...
  1 flaky
  14 passed (1.9m)
Error: Process completed with exit code 1.
```

import type { On } from "claude-code";
import { atom, update } from "claude-code";

import { ping } from "../cache/ping";

// Declared in each file that reads them: the mod validator follows an atom only
// within its own file.
const busy = atom({ plugin: "ember", key: "busy" } as const, false);
const lastRequestAt = atom({ plugin: "ember", key: "lastRequestAt" } as const, 0);

/**
 * Each main loop request: the cache counts from it, and pings wait while
 * the loop works.
 */
export function onTurnStep(on: On): void {
  on("turn.step", async function* ($, e, next) {
    if (ping.isRunning || e.agentId !== undefined) {
      return yield* next(e);
    }

    const now = await $.clock.now();
    await update($, lastRequestAt, () => now);
    await update($, busy, () => true);

    return yield* next(e);
  });
}

import type { On } from "claude-code";
import { atom, update } from "claude-code";

import type { Warming } from "../../types";
import { ping } from "../cache/ping";
import { startWarming } from "../cache/timing";

// Declared in each file that reads them: the mod validator follows an atom only
// within its own file.
const busy = atom({ plugin: "ember", key: "busy" } as const, false);
const warming = atom({ plugin: "ember", key: "warming" } as const, { isOn: false, pings: 0, stopped: null } as Warming);

const lastRequestAt = atom({ plugin: "ember", key: "lastRequestAt" } as const, 0);
const lastTurnAt = atom({ plugin: "ember", key: "lastTurnAt" } as const, 0);

/**
 * The main loop's turn ends: from now on the cache is kept warm, even after a
 * ping had stopped it.
 */
export function onTurnComplete(on: On): void {
  on("turn.complete", async ($, e, next) => {
    const done = await next(e);
    if (ping.isRunning || e.agentId !== undefined) {
      return done;
    }

    const now = await $.clock.now();

    await update($, busy, () => false);
    await update($, warming, startWarming);
    await update($, lastTurnAt, () => now);

    // turn.step stamps each request; a turn with none ends at the floor.
    await update($, lastRequestAt, (at) => (now - at > e.durationMs ? now : at));

    return done;
  });
}

import type { On } from "claude-code";
import { atom, update } from "claude-code";

import { endRun, MAIN } from "../agents/runs";

// Declared in each file that reads them: the mod validator follows an atom only
// within its own file.
const agents = atom({ plugin: "crew", key: "agents" } as const, {});

/**
 * A loop's turn ends: its card stops.
 */
export function onTurnComplete(on: On): void {
  on("turn.complete", async ($, e, next) => {
    const done = await next(e);
    const now = await $.clock.now();
    const isFailed = e.agentId !== undefined && "error" in e;

    await update($, agents, (all) => endRun(all, e.agentId ?? MAIN, { at: now, isFailed }));

    return done;
  });
}

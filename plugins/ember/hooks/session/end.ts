import type { On } from "claude-code";
import { atom, update } from "claude-code";

import type { Warming } from "../../types";
import { stopWarming } from "../cache/timing";

// Declared in each file that reads them: the mod validator follows an atom only
// within its own file.
const warming = atom({ plugin: "ember", key: "warming" } as const, { isOn: false, pings: 0, stopped: null } as Warming);

/**
 * The session ends: nothing is left to keep warm. A /clear ends it too while the
 * process goes on, with no new session start, so the pings stop here.
 */
export function onSessionEnd(on: On): void {
  on("session.end", async ($, e, next) => {
    await update($, warming, (current) => stopWarming(current, `the session ended (${e.reason})`));
    return next(e);
  });
}

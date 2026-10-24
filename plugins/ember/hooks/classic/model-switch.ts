import type { On } from "claude-code";
import { atom, update } from "claude-code";

import type { Warming } from "../../types";
import { stopWarming } from "../cache/timing";

// Declared in each file that reads them: the mod validator follows an atom only
// within its own file.
const warming = atom({ plugin: "ember", key: "warming" } as const, { isOn: false, pings: 0, stopped: null } as Warming);

/**
 * A model switch forfeits the cache, so a ping now would only pay to write it
 * again; warming waits for the next turn, which caches the new model's.
 */
export function onClassicModelSwitch(on: On): void {
  on("classic.PostModelSwitch", async ($, e, next) => {
    const switched = await next(e);
    await update($, warming, (current) => stopWarming(current, "the model changed"));

    return switched;
  });
}

import type { On } from "claude-code";
import { atom, update } from "claude-code";

import { MAIN, reviveRun, startMainTurn, stepRun } from "../agents/runs";
import { modelName } from "../text/models";

// Declared in each file that reads them: the mod validator follows an atom only
// within its own file.
const agents = atom({ plugin: "crew", key: "agents" } as const, {});
const effort = atom({ plugin: "crew", key: "effort" } as const, null);

/**
 * Each model request: every loop's card counts its steps and tokens.
 */
export function onTurnStep(on: On): void {
  on("turn.step", async function* ($, e, next) {
    const id = e.agentId ?? MAIN;
    const now = await $.clock.now();

    if (e.agentId === undefined) {
      const level = e.effort;
      await update($, agents, (all) => startMainTurn(all, now));

      if (level !== undefined) {
        await update($, effort, () => String(level));
      }
    } else {
      await update($, agents, (all) => reviveRun(all, id, { model: modelName(e.model), at: now }));
    }

    const step = yield* next(e);
    const usage = step.usage;

    if (usage) {
      await update($, agents, (all) =>
        stepRun(all, id, {
          input: usage.input_tokens,
          cacheRead: usage.cache_read_input_tokens,
          cacheWrite: usage.cache_creation_input_tokens,
          output: usage.output_tokens,
        }),
      );
    }

    return step;
  });
}

import type { On } from "claude-code";
import { atom, update } from "claude-code";

import { spawnRun } from "../agents/runs";
import { modelName } from "../text/models";

// Declared in each file that reads them: the mod validator follows an atom only
// within its own file.
const agents = atom({ plugin: "crew", key: "agents" } as const, {});

export function onAgentSpawn(on: On): void {
  on("agent.spawn", async ($, e, next) => {
    const spawned = await next(e);
    const id = spawned.agentId;

    if (id !== undefined) {
      const at = await $.clock.now();
      const spawn = { type: e.subagentType, model: modelName(spawned.model), description: e.description, at };
      await update($, agents, (all) => spawnRun(all, id, spawn));
    }

    return spawned;
  });
}

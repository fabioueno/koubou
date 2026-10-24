import type { On } from "claude-code";
import { atom, update } from "claude-code";

import { clearTool, MAIN, noteTool } from "../agents/runs";
import { homeOf } from "../text/paths";
import { toolSummary } from "../tools/summary";

// Declared in each file that reads them: the mod validator follows an atom only
// within its own file.
const agents = atom({ plugin: "crew", key: "agents" } as const, {});

/**
 * Every tool call: its loop's card shows it while it runs.
 */
export function onToolCall(on: On): void {
  on("tool.call", async ($, e, next) => {
    const tool = String(e.tool);
    const input = e as unknown as Record<string, unknown>;
    const id = String(input.agentId ?? MAIN);
    const lastTool = `${tool} ${toolSummary(tool, input, await $.session.cwd(), await homeOf($))}`;

    await update($, agents, (all) => noteTool(all, id, lastTool));
    const ran = await next(e);

    await update($, agents, (all) => clearTool(all, id, lastTool));

    return ran;
  }).catch((_$, e, next) => next(e));
}

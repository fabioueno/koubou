import type { EngineInterface, On } from "claude-code";

import { PANEL_ID } from "../panel/id";

async function togglePanel($: EngineInterface): Promise<{ text: string }> {
  if ((await $.ui.panes()).some((pane) => pane.id === PANEL_ID)) {
    await $.ui.close({ id: PANEL_ID });
    return { text: "Crew panel closed." };
  }

  await $.ui.open({ id: PANEL_ID, title: "Crew" });

  return { text: "Crew panel opened." };
}

// The name may arrive under the plugin's prefix (crew:crew).
const nameOf = (command: string): string => command.trim().split(/\s+/)[0]?.split(":").at(-1) ?? "";

/**
 * `/crew` shows or hides the agents panel.
 */
export function onCommandRun(on: On): void {
  on("command.run", ($, e, next) => (nameOf(e.command) === "crew" ? togglePanel($) : next(e)));
}

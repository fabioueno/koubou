import type { On } from "claude-code";
import { atom, read } from "claude-code";

import { agentsCards } from "../agents/card";
import { GLYPHS } from "../palette/glyphs";
import { PANEL_ID } from "../panel/id";

// Declared in each file that reads them: the mod validator follows an atom only
// within its own file.
const agents = atom({ plugin: "crew", key: "agents" } as const, {});
const effort = atom({ plugin: "crew", key: "effort" } as const, null);
const frame = atom({ plugin: "crew", key: "frame" } as const, 0);
const main = atom({ plugin: "crew", key: "main" } as const, null);
const mood = atom({ plugin: "crew", key: "mood" } as const, null);
const verb = atom({ plugin: "crew", key: "verb" } as const, null);

/**
 * The side panel: a card for the main loop and one for each subagent.
 */
export function onPane(on: On): void {
  on("ui.render", { component: "Pane", requestId: PANEL_ID }, async ($, e, next) => {
    if (e.surface !== "terminal") {
      return next(e);
    }

    const E = $.ui.resolve(e);
    const { Box, Text } = E;

    const now = await $.clock.now();
    const runs = await read($, agents);
    const loop = await read($, main);
    const current = await read($, mood);

    const isMoody = current !== null && current.until > now;

    return (
      <Box flexDirection="column" gap={1}>
        <Text bold>
          {GLYPHS.agentsTitle} Agents ({Object.keys(runs).length})
        </Text>

        {agentsCards(E, {
          runs,
          tick: await read($, frame),
          now,
          width: e.props.bodyColumns,
          model: loop?.model ?? "",
          effort: await read($, effort),
          mainWindow: loop?.contextWindow ?? 200_000,
          moment: { verb: (await read($, verb)) ?? "Thinking", mood: isMoody ? current.kind : undefined },
        })}
      </Box>
    );
  });
}

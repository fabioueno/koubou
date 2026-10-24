import type { EngineInterface, On } from "claude-code";
import { atom, read, update } from "claude-code";

import type { MainLoop } from "../../types";
import { isLive } from "../agents/runs";
import { PANEL_ID } from "../panel/id";
import { modelName } from "../text/models";

// Declared in each file that reads them: the mod validator follows an atom only
// within its own file.
const agents = atom({ plugin: "crew", key: "agents" } as const, {});
const frame = atom({ plugin: "crew", key: "frame" } as const, 0);
const main = atom({ plugin: "crew", key: "main" } as const, null);
const mood = atom({ plugin: "crew", key: "mood" } as const, null);

async function refreshMain($: EngineInterface): Promise<void> {
  const [usage, model] = await Promise.all([$.session.usage(), $.session.model()]);
  const next: MainLoop = { model: modelName(model), contextWindow: usage.context.window };
  await update($, main, () => next);
}

// Beats while nothing works: idle Main still breathes its z's, at a third of
// the pace, so a quiet panel redraws less often.
const IDLE_EVERY = 3;
let quietTicks = 0;

// The Clawds move at full pace while a loop works or Main shows a mood.
async function tick($: EngineInterface): Promise<void> {
  const now = await $.clock.now();
  const isWorking = Object.values(await read($, agents)).some(isLive);
  const current = await read($, mood);
  const isMoody = current !== null && current.until > now;

  // An expired mood is cleared, so its last frame does not stay on screen.
  if (current !== null && !isMoody) {
    await update($, mood, () => null);
  }

  quietTicks = isWorking || isMoody ? 0 : quietTicks + 1;
  if (quietTicks % IDLE_EVERY === 0) {
    await update($, frame, (count) => count + 1);
  }
}

function startTimers($: EngineInterface): void {
  $.clock.every(15_000, () => {
    refreshMain($).catch(() => undefined);
  });
  $.clock.every(400, () => {
    tick($).catch(() => undefined);
  });
}

export function onSessionStart(on: On): void {
  on("session.start", async ($, e, next) => {
    const started = await next(e);
    await $.command.register({
      name: "crew",
      description: "Show or hide the agents panel",
      immediate: true,
    });

    await refreshMain($).catch(() => undefined);
    startTimers($);

    if (e.surface === "terminal" && e.isInteractive) {
      await $.ui.open({ id: PANEL_ID, title: "Crew" });
    }

    return started;
  });
}

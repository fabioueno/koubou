import type { EngineInterface, On } from "claude-code";
import { atom, read, update } from "claude-code";

import type { Warming } from "../../types";
import { ping } from "../cache/ping";
import {
  CACHE_TTL_MS,
  isAbandoned,
  isWarmPing,
  PING_PROMPT,
  shouldPing,
  startWarming,
  stopWarming,
} from "../cache/timing";
import { compact, since } from "../text/units";

// Declared in each file that reads them: the mod validator follows an atom only
// within its own file.
const busy = atom({ plugin: "ember", key: "busy" } as const, false);
const warming = atom({ plugin: "ember", key: "warming" } as const, { isOn: false, pings: 0, stopped: null } as Warming);

const lastRequestAt = atom({ plugin: "ember", key: "lastRequestAt" } as const, 0);
const lastTurnAt = atom({ plugin: "ember", key: "lastTurnAt" } as const, 0);
const notice = atom({ plugin: "ember", key: "notice" } as const, null);

async function stop($: EngineInterface, why: string): Promise<void> {
  await update($, warming, (current) => stopWarming(current, why));
  await update($, notice, () => ({ kind: "stopped" as const, text: `Cache warming stopped: ${why}.` }));
}

async function pingCache($: EngineInterface): Promise<void> {
  const reply = await $.model.fork({ prompt: PING_PROMPT });
  if (!reply.isAnswered) {
    await stop($, `the ping was not answered (${reply.reason})`);
    return;
  }

  // A ping that finds the cache gone has written it again, unavoidably: ember
  // stops there, so it never keeps alive a cache only it re-wrote.
  if (!isWarmPing(reply.usage)) {
    await update($, warming, (current) => stopWarming(current, "the cache had expired early"));
    await update($, notice, () => ({
      kind: "cold" as const,
      text: "While you were away, the prompt cache expired early, so warming stopped.",
    }));

    return;
  }

  const pingedAt = await $.clock.now();

  await update($, lastRequestAt, () => pingedAt);
  await update($, warming, (current) => ({ ...current, pings: current.pings + 1 }));
}

async function sayExpired($: EngineInterface, ago: number): Promise<void> {
  await update($, warming, (current) => stopWarming(current, "the cache expired with no ping"));

  // A resume already said it, with Claude Code's own price.
  if ((await read($, notice)) !== null) {
    return;
  }

  const tokens = (await $.session.usage()).context.tokens;
  const resent = tokens === undefined ? "the whole context" : `${compact(tokens)} tokens`;

  await update($, notice, () => ({
    kind: "cold" as const,
    text: `Prompt cache expired ${since(ago)} ago: your next message re-caches ${resent}.`,
  }));
}

// While warming is on and the main loop idle, a ping before the cache would
// expire. It runs for as long as the session does.
async function warmCache($: EngineInterface): Promise<void> {
  const [current, now, at] = [await read($, warming), await $.clock.now(), await read($, lastRequestAt)];
  if (!current.isOn) {
    return;
  }

  // After this long nobody is there to read a notice, so it stops silently.
  if (isAbandoned(await read($, lastTurnAt), now)) {
    await update($, warming, (warm) => stopWarming(warm, "no turn in 72 hours"));
    return;
  }

  // Past its expiry with no ping, as when the computer slept: nothing is left
  // to keep warm, so ember says what the next message costs and stops.
  if (at > 0 && now - at >= CACHE_TTL_MS) {
    await sayExpired($, now - at - CACHE_TTL_MS);
    return;
  }

  if (ping.isRunning || (await read($, busy)) || !shouldPing(at, now)) {
    return;
  }

  ping.isRunning = true;

  try {
    await pingCache($);
  } finally {
    ping.isRunning = false;
  }
}

export function onSessionStart(on: On): void {
  on("session.start", async ($, e, next) => {
    const started = await next(e);

    $.clock.every(60_000, () => {
      warmCache($).catch(() => undefined);
    });

    if (e.surface === "terminal" && e.isInteractive) {
      const now = await $.clock.now();

      await update($, lastTurnAt, () => now);
      await update($, warming, startWarming);
    }

    return started;
  });
}

import type { On } from "claude-code";
import { atom, update } from "claude-code";

import { CACHE_TTL_MS } from "../cache/timing";
import { compact, since } from "../text/units";

// Declared in each file that reads them: the mod validator follows an atom only
// within its own file.
const lastRequestAt = atom({ plugin: "ember", key: "lastRequestAt" } as const, 0);
const notice = atom({ plugin: "ember", key: "notice" } as const, null);

function coldNotice(e: {
  seconds_since_last_response: number;
  context_tokens?: number;
  estimated_cache_write_usd?: number;
}): string {
  const ago = since(e.seconds_since_last_response * 1000 - CACHE_TTL_MS);
  const tokens = e.context_tokens === undefined ? "the whole context" : `${compact(e.context_tokens)} tokens`;
  const price = e.estimated_cache_write_usd === undefined ? "" : ` (about $${e.estimated_cache_write_usd.toFixed(2)})`;

  return `Prompt cache expired ${ago} ago: your next message re-caches ${tokens}${price}.`;
}

/**
 * A resumed transcript's last response is its last request: the cache counts
 * from there, and a cold one is said above the prompt until the next message.
 */
export function onClassicSessionStart(on: On): void {
  on("classic.SessionStart", async ($, e, next) => {
    const started = await next(e);
    if (e.source === "clear") {
      await update($, lastRequestAt, () => 0);
      return started;
    }

    const seconds = e.seconds_since_last_response;
    if ((e.source !== "resume" && e.source !== "fork") || seconds === undefined) {
      return started;
    }

    const at = (await $.clock.now()) - seconds * 1000;
    await update($, lastRequestAt, () => at);

    if (e.prompt_cache_likely_expired === true) {
      const text = coldNotice({ ...e, seconds_since_last_response: seconds });
      await update($, notice, () => ({ kind: "cold" as const, text }));
    }

    return started;
  });
}

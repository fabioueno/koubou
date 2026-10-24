import type { Warming } from "../../types";

export const CACHE_TTL_MS = 60 * 60_000;

// A session with no turn for this long is taken as left for good.
export const IDLE_LIMIT_MS = 72 * 60 * 60_000;

// Ten minutes before the cache would expire.
export const PING_AFTER_MS = 50 * 60_000;
export const PING_PROMPT = "Reply with the single word: warm";

export function startWarming(warming: Warming): Warming {
  return { ...warming, isOn: true, stopped: null };
}

/**
 * A ping that writes the cache again instead of reading it means the cache was
 * already gone.
 */
export function isWarmPing(usage: { cache_read_input_tokens: number; cache_creation_input_tokens: number }): boolean {
  return usage.cache_read_input_tokens > 0 && usage.cache_creation_input_tokens < 0.1 * usage.cache_read_input_tokens;
}

export function shouldPing(lastRequestAt: number, now: number): boolean {
  const idle = now - lastRequestAt;
  return lastRequestAt > 0 && idle >= PING_AFTER_MS && idle < CACHE_TTL_MS;
}

export function stopWarming(warming: Warming, why: string): Warming {
  return { ...warming, isOn: false, stopped: why };
}

/**
 * True once the person has sent no turn for IDLE_LIMIT_MS. The pings move the
 * cache's clock, not this one.
 */
export function isAbandoned(lastTurnAt: number, now: number): boolean {
  return now - lastTurnAt >= IDLE_LIMIT_MS;
}

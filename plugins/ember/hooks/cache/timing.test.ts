import { describe, expect, test as it } from "claude-code/testing";

import { isWarmPing, shouldPing, startWarming, stopWarming } from "./timing";

const MINUTE = 60_000;

describe("shouldPing", () => {
  it("pings between 50 and 60 minutes of idle, and not before or after", () => {
    const at = 1_000_000;

    expect([49, 50, 59, 60].map((idle) => shouldPing(at, at + idle * MINUTE))).toEqual([false, true, true, false]);
  });

  it("never pings before the first request", () => {
    expect(shouldPing(0, 55 * MINUTE)).toBe(false);
  });
});

describe("isWarmPing", () => {
  it("counts a ping that read the cache as warm", () => {
    expect(isWarmPing({ cache_read_input_tokens: 500_000, cache_creation_input_tokens: 40 })).toBe(true);
  });

  it("counts a ping that wrote the cache again as cold", () => {
    expect(isWarmPing({ cache_read_input_tokens: 24_000, cache_creation_input_tokens: 600_000 })).toBe(false);
  });
});

describe("warming", () => {
  it("starts again after a stop, keeping its count, and stops with its reason", () => {
    const stopped = { isOn: false, pings: 2, stopped: "the cache had expired early" };

    expect(startWarming(stopped)).toEqual({ isOn: true, pings: 2, stopped: null });
    expect(stopWarming(startWarming(stopped), "the ping was not answered (aborted)")).toEqual({
      isOn: false,
      pings: 2,
      stopped: "the ping was not answered (aborted)",
    });
  });
});

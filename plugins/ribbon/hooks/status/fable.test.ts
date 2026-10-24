import { describe, expect, test as it } from "claude-code/testing";

import { fablePercent } from "./fable";

describe("fablePercent", () => {
  it("reads the scoped weekly limit before the flat bucket", () => {
    const cache = JSON.stringify({
      limits: [{ kind: "weekly_scoped", percent: 42.7, scope: { model: { display_name: "Fable" } } }],
      seven_day_fable: { utilization: 3 },
    });

    const percent = fablePercent(cache);

    expect(percent).toBe(42);
  });

  it("has nothing for an account without a Fable window", () => {
    const cache = JSON.stringify({ limits: [], seven_day: null });

    const percent = fablePercent(cache);

    expect(percent).toBeUndefined();
  });
});

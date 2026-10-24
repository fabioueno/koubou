import { describe, expect, test as it } from "claude-code/testing";

import { byActivity, byStart, endRun, spawnRun } from "./runs";

const spawned = (ids: readonly string[]): Parameters<typeof byStart>[0] =>
  ids.reduce(
    (all, id, at) => spawnRun(all, id, { type: "Explore", model: "Haiku 5.5", description: id, at }),
    {} as Parameters<typeof byStart>[0],
  );

describe("byActivity", () => {
  it("lists working subagents newest first, then finished ones by when they ended", () => {
    let all = spawned(["first", "second", "third", "fourth"]);
    all = endRun(all, "first", { at: 20, isFailed: false });
    all = endRun(all, "third", { at: 10, isFailed: false });

    expect(byActivity(all).map(([id]) => id)).toEqual(["fourth", "second", "first", "third"]);
  });

  it("leaves the start order for the looks", () => {
    const all = endRun(spawned(["first", "second"]), "first", { at: 5, isFailed: false });

    expect(byStart(all).map(([id]) => id)).toEqual(["first", "second"]);
  });
});

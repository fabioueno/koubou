import { describe, expect, test as it } from "claude-code/testing";

import { lookOf } from "./look";

describe("lookOf", () => {
  it("gives the first five subagents five hats, colours and routines", () => {
    const looks = [0, 1, 2, 3, 4].map((order) => lookOf(`agent-${order}`, order));

    expect(new Set(looks.map((look) => look.hat)).size).toBe(5);
    expect(new Set(looks.map((look) => look.color)).size).toBe(5);
    expect(new Set(looks.map((look) => look.routine)).size).toBe(5);
  });

  it("keeps a subagent's look for its start order, whatever its id", () => {
    const [left, right] = [lookOf("one-id", 2), lookOf("another-id", 2)];

    expect([left.hat, left.color, left.routine]).toEqual([right.hat, right.color, right.routine]);
  });
});

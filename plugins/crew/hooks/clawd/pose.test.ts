import { describe, expect, test as it } from "claude-code/testing";

import type { AgentRun } from "../../types";
import { lookOf } from "./look";
import { HEAD, LID } from "./parts";
import { clawdRows } from "./pose";

const run = (change: Partial<AgentRun> = {}): AgentRun => ({
  type: "Explore",
  description: "Map the API routes",
  startedAt: 0,
  isFailed: false,
  steps: 0,
  context: 0,
  output: 0,
  ...change,
});

const headOf = (rows: readonly string[]): string => rows[1] ?? "";

describe("clawdRows", () => {
  it("closes the open eyes for one beat at the Clawd's blink", () => {
    // Order 1 dances, a routine with both eyes open on every beat.
    const id = "a1b2c3d4e5f6a7b8c";
    const { blink } = lookOf(id, 1);
    const scene = { id, order: 1, run: run(), isMain: false };

    expect(headOf(clawdRows({ ...scene, tick: blink.at }).rows)).toContain(LID);
    expect(headOf(clawdRows({ ...scene, tick: blink.at + 1 }).rows)).not.toContain(LID);
  });

  it("rests a finished subagent with its eyes closed", () => {
    const drawn = clawdRows({ id: "done", order: 0, run: run({ endedAt: 10 }), isMain: false, tick: 3 });

    expect(headOf(drawn.rows).trim()).toBe(HEAD.shut.trim());
  });
});

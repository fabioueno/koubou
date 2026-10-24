import { describe, expect, test as it, mock } from "claude-code/testing";

import { PANE } from "../../tests/mounts";

const ATLAS = "/Users/robin/Projects/atlas";

describe("onPane", () => {
  it("gives a spawned subagent its own card with its task", async ($, on) => {
    mock.clock(on, { now: 0 });

    on("session.cwd", () => ({ value: ATLAS }));
    on("env.get", () => ({ value: "/Users/robin" }));
    on("agent.spawn", () => ({ model: "claude-haiku-5-5", agentId: "a1b2c3d4e5f6a7b8c" }));

    await $.agent.spawn({
      prompt: "List the routes.",
      description: "Map the API routes",
      subagentType: "Explore",
    } as never);

    const ui = await $.ui.mount(PANE);

    expect(await ui.find({ type: "Text", text: /Explore/ })).toBeDefined();
    expect(await ui.find({ type: "Text", text: /Map the API routes/ })).toBeDefined();
    expect(await ui.find({ type: "Text", text: /Haiku 5\.5/ })).toBeDefined();
  });

  it("keeps a finished subagent's card, reading Done", async ($, on) => {
    const clock = mock.clock(on, { now: 0 });

    on("session.cwd", () => ({ value: ATLAS }));
    on("env.get", () => ({ value: "/Users/robin" }));
    on("agent.spawn", () => ({ model: "claude-haiku-5-5", agentId: "a1b2c3d4e5f6a7b8c" }));
    on("turn.complete", () => ({ text: "Done." }) as never);

    await $.agent.spawn({
      prompt: "List the routes.",
      description: "Map the API routes",
      subagentType: "Explore",
    } as never);
    await clock.advance(5_000);

    await $.turn.complete({ agentId: "a1b2c3d4e5f6a7b8c", durationMs: 5_000, answer: "Twelve routes." } as never);
    const ui = await $.ui.mount(PANE);

    expect(await ui.find({ type: "Text", text: /Done/ })).toBeDefined();
    expect(await ui.find({ type: "Text", text: /5s/ })).toBeDefined();
  });

  it("shows the main agent waiting for an answer while its question is open", async ($, on) => {
    const clock = mock.clock(on, { now: 0 });

    on("session.cwd", () => ({ value: ATLAS }));
    on("env.get", () => ({ value: "/Users/robin" }));

    let answer: (() => void) | undefined;

    on(
      "tool.call",
      { tool: "AskUserQuestion" },
      () =>
        new Promise((done) => {
          answer = (): void => done({ result: { answers: {} } } as never);
        }),
    );
    on("turn.step", async function* () {
      yield* [];

      return { turnId: "turn-1", index: 0, answer: "", toolUses: [], stopReason: "tool_use", usage: null } as never;
    });

    for await (const _ of $.turn.step({
      turnId: "turn-1",
      index: 0,
      model: "claude-opus-5-5",
      messageCount: 1,
    } as never)) {
      // drained
    }

    const asked = $.tool.call({ tool: "AskUserQuestion", questions: [] } as never);
    await clock.settle();

    const ui = await $.ui.mount(PANE);

    expect(await ui.find({ type: "Text", text: /Waiting for your answer/ })).toBeDefined();

    answer?.();
    await asked;
    await ui.redraw(PANE.props);

    expect(await ui.find({ type: "Text", text: /Waiting for your answer/ })).toBeUndefined();
  });
});

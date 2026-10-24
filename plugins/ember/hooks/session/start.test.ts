import type { TestBody } from "claude-code/testing";
import { describe, expect, test as it, mock } from "claude-code/testing";

import { ABOVE } from "../../tests/mounts";

const MINUTE = 60_000;

// A last request at zero reads as none at all, so the clock starts later.
const START = 1_000_000;

const usage = (read: number, write: number): never =>
  ({ cache_read_input_tokens: read, cache_creation_input_tokens: write, input_tokens: 5, output_tokens: 1 }) as never;

async function finishTurn($: Parameters<TestBody>[0]): Promise<void> {
  for await (const _ of $.turn.step({
    turnId: "turn-1",
    index: 0,
    model: "claude-opus-5-5",
    messageCount: 1,
  } as never)) {
    // drained
  }

  await $.turn.complete({ turnId: "turn-1", durationMs: 1_000, answer: "Done." } as never);
}

describe("warming", () => {
  it("pings once the session has been idle for 50 minutes, and stays quiet while the cache is warm", async ($, on) => {
    const clock = mock.clock(on, { now: START });

    const forks: string[] = [];
    const toasts: string[] = [];

    on("session.start", () => ({ cwd: "/Users/robin/Projects/atlas", startedAt: 0 }) as never);
    on("turn.step", async function* () {
      yield* [];

      return { turnId: "turn-1", index: 0, answer: "", toolUses: [], stopReason: "end_turn", usage: null } as never;
    });
    on("turn.complete", () => ({ text: "Done." }) as never);
    on("model.fork", (_, e) => {
      forks.push(e.prompt);
      return { value: { isAnswered: true, text: "warm", usage: usage(500_000, 40) } as never };
    });
    on("ui.toast", (_, e) => {
      toasts.push(e.text);
      return { value: undefined } as never;
    });

    await $.session.start({ cwd: "/Users/robin/Projects/atlas", surface: "terminal", isInteractive: true });
    await finishTurn($);
    await clock.advance(49 * MINUTE);

    expect(forks).toEqual([]);

    await clock.advance(2 * MINUTE);

    expect(forks).toEqual(["Reply with the single word: warm"]);
    expect(toasts).toEqual([]);
  });

  it("keeps pinging for as long as the session runs, with no time limit", async ($, on) => {
    const clock = mock.clock(on, { now: START });
    let forks = 0;

    on("session.start", () => ({ cwd: "/Users/robin/Projects/atlas", startedAt: 0 }) as never);
    on("turn.step", async function* () {
      yield* [];

      return { turnId: "turn-1", index: 0, answer: "", toolUses: [], stopReason: "end_turn", usage: null } as never;
    });
    on("turn.complete", () => ({ text: "Done." }) as never);
    on("model.fork", () => {
      forks += 1;
      return { value: { isAnswered: true, text: "warm", usage: usage(500_000, 40) } as never };
    });

    await $.session.start({ cwd: "/Users/robin/Projects/atlas", surface: "terminal", isInteractive: true });
    await finishTurn($);
    await clock.advance(10 * 60 * MINUTE);

    // One ping every 50 or 51 minutes, ten hours after the last turn.
    expect(forks).toBeGreaterThanOrEqual(11);
  });

  it("stops for good once 72 hours pass with no turn", async ($, on) => {
    const clock = mock.clock(on, { now: START });
    let forks = 0;

    on("session.start", () => ({ cwd: "/Users/robin/Projects/atlas", startedAt: 0 }) as never);
    on("turn.step", async function* () {
      yield* [];

      return { turnId: "turn-1", index: 0, answer: "", toolUses: [], stopReason: "end_turn", usage: null } as never;
    });
    on("turn.complete", () => ({ text: "Done." }) as never);
    on("model.fork", () => {
      forks += 1;
      return { value: { isAnswered: true, text: "warm", usage: usage(500_000, 40) } as never };
    });

    await $.session.start({ cwd: "/Users/robin/Projects/atlas", surface: "terminal", isInteractive: true });
    await finishTurn($);
    await clock.advance(73 * 60 * MINUTE);

    const atLimit = forks;
    await clock.advance(10 * 60 * MINUTE);

    expect(atLimit).toBeGreaterThan(80);
    expect(forks).toBe(atLimit);
  });

  it("stops when the session ends, as a /clear ends it", async ($, on) => {
    const clock = mock.clock(on, { now: START });
    let forks = 0;

    on("session.start", () => ({ cwd: "/Users/robin/Projects/atlas", startedAt: 0 }) as never);
    on("session.end", () => ({ sessionId: "session-1" }) as never);
    on("turn.step", async function* () {
      yield* [];

      return { turnId: "turn-1", index: 0, answer: "", toolUses: [], stopReason: "end_turn", usage: null } as never;
    });
    on("turn.complete", () => ({ text: "Done." }) as never);
    on("model.fork", () => {
      forks += 1;
      return { value: { isAnswered: true, text: "warm", usage: usage(500_000, 40) } as never };
    });

    await $.session.start({ cwd: "/Users/robin/Projects/atlas", surface: "terminal", isInteractive: true });
    await finishTurn($);

    await $.session.end({ reason: "clear", sessionId: "session-1", resume: {} } as never);
    await clock.advance(3 * 60 * MINUTE);

    expect(forks).toBe(0);
  });

  it("stops at the first ping that finds the cache gone, and says so", async ($, on) => {
    const clock = mock.clock(on, { now: START });
    let forks = 0;

    on("session.start", () => ({ cwd: "/Users/robin/Projects/atlas", startedAt: 0 }) as never);
    on("turn.step", async function* () {
      yield* [];

      return { turnId: "turn-1", index: 0, answer: "", toolUses: [], stopReason: "end_turn", usage: null } as never;
    });
    on("turn.complete", () => ({ text: "Done." }) as never);

    // Nothing else sits above the prompt here.
    on("ui.render", { component: "AbovePrompt" }, ($, e, next) =>
      e.surface === "terminal" ? $.ui.resolve(e).Box({}) : next(e),
    );
    on("model.fork", () => {
      forks += 1;
      return { value: { isAnswered: true, text: "warm", usage: usage(24_000, 246_100) } as never };
    });

    await $.session.start({ cwd: "/Users/robin/Projects/atlas", surface: "terminal", isInteractive: true });
    await finishTurn($);
    await clock.advance(3 * 60 * MINUTE);

    const ui = await $.ui.mount(ABOVE);

    expect(forks).toBe(1);
    expect(
      await ui.find({
        type: "Text",
        text: /While you were away, the prompt cache expired early, so warming stopped\./,
      }),
    ).toBeDefined();
  });

  it("says what the next message re-caches when the cache expired with no ping, and sends none", async ($, on) => {
    const clock = mock.clock(on, { now: START + 70 * MINUTE });
    let forks = 0;

    on("session.start", () => ({ cwd: "/Users/robin/Projects/atlas", startedAt: 0 }) as never);
    on("turn.step", async function* () {
      yield* [];

      return { turnId: "turn-1", index: 0, answer: "", toolUses: [], stopReason: "end_turn", usage: null } as never;
    });
    on("turn.complete", () => ({ text: "Done." }) as never);

    // Nothing else sits above the prompt here.
    on("ui.render", { component: "AbovePrompt" }, ($, e, next) =>
      e.surface === "terminal" ? $.ui.resolve(e).Box({}) : next(e),
    );
    on("classic.SessionStart", () => ({}) as never);
    on("session.usage", () => ({ value: { startedAt: 0, context: { tokens: 246_100 }, rateLimits: [] } as never }));
    on("model.fork", () => {
      forks += 1;
      return { value: { isAnswered: true, text: "warm", usage: usage(500_000, 40) } as never };
    });

    await $.session.start({ cwd: "/Users/robin/Projects/atlas", surface: "terminal", isInteractive: true });

    // A resume whose last request was 70 minutes ago, as after the computer slept.
    await $.classic.SessionStart({ source: "resume", seconds_since_last_response: 70 * 60 } as never);
    await clock.advance(MINUTE);
    const ui = await $.ui.mount(ABOVE);

    expect(forks).toBe(0);
    expect(
      await ui.find({
        type: "Text",
        text: /Prompt cache expired 11m 00s ago: your next message re-caches 246\.1k tokens\./,
      }),
    ).toBeDefined();
  });

  it("keeps a resume's own notice instead of saying the same again", async ($, on) => {
    const clock = mock.clock(on, { now: START + 70 * MINUTE });

    on("session.start", () => ({ cwd: "/Users/robin/Projects/atlas", startedAt: 0 }) as never);
    on("classic.SessionStart", () => ({}) as never);
    on("session.usage", () => ({ value: { startedAt: 0, context: { tokens: 246_100 }, rateLimits: [] } as never }));

    // Nothing else sits above the prompt here.
    on("ui.render", { component: "AbovePrompt" }, ($, e, next) =>
      e.surface === "terminal" ? $.ui.resolve(e).Box({}) : next(e),
    );

    await $.session.start({ cwd: "/Users/robin/Projects/atlas", surface: "terminal", isInteractive: true });
    await $.classic.SessionStart({
      source: "resume",
      seconds_since_last_response: 70 * 60,
      prompt_cache_likely_expired: true,
      context_tokens: 246_100,
      estimated_cache_write_usd: 1.97,
    } as never);

    await clock.advance(MINUTE);
    const ui = await $.ui.mount(ABOVE);

    expect(await ui.find({ type: "Text", text: /\(about \$1\.97\)\./ })).toBeDefined();
  });

  it("stops without a ping when the model changes", async ($, on) => {
    const clock = mock.clock(on, { now: START });
    let forks = 0;

    on("session.start", () => ({ cwd: "/Users/robin/Projects/atlas", startedAt: 0 }) as never);
    on("turn.step", async function* () {
      yield* [];

      return { turnId: "turn-1", index: 0, answer: "", toolUses: [], stopReason: "end_turn", usage: null } as never;
    });
    on("turn.complete", () => ({ text: "Done." }) as never);

    // Nothing else sits above the prompt here.
    on("ui.render", { component: "AbovePrompt" }, ($, e, next) =>
      e.surface === "terminal" ? $.ui.resolve(e).Box({}) : next(e),
    );
    on("classic.PostModelSwitch", () => ({}) as never);
    on("model.fork", () => {
      forks += 1;
      return { value: { isAnswered: true, text: "warm", usage: usage(500_000, 40) } as never };
    });

    await $.session.start({ cwd: "/Users/robin/Projects/atlas", surface: "terminal", isInteractive: true });
    await finishTurn($);
    await $.classic.PostModelSwitch({ from_model: "claude-opus-5-5", to_model: "claude-sonnet-5-5" } as never);
    await clock.advance(3 * 60 * MINUTE);

    expect(forks).toBe(0);
  });
});

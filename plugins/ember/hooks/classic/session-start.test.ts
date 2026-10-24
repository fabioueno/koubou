import { describe, expect, test as it, mock } from "claude-code/testing";

import { ABOVE } from "../../tests/mounts";

const COLD = "Prompt cache expired 26 days ago: your next message re-caches 303.1k tokens (about $3.03).";

describe("onClassicSessionStart", () => {
  it("says above the prompt what the next message re-caches when a resume finds the cache cold", async ($, on) => {
    mock.clock(on, { now: 30 * 24 * 60 * 60_000 });

    on("classic.SessionStart", () => ({}) as never);
    on("prompt.submit", (_, e) => ({ text: e.text }));

    // Nothing else sits above the prompt here.
    on("ui.render", { component: "AbovePrompt" }, ($, e, next) =>
      e.surface === "terminal" ? $.ui.resolve(e).Box({}) : next(e),
    );

    await $.classic.SessionStart({
      source: "resume",
      seconds_since_last_response: 26 * 24 * 60 * 60 + 2 * 60 * 60,
      prompt_cache_likely_expired: true,
      context_tokens: 303_100,
      estimated_cache_write_usd: 3.03,
    } as never);

    const ui = await $.ui.mount(ABOVE);

    expect(
      await ui.find({ type: "Text", text: new RegExp(COLD.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) }),
    ).toBeDefined();

    await $.prompt.submit({ text: "Carry on", origin: { kind: "composer" }, wait: false } as never);
    await ui.redraw(ABOVE.props);

    expect(await ui.find({ type: "Text", text: /Prompt cache expired/ })).toBeUndefined();
  });
});

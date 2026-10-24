import { describe, expect, test as it, mock } from "claude-code/testing";

import { PANE } from "../../tests/mounts";

const typed = (text: string): never => ({ text, origin: { kind: "composer" }, wait: false }) as never;

describe("onPromptSubmit", () => {
  it("shows the mood Haiku reads in a typed prompt on Main's card", async ($, on) => {
    const clock = mock.clock(on, { now: 0 });
    on("prompt.submit", (_, e) => ({ text: e.text }));
    on("model.classify", () => ({ value: "thanks Claude" }));

    await $.prompt.submit(typed("Danke!"));
    await clock.settle();
    const ui = await $.ui.mount(PANE);

    expect(await ui.find({ type: "Text", text: /Glad that helped/ })).toBeDefined();
  });

  it("leaves Main waiting when Haiku reads no mood", async ($, on) => {
    const clock = mock.clock(on, { now: 0 });
    on("prompt.submit", (_, e) => ({ text: e.text }));
    on("model.classify", () => ({ value: "none of these: a plain request or question" }));

    await $.prompt.submit(typed("Add a test for the trip dates"));
    await clock.settle();
    const ui = await $.ui.mount(PANE);

    expect(await ui.find({ type: "Text", text: /Waiting for you/ })).toBeDefined();
  });
});

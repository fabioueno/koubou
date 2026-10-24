import { describe, expect, test as it } from "claude-code/testing";

import { VIEWPORT } from "../../tests/mounts";

describe("onPromptHint", () => {
  it("drops the agents count from the hint line", async ($, on) => {
    on("ui.render", { component: "PromptHint" }, ($, e) => {
      const { Text } = $.ui.resolve(e);
      return <Text>{e.props.hint}</Text>;
    });

    const ui = await $.ui.mount({
      plugin: "crew",
      surface: "terminal",
      component: "PromptHint",
      viewport: VIEWPORT,
      props: { isDraft: false, isWorking: true, hint: "auto mode on (shift+tab to cycle) · ← 2 agents" },
    });

    expect(await ui.find({ type: "Text", text: "auto mode on (shift+tab to cycle)" })).toBeDefined();
  });
});

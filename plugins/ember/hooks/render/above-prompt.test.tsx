import { describe, expect, test as it, mock } from "claude-code/testing";

import { ABOVE } from "../../tests/mounts";
import { LOOKS } from "../notice/look";

describe("onAbovePrompt", () => {
  it("draws nothing of its own while there is no notice", async ($, on) => {
    on("ui.render", { component: "AbovePrompt" }, ($, e, next) => {
      if (e.surface !== "terminal") {
        return next(e);
      }

      const { Text } = $.ui.resolve(e);

      return <Text>band</Text>;
    });

    const ui = await $.ui.mount(ABOVE);

    expect((await ui.findAll({ type: "Text" })).map((node) => node.text)).toEqual(["band"]);
  });

  it("puts a cold cache's notice, with its ice, above what the rest draws", async ($, on) => {
    mock.clock(on, { now: 10 * 60 * 60_000 });

    on("classic.SessionStart", () => ({}) as never);
    on("ui.render", { component: "AbovePrompt" }, ($, e, next) => {
      if (e.surface !== "terminal") {
        return next(e);
      }

      const { Text } = $.ui.resolve(e);
      return <Text>band</Text>;
    });

    await $.classic.SessionStart({
      source: "resume",
      seconds_since_last_response: 3 * 60 * 60,
      prompt_cache_likely_expired: true,
    } as never);

    const texts = (await (await $.ui.mount(ABOVE)).findAll({ type: "Text" })).map((node) => node.text);

    expect(texts.at(-1)).toBe("band");
    expect(texts[0]?.startsWith(LOOKS.cold.glyph)).toBe(true);
  });
});

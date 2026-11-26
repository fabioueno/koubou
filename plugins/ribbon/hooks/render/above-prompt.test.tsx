import { describe, expect, test as it, mock } from "claude-code/testing";

const BAND = {
  hasSurvey: false,
  isCollapsed: false,
  isWorking: false,
  maxRows: 6,
  bodyColumns: 120,
  scroll: { offset: 0, bodyRows: 6 },
  view: {},
} as const;

const ROW_MOUNT = {
  plugin: "ribbon",
  surface: "terminal",
  component: "AbovePrompt",
  viewport: { columns: 160, rows: 48 },
  props: BAND,
} as const;

describe("onAbovePrompt", () => {
  it("draws the band as ribbon's own row", { options: { showRateLimits: false } }, async ($, on) => {
    mock.clock(on, { now: 60 * 60_000 });

    on("session.start", () => ({ cwd: "/Users/robin/Projects/atlas", startedAt: 0 }) as never);
    on("session.usage", () => ({ value: { startedAt: 0, context: {}, rateLimits: [] } as never }));
    on("session.cwd", () => ({ value: "/Users/robin/Projects/atlas" }));
    on("session.root", () => ({ value: "/Users/robin/Projects/atlas" }));

    await $.session.start({ cwd: "/Users/robin/Projects/atlas", surface: "terminal", isInteractive: true });
    const texts = (await (await $.ui.mount(ROW_MOUNT)).findAll({ type: "Text" })).map((node) => node.text);

    expect(texts.some((text) => text.endsWith("atlas"))).toBe(true);
  });
});

describe("onAbovePromptList", () => {
  it("keeps ribbon's row next to the prompt, under every other plugin's row", async ($) => {
    const list = await $.ui.mount({
      plugin: "ribbon",
      surface: "terminal",
      component: "AbovePromptList",
      viewport: { columns: 160, rows: 48 },
      props: {
        ...BAND,
        rows: [
          { plugin: "ribbon", tree: { type: "Text", children: ["the band"] } },
          { plugin: "notes", tree: { type: "Text", children: ["a line of another plugin"] } },
        ],
      },
    });
    const texts = (await list.findAll({ type: "Text" })).map((node) => node.text);

    expect(texts).toEqual(["a line of another plugin", "the band"]);
  });
});

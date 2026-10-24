import { describe, expect, test as it, mock } from "claude-code/testing";

const MOUNT = {
  plugin: "ribbon",
  surface: "terminal",
  component: "AbovePrompt",
  viewport: { columns: 160, rows: 48 },
  props: {
    hasSurvey: false,
    isWorking: false,
    maxRows: 6,
    bodyColumns: 120,
    scroll: { offset: 0, bodyRows: 6 },
    view: {},
  },
} as const;

describe("onAbovePrompt", () => {
  it(
    "keeps the band next to the prompt, under what other plugins draw",
    { options: { showRateLimits: false } },
    async ($, on) => {
      mock.clock(on, { now: 60 * 60_000 });

      on("session.start", () => ({ cwd: "/Users/robin/Projects/atlas", startedAt: 0 }) as never);
      on("session.usage", () => ({ value: { startedAt: 0, context: {}, rateLimits: [] } as never }));
      on("session.cwd", () => ({ value: "/Users/robin/Projects/atlas" }));
      on("session.root", () => ({ value: "/Users/robin/Projects/atlas" }));
      on("process.run", () => ({
        value: { exitCode: 1, stdout: "", stderr: "", isStdoutTruncated: false, isStderrTruncated: false },
      }));
      on("ui.render", { component: "AbovePrompt" }, ($, e, next) => {
        if (e.surface !== "terminal") {
          return next(e);
        }

        const { Text } = $.ui.resolve(e);

        return <Text>a line of another plugin</Text>;
      });

      await $.session.start({ cwd: "/Users/robin/Projects/atlas", surface: "terminal", isInteractive: true });
      const texts = (await (await $.ui.mount(MOUNT)).findAll({ type: "Text" })).map((node) => node.text);

      expect(texts[0]).toBe("a line of another plugin");
      expect(texts.some((text) => text.endsWith("atlas"))).toBe(true);
    },
  );
});

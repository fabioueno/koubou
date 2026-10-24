import { describe, expect, test as it } from "claude-code/testing";

import type { Status } from "../../types";
import { type BandView, band } from "./band";

const NOW = Date.parse("2026-10-24T18:00:00Z");

const STATUS: Status = {
  now: NOW,
  startedAt: NOW - 42 * 60_000,
  costUsd: 3.5,
  fiveHour: { percent: 37, resetsAt: "2026-10-24T20:00:00Z" },
  sevenDay: { percent: 61 },
  fable: 12,
  project: "atlas",
  branch: "feat/trips",
};

const VIEW: BandView = {
  status: STATUS,
  width: 120,
  showCost: true,
  showRateLimits: true,
};

const MOUNT = {
  plugin: "ribbon",
  surface: "terminal",
  component: "AbovePrompt",
  viewport: { columns: 160, rows: 48 },
  props: {
    hasSurvey: false,
    isWorking: false,
    maxRows: 4,
    bodyColumns: 120,
    scroll: { offset: 0, bodyRows: 4 },
    view: {},
  },
} as const;

const texts = async (ui: { findAll: (query: { type: "Text" }) => Promise<{ text: string }[]> }): Promise<string[]> =>
  (await ui.findAll({ type: "Text" })).map((node) => node.text);

describe("band", () => {
  it("shows the session's time, cost, project, branch and limits", async ($, on) => {
    on("ui.render", { component: "AbovePrompt" }, ($, e, next) =>
      e.surface === "terminal" ? band($.ui.resolve(e), VIEW) : next(e),
    );

    const shown = (await texts(await $.ui.mount(MOUNT))).join(" | ");

    for (const part of ["42m 00s", "3.50", "atlas", "feat/trips", "37%", "2h 00m", "61%", "12%"]) {
      expect(shown).toContain(part);
    }
  });

  it("leaves out the cost and the limits when their options are off", async ($, on) => {
    on("ui.render", { component: "AbovePrompt" }, ($, e, next) =>
      e.surface === "terminal" ? band($.ui.resolve(e), { ...VIEW, showCost: false, showRateLimits: false }) : next(e),
    );

    const shown = (await texts(await $.ui.mount(MOUNT))).join(" | ");

    expect(shown).not.toContain("3.50");
    expect(shown).not.toContain("37%");
    expect(shown).not.toContain("61%");
  });
});

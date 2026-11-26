import type { On, PluginOptions } from "claude-code";
import { atom, read } from "claude-code";

import { band } from "../status/band";

// Declared in each file that reads them: the mod validator follows an atom only
// within its own file.
const status = atom({ plugin: "ribbon", key: "status" } as const, null);

/**
 * The band as ribbon's own row above the prompt.
 */
export function onAbovePrompt(on: On, options: PluginOptions): void {
  on("ui.render", { component: "AbovePrompt" }, async ($, e, next) => {
    const current = await read($, status);
    if (e.surface !== "terminal" || e.props.hasSurvey || current === null) {
      return next(e);
    }

    return band($.ui.resolve(e), {
      status: current,
      width: e.props.bodyColumns,
      showCost: options.showCost !== false,
      showRateLimits: options.showRateLimits !== false,
    });
  });
}

/**
 * Ribbon's row last, so the band stays next to the prompt under every other
 * plugin's row, whatever order the plugins run in.
 */
export function onAbovePromptList(on: On): void {
  on("ui.render", { component: "AbovePromptList" }, (_$, e, next) => {
    const rows = e.props.rows;
    const others = rows.filter((row) => row.plugin !== "ribbon");
    const own = rows.filter((row) => row.plugin === "ribbon");

    return next({ ...e, props: { ...e.props, rows: [...others, ...own] } });
  });
}

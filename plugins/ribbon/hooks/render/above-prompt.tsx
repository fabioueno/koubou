import type { On, PluginOptions } from "claude-code";
import { atom, read } from "claude-code";

import { band } from "../status/band";

// Declared in each file that reads them: the mod validator follows an atom only
// within its own file.
const status = atom({ plugin: "ribbon", key: "status" } as const, null);

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

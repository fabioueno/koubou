import type { On, PluginOptions } from "claude-code";
import { atom, read } from "claude-code";

import { band } from "../status/band";

// Declared in each file that reads them: the mod validator follows an atom only
// within its own file.
const status = atom({ plugin: "ribbon", key: "status" } as const, null);

/**
 * The band, kept next to the prompt, under whatever the other plugins draw
 * above the prompt, so each one's part shows whatever order the plugins run in.
 */
export function onAbovePrompt(on: On, options: PluginOptions): void {
  on("ui.render", { component: "AbovePrompt" }, async ($, e, next) => {
    const current = await read($, status);
    if (e.surface !== "terminal" || e.props.hasSurvey || current === null) {
      return next(e);
    }

    const E = $.ui.resolve(e);
    const above = await next(e);

    return (
      <E.Box flexDirection="column">
        {above}
        {band(E, {
          status: current,
          width: e.props.bodyColumns,
          showCost: options.showCost !== false,
          showRateLimits: options.showRateLimits !== false,
        })}
      </E.Box>
    );
  });
}

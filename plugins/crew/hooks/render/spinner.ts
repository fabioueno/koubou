import type { On } from "claude-code";
import { atom, update } from "claude-code";

// Declared in each file that reads them: the mod validator follows an atom only
// within its own file.
const verb = atom({ plugin: "crew", key: "verb" } as const, null);

/**
 * Passes the engine's line through, keeping its verb for the main agent's card.
 */
export function onSpinner(on: On): void {
  let lastVerb = "";
  on("ui.render", { component: "Spinner" }, ($, e, next) => {
    const word = e.props.word;
    if (word !== "" && word !== lastVerb) {
      lastVerb = word;

      // Drawing may not write state, so the write waits for a timer.
      $.clock.after(0, () => {
        update($, verb, () => word).catch(() => undefined);
      });
    }

    return next(e);
  });
}

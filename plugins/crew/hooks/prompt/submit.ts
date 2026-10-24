import type { On, PluginOptions } from "claude-code";
import { atom, update } from "claude-code";

import { moodOf } from "../mood/classify";
import { MOOD_MS } from "../mood/look";

// Declared in each file that reads them: the mod validator follows an atom only
// within its own file.
const mood = atom({ plugin: "crew", key: "mood" } as const, null);

/**
 * A prompt the person typed sets Main's mood for a few seconds; the prompt
 * itself reaches the model untouched, without waiting for the classifier.
 */
export function onPromptSubmit(on: On, options: PluginOptions): void {
  on("prompt.submit", async ($, e, next) => {
    const submitted = await next(e);
    if (options.showMoods === false || e.origin.kind !== "composer") {
      return submitted;
    }

    moodOf($, e.text)
      .then(async (kind) => {
        if (kind !== undefined) {
          const until = (await $.clock.now()) + MOOD_MS;
          await update($, mood, () => ({ kind, until }));
        }
      })
      .catch(() => undefined);

    return submitted;
  }).catch((_$, e, next) => next(e));
}

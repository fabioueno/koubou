import type { On } from "claude-code";
import { atom, update } from "claude-code";

// Declared in each file that reads them: the mod validator follows an atom only
// within its own file.
const notice = atom({ plugin: "ember", key: "notice" } as const, null);

/**
 * The next message is what the notice was about, so sending it clears it.
 */
export function onPromptSubmit(on: On): void {
  on("prompt.submit", async ($, e, next) => {
    const submitted = await next(e);
    await update($, notice, () => null);

    return submitted;
  }).catch((_$, e, next) => next(e));
}

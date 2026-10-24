import type { On } from "claude-code";

const AGENTS_COUNT = /\s*·\s*←?\s*\d+ agents?\b/g;

/**
 * The agents live in the side panel, so the hint line need not count them.
 */
export function onPromptHint(on: On): void {
  on("ui.render", { component: "PromptHint" }, (_$, e, next) => {
    const hint = e.props.hint.replace(AGENTS_COUNT, "");
    if (e.surface !== "terminal" || hint === e.props.hint) {
      return next(e);
    }

    return next({ ...e, props: { ...e.props, hint } });
  });
}

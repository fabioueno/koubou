import type { Register } from "claude-code";

import { onAbovePrompt, onAbovePromptList } from "./render/above-prompt";
import { onSessionStart } from "./session/start";

export const register: Register = (on, options) => {
  onSessionStart(on, options);
  onAbovePrompt(on, options);
  onAbovePromptList(on);
};

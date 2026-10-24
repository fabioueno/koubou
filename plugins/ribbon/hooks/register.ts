import type { Register } from "claude-code";

import { onAbovePrompt } from "./render/above-prompt";
import { onSessionStart } from "./session/start";

export const register: Register = (on, options) => {
  onSessionStart(on, options);
  onAbovePrompt(on, options);
};

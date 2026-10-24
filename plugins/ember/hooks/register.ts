import type { Register } from "claude-code";

import { onClassicModelSwitch } from "./classic/model-switch";
import { onClassicSessionStart } from "./classic/session-start";
import { onPromptSubmit } from "./prompt/submit";
import { onAbovePrompt } from "./render/above-prompt";
import { onSessionEnd } from "./session/end";
import { onSessionStart } from "./session/start";
import { onTurnComplete } from "./turn/complete";
import { onTurnStep } from "./turn/step";

export const register: Register = (on) => {
  onSessionStart(on);
  onSessionEnd(on);
  onClassicSessionStart(on);
  onClassicModelSwitch(on);
  onTurnStep(on);
  onTurnComplete(on);
  onPromptSubmit(on);
  onAbovePrompt(on);
};

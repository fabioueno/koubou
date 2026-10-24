import type { Register } from "claude-code";

import { onAgentSpawn } from "./agent/spawn";
import { onCommandRun } from "./command/run";
import { onPromptSubmit } from "./prompt/submit";
import { onPane } from "./render/pane";
import { onPromptHint } from "./render/prompt-hint";
import { onSpinner } from "./render/spinner";
import { onSessionStart } from "./session/start";
import { onToolCall } from "./tool/call";
import { onTurnComplete } from "./turn/complete";
import { onTurnStep } from "./turn/step";

export const register: Register = (on, options) => {
  onSessionStart(on);
  onPromptSubmit(on, options);
  onTurnStep(on);
  onTurnComplete(on);
  onAgentSpawn(on);
  onToolCall(on);
  onCommandRun(on);
  onSpinner(on);
  onPromptHint(on);
  onPane(on);
};

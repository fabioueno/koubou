import type { AgentRun, MoodKind } from "../../types";
import { MOOD_LOOKS } from "../mood/look";
import { GLYPHS } from "../palette/glyphs";
import { isAsking, isLive } from "./runs";

export interface Moment {
  verb: string;
  mood?: MoodKind;
}

/**
 * What a card says its loop is doing, with the glyph beside it.
 */
export function actionOf(run: AgentRun | undefined, isMain: boolean, moment: Moment): [string, string] {
  if (isAsking(run)) {
    return [GLYPHS.question, "Waiting for your answer"];
  }
  if (isMain && moment.mood !== undefined) {
    return [MOOD_LOOKS[moment.mood].glyph, MOOD_LOOKS[moment.mood].line];
  }
  if (isLive(run)) {
    return run?.lastTool === undefined ? [GLYPHS.thinking, `${moment.verb}…`] : [GLYPHS.tool, run.lastTool];
  }
  if (!isMain) {
    return run?.isFailed ? [GLYPHS.fail, "Failed"] : [GLYPHS.ok, "Done"];
  }

  return [GLYPHS.waiting, "Waiting for you"];
}

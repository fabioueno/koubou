import type { RenderElement } from "claude-code";

import type { Els } from "../cards/elements";
import { LID } from "./parts";

/**
 * One row of a Clawd in its color, with each closed eyelid drawn inverse.
 */
export function clawdRow(E: Els, row: string, color: string): RenderElement {
  const { Text } = E;
  const pieces = row.split(LID);

  return (
    <Text color={color}>{pieces.flatMap((piece, i) => (i === 0 ? [piece] : [<Text inverse>{LID}</Text>, piece]))}</Text>
  );
}

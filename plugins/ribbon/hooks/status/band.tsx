import type { RenderElement } from "claude-code";

import type { Gauge, Status } from "../../types";
import type { Els } from "../cards/elements";
import { CARD_BORDER, MUTED, RAMP } from "../palette/colors";
import { GLYPHS } from "../palette/glyphs";
import { gradient } from "../palette/gradient";
import { duration, untilReset } from "../text/units";

// The fixed-colour items, in the order they take the ramp.
function fixedItems(view: BandView): [string, string][] {
  const { status } = view;
  const items: [string, string][] = [[GLYPHS.clock, duration(status.now - status.startedAt)]];

  if (view.showCost) {
    items.push([GLYPHS.cost, status.costUsd.toFixed(2)]);
  }

  items.push([GLYPHS.project, status.project]);

  if (status.branch !== undefined) {
    items.push([GLYPHS.branch, status.branch]);
  }
  if (status.worktree !== undefined) {
    items.push([GLYPHS.worktree, status.worktree]);
  }

  return items;
}

function gauge(E: Els, glyph: string, limit: Gauge | undefined, view: BandView, fable?: number): RenderElement | null {
  const { Box, Text } = E;
  if (limit === undefined && fable === undefined) {
    return null;
  }

  const reset = untilReset(limit?.resetsAt, view.status.now);

  return (
    <Box gap={1}>
      {limit !== undefined && (
        <Text wrap="truncate-end" color={gradient(limit.percent)}>
          {glyph} {Math.trunc(limit.percent)}%
        </Text>
      )}

      {fable !== undefined && (
        <Text wrap="truncate-end" color={gradient(fable)}>
          {GLYPHS.fable} {fable}%
        </Text>
      )}

      {reset !== undefined && (
        <Text wrap="truncate-end" color={MUTED}>
          {reset}
        </Text>
      )}
    </Box>
  );
}

export interface BandView {
  status: Status;
  width: number;
  showCost: boolean;
  showRateLimits: boolean;
}

/**
 * One rounded line: fixed items along a pastel ramp first, then the gauges
 * coloured by their value.
 */
export function band(E: Els, view: BandView): RenderElement {
  const { Box, Text } = E;
  const { status } = view;

  return (
    <Box borderStyle="round" borderColor={CARD_BORDER} paddingX={1} columnGap={4} flexWrap="wrap" width={view.width}>
      {fixedItems(view).map(([glyph, text], index) => (
        <Text wrap="truncate-end" color={RAMP[Math.min(index, RAMP.length - 1)]}>
          {glyph} {text}
        </Text>
      ))}

      {view.showRateLimits && gauge(E, GLYPHS.hourglass, status.fiveHour, view)}
      {view.showRateLimits && gauge(E, GLYPHS.calendar, status.sevenDay, view, status.fable)}
    </Box>
  );
}

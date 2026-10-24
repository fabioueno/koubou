import type { RenderElement } from "claude-code";

import { EMPTY, MUTED } from "../palette/colors";
import { gradient } from "../palette/gradient";
import { compact } from "../text/units";
import type { Els } from "./elements";

export function contextBar(E: Els, usage: { percent: number; tokens: number; window: number }): RenderElement {
  const { Box, Text } = E;
  const filled = usage.percent < 0 ? 0 : Math.min(10, Math.round(usage.percent / 10));

  return (
    <Box gap={1}>
      <Box>
        {Array.from({ length: 10 }, (_, cell) =>
          cell < filled ? <Text color={gradient(cell * 10)}>█</Text> : <Text color={EMPTY}>░</Text>,
        )}
      </Box>

      <Text wrap="truncate-end" color={usage.percent < 0 ? MUTED : gradient(usage.percent)}>
        {usage.percent < 0 ? "—" : `${Math.trunc(usage.percent)}%`}
      </Text>
      <Text wrap="truncate-end" color={MUTED}>
        {compact(usage.tokens)} / {compact(usage.window)}
      </Text>
    </Box>
  );
}

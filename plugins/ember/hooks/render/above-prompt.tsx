import type { On } from "claude-code";
import { atom, read } from "claude-code";

import { INDENT, LOOKS } from "../notice/look";

// Declared in each file that reads them: the mod validator follows an atom only
// within its own file.
const notice = atom({ plugin: "ember", key: "notice" } as const, null);

/**
 * The notice above whatever else sits above the prompt, after a blank row and
 * in line with the band's text, until the next message clears it.
 */
export function onAbovePrompt(on: On): void {
  on("ui.render", { component: "AbovePrompt" }, async ($, e, next) => {
    const current = await read($, notice);
    if (e.surface !== "terminal" || e.props.hasSurvey || current === null) {
      return next(e);
    }

    const { Box, Text } = $.ui.resolve(e);
    const below = await next(e);
    const look = LOOKS[current.kind];

    return (
      <Box flexDirection="column">
        <Box marginTop={1} paddingLeft={INDENT}>
          <Text color={look.color} wrap="wrap">
            {look.glyph} {current.text}
          </Text>
        </Box>
        {below}
      </Box>
    );
  });
}

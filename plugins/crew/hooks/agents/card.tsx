import type { RenderElement } from "claude-code";

import type { AgentRun } from "../../types";
import { contextBar } from "../cards/context-bar";
import type { Els } from "../cards/elements";
import { lookOf } from "../clawd/look";
import { askingTint, clawdRows } from "../clawd/pose";
import { clawdRow } from "../clawd/row";
import { CARD_BORDER, CLAUDE, MUTED, REMOVED_TEXT } from "../palette/colors";
import { GLYPHS } from "../palette/glyphs";
import { fit } from "../text/fit";
import { compact, duration } from "../text/units";
import { actionOf, type Moment } from "./action";
import { byActivity, byStart, isAsking, isLive, MAIN } from "./runs";

// The card's padding, the Clawd column's thirteen and the gap beside it.
const CHROME = 4 + 13 + 2;

// A subagent on another model than the main loop's is assumed to have this
// window.
const SUBAGENT_WINDOW = 200_000;

type Line = (icon: string, text: string, tint?: string) => RenderElement;

interface Card {
  id: string;
  order: number;
  run: AgentRun | undefined;
  isMain: boolean;
}

function figureColor(card: Card, tint: string | undefined): string {
  if (tint !== undefined) {
    return tint;
  }
  if (card.isMain) {
    return isLive(card.run) ? CLAUDE : MUTED;
  }

  return card.run?.isFailed ? REMOVED_TEXT : lookOf(card.id, card.order).color;
}

function borderOf(card: Card, tick: number): string {
  if (!isLive(card.run)) {
    return CARD_BORDER;
  }
  if (isAsking(card.run)) {
    return askingTint(tick);
  }

  return card.isMain ? CLAUDE : lookOf(card.id, card.order).color;
}

function figure(E: Els, card: Card, view: AgentsView): RenderElement {
  const { Box } = E;
  const drawn = clawdRows({ ...card, tick: view.tick, mood: view.moment.mood });
  const color = figureColor(card, drawn.tint);

  return (
    <Box flexDirection="column" width={13}>
      {drawn.rows.map((row) => clawdRow(E, row, color))}
    </Box>
  );
}

function headline(E: Els, card: Card, now: number): RenderElement {
  const { Box, Text } = E;
  const { run, isMain } = card;
  const isClocked = run !== undefined && (isLive(run) || !isMain);

  return (
    <Box justifyContent="space-between">
      <Text color={isLive(run) ? CLAUDE : MUTED} bold={isLive(run)} wrap="truncate-end">
        {GLYPHS.agent} {isMain ? "Main" : (run?.type ?? "")}
      </Text>

      <Text dimColor>{isClocked ? duration((run.endedAt ?? now) - run.startedAt) : ""}</Text>
    </Box>
  );
}

function usage(E: Els, run: AgentRun, window: number, line: Line): RenderElement[] {
  const { Box, Text } = E;

  return [
    line(GLYPHS.output, `${compact(run.output)} output`),
    line(GLYPHS.steps, `${run.steps} ${run.steps === 1 ? "step" : "steps"}`),

    <Box gap={1}>
      <Text color={MUTED}>{GLYPHS.context}</Text>
      {contextBar(E, { percent: (run.context / window) * 100, tokens: run.context, window })}
    </Box>,
  ];
}

function details(E: Els, card: Card, view: AgentsView): RenderElement {
  const { Box, Text } = E;
  const { run, isMain } = card;

  const model = isMain ? view.model : (run?.model ?? "");
  const window = model === view.model || model === "" ? view.mainWindow : SUBAGENT_WINDOW;

  const [glyph, action] = actionOf(run, isMain, view.moment);

  const effort =
    isMain && view.effort !== null ? ` (${view.effort.charAt(0).toUpperCase()}${view.effort.slice(1)})` : "";

  const actionTint = isAsking(run) ? askingTint(view.tick) : undefined;

  const line: Line = (icon, text, tint) => (
    <Text color={tint ?? MUTED} bold={isAsking(run)} wrap="truncate-end">
      {fit(`${icon} ${text}`, view.width - CHROME)}
    </Text>
  );

  return (
    <Box flexDirection="column" flexGrow={1} flexShrink={1}>
      {headline(E, card, view.now)}
      {model !== "" && line(GLYPHS.model, `${model}${effort}`)}
      {!isMain && run !== undefined && line(GLYPHS.task, run.description)}
      {line(glyph, action, actionTint ?? (isLive(run) ? undefined : MUTED))}
      {run !== undefined && usage(E, run, window, line)}
    </Box>
  );
}

function card(E: Els, each: Card, view: AgentsView): RenderElement {
  const { Box } = E;

  return (
    <Box
      borderStyle="round"
      borderColor={borderOf(each, view.tick)}
      paddingX={1}
      gap={2}
      alignItems="center"
      width={view.width}
    >
      {figure(E, each, view)}
      {details(E, each, view)}
    </Box>
  );
}

export interface AgentsView {
  runs: Readonly<Record<string, AgentRun>>;
  tick: number;
  now: number;
  width: number;
  model: string;
  effort: string | null;
  mainWindow: number;
  moment: Moment;
}

/**
 * The main loop's card on top, then a card per subagent, working ones first
 * and the newest of each group on top. A subagent's look follows its start
 * order, so it keeps its Clawd as it moves in the list.
 */
export function agentsCards(E: Els, view: AgentsView): RenderElement {
  const { Box } = E;
  const orders = new Map(byStart(view.runs).map(([id], order) => [id, order]));

  return (
    <Box flexDirection="column" gap={1}>
      {card(E, { id: MAIN, order: 0, run: view.runs[MAIN], isMain: true }, view)}
      {byActivity(view.runs).map(([id, run]) => card(E, { id, order: orders.get(id) ?? 0, run, isMain: false }, view))}
    </Box>
  );
}

import type { AgentRun, MoodKind } from "../../types";
import { isAsking, isLive } from "../agents/runs";
import { MOOD_LOOKS } from "../mood/look";
import { CLAUDE, FLASH } from "../palette/colors";
import { GLYPHS } from "../palette/glyphs";
import { lookOf } from "./look";
import { moodMove } from "./moods";
import { ARMS, HEAD, LEGS, LID } from "./parts";
import type { Move } from "./routines";

interface Scene {
  id: string;
  order: number;
  run: AgentRun | undefined;
  isMain: boolean;
  tick: number;
  mood?: MoodKind;
}

const STILL: Move = { head: HEAD.ahead, arms: ARMS.down, legs: LEGS.still, float: "" };

// Both arms waving, stepping in place, the question marks piling up.
function askingMove(beat: number): Move {
  const isOdd = beat % 2 === 1;

  return {
    head: HEAD.ahead,
    arms: isOdd ? ARMS.down : ARMS.up,
    legs: isOdd ? LEGS.step : LEGS.still,
    float: ["?", "??", "???", " ?"][beat % 4] ?? "?",
  };
}

function moveOf(scene: Scene, beat: number): { move: Move; tint?: string } {
  const { run, isMain } = scene;

  if (isAsking(run)) {
    return { move: askingMove(beat), tint: askingTint(scene.tick) };
  }
  if (isMain && scene.mood !== undefined) {
    return { move: moodMove(scene.mood, beat), tint: MOOD_LOOKS[scene.mood].color };
  }
  if (isLive(run)) {
    const routine = lookOf(scene.id, scene.order).routine;
    return { move: routine[beat % routine.length] ?? STILL };
  }
  if (isMain || run === undefined) {
    return { move: { head: HEAD.shut, arms: ARMS.down, legs: LEGS.still, float: beat % 4 < 2 ? "z" : "zZ" } };
  }

  // A finished subagent rests with its eyes closed.
  return {
    move: {
      ...STILL,
      head: HEAD.shut,
      arms: run.isFailed ? ARMS.down : ARMS.up,
      float: run.isFailed ? GLYPHS.fail : GLYPHS.ok,
    },
  };
}

// Every open eye of a head shut, wherever the head looks.
const closed = (head: string): string => head.replace(/[▛▜]/g, LID);

/**
 * Two beats a colour: the waving keeps the beat, the colour half its pace.
 */
export function askingTint(tick: number): typeof FLASH | typeof CLAUDE {
  return Math.floor(tick / 2) % 2 === 1 ? FLASH : CLAUDE;
}

/**
 * Four rows of thirteen columns: hat, head, arms and legs in a ten-column field
 * (a sway moves them one column right), and a three-column slot beside the hat
 * where notes, dots and z's float.
 */
export function clawdRows(scene: Scene): { rows: string[]; tint?: string } {
  const look = lookOf(scene.id, scene.order);
  const { move, tint } = moveOf(scene, scene.tick + look.phase);

  const field = (art: string): string => (move.sway ? ` ${art}` : `${art} `);
  const isBlinking = scene.tick % look.blink.every === look.blink.at;

  return {
    rows: [
      `${field(look.hat)}${move.float.padEnd(3)}`,
      `${field(isBlinking ? closed(move.head) : move.head)}   `,
      `${field(move.arms)}   `,
      `${field(move.legs)}   `,
    ],
    tint,
  };
}

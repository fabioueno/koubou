import { MAIN } from "../agents/runs";
import { CLAUDE } from "../palette/colors";
import { BLANK, HATS, HUES } from "./parts";
import { MAIN_ROUTINE, type Move, ROUTINES } from "./routines";

function hashOf(id: string): number {
  let hash = 0;
  for (const char of id) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }

  return hash;
}

function blinkOf(hash: number): Blink {
  const every = 12 + ((hash >>> 9) % 8);
  return { every, at: (hash >>> 12) % every };
}

export interface Look {
  hat: string;
  color: string;
  routine: readonly Move[];
  phase: number;
  blink: Blink;
}

// A blink lasts one beat, once every 12 to 19 beats (about five to eight
// seconds), at a beat of the Clawd's own so a panel never blinks in unison.
export interface Blink {
  every: number;
  at: number;
}

/**
 * A subagent's hat, colour and routine come from the order it started in, so
 * the first five in a session never share any of them; its phase and blink come
 * from its id.
 */
export function lookOf(id: string, order: number): Look {
  const hash = hashOf(id);
  if (id === MAIN) {
    return { hat: BLANK, color: CLAUDE, routine: MAIN_ROUTINE, phase: hash % 4, blink: blinkOf(hash) };
  }

  return {
    hat: HATS[order % HATS.length] ?? BLANK,
    color: HUES[order % HUES.length] ?? CLAUDE,
    routine: ROUTINES[order % ROUTINES.length] ?? MAIN_ROUTINE,
    phase: hash % 4,
    blink: blinkOf(hash),
  };
}

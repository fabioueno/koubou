import type { MoodKind } from "../../types";
import { ARMS, HEAD, LEGS } from "./parts";
import type { Move } from "./routines";

const move = (head: string, arms: string, legs: string, float: string, sway = false): Move => ({
  head,
  arms,
  legs,
  float,
  sway,
});

// Two beats each, alternating; the float slot carries the mood's sign.
const MOOD_MOVES: Readonly<Record<MoodKind, readonly [Move, Move]>> = {
  celebrating: [move(HEAD.ahead, ARMS.left, LEGS.wide, "✦"), move(HEAD.ahead, ARMS.right, LEGS.step, " ✧")],
  confused: [move(HEAD.left, ARMS.right, LEGS.still, "?"), move(HEAD.right, ARMS.right, LEGS.still, " ?")],
  embarrassed: [move(HEAD.shut, ARMS.down, LEGS.still, "///"), move(HEAD.shut, ARMS.down, LEGS.still, "///", true)],
  grateful: [move(HEAD.ahead, ARMS.up, LEGS.still, "♥"), move(HEAD.wink, ARMS.up, LEGS.still, " ♥")],
  laughing: [move(HEAD.ahead, ARMS.up, LEGS.still, "ha"), move(HEAD.ahead, ARMS.down, LEGS.still, " ha", true)],
  proud: [move(HEAD.ahead, ARMS.up, LEGS.wide, "★"), move(HEAD.ahead, ARMS.up, LEGS.still, " ★")],
  reassuring: [move(HEAD.ahead, ARMS.up, LEGS.still, "~"), move(HEAD.wink, ARMS.up, LEGS.still, " ~")],
  sleepy: [move(HEAD.ahead, ARMS.up, LEGS.wide, "o"), move(HEAD.shut, ARMS.up, LEGS.still, "O")],
  startled: [move(HEAD.ahead, ARMS.up, LEGS.still, "!"), move(HEAD.ahead, ARMS.up, LEGS.still, "!!")],
  sympathetic: [move(HEAD.shut, ARMS.down, LEGS.still, "…"), move(HEAD.ahead, ARMS.down, LEGS.still, " …")],
  waving: [move(HEAD.ahead, ARMS.right, LEGS.still, "~"), move(HEAD.ahead, ARMS.down, LEGS.still, " ~")],
};

export function moodMove(kind: MoodKind, beat: number): Move {
  const [first, second] = MOOD_MOVES[kind];
  return beat % 2 === 1 ? second : first;
}

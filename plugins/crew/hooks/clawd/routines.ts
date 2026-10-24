import { ARMS, HEAD, LEGS } from "./parts";

export interface Move {
  head: string;
  arms: string;
  legs: string;
  float: string;
  sway?: boolean;
}

// The main loop's own: typing, one hand then the other, with Claude's spark
// blinking beside it and a glance aside now and then.
export const MAIN_ROUTINE: readonly Move[] = [
  { head: HEAD.ahead, arms: ARMS.left, legs: LEGS.still, float: "✻" },
  { head: HEAD.ahead, arms: ARMS.right, legs: LEGS.still, float: "" },
  { head: HEAD.ahead, arms: ARMS.left, legs: LEGS.still, float: "✻" },
  { head: HEAD.right, arms: ARMS.right, legs: LEGS.still, float: "" },
];

/**
 * The loops a working subagent plays whatever the tool: waving, dancing,
 * looking around, cheering, thinking, marching.
 */
export const ROUTINES: readonly (readonly Move[])[] = [
  [
    { head: HEAD.ahead, arms: ARMS.down, legs: LEGS.still, float: "" },
    { head: HEAD.ahead, arms: ARMS.right, legs: LEGS.still, float: "" },
    { head: HEAD.wink, arms: ARMS.right, legs: LEGS.still, float: "" },
    { head: HEAD.ahead, arms: ARMS.right, legs: LEGS.still, float: "" },
  ],
  [
    { head: HEAD.ahead, arms: ARMS.left, legs: LEGS.step, float: "♪" },
    { head: HEAD.ahead, arms: ARMS.right, legs: LEGS.still, float: "", sway: true },
    { head: HEAD.ahead, arms: ARMS.left, legs: LEGS.step, float: "♫", sway: true },
    { head: HEAD.ahead, arms: ARMS.right, legs: LEGS.still, float: "" },
  ],
  [
    { head: HEAD.left, arms: ARMS.down, legs: LEGS.still, float: "" },
    { head: HEAD.ahead, arms: ARMS.down, legs: LEGS.still, float: "?" },
    { head: HEAD.right, arms: ARMS.down, legs: LEGS.still, float: "" },
    { head: HEAD.ahead, arms: ARMS.down, legs: LEGS.still, float: "?" },
  ],
  [
    { head: HEAD.ahead, arms: ARMS.up, legs: LEGS.wide, float: "✦" },
    { head: HEAD.ahead, arms: ARMS.down, legs: LEGS.still, float: "" },
    { head: HEAD.ahead, arms: ARMS.up, legs: LEGS.wide, float: "✧" },
    { head: HEAD.ahead, arms: ARMS.down, legs: LEGS.still, float: "" },
  ],
  [
    { head: HEAD.right, arms: ARMS.down, legs: LEGS.still, float: "·" },
    { head: HEAD.right, arms: ARMS.right, legs: LEGS.still, float: "··" },
    { head: HEAD.right, arms: ARMS.right, legs: LEGS.still, float: "···" },
    { head: HEAD.ahead, arms: ARMS.down, legs: LEGS.still, float: "" },
  ],
  [
    { head: HEAD.ahead, arms: ARMS.left, legs: LEGS.step, float: "" },
    { head: HEAD.ahead, arms: ARMS.right, legs: LEGS.still, float: "", sway: true },
    { head: HEAD.ahead, arms: ARMS.left, legs: LEGS.step, float: "", sway: true },
    { head: HEAD.ahead, arms: ARMS.right, legs: LEGS.still, float: "" },
  ],
];

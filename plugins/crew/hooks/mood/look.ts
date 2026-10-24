import type { MoodKind } from "../../types";

// How long Main shows a mood before going back to its routine.
export const MOOD_MS = 6000;

export interface MoodLook {
  color: string;
  line: string;
  glyph: string;
}

export const MOOD_LOOKS: Readonly<Record<MoodKind, MoodLook>> = {
  celebrating: { color: "#A6E3A1", line: "We did it!", glyph: "✦" },
  confused: { color: "#B4BEFE", line: "Let me explain better", glyph: "?" },
  embarrassed: { color: "#F5C2E7", line: "Sorry about that…", glyph: "///" },
  grateful: { color: "#F5A97F", line: "Glad that helped", glyph: "♥" },
  laughing: { color: "#F2CDCD", line: "Ha!", glyph: "ha" },
  proud: { color: "#E5C890", line: "Thank you!", glyph: "★" },
  reassuring: { color: "#94E2D5", line: "No worries", glyph: "~" },
  sleepy: { color: "#6C7086", line: "See you!", glyph: "z" },
  startled: { color: "#F9E2AF", line: "Stopping…", glyph: "!" },
  sympathetic: { color: "#74C7EC", line: "Take a break", glyph: "…" },
  waving: { color: "#89DCEB", line: "Hi there!", glyph: "~" },
};

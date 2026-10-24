import type { Notice } from "../../types";

// Pastel tints, blended toward the Carbonfox background (#161616) like the other
// mods' colours: blue ice for a cache gone cold, red fire for warming stopped.
export const LOOKS: Readonly<Record<Notice["kind"], { glyph: string; color: string }>> = {
  cold: { glyph: "\u{f2dc}", color: "#89B4FA" },
  stopped: { glyph: "\u{f06d}", color: "#F38BA8" },
};

// The band's border and padding, so the line starts where the band's text does.
export const INDENT = 2;

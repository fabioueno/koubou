function hex(red: number, green: number, blue: number): string {
  return `#${[red, green, blue].map((value) => Math.round(value).toString(16).padStart(2, "0")).join("")}`;
}

/**
 * The gauge colour for a percent: green through yellow to red, along the
 * Catppuccin Mocha anchors the old status line used.
 */
export function gradient(percent: number): string {
  const clamped = Math.max(0, Math.min(100, percent));
  if (clamped < 50) {
    return hex(166 + (83 * clamped) / 50, 227 - clamped / 50, 161 + (14 * clamped) / 50);
  }

  const past = clamped - 50;

  return hex(249 - (6 * past) / 50, 226 - (87 * past) / 50, 175 - (7 * past) / 50);
}

export type Align = "left" | "center" | "right";

/**
 * Cuts or pads text to exactly `width` cells.
 */
export function fit(text: string, width: number, align: Align = "left"): string {
  const flat = text.replace(/\t/g, "  ");

  if (width <= 0) {
    return "";
  }
  if (flat.length > width) {
    return `${flat.slice(0, Math.max(0, width - 1))}…`;
  }

  const room = width - flat.length;

  if (align === "right") {
    return " ".repeat(room) + flat;
  }
  if (align === "center") {
    const left = Math.floor(room / 2);
    return " ".repeat(left) + flat + " ".repeat(room - left);
  }

  return flat + " ".repeat(room);
}

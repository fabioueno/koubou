// Clawd as the welcome screen draws him, nine columns wide, in parts that
// combine into poses.
export const ARMS = {
  down: "▝▜█████▛▘",
  left: "▗▟█████▛▘",
  right: "▝▜█████▙▖",
  up: "▗▟█████▙▖",
} as const;

export const BLANK = "         ";

export const LID = "─";

export const HATS = ["  ▗▄▄▄▖  ", "   ▗▅▖   ", " ▄▄███▄  ", "   ╻ ╻   ", "  ▁▃▅▃▁  "] as const;

export const HEAD = {
  ahead: " ▐▛███▜▌ ",
  left: " ▐▛█▜██▌ ",
  right: " ▐██▛█▜▌ ",
  shut: " ▐─███─▌ ",
  wink: " ▐▛███─▌ ",
} as const;

export const HUES = ["#F5C2E7", "#CBA6F7", "#B4BEFE", "#89B4FA", "#74C7EC", "#94E2D5"] as const;

export const LEGS = { step: "  ▝▘ ▘▝  ", still: "  ▘▘ ▝▝  ", wide: " ▘▘   ▝▝ " } as const;

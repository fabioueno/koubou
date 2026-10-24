/**
 * The two largest units that apply: `1h 02m`, `7m 03s`, `12s`.
 */
export function duration(milliseconds: number): string {
  const seconds = Math.max(0, Math.floor(milliseconds / 1000));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${String(minutes).padStart(2, "0")}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${String(seconds % 60).padStart(2, "0")}s`;
  }

  return `${seconds}s`;
}

/**
 * The countdown to an ISO reset time, or nothing once it has passed.
 */
export function untilReset(resetsAt: string | undefined, now: number): string | undefined {
  if (resetsAt === undefined) {
    return undefined;
  }

  const seconds = Math.floor((Date.parse(resetsAt) - now) / 1000);

  if (!(seconds > 0)) {
    return undefined;
  }
  if (seconds >= 86_400) {
    return `${Math.floor(seconds / 86_400)}d ${Math.floor((seconds % 86_400) / 3600)}h`;
  }
  if (seconds >= 3600) {
    return duration(seconds * 1000);
  }

  return seconds >= 60 ? `${Math.floor(seconds / 60)}m` : "<1m";
}

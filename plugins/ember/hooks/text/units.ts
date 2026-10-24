export function compact(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`;
  }

  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }

  return String(count);
}

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
 * How long ago, for a message: whole days past the first, else `duration`.
 */
export function since(milliseconds: number): string {
  const days = Math.floor(milliseconds / 86_400_000);
  if (days >= 2) {
    return `${days} days`;
  }

  return duration(milliseconds);
}

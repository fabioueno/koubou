import type { SessionRateLimit } from "claude-code";

import type { Gauge } from "../../types";

export function gaugeOf(limits: readonly SessionRateLimit[], kind: string): Gauge | undefined {
  const limit = limits.find((each) => each.kind === kind);
  return limit ? { percent: limit.percentUsed, resetsAt: limit.resetsAt } : undefined;
}

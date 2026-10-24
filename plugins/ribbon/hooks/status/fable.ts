type Loose = Readonly<Record<string, unknown>>;

function scopedFable(usage: Loose): Loose | undefined {
  const limits = Array.isArray(usage.limits) ? (usage.limits as Loose[]) : [];

  return limits.find((limit) => {
    const model = (limit.scope as Loose | undefined)?.model as Loose | undefined;

    return (
      limit.kind === "weekly_scoped" &&
      String(model?.display_name ?? "")
        .toLowerCase()
        .includes("fable")
    );
  });
}

function pickOf(usage: Loose): { percent: number; reset: unknown } | undefined {
  const scoped = scopedFable(usage);
  if (scoped) {
    return { percent: Number(scoped.percent ?? 0), reset: scoped.resets_at };
  }

  const flat = (usage.seven_day_overage_included ?? usage.seven_day_fable) as Loose | undefined;

  return flat ? { percent: Number(flat.utilization ?? 0), reset: flat.resets_at } : undefined;
}

/**
 * The Fable weekly percent from the usage endpoint's cache: its scoped limit
 * first, else the flat bucket under either of its names. A zero percent with no
 * reset is a window the account does not have.
 */
export function fablePercent(raw: string): number | undefined {
  const pick = pickOf(JSON.parse(raw) as Loose);
  if (!pick || (pick.percent === 0 && (pick.reset === null || pick.reset === undefined))) {
    return undefined;
  }

  return Math.trunc(pick.percent);
}

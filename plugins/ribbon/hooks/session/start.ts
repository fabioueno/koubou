import type { EngineInterface, On, PluginOptions } from "claude-code";
import { atom, update } from "claude-code";

import type { Status } from "../../types";
import { gitStateOf } from "../git/state";
import { fablePercent } from "../status/fable";
import { gaugeOf } from "../status/limits";
import { basename, homeOf } from "../text/paths";

// Declared in each file that reads them: the mod validator follows an atom only
// within its own file.
const status = atom({ plugin: "ribbon", key: "status" } as const, null);

const USAGE_REFRESH_MS = 180_000;

// The status line script refreshed the Fable usage cache as a side effect; with
// the status line gone, a timer runs it for the same cache. The script touches
// the stamp on every fetch attempt, failed ones too.
interface Usage {
  cache: string;
  stamp: string;
  script: string;
}

async function usageOf($: EngineInterface, options: PluginOptions): Promise<Usage | undefined> {
  if (options.showRateLimits === false) {
    return undefined;
  }

  const dir = (await $.env.get("CLAUDE_CONFIG_DIR")) ?? `${await homeOf($)}/.claude`;

  return {
    cache: `${dir}/cache/statusline-usage.json`,
    stamp: `${dir}/cache/statusline-usage.refresh`,
    script: `${dir}/statusline.sh`,
  };
}

async function placeOf($: EngineInterface, cwd: string): Promise<Pick<Status, "project" | "branch" | "worktree">> {
  const [root, { repository, ...git }] = await Promise.all([
    $.session.root().catch(() => cwd),
    gitStateOf($, cwd),
  ]);

  return { project: repository ?? basename(root), ...git };
}

async function refreshStatus($: EngineInterface, usageFiles: Usage | undefined): Promise<void> {
  const [usage, cwd, now] = await Promise.all([$.session.usage(), $.session.cwd(), $.clock.now()]);
  const fable = usageFiles && (await $.fs.read(usageFiles.cache).then(fablePercent, () => undefined));

  const next: Status = {
    now,
    startedAt: usage.startedAt,
    costUsd: usage.cost?.usd ?? 0,
    fiveHour: gaugeOf(usage.rateLimits, "five_hour"),
    sevenDay: gaugeOf(usage.rateLimits, "seven_day"),
    fable,
    ...(await placeOf($, cwd)),
  };

  await update($, status, () => next);
}

function startTimers($: EngineInterface, usageFiles: Usage | undefined): void {
  $.clock.every(15_000, () => {
    refreshStatus($, usageFiles).catch(() => undefined);
  });

  if (usageFiles !== undefined) {
    $.clock.every(USAGE_REFRESH_MS, () => {
      refreshUsage($, usageFiles).catch(() => undefined);
    });
  }
}

// Every session runs this timer against one shared cache, so a session leaves
// the script alone while another one refreshed or tried within the interval.
async function refreshUsage($: EngineInterface, usageFiles: Usage): Promise<void> {
  const [now, cacheMs, stampMs] = await Promise.all([
    $.clock.now(),
    modifiedMs($, usageFiles.cache),
    modifiedMs($, usageFiles.stamp),
  ]);

  if (now - Math.max(cacheMs, stampMs) < USAGE_REFRESH_MS) {
    return;
  }

  await $.process.run(["bash", usageFiles.script], { stdin: "{}" });
}

function modifiedMs($: EngineInterface, path: string): Promise<number> {
  return $.fs.stat(path).then(
    (stat) => stat.mtimeMs,
    () => Number.NEGATIVE_INFINITY,
  );
}

export function onSessionStart(on: On, options: PluginOptions): void {
  on("session.start", async ($, e, next) => {
    const started = await next(e);
    const usageFiles = await usageOf($, options);

    await refreshStatus($, usageFiles).catch(() => undefined);
    startTimers($, usageFiles);

    return started;
  });
}

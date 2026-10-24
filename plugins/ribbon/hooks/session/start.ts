import type { EngineInterface, On, PluginOptions } from "claude-code";
import { atom, update } from "claude-code";

import type { Status } from "../../types";
import { fablePercent } from "../status/fable";
import { gaugeOf } from "../status/limits";
import { basename, homeOf } from "../text/paths";

// Declared in each file that reads them: the mod validator follows an atom only
// within its own file.
const status = atom({ plugin: "ribbon", key: "status" } as const, null);

// The status line script refreshed the Fable usage cache as a side effect; with
// the status line gone, a timer runs it for the same cache.
interface Usage {
  cache: string;
  script: string;
}

async function usageOf($: EngineInterface, options: PluginOptions): Promise<Usage | undefined> {
  if (options.showRateLimits === false) {
    return undefined;
  }

  const dir = (await $.env.get("CLAUDE_CONFIG_DIR")) ?? `${await homeOf($)}/.claude`;

  return { cache: `${dir}/cache/statusline-usage.json`, script: `${dir}/statusline.sh` };
}

async function placeOf($: EngineInterface, cwd: string): Promise<Pick<Status, "project" | "branch" | "worktree">> {
  const git = async (...args: string[]): Promise<string | undefined> => {
    const ran = await $.process.run(["git", "-C", cwd, ...args]).catch(() => undefined);
    return ran?.exitCode === 0 ? ran.stdout.trim() : undefined;
  };

  const [branch, gitDir, commonDir, top] = await Promise.all([
    git("branch", "--show-current"),
    git("rev-parse", "--absolute-git-dir"),
    git("rev-parse", "--path-format=absolute", "--git-common-dir"),
    git("rev-parse", "--show-toplevel"),
  ]);

  const isWorktree = gitDir !== undefined && commonDir !== undefined && gitDir !== commonDir && top !== undefined;

  return {
    project: basename(await $.session.root().catch(() => cwd)),
    branch: branch === undefined ? undefined : branch || "detached",
    worktree: isWorktree ? basename(top) : undefined,
  };
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
    $.clock.every(180_000, () => {
      $.process.run(["bash", usageFiles.script], { stdin: "{}" }).catch(() => undefined);
    });
  }
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

import type { AgentRun } from "../../types";

type Runs = Readonly<Record<string, AgentRun>>;

function withRun(all: Runs, id: string, change: (run: AgentRun) => AgentRun): Runs {
  const run = all[id];
  return run === undefined ? all : { ...all, [id]: change(run) };
}

// The main loop's row; subagents are keyed by their agent id.
export const MAIN = "main";

/**
 * The subagents in the order they started; this order picks each one's look.
 */
export function byStart(all: Runs): [string, AgentRun][] {
  return Object.entries(all)
    .filter(([id]) => id !== MAIN)
    .sort(([, left], [, right]) => left.startedAt - right.startedAt);
}

/**
 * The subagents as the panel lists them: working ones first, newest at the
 * top, then finished ones, the most recently finished first.
 */
export function byActivity(all: Runs): [string, AgentRun][] {
  const activeAt = (run: AgentRun): number => run.endedAt ?? Number.POSITIVE_INFINITY;

  return byStart(all).sort(
    ([, left], [, right]) => activeAt(right) - activeAt(left) || right.startedAt - left.startedAt,
  );
}

export function clearTool(all: Runs, id: string, lastTool: string): Runs {
  return withRun(all, id, (run) => (run.lastTool === lastTool ? { ...run, lastTool: undefined } : run));
}

export function endRun(all: Runs, id: string, end: { at: number; isFailed: boolean }): Runs {
  return withRun(all, id, (run) => ({ ...run, endedAt: end.at, isFailed: end.isFailed }));
}

/**
 * True while the loop waits on its own AskUserQuestion, which runs until the
 * person answers.
 */
export function isAsking(run: AgentRun | undefined): boolean {
  return isLive(run) && run?.lastTool?.startsWith("AskUserQuestion") === true;
}

export function isLive(run: AgentRun | undefined): boolean {
  return run !== undefined && run.endedAt === undefined;
}

export function noteTool(all: Runs, id: string, lastTool: string): Runs {
  return withRun(all, id, (run) => ({ ...run, lastTool }));
}

/**
 * A step from a finished subagent means it was sent more work: it is working
 * again, its clock from now.
 */
export function reviveRun(all: Runs, id: string, step: { model: string; at: number }): Runs {
  return withRun(all, id, (run) => {
    const revived =
      run.endedAt === undefined ? run : { ...run, endedAt: undefined, startedAt: step.at, isFailed: false };

    return { ...revived, model: run.model ?? step.model };
  });
}

export function spawnRun(
  all: Runs,
  id: string,
  spawn: { type: string; model: string; description: string; at: number },
): Runs {
  const run: AgentRun = {
    type: spawn.type,
    model: spawn.model,
    description: spawn.description,
    startedAt: spawn.at,
    isFailed: false,
    steps: 0,
    context: 0,
    output: 0,
  };

  return { ...all, [id]: run };
}

/**
 * A step after the main loop went idle starts its next turn, keeping the
 * counts.
 */
export function startMainTurn(all: Runs, at: number): Runs {
  const main = all[MAIN];
  if (isLive(main)) {
    return all;
  }

  return {
    ...all,
    [MAIN]: {
      type: "main",
      description: "",
      startedAt: at,
      isFailed: false,
      steps: main?.steps ?? 0,
      context: main?.context ?? 0,
      output: main?.output ?? 0,
    },
  };
}

export function stepRun(
  all: Runs,
  id: string,
  usage: { input: number; cacheRead: number; cacheWrite: number; output: number },
): Runs {
  return withRun(all, id, (run) => ({
    ...run,
    steps: run.steps + 1,
    context: usage.input + usage.cacheRead + usage.cacheWrite,
    output: run.output + usage.output,
  }));
}

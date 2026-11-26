import type { On } from "claude-code";
import type { Engine } from "claude-code/testing";
import { describe, expect, test as it, mock } from "claude-code/testing";

const CACHE = "/c/cache/statusline-usage.json";
const STAMP = "/c/cache/statusline-usage.refresh";
const SCRIPT = "/c/statusline.sh";

// Ages in milliseconds at the moment the 180 s timer first fires.
function startWithFiles(on: On, ages: Readonly<Record<string, number>>): string[][] {
  const ran: string[][] = [];
  const firesAt = 180_000;

  mock.env(on, { CLAUDE_CONFIG_DIR: "/c", HOME: "/home/robin" });

  on("session.start", () => ({ cwd: "/r/notes", startedAt: 0 }) as never);
  on("session.usage", () => ({ value: { startedAt: 0, context: {}, rateLimits: [] } as never }));
  on("session.cwd", () => ({ value: "/r/notes" }));
  on("session.root", () => ({ value: "/r/notes" }));

  on("fs.read", (_$, e) => ({ deny: `no such file: ${e.path}` }));
  on("fs.stat", (_$, e) => {
    const age = ages[e.path];
    return age === undefined
      ? { deny: `no such file: ${e.path}` }
      : { value: { kind: "file", size: 0, mtimeMs: firesAt - age, isLink: false } };
  });

  on("process.run", (_$, e) => {
    ran.push([...e.argv]);
    return { value: { exitCode: 0, stdout: "", stderr: "", isStdoutTruncated: false, isStderrTruncated: false } };
  });

  return ran;
}

async function runUntilUsageTimer($: Engine, on: On): Promise<void> {
  const clock = mock.clock(on, { now: 0 });

  await $.session.start({ cwd: "/r/notes", surface: "terminal", isInteractive: true });
  await clock.advance(180_000);
}

describe("onSessionStart", () => {
  it("skips the usage script while the cache is fresh", async ($, on) => {
    const ran = startWithFiles(on, { [CACHE]: 60_000 });

    await runUntilUsageTimer($, on);

    expect(ran).toEqual([]);
  });

  it("skips the usage script while another session's attempt is recent", async ($, on) => {
    const ran = startWithFiles(on, { [CACHE]: 900_000, [STAMP]: 20_000 });

    await runUntilUsageTimer($, on);

    expect(ran).toEqual([]);
  });

  it("runs the usage script once the cache and the last attempt are stale", async ($, on) => {
    const ran = startWithFiles(on, { [CACHE]: 900_000, [STAMP]: 400_000 });

    await runUntilUsageTimer($, on);

    expect(ran).toEqual([["bash", SCRIPT]]);
  });

  it("never runs git for the band", async ($, on) => {
    const ran = startWithFiles(on, {});

    await runUntilUsageTimer($, on);

    expect(ran.filter((argv) => argv[0] === "git")).toEqual([]);
  });
});

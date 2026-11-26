import type { On } from "claude-code";
import type { Engine } from "claude-code/testing";
import { describe, expect, test as it, mock } from "claude-code/testing";

import { GLYPHS } from "../palette/glyphs";

const MOUNT = {
  plugin: "ribbon",
  surface: "terminal",
  component: "AbovePrompt",
  viewport: { columns: 160, rows: 48 },
  props: {
    hasSurvey: false,
    isCollapsed: false,
    isWorking: false,
    maxRows: 6,
    bodyColumns: 120,
    scroll: { offset: 0, bodyRows: 6 },
    view: {},
  },
} as const;

const NO_LIMITS = { options: { showRateLimits: false } };

type Files = Readonly<Record<string, string>>;

// gitStateOf runs inside the plugin's session.start hook, so each test starts a
// session in a fake folder and reads what the band shows.
async function bandIn(
  $: Engine,
  on: On,
  cwd: string,
  files: Files,
  dirs: readonly string[] = [],
): Promise<string> {
  const kindOf = (path: string): "dir" | "file" | undefined => {
    if (dirs.includes(path)) {
      return "dir";
    }
    return path in files ? "file" : undefined;
  };

  mock.clock(on, { now: 0 });

  on("session.start", () => ({ cwd, startedAt: 0 }) as never);
  on("session.usage", () => ({ value: { startedAt: 0, context: {}, rateLimits: [] } as never }));
  on("session.cwd", () => ({ value: cwd }));
  on("session.root", () => ({ value: cwd }));

  on("fs.stat", (_$, e) => {
    const kind = kindOf(e.path);

    return kind === undefined
      ? { deny: `no such file: ${e.path}` }
      : { value: { kind, size: 0, mtimeMs: 0, isLink: false } };
  });

  on("fs.read", (_$, e) => {
    const text = files[e.path];
    return text === undefined ? { deny: `no such file: ${e.path}` } : { value: text };
  });

  await $.session.start({ cwd, surface: "terminal", isInteractive: true });
  const texts = await (await $.ui.mount(MOUNT)).findAll({ type: "Text" });

  return texts.map((node) => node.text).join(" | ");
}

describe("gitStateOf", () => {
  it("reads the branch from HEAD in the nearest repository", NO_LIMITS, async ($, on) => {
    const shown = await bandIn($, on, "/r/app/src", { "/r/app/.git/HEAD": "ref: refs/heads/main\n" }, ["/r/app/.git"]);

    expect(shown).toContain(`${GLYPHS.branch} main`);
    expect(shown).not.toContain(GLYPHS.worktree);
  });

  it("names a detached HEAD", NO_LIMITS, async ($, on) => {
    const head = { "/r/app/.git/HEAD": "4f2c9e1b8a7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b\n" };
    const shown = await bandIn($, on, "/r/app", head, ["/r/app/.git"]);

    expect(shown).toContain(`${GLYPHS.branch} detached`);
  });

  it("names the worktree that a .git file points to", NO_LIMITS, async ($, on) => {
    const shown = await bandIn($, on, "/r/app/.claude/worktrees/tidy", {
      "/r/app/.claude/worktrees/tidy/.git": "gitdir: /r/app/.git/worktrees/tidy\n",
      "/r/app/.git/worktrees/tidy/HEAD": "ref: refs/heads/fix/tidy-up\n",
      "/r/app/.git/worktrees/tidy/commondir": "../..\n",
    });

    expect(shown).toContain(`${GLYPHS.branch} fix/tidy-up`);
    expect(shown).toContain(`${GLYPHS.worktree} tidy`);
  });

  it("names the main repository as the project inside a worktree", NO_LIMITS, async ($, on) => {
    const shown = await bandIn($, on, "/r/app/.claude/worktrees/tidy", {
      "/r/app/.claude/worktrees/tidy/.git": "gitdir: /r/app/.git/worktrees/tidy\n",
      "/r/app/.git/worktrees/tidy/HEAD": "ref: refs/heads/fix/tidy-up\n",
      "/r/app/.git/worktrees/tidy/commondir": "../..\n",
    });

    expect(shown).toContain(`${GLYPHS.project} app`);
    expect(shown).not.toContain(`${GLYPHS.project} tidy`);
  });

  it("names a bare repository as the project of its worktrees", NO_LIMITS, async ($, on) => {
    const shown = await bandIn($, on, "/r/trees/tidy", {
      "/r/trees/tidy/.git": "gitdir: /r/app.git/worktrees/tidy\n",
      "/r/app.git/worktrees/tidy/HEAD": "ref: refs/heads/main\n",
      "/r/app.git/worktrees/tidy/commondir": "../..\n",
    });

    expect(shown).toContain(`${GLYPHS.project} app`);
  });

  it("does not take a submodule for a worktree", NO_LIMITS, async ($, on) => {
    const shown = await bandIn($, on, "/r/app/lib", {
      "/r/app/lib/.git": "gitdir: ../.git/modules/lib\n",
      "/r/app/.git/modules/lib/HEAD": "ref: refs/heads/main\n",
    });

    expect(shown).toContain(`${GLYPHS.branch} main`);
    expect(shown).not.toContain(GLYPHS.worktree);
  });

  it("shows no branch outside a repository", NO_LIMITS, async ($, on) => {
    const shown = await bandIn($, on, "/r/notes", {});

    expect(shown).not.toContain(GLYPHS.branch);
  });

  it("shows no branch when HEAD cannot be read", NO_LIMITS, async ($, on) => {
    const shown = await bandIn($, on, "/r/app", {}, ["/r/app/.git"]);

    expect(shown).not.toContain(GLYPHS.branch);
  });
});

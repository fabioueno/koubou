import type { EngineInterface } from "claude-code";

import { basename, dirname, pathAndParentsOf, resolvePath } from "../text/paths";

interface GitEntry {
  top: string;
  path: string;
  kind: "dir" | "file";
}

async function nearestGitEntry($: EngineInterface, cwd: string): Promise<GitEntry | undefined> {
  for (const top of pathAndParentsOf(cwd)) {
    const path = top === "/" ? "/.git" : `${top}/.git`;
    const stat = await $.fs.stat(path).catch(() => undefined);

    if (stat?.kind === "dir" || stat?.kind === "file") {
      return { top, path, kind: stat.kind };
    }
  }

  return undefined;
}

// A worktree or a submodule has a .git file whose gitdir line names the folder
// git keeps for it.
async function gitDirOf($: EngineInterface, entry: GitEntry): Promise<string | undefined> {
  if (entry.kind === "dir") {
    return entry.path;
  }

  const link = /^gitdir:\s*(.+)$/m.exec((await readText($, entry.path)) ?? "")?.[1];
  return link === undefined ? undefined : resolvePath(dirname(entry.path), link.trim());
}

function branchOf(head: string): string {
  return /^ref: refs\/heads\/(.+)$/m.exec(head)?.[1]?.trim() ?? "detached";
}

async function readText($: EngineInterface, path: string): Promise<string | undefined> {
  const text = await $.fs.read(path).catch(() => undefined);
  return typeof text === "string" ? text : undefined;
}

export interface GitState {
  branch?: string;
  worktree?: string;
}

// Reads the files git keeps instead of running git: the band refreshes every
// 15 s in every session, and each process launch is the expensive part.
export async function gitStateOf($: EngineInterface, cwd: string): Promise<GitState> {
  const entry = await nearestGitEntry($, cwd);
  const gitDir = entry && (await gitDirOf($, entry));
  const head = gitDir && (await readText($, `${gitDir}/HEAD`));

  if (entry === undefined || gitDir === undefined || head === undefined) {
    return {};
  }

  const commonDir = await readText($, `${gitDir}/commondir`);
  const isWorktree = commonDir !== undefined && resolvePath(gitDir, commonDir.trim()) !== gitDir;

  return { branch: branchOf(head), worktree: isWorktree ? basename(entry.top) : undefined };
}

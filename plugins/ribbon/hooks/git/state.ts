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

// A worktree's common folder is the main checkout's .git, or a bare
// repository such as app.git.
function repositoryOf(commonPath: string): string {
  const name = basename(commonPath);
  return name === ".git" ? basename(dirname(commonPath)) : name.replace(/\.git$/, "");
}

export interface GitState {
  branch?: string;
  worktree?: string;
  repository?: string;
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
  const commonPath = commonDir === undefined ? gitDir : resolvePath(gitDir, commonDir.trim());

  if (commonPath === gitDir) {
    return { branch: branchOf(head), worktree: undefined };
  }

  return { branch: branchOf(head), worktree: basename(entry.top), repository: repositoryOf(commonPath) };
}

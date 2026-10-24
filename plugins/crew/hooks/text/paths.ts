import type { EngineInterface } from "claude-code";

export async function homeOf($: EngineInterface): Promise<string> {
  return (await $.env.get("HOME")) ?? "";
}

/**
 * A path as the person reads it: inside the session's folder, or from home.
 */
export function relative(path: string, cwd: string, home: string): string {
  if (path.startsWith(`${cwd}/`)) {
    return path.slice(cwd.length + 1);
  }
  if (home !== "" && path.startsWith(`${home}/`)) {
    return `~/${path.slice(home.length + 1)}`;
  }

  return path;
}

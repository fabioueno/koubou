import type { EngineInterface } from "claude-code";

export async function homeOf($: EngineInterface): Promise<string> {
  return (await $.env.get("HOME")) ?? "";
}

export function basename(path: string): string {
  return path.split("/").filter(Boolean).at(-1) ?? path;
}

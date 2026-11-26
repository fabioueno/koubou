import type { EngineInterface } from "claude-code";

export async function homeOf($: EngineInterface): Promise<string> {
  return (await $.env.get("HOME")) ?? "";
}

export function basename(path: string): string {
  return path.split("/").filter(Boolean).at(-1) ?? path;
}

export function dirname(path: string): string {
  return `/${path.split("/").filter(Boolean).slice(0, -1).join("/")}`;
}

export function pathAndParentsOf(path: string): string[] {
  const parts = path.split("/").filter(Boolean);
  return parts.map((_, index) => `/${parts.slice(0, parts.length - index).join("/")}`).concat("/");
}

export function resolvePath(base: string, path: string): string {
  const parts = path.startsWith("/") ? [] : base.split("/").filter(Boolean);

  for (const part of path.split("/")) {
    if (part === "..") {
      parts.pop();
    } else if (part !== "" && part !== ".") {
      parts.push(part);
    }
  }

  return `/${parts.join("/")}`;
}

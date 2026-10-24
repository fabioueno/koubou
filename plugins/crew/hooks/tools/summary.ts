import { relative } from "../text/paths";

const SUMMARY_KEYS = ["pattern", "url", "query", "description", "skill", "prompt"] as const;

const firstLine = (text: string): string => text.split("\n")[0] ?? "";

/**
 * What a tool row says about its call: a path, a command, a pattern, else its
 * first text input.
 */
export function toolSummary(tool: string, input: Readonly<Record<string, unknown>>, cwd: string, home: string): string {
  const path = input.file_path ?? input.notebook_path;

  if (typeof path === "string") {
    return relative(path, cwd, home);
  }
  if (tool === "Bash" && typeof input.command === "string") {
    return firstLine(input.command);
  }

  const named = SUMMARY_KEYS.map((key) => input[key]).find((value) => typeof value === "string");
  const text = named ?? Object.values(input).find((value) => typeof value === "string");

  return typeof text === "string" ? firstLine(text) : "";
}

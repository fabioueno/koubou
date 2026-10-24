import { describe, expect, test as it } from "claude-code/testing";

import { relative } from "./paths";

const HOME = "/Users/robin";
const ATLAS = `${HOME}/Projects/atlas`;

describe("relative", () => {
  it("shows a path inside the session's folder, from home, or as given", () => {
    const paths = [
      relative(`${ATLAS}/apps/api/src/index.ts`, ATLAS, HOME),
      relative(`${HOME}/.claude/CLAUDE.md`, ATLAS, HOME),
      relative("/etc/hosts", ATLAS, HOME),
      relative("/etc/hosts", ATLAS, ""),
    ];

    expect(paths).toEqual(["apps/api/src/index.ts", "~/.claude/CLAUDE.md", "/etc/hosts", "/etc/hosts"]);
  });
});

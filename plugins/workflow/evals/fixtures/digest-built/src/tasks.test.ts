import { describe, expect, it } from "vitest";
import { listDigest, type Task } from "./tasks";

const task = (id: string, dueOn: string | null, done = false): Task => ({
  id,
  title: `Task ${id}`,
  dueOn,
  done,
  householdId: "01JB8Z3K6Q2W4E5R7T9Y1U3I5O",
});

describe("listDigest", () => {
  it("lists overdue tasks, oldest first", () => {
    const digest = listDigest([task("b", "2026-10-20"), task("a", "2026-10-18")], "2026-10-25");

    expect(digest.overdue.map((t) => t.id)).toEqual(["a", "b"]);
  });

  it("lists tasks due tomorrow", () => {
    const digest = listDigest([task("a", "2026-10-26"), task("b", "2026-10-27")], "2026-10-25");

    expect(digest.dueTomorrow.map((t) => t.id)).toEqual(["a"]);
  });

  it("leaves out tasks due today, done tasks and undated tasks", () => {
    const digest = listDigest(
      [task("a", "2026-10-25"), task("b", "2026-10-20", true), task("c", null)],
      "2026-10-25",
    );

    expect(digest).toEqual({ overdue: [], dueTomorrow: [] });
  });

  it("finds tomorrow across the end of a month and a year", () => {
    expect(listDigest([task("a", "2026-11-01")], "2026-10-31").dueTomorrow).toHaveLength(1);
    expect(listDigest([task("b", "2027-01-01")], "2026-12-31").dueTomorrow).toHaveLength(1);
  });
});

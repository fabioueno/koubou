import { describe, expect, test as it } from "claude-code/testing";

const typed = (command: string) =>
  ({ command, args: "", origin: { kind: "composer" }, presentation: { isFullscreen: true, columns: 160 } }) as const;

describe("onCommandRun", () => {
  it("toggles the agents panel with /crew", async ($, on) => {
    const panes: string[] = [];

    on("ui.panes", () => ({ value: panes.map((id) => ({ id })) as never }));
    on("ui.open", (_, e) => {
      panes.push(e.id);
      return { value: { isPlaced: true } };
    });
    on("ui.close", (_, e) => {
      panes.splice(panes.indexOf(e.id), 1);
      return { value: undefined };
    });

    const opened = await $.command.run(typed("crew"));

    expect(opened).toMatchObject({ text: "Crew panel opened." });
    expect(panes).toEqual(["crew-side"]);

    const closed = await $.command.run(typed("crew"));

    expect(closed).toMatchObject({ text: "Crew panel closed." });
  });
});

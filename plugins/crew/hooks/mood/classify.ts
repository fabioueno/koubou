import type { EngineInterface } from "claude-code";

import type { MoodKind } from "../../types";

// What each mood answers to, said the way the classifier reads a label.
const LABELS: Readonly<Record<MoodKind, string>> = {
  startled: "asks Claude to stop, wait or undo",
  embarrassed: "says Claude made a mistake",
  confused: "says they do not understand",
  reassuring: "says a problem is fine or not a big deal",
  grateful: "thanks Claude",
  proud: "praises Claude's work",
  celebrating: "celebrates that something works or shipped",
  laughing: "laughs or makes a joke",
  waving: "greets Claude",
  sleepy: "says goodbye or that they are done for now",
  sympathetic: "says they are tired, stressed or frustrated",
};

const NONE = "none of these: a plain request or question";

const KINDS = new Map(Object.entries(LABELS).map(([kind, label]) => [label, kind as MoodKind]));

/**
 * The mood a message calls for, as Haiku reads it, or none.
 */
export async function moodOf($: EngineInterface, text: string): Promise<MoodKind | undefined> {
  const label = await $.model.classify(text, [...KINDS.keys(), NONE], { model: "haiku" });
  return label === undefined ? undefined : KINDS.get(label);
}

declare module "claude-code" {
  interface PluginState {
    crew: {
      agents: Record<string, AgentRun>;
      effort: string | null;
      frame: number;
      main: MainLoop | null;
      mood: Mood | null;
      verb: string | null;
    };
  }
}

export interface AgentRun {
  type: string;
  model?: string;
  description: string;
  startedAt: number;
  endedAt?: number;
  isFailed: boolean;
  steps: number;
  context: number;
  output: number;
  lastTool?: string;
}

export interface MainLoop {
  model: string;
  contextWindow: number;
}

export interface Mood {
  kind: MoodKind;
  until: number;
}

export type MoodKind =
  | "startled"
  | "embarrassed"
  | "confused"
  | "reassuring"
  | "grateful"
  | "proud"
  | "celebrating"
  | "laughing"
  | "waving"
  | "sleepy"
  | "sympathetic";

declare module "claude-code" {
  interface PluginState {
    ribbon: {
      status: Status | null;
    };
  }
}

export interface Gauge {
  percent: number;
  resetsAt?: string;
}

export interface Status {
  now: number;
  startedAt: number;
  costUsd: number;
  fiveHour?: Gauge;
  sevenDay?: Gauge;
  fable?: number;
  project: string;
  branch?: string;
  worktree?: string;
}

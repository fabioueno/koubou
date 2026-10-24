declare module "claude-code" {
  interface PluginState {
    ember: {
      busy: boolean;
      warming: Warming;
      lastRequestAt: number;
      lastTurnAt: number;
      notice: Notice | null;
    };
  }
}

export interface Warming {
  isOn: boolean;
  pings: number;
  stopped: string | null;
}

// What the line above the prompt says: the cache found cold, or warming stopped.
export interface Notice {
  kind: "cold" | "stopped";
  text: string;
}

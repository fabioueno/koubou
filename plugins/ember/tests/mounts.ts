export const ABOVE = {
  plugin: "ember",
  surface: "terminal",
  component: "AbovePrompt",
  viewport: { columns: 160, rows: 48 },
  props: {
    hasSurvey: false,
    isWorking: false,
    maxRows: 4,
    bodyColumns: 120,
    scroll: { offset: 0, bodyRows: 4 },
    view: {},
  },
} as const;

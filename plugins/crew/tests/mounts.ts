export const PANE = {
  plugin: "crew",
  surface: "terminal",
  component: "Pane",
  requestId: "crew-side",
  viewport: { columns: 160, rows: 48 },
  props: {
    title: "Crew",
    isFocused: false,
    bodyColumns: 60,
    placement: "dock",
    scroll: { offset: 0, bodyRows: 40 },
    view: {},
  },
} as const;

export const VIEWPORT = { columns: 160, rows: 48 } as const;

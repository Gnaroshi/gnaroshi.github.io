export type IconPath = {
  d: string;
  fill?: "currentColor";
  stroke?: "none";
};

export type IconDefinition = {
  viewBox: "0 0 24 24";
  strokeWidth: 1.8;
  paths: IconPath[];
};

const line = (...paths: string[]): IconDefinition => ({
  viewBox: "0 0 24 24",
  strokeWidth: 1.8,
  paths: paths.map((d) => ({ d }))
});

export const iconDefinitions = {
  sun: line("M12 3.25v2M12 18.75v2M3.25 12h2M18.75 12h2M5.8 5.8l1.4 1.4M16.8 16.8l1.4 1.4M18.2 5.8l-1.4 1.4M7.2 16.8l-1.4 1.4", "M16.25 12A4.25 4.25 0 1 1 7.75 12a4.25 4.25 0 0 1 8.5 0Z"),
  moon: line("M20 15.2A8.25 8.25 0 0 1 8.8 4a8.25 8.25 0 1 0 11.2 11.2Z"),
  menu: line("M4 7h16M4 12h16M4 17h16"),
  close: line("m5.5 5.5 13 13M18.5 5.5l-13 13"),
  arrowRight: line("M4 12h15M14 7l5 5-5 5"),
  externalLink: line("M13 5h6v6M19 5l-8.5 8.5", "M18 13.5V19H5V6h5.5"),
  chevronDown: line("m6 9 6 6 6-6"),
  language: line("M4 5h9M8.5 3v2M6 8c1.4 3 3.7 5.2 6.5 6.5M12 8c-1.2 3.2-3.6 5.7-7 7", "m14 19 3.5-9 3.5 9M15.4 15.5h4.2"),
  github: line("M9 19c-4.5 1.4-4.5-2.5-6-3M15 21v-3.5c0-1 .1-1.5-.5-2 2.8-.3 5.7-1.4 5.7-6.2 0-1.4-.5-2.5-1.3-3.4.1-.4.6-1.8-.1-3.4 0 0-1.1-.4-3.7 1.3a12.9 12.9 0 0 0-6.2 0C6.3 2.1 5.2 2.5 5.2 2.5c-.7 1.6-.2 3-.1 3.4-.8.9-1.3 2-1.3 3.4 0 4.8 2.9 5.9 5.7 6.2-.5.4-.6 1-.5 2V21"),
  search: line("M10.75 18.5a7.75 7.75 0 1 1 0-15.5 7.75 7.75 0 0 1 0 15.5ZM16.5 16.5 21 21"),
  paper: line("M6 3h8l4 4v14H6V3Z", "M14 3v5h4M9 12h6M9 16h6"),
  writing: line("M4 19.5 5.2 15 16.6 3.6a1.9 1.9 0 0 1 2.8 2.8L8 17.8 4 19.5Z", "m14.5 5.7 3.8 3.8"),
  research: line("M9 3h6M10 3v5l-5.5 9.5A2.3 2.3 0 0 0 6.5 21h11a2.3 2.3 0 0 0 2-3.5L14 8V3", "M7.3 15h9.4"),
  project: line("M4 7h6l2-3h8v16H4V7Z", "M8 12h8M8 16h5"),
  growth: line("M4 19V9M10 19V5M16 19v-7M22 19V3"),
  review: line("M5 4h14v16H5V4Z", "m8 11 2.2 2.2L16 7.5M8 17h8"),
  formula: line("M18 4H8l5 8-5 8h10", "M15 9h4M15 15h4"),
  microphone: line("M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3Z", "M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M8.5 21h7"),
  code: line("m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"),
  clock: line("M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "M12 7v5l3 2"),
  calendar: line("M5 5h14v16H5V5ZM8 3v4M16 3v4M5 10h14"),
  check: line("m5 12 4.5 4.5L19 7"),
  copy: line("M9 8h10v12H9V8Z", "M15 8V4H5v12h4"),
  download: line("M12 3v12M7.5 11.5 12 16l4.5-4.5M4 21h16"),
  warning: line("M12 3 2.8 20h18.4L12 3Z", "M12 9v5M12 17.5h.01"),
  info: line("M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "M12 10v6M12 7h.01")
} as const satisfies Record<string, IconDefinition>;

export type IconName = keyof typeof iconDefinitions;

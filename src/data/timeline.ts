export type TimelineItem = {
  label: string;
  period: string;
  description: string;
};

export const education: TimelineItem[] = [];

export const researchTimeline: TimelineItem[] = [
  {
    label: "Current direction",
    period: "Now",
    description:
      "Building a personal research system around paper reading, implementation notes, and AI/software projects."
  },
  {
    label: "Public notebook",
    period: "In progress",
    description:
      "Turning daily reading and technical work into Markdown-first notes that can be searched, revisited, and linked."
  }
] as const;

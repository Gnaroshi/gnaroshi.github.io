export const managedApplications = [
  { id: "paperflow", group: "research-workflow" },
  { id: "arxiv-discovery", group: "research-workflow" },
  { id: "runshelf", group: "research-workflow" },
  { id: "tr-gpu-monitor", group: "system-utilities" },
  { id: "contentdeck", group: "learning-tools" }
] as const;

export type ManagedApplication = (typeof managedApplications)[number];

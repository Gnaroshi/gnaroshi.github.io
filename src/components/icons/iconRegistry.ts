import { iconDefinitions, type IconName } from "./icons.ts";

export type IconRegistryEntry = {
  name: IconName;
  component: (typeof iconDefinitions)[IconName];
  purpose: string;
  usedBy: string[];
  decorativeAllowed: boolean;
  accessibleLabelRequired: boolean;
};

const entry = (
  name: IconName,
  purpose: string,
  usedBy: string[],
  decorativeAllowed = true,
  accessibleLabelRequired = false
): IconRegistryEntry => ({ name, component: iconDefinitions[name], purpose, usedBy, decorativeAllowed, accessibleLabelRequired });

export const iconRegistry = [
  entry("sun", "Light theme state", ["Theme toggle"], false, true),
  entry("moon", "Dark theme state", ["Theme toggle"], false, true),
  entry("menu", "Open mobile navigation", ["Mobile navigation"], false, true),
  entry("close", "Close mobile navigation", ["Mobile navigation"], false, true),
  entry("arrowRight", "Forward primary action", ["Primary CTA"]),
  entry("externalLink", "External destination", ["ExternalLink"]),
  entry("chevronDown", "Expand a disclosure", ["Disclosure controls"]),
  entry("language", "Language selection", ["Language switcher"], false, true),
  entry("github", "GitHub destination", ["Profile and project links"]),
  entry("search", "Search records", ["Writing and Paper filters"], false, true),
  entry("paper", "Paper record", ["Paper Lab navigation and empty state"]),
  entry("writing", "Writing record", ["Writing empty state"]),
  entry("research", "Research context", ["Research links"]),
  entry("project", "Project evidence", ["Project links"]),
  entry("growth", "Eligible longitudinal metric", ["Growth metrics"]),
  entry("review", "Review evidence", ["Paper Lab review"]),
  entry("formula", "Formula recall", ["Paper Lab practice"]),
  entry("microphone", "Optional oral practice", ["Paper Lab oral exam"], false, true),
  entry("code", "Implementation evidence", ["Paper Lab implementation"]),
  entry("clock", "Duration metadata", ["Reading metadata"]),
  entry("calendar", "Date metadata", ["Writing and Paper metadata"]),
  entry("check", "Completed status", ["Status actions"]),
  entry("copy", "Copy command", ["Copy actions"], false, true),
  entry("download", "Download command", ["Download actions"], false, true),
  entry("warning", "Warning status", ["Validation messages"]),
  entry("info", "Informational status", ["Context messages"])
] as const satisfies readonly IconRegistryEntry[];

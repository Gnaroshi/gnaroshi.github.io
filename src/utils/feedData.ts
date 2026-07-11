import { readContentFeedJson } from "./contentFeed";

export type ActivityDay = {
  date: string;
  readingSessions: number;
  distinctPapersTouched: number;
  readingMinutes: number;
  activeDay: boolean;
  completedPasses: number;
  revisits: number;
  implementations: number;
  deepSessions: number;
  paperIds: string[];
};

export type PublicGrowthSnapshot = {
  id: string;
  schemaVersion: number;
  generatedAt: string;
  metricEligible: boolean;
  periodStart: string;
  periodEnd: string;
  score: number | null;
  confidence: "insufficient" | "low" | "medium" | "high";
  evidenceCount: number;
  activeDays: number;
  components: Record<string, number | null>;
};

export function getActivityCalendar(): ActivityDay[] {
  return readContentFeedJson<ActivityDay[]>("data/activity-calendar.json", [])
    .filter((day) => /^\d{4}-\d{2}-\d{2}$/.test(day.date) && day.readingSessions >= 0 && day.readingMinutes >= 0)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getPublicGrowthSnapshot(): PublicGrowthSnapshot | null {
  const snapshot = readContentFeedJson<PublicGrowthSnapshot | null>("data/growth-snapshot.json", null);
  if (!snapshot || snapshot.schemaVersion !== 1 || typeof snapshot.evidenceCount !== "number") return null;
  return snapshot;
}

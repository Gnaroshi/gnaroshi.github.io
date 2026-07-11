import { readContentFeedJson } from "./contentFeed";

export type WeeklyReview = {
  id: string; schemaVersion: number; weekId: string; startDate: string; endDate: string; generatedAt: string;
  closedAt?: string; visibility: "public" | "unlisted"; state: "in-progress" | "complete" | "insufficient-evidence";
  meaningfulEventCount: number; summary: string;
  metrics: {
    readingSessions?: number; distinctPapersTouched?: number; readingMinutes?: number; activeDays?: number;
    completedPasses?: number; revisits?: number; reviews?: number; oralExams?: number; formulaRecalls?: number;
    implementations?: number; posts?: number;
  };
  strongestDimension?: string | null; weakestDimension?: string | null; wins: string[]; openLoops: string[]; nextActions: string[];
  featuredItems: Array<{ recordType: "paper" | "blog" | "implementation"; recordId: string; title: string; href: string }>;
};

export function getAllWeeklyReviews(): WeeklyReview[] {
  return readContentFeedJson<WeeklyReview[]>("data/weekly-reviews/index.json", [])
    .filter((review) => review.schemaVersion === 1 && review.visibility === "public")
    .sort((a, b) => b.weekId.localeCompare(a.weekId));
}
export function getWeeklyReview(weekId: string): WeeklyReview | undefined { return getAllWeeklyReviews().find((review) => review.weekId === weekId); }
export function formatMetricLabel(key: string): string { return key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase()); }

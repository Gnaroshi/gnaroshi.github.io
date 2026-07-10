const weeklyReviewModules = import.meta.glob("../generated/weekly-reviews/*.json", { eager: true });

export type WeeklyReview = {
  schemaVersion: "1.0.0";
  weekId: string;
  startDate: string;
  endDate: string;
  generatedAt: string;
  visibility?: "public" | "unlisted" | "hidden";
  status?: "in-progress" | "complete" | "insufficient-evidence";
  meaningfulEventCount?: number;
  contentStage?: "seed" | "working" | "substantive";
  metricEligible?: boolean;
  graphEligible?: boolean;
  weeklyReviewEligible?: boolean;
  summary: string;
  metrics: {
    papersRead: number;
    deepReads: number;
    aiReviews: number;
    oralExams: number;
    formulaRecalls: number;
    blogPosts: number;
    projectUpdates: number;
    githubContributions: number;
  };
  strongestDimension: string | null;
  weakestDimension: string | null;
  wins: string[];
  openLoops: string[];
  nextWeekFocus: string;
  featuredItems: Array<{
    type: string;
    slug: string;
    title: string;
    href: string;
  }>;
};

export function getAllWeeklyReviews(): WeeklyReview[] {
  return Object.values(weeklyReviewModules)
    .map(unwrapJsonModule)
    .filter(isWeeklyReview)
    .filter((review) => (review.visibility ?? "public") === "public")
    .sort((a, b) => b.weekId.localeCompare(a.weekId));
}

export function getWeeklyReview(weekId: string): WeeklyReview | undefined {
  return getAllWeeklyReviews().find((review) => review.weekId === weekId);
}

export function formatMetricLabel(key: string): string {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
}

function unwrapJsonModule(module: unknown): unknown {
  if (module && typeof module === "object" && "default" in module) {
    return (module as { default: unknown }).default;
  }

  return module;
}

function isWeeklyReview(value: unknown): value is WeeklyReview {
  if (!value || typeof value !== "object") return false;
  const review = value as Partial<WeeklyReview>;
  return (
    review.schemaVersion === "1.0.0" &&
    typeof review.weekId === "string" &&
    typeof review.startDate === "string" &&
    typeof review.endDate === "string" &&
    typeof review.summary === "string" &&
    Boolean(review.metrics)
  );
}

import { readContentFeedJson } from "./contentFeed";

export type WeeklyReview = {
  schemaVersion: string;
  weekId: string;
  startDate: string;
  endDate: string;
  generatedAt: string;
  visibility: "public";
  status: "in-progress" | "complete" | "insufficient-evidence";
  meaningfulEventCount: number;
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
  featuredItems: Array<{ type: string; slug: string; title: string; href: string }>;
};

type FeedWeeklyReview = {
  schemaVersion: number;
  weekId: string;
  startDate: string;
  endDate: string;
  updatedAt: string;
  visibility: string;
  summary: string;
  achievements: string[];
  questions: string[];
  nextActions: string[];
  metrics: {
    readingSessions: number;
    readingMinutes: number;
    reviews: number;
    oralExams: number;
    implementations: number;
    posts: number;
  };
};

export function getAllWeeklyReviews(): WeeklyReview[] {
  return readContentFeedJson<FeedWeeklyReview[]>("data/weekly-reviews/index.json", [])
    .filter((review) => review.schemaVersion === 1 && review.visibility === "public")
    .map((review) => {
      const meaningfulEventCount = review.metrics.readingSessions + review.metrics.reviews + review.metrics.oralExams + review.metrics.implementations + review.metrics.posts;
      return {
        schemaVersion: String(review.schemaVersion),
        weekId: review.weekId,
        startDate: review.startDate,
        endDate: review.endDate,
        generatedAt: review.updatedAt,
        visibility: "public" as const,
        status: meaningfulEventCount > 0 ? "complete" as const : "insufficient-evidence" as const,
        meaningfulEventCount,
        summary: review.summary,
        metrics: {
          papersRead: review.metrics.readingSessions,
          deepReads: 0,
          aiReviews: review.metrics.reviews,
          oralExams: review.metrics.oralExams,
          formulaRecalls: 0,
          blogPosts: review.metrics.posts,
          projectUpdates: review.metrics.implementations,
          githubContributions: 0
        },
        strongestDimension: null,
        weakestDimension: null,
        wins: review.achievements,
        openLoops: review.questions,
        nextWeekFocus: review.nextActions[0] ?? "",
        featuredItems: []
      };
    })
    .sort((a, b) => b.weekId.localeCompare(a.weekId));
}

export function getWeeklyReview(weekId: string): WeeklyReview | undefined {
  return getAllWeeklyReviews().find((review) => review.weekId === weekId);
}

export function formatMetricLabel(key: string): string {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
}

import type { PaperEntry } from "./papers";

export type ScoreLevel = "seed" | "developing" | "solid" | "strong" | "excellent";
export type ReviewVisibility = "public" | "hidden";

export type PaperReviewDimension = {
  score: number;
  feedback: string;
  evidence: string;
  nextStep: string;
};

export type PaperReview = {
  schemaVersion: "1.0.0";
  paperSlug: string;
  paperTitle: string;
  reviewedAt: string;
  model: string;
  reviewVisibility: ReviewVisibility;
  overallScore: number;
  scoreLevel: ScoreLevel;
  confidence: "low" | "medium" | "high";
  summary: string;
  motivationMessage: string;
  dimensions: Record<string, PaperReviewDimension>;
  threePassReview: Record<"pass1" | "pass2" | "pass3", { status: string; comment: string }>;
  strengths: string[];
  gaps: string[];
  nextActions: Array<{ type: string; action: string; effortMinutes: number }>;
  retrievalQuestions: string[];
  badge: { id: string; label: string; reason: string };
  limitations: string[];
  history: Array<{ reviewedAt: string; overallScore: number; scoreLevel: ScoreLevel }>;
};

export type PaperReviewSummary = Pick<
  PaperReview,
  "paperSlug" | "paperTitle" | "reviewedAt" | "overallScore" | "scoreLevel" | "confidence" | "summary" | "badge"
>;

export type PaperReviewStats = {
  averageScore: number | null;
  recentAverageScore: number | null;
  reviewedCount: number;
  unreviewedCount: number;
  bestImproved?: {
    paperSlug: string;
    paperTitle: string;
    from: number;
    to: number;
    delta: number;
  };
  recentBadges: Array<{
    paperSlug: string;
    paperTitle: string;
    id: string;
    label: string;
    reason: string;
  }>;
  trend: Array<{
    paperSlug: string;
    paperTitle: string;
    reviewedAt: string;
    overallScore: number;
    scoreLevel: ScoreLevel;
  }>;
};

const reviewModules = import.meta.glob("../generated/paper-reviews/*.json", { eager: true });

export function getAllPaperReviews(): PaperReview[] {
  return Object.values(reviewModules)
    .map(unwrapJsonModule)
    .filter(isPaperReview)
    .sort((a, b) => b.reviewedAt.localeCompare(a.reviewedAt));
}

export function getPaperReviewMap(): Map<string, PaperReview> {
  return new Map(getAllPaperReviews().map((review) => [review.paperSlug, review]));
}

export function getPaperReviewForSlug(slug: string): PaperReview | undefined {
  return getPaperReviewMap().get(slug);
}

export function getPublicPaperReviewForPaper(paper: PaperEntry): PaperReview | undefined {
  const review = getPaperReviewForSlug(paper.id);
  if (!review) return undefined;
  return isReviewVisibleForPaper(paper, review) ? review : undefined;
}

export function getPublicPaperReviewMap(papers: PaperEntry[]): Map<string, PaperReview> {
  return new Map(
    papers
      .map((paper) => [paper.id, getPublicPaperReviewForPaper(paper)] as const)
      .filter((entry): entry is readonly [string, PaperReview] => Boolean(entry[1]))
  );
}

export function toPaperReviewSummary(review: PaperReview): PaperReviewSummary {
  return {
    paperSlug: review.paperSlug,
    paperTitle: review.paperTitle,
    reviewedAt: review.reviewedAt,
    overallScore: review.overallScore,
    scoreLevel: review.scoreLevel,
    confidence: review.confidence,
    summary: review.summary,
    badge: review.badge
  };
}

export function getPaperReviewStats(papers: PaperEntry[], reviewsBySlug: Map<string, PaperReview>): PaperReviewStats {
  const visibleReviews = papers
    .map((paper) => reviewsBySlug.get(paper.id))
    .filter((review): review is PaperReview => Boolean(review))
    .sort((a, b) => a.reviewedAt.localeCompare(b.reviewedAt));
  const reviewedCount = visibleReviews.length;
  const unreviewedCount = Math.max(0, papers.length - reviewedCount);
  const recentReviews = visibleReviews.slice(-7);

  return {
    averageScore: averageScore(visibleReviews),
    recentAverageScore: averageScore(recentReviews),
    reviewedCount,
    unreviewedCount,
    bestImproved: getBestImprovedPaper(visibleReviews),
    recentBadges: visibleReviews
      .slice(-5)
      .reverse()
      .map((review) => ({
        paperSlug: review.paperSlug,
        paperTitle: review.paperTitle,
        id: review.badge.id,
        label: review.badge.label,
        reason: review.badge.reason
      })),
    trend: visibleReviews.slice(-12).map((review) => ({
      paperSlug: review.paperSlug,
      paperTitle: review.paperTitle,
      reviewedAt: review.reviewedAt,
      overallScore: review.overallScore,
      scoreLevel: review.scoreLevel
    }))
  };
}

export function scoreLevelLabel(level: ScoreLevel): string {
  return {
    seed: "Seed",
    developing: "Developing",
    solid: "Solid",
    strong: "Strong",
    excellent: "Excellent"
  }[level];
}

export function scoreLevelForScore(score: number): ScoreLevel {
  if (score <= 39) return "seed";
  if (score <= 59) return "developing";
  if (score <= 74) return "solid";
  if (score <= 89) return "strong";
  return "excellent";
}

export function formatScore(score: number | null): string {
  return score === null ? "N/A" : String(score);
}

function isReviewVisibleForPaper(paper: PaperEntry, review: PaperReview): boolean {
  return paper.data.reviewVisibility !== "hidden" && review.reviewVisibility !== "hidden";
}

function averageScore(reviews: PaperReview[]): number | null {
  if (reviews.length === 0) return null;
  const total = reviews.reduce((sum, review) => sum + review.overallScore, 0);
  return Math.round(total / reviews.length);
}

function getBestImprovedPaper(reviews: PaperReview[]): PaperReviewStats["bestImproved"] {
  const improvements = reviews
    .map((review) => {
      const history = review.history ?? [];
      if (history.length < 2) return undefined;
      const sorted = [...history].sort((a, b) => a.reviewedAt.localeCompare(b.reviewedAt));
      const first = sorted[0];
      const last = sorted[sorted.length - 1];
      const delta = last.overallScore - first.overallScore;
      if (delta <= 0) return undefined;
      return {
        paperSlug: review.paperSlug,
        paperTitle: review.paperTitle,
        from: first.overallScore,
        to: last.overallScore,
        delta
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return improvements.sort((a, b) => b.delta - a.delta)[0];
}

function unwrapJsonModule(module: unknown): unknown {
  if (module && typeof module === "object" && "default" in module) {
    return (module as { default: unknown }).default;
  }

  return module;
}

function isPaperReview(value: unknown): value is PaperReview {
  if (!value || typeof value !== "object") return false;
  const review = value as Partial<PaperReview>;
  return (
    review.schemaVersion === "1.0.0" &&
    typeof review.paperSlug === "string" &&
    typeof review.paperTitle === "string" &&
    typeof review.reviewedAt === "string" &&
    typeof review.overallScore === "number" &&
    typeof review.scoreLevel === "string" &&
    review.reviewVisibility !== "hidden"
  );
}

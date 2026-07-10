import type { PaperEntry } from "./papers";

export type ScoreLevel = "seed" | "developing" | "solid" | "strong" | "excellent";
export type ReviewVisibility = "public" | "unlisted" | "hidden";

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
  selfScoreComparison: {
    userScore: number;
    aiScore: number;
    difference: number;
    comment: string;
  } | null;
  improvementTarget: {
    currentLevel: ScoreLevel;
    nextLevel: ScoreLevel;
    oneThingToImprove: string;
    suggestedTimeMinutes: number;
  };
  nextReviewDate: string;
  dimensions: Record<string, PaperReviewDimension>;
  threePassReview: Record<"pass1" | "pass2" | "pass3", { status: string; comment: string }>;
  strengths: string[];
  gaps: string[];
  nextActions: Array<{ type: string; action: string; effortMinutes: number }>;
  retrievalQuestions: string[];
  badge: { id: string; label: string; reason: string };
  limitations: string[];
  history: Array<{
    reviewedAt: string;
    overallScore: number;
    scoreLevel: ScoreLevel;
    dimensionScores: Record<string, number>;
  }>;
};

export type PaperReviewSummary = Pick<
  PaperReview,
  | "paperSlug"
  | "paperTitle"
  | "reviewedAt"
  | "overallScore"
  | "scoreLevel"
  | "confidence"
  | "summary"
  | "badge"
  | "nextReviewDate"
  | "improvementTarget"
>;

export type PaperReviewStats = {
  averageScore: number | null;
  averageSelfScore: number | null;
  averageScoreGap: number | null;
  recentAverageScore: number | null;
  reviewedCount: number;
  unreviewedCount: number;
  papersWithNextReviewDue: number;
  weakestDimension?: {
    key: string;
    label: string;
    averageScore: number;
    weakCount: number;
  };
  mostImprovedDimension?: {
    key: string;
    label: string;
    delta: number;
  };
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
const DIMENSION_LABELS: Record<string, string> = {
  problemFraming: "Problem framing",
  coreIdea: "Core idea",
  methodUnderstanding: "Method understanding",
  formulaUnderstanding: "Formula understanding",
  experimentUnderstanding: "Experiment understanding",
  criticalThinking: "Critical thinking",
  researchConnection: "Research connection",
  retrievalReadiness: "Retrieval readiness",
  threePassDiscipline: "Three-pass discipline",
  noteQuality: "Note quality"
};

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
  return paper.data.reviewVisibility === "public" && review.reviewVisibility === "public" ? review : undefined;
}

export function getVisiblePaperReviewForPaper(paper: PaperEntry): PaperReview | undefined {
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
    badge: review.badge,
    nextReviewDate: review.nextReviewDate,
    improvementTarget: review.improvementTarget
  };
}

export function getPaperReviewStats(papers: PaperEntry[], reviewsBySlug: Map<string, PaperReview>, today = toLocalDateKey()): PaperReviewStats {
  const visibleReviews = papers
    .map((paper) => reviewsBySlug.get(paper.id))
    .filter((review): review is PaperReview => Boolean(review))
    .sort((a, b) => a.reviewedAt.localeCompare(b.reviewedAt));
  const paperBySlug = new Map(papers.map((paper) => [paper.id, paper]));
  const selfScoreComparisons = visibleReviews
    .map((review) => {
      const paper = paperBySlug.get(review.paperSlug);
      const userScore = getPaperSelfScore(paper);
      return userScore === null ? undefined : { userScore, aiScore: review.overallScore, gap: userScore - review.overallScore };
    })
    .filter((item): item is { userScore: number; aiScore: number; gap: number } => Boolean(item));
  const reviewedCount = visibleReviews.length;
  const unreviewedCount = Math.max(0, papers.length - reviewedCount);
  const recentReviews = visibleReviews.slice(-7);

  return {
    averageScore: averageScore(visibleReviews),
    averageSelfScore: averageNumber(selfScoreComparisons.map((item) => item.userScore)),
    averageScoreGap: averageNumber(selfScoreComparisons.map((item) => item.gap)),
    recentAverageScore: averageScore(recentReviews),
    reviewedCount,
    unreviewedCount,
    papersWithNextReviewDue: visibleReviews.filter((review) => review.nextReviewDate <= today).length,
    weakestDimension: getWeakestDimension(visibleReviews),
    mostImprovedDimension: getMostImprovedDimension(visibleReviews),
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

function averageNumber(values: number[]): number | null {
  if (values.length === 0) return null;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function getPaperSelfScore(paper?: PaperEntry): number | null {
  const selfScore = paper?.data.selfScore;
  if (typeof selfScore === "number") return selfScore;
  if (selfScore && typeof selfScore === "object" && "overall" in selfScore && typeof selfScore.overall === "number") {
    return selfScore.overall;
  }
  return null;
}

function getWeakestDimension(reviews: PaperReview[]): PaperReviewStats["weakestDimension"] {
  if (reviews.length === 0) return undefined;

  const dimensionStats = Object.entries(DIMENSION_LABELS).map(([key, label]) => {
    const scores = reviews.map((review) => review.dimensions[key]?.score ?? 0);
    return {
      key,
      label,
      averageScore: Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 10) / 10,
      weakCount: scores.filter((score) => score <= 5).length
    };
  });

  return dimensionStats.sort((a, b) => b.weakCount - a.weakCount || a.averageScore - b.averageScore)[0];
}

function getMostImprovedDimension(reviews: PaperReview[]): PaperReviewStats["mostImprovedDimension"] {
  const improvements = new Map<string, number[]>();

  for (const review of reviews) {
    const history = [...(review.history ?? [])].sort((a, b) => a.reviewedAt.localeCompare(b.reviewedAt));
    if (history.length < 2) continue;

    const first = history[0];
    const last = history[history.length - 1];
    for (const key of Object.keys(DIMENSION_LABELS)) {
      const delta = (last.dimensionScores?.[key] ?? 0) - (first.dimensionScores?.[key] ?? 0);
      improvements.set(key, [...(improvements.get(key) ?? []), delta]);
    }
  }

  const best = [...improvements.entries()]
    .map(([key, deltas]) => ({
      key,
      label: DIMENSION_LABELS[key],
      delta: Math.round((deltas.reduce((sum, value) => sum + value, 0) / deltas.length) * 10) / 10
    }))
    .filter((item) => item.delta > 0)
    .sort((a, b) => b.delta - a.delta)[0];

  return best;
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
    typeof review.nextReviewDate === "string" &&
    typeof review.reviewVisibility === "string" && ["public", "unlisted", "hidden"].includes(review.reviewVisibility)
  );
}

function toLocalDateKey(date = new Date()): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

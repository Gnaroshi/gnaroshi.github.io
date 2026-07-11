import type { PaperEntry } from "./papers";
import { readContentFeedJson } from "./contentFeed";
import { getContentSlug } from "./localizedContent";

export type ScoreLevel = "seed" | "developing" | "solid" | "strong" | "excellent";
export type ReviewVisibility = "public" | "unlisted" | "hidden";
export type PaperReviewDimension = { score: number; feedback: string; evidence: string; nextStep: string };
export type PaperReview = {
  id: string;
  paperSlug: string;
  paperTitle: string;
  reviewedAt: string;
  reviewer: "self" | "ai" | "peer";
  reviewVisibility: ReviewVisibility;
  overallScore: number | null;
  scoreLevel?: ScoreLevel;
  confidence: "low" | "medium" | "high";
  summary: string;
  strengths: string[];
  gaps: string[];
  nextActions: string[];
  nextReviewDate?: string;
  dimensions?: Record<string, PaperReviewDimension>;
  history?: Array<{ reviewedAt: string; overallScore: number; dimensionScores?: Record<string, number> }>;
};
export type PaperReviewSummary = Pick<PaperReview, "paperSlug" | "paperTitle" | "reviewedAt" | "overallScore" | "confidence" | "summary" | "nextReviewDate"> & { scoreLevel?: ScoreLevel };
export type PaperReviewStats = {
  averageScore: number | null; averageSelfScore: number | null; averageScoreGap: number | null; recentAverageScore: number | null;
  reviewedCount: number; unreviewedCount: number; papersWithNextReviewDue: number;
  weakestDimension?: { key: string; label: string; averageScore: number; weakCount: number };
  mostImprovedDimension?: { key: string; label: string; delta: number };
  trend: Array<{ paperSlug: string; paperTitle: string; reviewedAt: string; overallScore: number; scoreLevel: ScoreLevel }>;
};

type FeedPaperReview = {
  id: string; schemaVersion: number; visibility: "unlisted" | "public"; paperId: string; reviewedAt: string;
  reviewer: "self" | "ai" | "peer"; overallScore: number | null; confidence: "low" | "medium" | "high";
  summary: string; strengths: string[]; gaps: string[]; nextActions: string[];
  dimensions?: Record<string, PaperReviewDimension>;
  history?: Array<{ reviewedAt: string; overallScore: number; dimensionScores?: Record<string, number> }>;
};

const DIMENSION_LABELS: Record<string, string> = {
  problemFraming: "Problem framing", coreIdea: "Core idea", methodUnderstanding: "Method understanding",
  formulaUnderstanding: "Formula understanding", experimentUnderstanding: "Experiment understanding",
  criticalThinking: "Critical thinking", researchConnection: "Research connection", retrievalReadiness: "Retrieval readiness",
  threePassDiscipline: "Three-pass discipline", noteQuality: "Note quality"
};

function getFeedPaperReviews(): FeedPaperReview[] {
  return readContentFeedJson<FeedPaperReview[]>("data/reviews/index.json", [])
    .filter((review) => review.schemaVersion === 1 && typeof review.paperId === "string");
}

function adaptFeedReview(review: FeedPaperReview | undefined, paper?: PaperEntry): PaperReview | undefined {
  if (!review) return undefined;
  return {
    id: review.id, paperSlug: paper?.data.canonicalSlug ?? review.paperId, paperTitle: paper?.data.title ?? review.paperId,
    reviewedAt: review.reviewedAt, reviewer: review.reviewer, reviewVisibility: review.visibility,
    overallScore: review.overallScore, ...(review.overallScore !== null ? { scoreLevel: scoreLevelForScore(review.overallScore) } : {}),
    confidence: review.confidence, summary: review.summary, strengths: review.strengths, gaps: review.gaps,
    nextActions: review.nextActions, ...(paper?.data.nextReviewAt ? { nextReviewDate: paper.data.nextReviewAt } : {}),
    ...(review.dimensions ? { dimensions: review.dimensions } : {}), ...(review.history ? { history: review.history } : {})
  };
}

export function getAllPaperReviews(): PaperReview[] {
  return getFeedPaperReviews().map((review) => adaptFeedReview(review)).filter((review): review is PaperReview => Boolean(review)).sort((a, b) => b.reviewedAt.localeCompare(a.reviewedAt));
}
export function getPaperReviewMap(): Map<string, PaperReview> { return new Map(getAllPaperReviews().map((review) => [review.paperSlug, review])); }
export function getPaperReviewForSlug(slug: string): PaperReview | undefined { return getPaperReviewMap().get(slug); }
export function getPublicPaperReviewForPaper(paper: PaperEntry): PaperReview | undefined {
  return adaptFeedReview(getFeedPaperReviews().find((item) => item.paperId === (paper.data.feedId ?? getContentSlug(paper.id))), paper);
}
export const getVisiblePaperReviewForPaper = getPublicPaperReviewForPaper;
export function getPublicPaperReviewMap(papers: PaperEntry[]): Map<string, PaperReview> {
  return new Map(papers.map((paper) => [paper.id, getPublicPaperReviewForPaper(paper)] as const).filter((entry): entry is readonly [string, PaperReview] => Boolean(entry[1])));
}
export function toPaperReviewSummary(review: PaperReview): PaperReviewSummary {
  return { paperSlug: review.paperSlug, paperTitle: review.paperTitle, reviewedAt: review.reviewedAt, overallScore: review.overallScore, confidence: review.confidence, summary: review.summary, ...(review.scoreLevel ? { scoreLevel: review.scoreLevel } : {}), ...(review.nextReviewDate ? { nextReviewDate: review.nextReviewDate } : {}) };
}

function average(values: number[]): number | null { return values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : null; }
function weakest(reviews: PaperReview[]): PaperReviewStats["weakestDimension"] {
  const values = Object.entries(DIMENSION_LABELS).flatMap(([key, label]) => {
    const scores = reviews.map((review) => review.dimensions?.[key]?.score).filter((score): score is number => typeof score === "number");
    return scores.length ? [{ key, label, averageScore: Math.round(average(scores)! * 10) / 10, weakCount: scores.filter((score) => score <= 5).length }] : [];
  });
  return values.sort((a, b) => b.weakCount - a.weakCount || a.averageScore - b.averageScore)[0];
}
function improved(reviews: PaperReview[]): PaperReviewStats["mostImprovedDimension"] {
  const deltas = new Map<string, number[]>();
  for (const review of reviews) {
    const history = [...(review.history ?? [])].sort((a, b) => a.reviewedAt.localeCompare(b.reviewedAt));
    if (history.length < 2) continue;
    for (const key of Object.keys(DIMENSION_LABELS)) {
      const first = history[0]?.dimensionScores?.[key]; const last = history.at(-1)?.dimensionScores?.[key];
      if (typeof first === "number" && typeof last === "number") deltas.set(key, [...(deltas.get(key) ?? []), last - first]);
    }
  }
  return [...deltas.entries()].map(([key, values]) => ({ key, label: DIMENSION_LABELS[key]!, delta: Math.round(average(values)! * 10) / 10 })).filter((item) => item.delta > 0).sort((a, b) => b.delta - a.delta)[0];
}
export function getPaperReviewStats(papers: PaperEntry[], reviewsBySlug: Map<string, PaperReview>, today = new Date().toISOString().slice(0, 10)): PaperReviewStats {
  const reviews = papers.map((paper) => reviewsBySlug.get(paper.id)).filter((review): review is PaperReview => Boolean(review));
  const scored = reviews.filter((review): review is PaperReview & { overallScore: number; scoreLevel: ScoreLevel } => review.overallScore !== null && Boolean(review.scoreLevel));
  return {
    averageScore: average(scored.map((review) => review.overallScore)), averageSelfScore: null, averageScoreGap: null,
    recentAverageScore: average(scored.slice(-7).map((review) => review.overallScore)), reviewedCount: reviews.length,
    unreviewedCount: Math.max(0, papers.length - reviews.length), papersWithNextReviewDue: reviews.filter((review) => review.nextReviewDate && review.nextReviewDate <= today).length,
    weakestDimension: weakest(reviews), mostImprovedDimension: improved(reviews),
    trend: scored.slice(-12).map((review) => ({ paperSlug: review.paperSlug, paperTitle: review.paperTitle, reviewedAt: review.reviewedAt, overallScore: review.overallScore, scoreLevel: review.scoreLevel }))
  };
}

export function scoreLevelForScore(score: number): ScoreLevel { return score <= 39 ? "seed" : score <= 59 ? "developing" : score <= 74 ? "solid" : score <= 89 ? "strong" : "excellent"; }
export function scoreLevelLabel(level: ScoreLevel): string { return ({ seed: "Seed", developing: "Developing", solid: "Solid", strong: "Strong", excellent: "Excellent" })[level]; }
export function formatScore(score: number | null): string { return score === null ? "N/A" : String(score); }

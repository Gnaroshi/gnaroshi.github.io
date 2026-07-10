import { getCollection } from "astro:content";
import { projects as projectCards } from "../data/projects";
import type {
  FormulaRecallAttempt,
  GitHubContributionDay,
  MomentumInput,
  OralExamScore,
  QuestionPracticeAttempt
} from "../types/momentum";
import { getPublishedBlogPosts } from "./content";
import { getPublishedImplementationAttempts, toImplementationDateKey } from "./implementations";
import { getPublicPaperReviewMap } from "./paperReviews";
import { getPublishedPapers, getTodayKey, toDateKey } from "./papers";
import { getQuestionBank } from "./questionBank";
import { getNextReviewDate } from "./reviewDue";
import { getContentSlug } from "./localizedContent";
import { shouldShowInIndex } from "./visibility";

const oralExamModules = import.meta.glob("../generated/oral-exams/*.json", { eager: true });
const formulaRecallModules = import.meta.glob("../generated/formula-recall/*.json", { eager: true });
const githubContributionModules = import.meta.glob("../generated/github-contributions/*.json", { eager: true });

export async function getMomentumInput(today = getTodayKey()): Promise<MomentumInput> {
  const [paperEntries, blogEntries, implementationEntries, projectEntries] = await Promise.all([
    getPublishedPapers(),
    getPublishedBlogPosts(),
    getPublishedImplementationAttempts(),
    getCollection("projects")
  ]);
  const reviews = [...getPublicPaperReviewMap(paperEntries).values()];
  const paperBySlug = new Map(paperEntries.map((paper) => [paper.id, paper]));
  const contentProjects = projectEntries.filter((project) => shouldShowInIndex(project.data));
  const questionBank = getQuestionBank();

  return {
    today,
    papers: paperEntries.map((paper) => ({
      slug: paper.id,
      title: paper.data.title,
      readDate: paper.data.readDate ? toDateKey(paper.data.readDate) : undefined,
      status: paper.data.status,
      depth: paper.data.depth,
      difficulty: paper.data.difficulty,
      draft: paper.data.draft,
      visibility: paper.data.visibility,
      projectUrl: paper.data.projectUrl,
      noteCompleteness: estimatePaperNoteCompleteness(paper.data, paper.body ?? ""),
      noteWordCount: countWords(paper.body ?? ""),
      selfScore: getSelfScore(paper.data.selfScore),
      contentStage: paper.data.contentStage,
      metricEligible: paper.data.metricEligible,
      graphEligible: paper.data.graphEligible,
      weeklyReviewEligible: paper.data.weeklyReviewEligible
    })),
    paperReviews: reviews.map((review) => ({
      paperSlug: review.paperSlug,
      reviewedAt: review.reviewedAt,
      overallScore: review.overallScore,
      reviewVisibility: review.reviewVisibility,
      confidence: review.confidence,
      dimensions: review.dimensions,
      selfScoreComparison: review.selfScoreComparison,
      contentStage: paperBySlug.get(review.paperSlug)?.data.contentStage,
      metricEligible: paperBySlug.get(review.paperSlug)?.data.metricEligible
    })),
    oralExams: loadGeneratedValues(oralExamModules).map(toOralExam).filter(isDefined),
    githubContributions: loadGeneratedValues(githubContributionModules).flatMap(toGitHubDays),
    blogPosts: blogEntries.map((post) => ({
      slug: getContentSlug(post.id),
      pubDate: toDateKey(post.data.pubDate),
      draft: post.data.draft,
      visibility: post.data.visibility,
      sourcePaper: post.data.sourcePaper,
      contentStage: post.data.contentStage,
      metricEligible: post.data.metricEligible,
      graphEligible: post.data.graphEligible,
      weeklyReviewEligible: post.data.weeklyReviewEligible
    })),
    projects: [
      ...contentProjects.map((project) => ({
        slug: project.id,
        updatedAt: project.data.updatedAt ? toDateKey(project.data.updatedAt) : undefined,
        status: project.data.status,
        visibility: project.data.visibility,
        contentStage: project.data.contentStage,
        metricEligible: project.data.metricEligible,
        graphEligible: project.data.graphEligible,
        weeklyReviewEligible: project.data.weeklyReviewEligible
      })),
      ...projectCards
        .filter((project) => !contentProjects.some((entry) => entry.id === project.slug))
        .map((project) => ({
          slug: project.slug,
          status: project.status,
          visibility: "public" as const,
          contentStage: project.contentStage,
          metricEligible: project.metricEligible,
          graphEligible: project.graphEligible,
          weeklyReviewEligible: project.weeklyReviewEligible
        }))
    ],
    implementations: implementationEntries.map((attempt) => ({
      slug: attempt.id,
      date: toImplementationDateKey(attempt.data.date) ?? today,
      status: attempt.data.status,
      result: attempt.data.result,
      failureReason: attempt.data.failureReason,
      lessons: attempt.data.lessons,
      relatedPapers: attempt.data.relatedPapers,
      relatedProjects: attempt.data.relatedProjects,
      visibility: attempt.data.visibility,
      contentStage: attempt.data.contentStage,
      metricEligible: attempt.data.metricEligible,
      graphEligible: attempt.data.graphEligible,
      weeklyReviewEligible: attempt.data.weeklyReviewEligible
    })),
    reviewDueItems: paperEntries.flatMap((paper) => {
      const completed = paper.data.reviewHistory.map((review) => {
        const completedAt = toDateKey(review.date);
        return {
          paperSlug: paper.id,
          dueDate: completedAt,
          completedAt,
          visibility: paper.data.visibility,
          contentStage: paper.data.contentStage,
          metricEligible: paper.data.metricEligible
        };
      });
      const nextReviewDate = getNextReviewDate(paper);
      return nextReviewDate
        ? [...completed, {
            paperSlug: paper.id,
            dueDate: nextReviewDate,
            visibility: paper.data.visibility,
            contentStage: paper.data.contentStage,
            metricEligible: paper.data.metricEligible
          }]
        : completed;
    }),
    formulaRecallAttempts: loadGeneratedValues(formulaRecallModules).map(toFormulaRecall).filter(isDefined),
    questionPracticeAttempts: questionBank.questions
      .filter((question) => question.timesAsked > 0 && Boolean(question.lastAsked))
      .map((question): QuestionPracticeAttempt => ({
        questionId: question.id,
        questionType: question.type,
        date: question.lastAsked,
        score: question.lastScore ?? undefined,
        visibility: "public",
        metricEligible: true,
        contentStage: "working"
      }))
  };
}

function loadGeneratedValues(modules: Record<string, unknown>): unknown[] {
  return Object.values(modules)
    .map(unwrapModule)
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .filter(Boolean);
}

function unwrapModule(value: unknown): unknown {
  if (value && typeof value === "object" && "default" in value) {
    return (value as { default: unknown }).default;
  }
  return value;
}

function toOralExam(value: unknown): OralExamScore | undefined {
  if (!isRecord(value)) return undefined;
  const scores = isRecord(value.scores) ? value.scores : {};
  const date = firstString(value.scoredAt, value.reviewedAt, value.createdAt, value.date);
  if (!date) return undefined;

  return {
    paperSlug: stringValue(value.paperSlug),
    date,
    overallScore: numberValue(value.overallScore, value.score),
    retrievalScore: numberValue(value.retrievalScore, scores.retrieval),
    explanationScore: numberValue(value.explanationScore, scores.explanation),
    precisionScore: numberValue(value.precisionScore, scores.precision),
    uncertaintyScore: numberValue(value.uncertaintyScore, scores.uncertainty),
    questionsAnswered: numberValue(value.questionsAnswered),
    totalQuestions: numberValue(value.totalQuestions),
    completed: typeof value.completed === "boolean" ? value.completed : undefined,
    questionTypeScores: numericRecord(value.questionTypeScores),
    visibility: visibilityValue(value.visibility),
    contentStage: contentStageValue(value.contentStage),
    metricEligible: booleanValue(value.metricEligible, value.mock !== true),
    graphEligible: booleanValue(value.graphEligible, value.mock !== true),
    weeklyReviewEligible: booleanValue(value.weeklyReviewEligible, value.mock !== true)
  };
}

function toFormulaRecall(value: unknown): FormulaRecallAttempt | undefined {
  if (!isRecord(value)) return undefined;
  const date = firstString(value.scoredAt, value.createdAt, value.date);
  if (!date) return undefined;
  return {
    paperSlug: stringValue(value.paperSlug),
    date,
    score: numberValue(value.score),
    completed: typeof value.completed === "boolean" ? value.completed : true,
    visibility: visibilityValue(value.visibility),
    contentStage: contentStageValue(value.contentStage),
    metricEligible: booleanValue(value.metricEligible, value.mock !== true)
  };
}

function toGitHubDays(value: unknown): GitHubContributionDay[] {
  if (!isRecord(value)) return [];
  const values = Array.isArray(value.days) ? value.days : Array.isArray(value.contributions) ? value.contributions : [value];
  return values
    .map((day) => {
      if (!isRecord(day)) return undefined;
      const date = firstString(day.date, day.contributionDate);
      const count = numberValue(day.count, day.contributionCount);
      if (!date || typeof count !== "number") return undefined;
      return {
        date,
        count,
        visibility: visibilityValue(day.visibility ?? value.visibility),
        contentStage: contentStageValue(day.contentStage ?? value.contentStage),
        metricEligible: booleanValue(day.metricEligible ?? value.metricEligible, true)
      };
    })
    .filter(isDefined);
}

function estimatePaperNoteCompleteness(data: Record<string, unknown>, body: string): number {
  const status = String(data.status ?? "pass1");
  const depth = String(data.depth ?? "skim");
  const fields = [data.oneLineSummary, data.coreQuestion, data.coreIdea, data.nextAction];
  if (status !== "pass1" && depth !== "skim") fields.push(data.experimentTakeaway, data.myConnection);
  if (["pass3", "implemented"].includes(status) || ["deep", "reproduce", "implement"].includes(depth)) {
    fields.push(data.mainFormula, data.formulaInterpretation, data.strengths, data.weaknesses);
  }
  const fieldScore = fields.length === 0 ? 0 : (fields.filter(hasContent).length / fields.length) * 70;
  const wordTarget = status === "pass1" || depth === "skim" ? 100 : status === "pass2" ? 250 : 500;
  const bodyScore = Math.min(30, (countWords(body) / wordTarget) * 30);
  return Math.round(Math.min(100, fieldScore + bodyScore));
}

function hasContent(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(hasContent);
  if (typeof value !== "string") return false;
  const normalized = value.trim().toLowerCase();
  return normalized.length >= 12 && !["todo", "placeholder"].some((token) => normalized.includes(token));
}

function countWords(value: string): number {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/[^a-zA-Z0-9가-힣_]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function getSelfScore(value: unknown): number | undefined {
  if (typeof value === "number") return value;
  if (isRecord(value) && typeof value.overall === "number") return value.overall;
  return undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function firstString(...values: unknown[]): string | undefined {
  return values.find((value): value is string => typeof value === "string" && value.length > 0);
}

function stringValue(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function numberValue(...values: unknown[]): number | undefined {
  const value = values.find((item) => typeof item === "number" && Number.isFinite(item));
  return typeof value === "number" ? value : undefined;
}

function numericRecord(value: unknown): Record<string, number> | undefined {
  if (!isRecord(value)) return undefined;
  const entries = Object.entries(value).filter((entry): entry is [string, number] => typeof entry[1] === "number");
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

function visibilityValue(value: unknown): "public" | "unlisted" | "hidden" {
  return value === "unlisted" || value === "hidden" ? value : "public";
}

function contentStageValue(value: unknown): "seed" | "working" | "substantive" {
  return value === "seed" || value === "substantive" ? value : "working";
}

function booleanValue(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function isDefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

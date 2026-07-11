import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const feedRoot = pathToFileURL(`${resolve(process.env.CONTENT_FEED_PATH || ".content-feed")}/`);
const localeSchema = z.enum(["en", "ko"]);
const visibilitySchema = z.enum(["unlisted", "public"]);
const contentStageSchema = z.enum(["seed", "working", "substantive"]);
const translationStatusSchema = z.enum(["complete", "partial", "source-only"]);
const dateKeySchema = z.preprocess((value) => value instanceof Date ? value.toISOString().slice(0, 10) : value, z.string().regex(/^\d{4}-\d{2}-\d{2}$/));
const timestampSchema = z.coerce.date();
const optionalUrl = z.url().optional();
const publicPath = z.string().regex(/^\/assets\/[a-f0-9]{64}\/.+$/);
const baseFields = {
  id: z.string().min(1), schemaVersion: z.literal(1), createdAt: timestampSchema, updatedAt: timestampSchema,
  visibility: visibilitySchema, contentStage: contentStageSchema, metricEligible: z.boolean(), graphEligible: z.boolean(), weeklyReviewEligible: z.boolean()
};
const localizedFields = {
  locale: localeSchema, translationKey: z.string().min(1), translationStatus: translationStatusSchema,
  canonicalSlug: z.string().min(1), aliases: z.array(z.string())
};

type FeedIdInput = { entry: string; data: Record<string, unknown> };
function feedEntryId({ entry, data }: FeedIdInput): string {
  const locale = data.locale === "ko" ? "ko" : "en";
  const fallback = entry.replace(/\.(md|mdx)$/i, "").split("/").at(-1) ?? entry;
  return `${locale}/${typeof data.id === "string" && data.id ? data.id : fallback}`;
}
function presentationVisibility(value: "unlisted" | "public") { return value; }

const blog = defineCollection({
  loader: glob({ base: new URL("blog/", feedRoot), pattern: "**/*.{md,mdx}", generateId: feedEntryId }),
  schema: z.object({
    ...baseFields, ...localizedFields, title: z.string().min(1), description: z.string().min(1), publishDate: dateKeySchema,
    updatedDate: dateKeySchema.optional(), tags: z.array(z.string()), series: z.string().optional(), seriesOrder: z.number().int().positive().optional(),
    featured: z.boolean(), heroImage: publicPath.optional(), ogImage: publicPath.optional(), canonicalUrl: optionalUrl, assets: z.array(publicPath)
  }).transform((data) => ({
    feedId: data.id, locale: data.locale, translationKey: data.translationKey, translationStatus: data.translationStatus,
    canonicalSlug: data.canonicalSlug, aliases: data.aliases, contentStage: data.contentStage, metricEligible: data.metricEligible,
    graphEligible: data.graphEligible, weeklyReviewEligible: data.weeklyReviewEligible, title: data.title, description: data.description,
    pubDate: new Date(`${data.publishDate}T00:00:00.000Z`), updatedDate: data.updatedDate ? new Date(`${data.updatedDate}T00:00:00.000Z`) : undefined,
    draft: false, tags: data.tags, visibility: presentationVisibility(data.visibility), series: data.series, seriesOrder: data.seriesOrder,
    heroImage: data.heroImage, featured: data.featured, canonicalUrl: data.canonicalUrl, ogImage: data.ogImage, assets: data.assets
  }))
});

const readingSessionSchema = z.object({
  id: z.string().min(1), date: dateKeySchema, pass: z.enum(["pass1", "pass2", "pass3", "revisit", "implementation"]),
  minutes: z.number().int().nonnegative(), outcome: z.enum(["started", "completed", "paused", "abandoned"]),
  completedPasses: z.number().int().nonnegative().optional(), deep: z.boolean().optional()
});
const selectedReviewSchema = z.object({
  reviewId: z.string(), overallScore: z.number().min(0).max(100).nullable().optional(), confidence: z.enum(["low", "medium", "high"]),
  summary: z.string(), reviewedAt: timestampSchema, reviewer: z.enum(["self", "ai", "peer"])
});
const selectedOralExamSchema = z.object({
  oralExamId: z.string(), date: dateKeySchema, questionsAnswered: z.number().int().nonnegative(), totalQuestions: z.number().int().positive(),
  overallScore: z.number().min(0).max(100).nullable().optional(), confidence: z.enum(["low", "medium", "high"]), summary: z.string().optional()
});
const futureMeSchema = z.object({
  oneThingToRemember: z.string().optional(), whyItMatters: z.string().optional(), whenToUseThis: z.string().optional(),
  whatToRevisit: z.string().optional(), warning: z.string().optional()
});

const papers = defineCollection({
  loader: glob({ base: new URL("papers/", feedRoot), pattern: "**/*.{md,mdx}", generateId: feedEntryId }),
  schema: z.object({
    ...baseFields, ...localizedFields, title: z.string().min(1), authors: z.array(z.string()).min(1), venue: z.string(), year: z.number().int(),
    paperUrl: optionalUrl, codeUrl: optionalUrl, projectUrl: optionalUrl,
    status: z.enum(["planned", "pass1", "pass2", "pass3", "read", "implemented", "abandoned"]),
    depth: z.enum(["skim", "understand", "deep", "reproduce", "implement"]), priority: z.enum(["low", "medium", "high"]),
    difficulty: z.number().int().min(1).max(5), tags: z.array(z.string()), relatedTopics: z.array(z.string()),
    publicReadingSessionSummary: z.object({ readingSessions: z.number().int().nonnegative().optional(), readingMinutes: z.number().int().nonnegative().optional(), activeDays: z.number().int().nonnegative().optional(), completedPasses: z.number().int().nonnegative().optional(), revisits: z.number().int().nonnegative().optional() }).optional(),
    readingSessions: z.array(readingSessionSchema).optional(), oneLineSummary: z.string().optional(), coreQuestion: z.string().optional(), coreIdea: z.string().optional(),
    formula: z.string().optional(), formulaTerms: z.array(z.object({ symbol: z.string(), meaning: z.string() })).optional(), formulaInterpretation: z.string().optional(),
    experimentTakeaway: z.string().optional(), strengths: z.array(z.string()).optional(), weaknesses: z.array(z.string()).optional(),
    publicResearchConnection: z.string().optional(), nextAction: z.string().optional(), futureMe: futureMeSchema.optional(),
    selectedReview: selectedReviewSchema.optional(), selectedOralExam: selectedOralExamSchema.optional(),
    selectedImplementations: z.array(z.object({ implementationId: z.string(), title: z.string(), status: z.string(), href: z.string().optional() })).optional(),
    featured: z.boolean(), assets: z.array(publicPath), reviewAfterDays: z.number().int().positive().optional(), nextReviewAt: dateKeySchema.optional()
  }).transform((data) => {
    const sessions = data.readingSessions ?? [];
    const readDate = sessions.map((session) => session.date).sort().at(-1);
    return {
      feedId: data.id, locale: data.locale, translationKey: data.translationKey, translationStatus: data.translationStatus,
      canonicalSlug: data.canonicalSlug, aliases: data.aliases, contentStage: data.contentStage, metricEligible: data.metricEligible,
      graphEligible: data.graphEligible, weeklyReviewEligible: data.weeklyReviewEligible, title: data.title, authors: data.authors,
      venue: data.venue, year: data.year, paperUrl: data.paperUrl, codeUrl: data.codeUrl, projectUrl: data.projectUrl,
      readDate: readDate ? new Date(`${readDate}T00:00:00.000Z`) : undefined, lastReviewed: data.selectedReview?.reviewedAt,
      status: data.status, depth: data.depth, priority: data.priority, difficulty: data.difficulty,
      readingTimeMinutes: data.publicReadingSessionSummary?.readingMinutes, tags: data.tags, relatedTopics: data.relatedTopics,
      reviewVisibility: presentationVisibility(data.visibility), visibility: presentationVisibility(data.visibility),
      oneLineSummary: data.oneLineSummary, coreQuestion: data.coreQuestion, coreIdea: data.coreIdea, mainFormula: data.formula,
      formulaInterpretation: data.formulaInterpretation, formulaTerms: data.formulaTerms,
      experimentTakeaway: data.experimentTakeaway, strengths: data.strengths, weaknesses: data.weaknesses,
      myConnection: data.publicResearchConnection, nextAction: data.nextAction, reviewAfterDays: data.reviewAfterDays,
      nextReviewAt: data.nextReviewAt,
      reviewHistory: data.selectedReview ? [{ date: data.selectedReview.reviewedAt, type: data.selectedReview.reviewer === "ai" ? "ai-review" as const : "manual" as const, note: data.selectedReview.summary }] : undefined,
      readingSessions: data.readingSessions,
      oralExams: data.selectedOralExam ? [{ id: data.selectedOralExam.oralExamId, date: data.selectedOralExam.date, questionsAnswered: data.selectedOralExam.questionsAnswered, totalQuestions: data.selectedOralExam.totalQuestions, overallScore: data.selectedOralExam.overallScore, confidence: data.selectedOralExam.confidence, summary: data.selectedOralExam.summary }] : undefined,
      futureMe: data.futureMe, featured: data.featured, draft: false, assets: data.assets
    };
  })
});

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    locale: localeSchema, translationKey: z.string().min(1), translationStatus: translationStatusSchema.default("complete"),
    contentStage: contentStageSchema.default("working"), metricEligible: z.boolean().default(true), graphEligible: z.boolean().default(true),
    weeklyReviewEligible: z.boolean().default(true), title: z.string(), description: z.string(), startedAt: z.coerce.date().optional(), updatedAt: z.coerce.date().optional(),
    status: z.enum(["active", "paused", "complete", "archived"]), tags: z.array(z.string()).min(1), repoUrl: z.union([z.url(), z.literal("")]).optional(),
    demoUrl: z.union([z.url(), z.literal("")]).optional(), paperUrl: z.union([z.url(), z.literal("")]).optional(),
    visibility: z.enum(["public", "unlisted", "hidden"]).default("public"), featured: z.boolean().default(false)
  })
});

export const collections = { blog, papers, projects };

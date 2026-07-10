import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const feedRoot = pathToFileURL(`${resolve(process.env.CONTENT_FEED_PATH || ".content-feed")}/`);
const optionalUrl = z.union([z.url(), z.literal("")]).optional();
const localeSchema = z.enum(["en", "ko"]);
const feedVisibilitySchema = z.enum(["private", "unlisted", "public"]);
const contentStageSchema = z.enum(["seed", "working", "substantive"]);
const dateKeySchema = z.preprocess(
  (value) => value instanceof Date && !Number.isNaN(value.getTime()) ? value.toISOString().slice(0, 10) : value,
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/)
);
const timestampSchema = z.coerce.date();
const sourceSchema = z.object({
  repository: z.string(),
  commit: z.string().regex(/^[a-f0-9]{40}$/i).optional(),
  path: z.string().optional()
}).optional();
const baseFeedFields = {
  id: z.string().min(1),
  schemaVersion: z.literal(1),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
  visibility: feedVisibilitySchema,
  contentStage: contentStageSchema,
  metricEligible: z.boolean(),
  graphEligible: z.boolean(),
  weeklyReviewEligible: z.boolean(),
  source: sourceSchema
};

type FeedIdInput = { entry: string; data: Record<string, unknown> };

function feedEntryId({ entry, data }: FeedIdInput): string {
  const locale = data.locale === "ko" ? "ko" : "en";
  const fallback = entry.replace(/\.(md|mdx)$/i, "").split("/").at(-1) ?? entry;
  const id = typeof data.id === "string" && data.id ? data.id : fallback;
  return `${locale}/${id}`;
}

function presentationVisibility(value: "private" | "unlisted" | "public") {
  return value === "private" ? "hidden" as const : value;
}

const blog = defineCollection({
  loader: glob({
    base: new URL("blog/", feedRoot),
    pattern: "**/*.{md,mdx}",
    generateId: feedEntryId
  }),
  schema: z.object({
    ...baseFeedFields,
    locale: localeSchema,
    translationKey: z.string().min(1).optional(),
    title: z.string(),
    description: z.string(),
    publishDate: dateKeySchema.optional(),
    tags: z.array(z.string()),
    seriesId: z.string().min(1).optional(),
    seriesOrder: z.number().int().positive().optional(),
    assets: z.array(z.object({
      path: z.string(),
      alt: z.string(),
      visibility: feedVisibilitySchema,
      contentHash: z.string().optional()
    })).default([]),
    featured: z.boolean(),
    draft: z.boolean(),
    importedFromPaperId: z.string().min(1).optional()
  }).transform((data) => ({
    feedId: data.id,
    source: data.source,
    locale: data.locale,
    translationKey: data.translationKey ?? data.id,
    translationStatus: "complete" as const,
    contentStage: data.contentStage,
    metricEligible: data.metricEligible,
    graphEligible: data.graphEligible,
    weeklyReviewEligible: data.weeklyReviewEligible,
    title: data.title,
    description: data.description,
    pubDate: data.publishDate ? new Date(`${data.publishDate}T00:00:00.000Z`) : data.createdAt,
    updatedDate: data.updatedAt,
    draft: data.draft,
    tags: data.tags,
    visibility: presentationVisibility(data.visibility),
    series: data.seriesId,
    seriesOrder: data.seriesOrder,
    sourcePaper: data.importedFromPaperId,
    heroImage: undefined,
    readingTime: undefined,
    featured: data.featured,
    canonicalUrl: undefined,
    ogImage: undefined,
    assets: data.assets
  }))
});

const readingSessionSchema = z.object({
  ...baseFeedFields,
  paperId: z.string(),
  date: dateKeySchema,
  pass: z.enum(["pass1", "pass2", "pass3", "revisit", "implementation"]),
  minutes: z.number().int().nonnegative(),
  sections: z.array(z.string()),
  outcome: z.enum(["started", "completed", "paused", "abandoned"]),
  note: z.string().optional().default("")
});

const paperReviewSchema = z.object({
  ...baseFeedFields,
  paperId: z.string(),
  reviewedAt: timestampSchema,
  reviewer: z.enum(["self", "ai", "peer"]),
  overallScore: z.number().min(0).max(100).nullable(),
  confidence: z.enum(["low", "medium", "high"]),
  summary: z.string(),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  nextActions: z.array(z.string())
});

const formulaRecallSchema = z.object({
  ...baseFeedFields,
  paperId: z.string(),
  date: dateKeySchema,
  prompt: z.string(),
  score: z.number().min(0).max(100).nullable(),
  confidence: z.enum(["low", "medium", "high"]),
  feedback: z.string()
});

const oralExamSchema = z.object({
  ...baseFeedFields,
  paperId: z.string(),
  date: dateKeySchema,
  mode: z.enum(["manual", "text", "voice"]),
  questionsAnswered: z.number().int().nonnegative(),
  totalQuestions: z.number().int().positive(),
  overallScore: z.number().min(0).max(100).nullable(),
  confidence: z.enum(["low", "medium", "high"]),
  missedSignals: z.array(z.string()),
  followUpQuestion: z.string()
});

const implementationAttemptSchema = z.object({
  ...baseFeedFields,
  paperIds: z.array(z.string()),
  projectIds: z.array(z.string()),
  date: dateKeySchema,
  status: z.enum(["planned", "in-progress", "partially-reproduced", "reproduced", "failed", "abandoned", "shipped"]),
  title: z.string(),
  goal: z.string(),
  result: z.string(),
  failureReason: z.string(),
  lessons: z.array(z.string()),
  tags: z.array(z.string()),
  repoUrl: optionalUrl,
  demoUrl: optionalUrl
});

const papers = defineCollection({
  loader: glob({
    base: new URL("papers/", feedRoot),
    pattern: "**/*.{md,mdx}",
    generateId: feedEntryId
  }),
  schema: z.object({
    ...baseFeedFields,
    locale: localeSchema,
    translationKey: z.string().min(1).optional(),
    title: z.string(),
    authors: z.array(z.string()),
    venue: z.string(),
    year: z.number().int(),
    paperUrl: optionalUrl,
    codeUrl: optionalUrl,
    projectUrl: optionalUrl,
    status: z.enum(["planned", "pass1", "pass2", "pass3", "read", "implemented", "abandoned"]),
    depth: z.enum(["skim", "understand", "deep", "reproduce", "implement"]),
    priority: z.enum(["low", "medium", "high"]),
    difficulty: z.number().int().min(1).max(5),
    tags: z.array(z.string()),
    relatedTopics: z.array(z.string()),
    oneLineSummary: z.string(),
    coreQuestion: z.string(),
    coreIdea: z.string(),
    mainFormula: z.string(),
    formulaInterpretation: z.string(),
    experimentTakeaway: z.string(),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    myConnection: z.string(),
    nextAction: z.string(),
    reviewAfterDays: z.number().int().positive(),
    nextReviewAt: dateKeySchema.optional(),
    readingSessions: z.array(readingSessionSchema),
    reviewHistory: z.array(paperReviewSchema),
    formulaRecallAttempts: z.array(formulaRecallSchema),
    oralExams: z.array(oralExamSchema),
    implementationAttempts: z.array(implementationAttemptSchema)
  }).transform((data) => {
    const completedSessions = data.readingSessions.filter((session) => session.outcome === "completed");
    const readDate = completedSessions.map((session) => session.date).sort().at(-1);
    const lastReviewed = data.reviewHistory.map((review) => review.reviewedAt).sort((a, b) => a.getTime() - b.getTime()).at(-1);
    return {
      feedId: data.id,
      source: data.source,
      locale: data.locale,
      translationKey: data.translationKey ?? data.id,
      translationStatus: "complete" as const,
      contentStage: data.contentStage,
      metricEligible: data.metricEligible,
      graphEligible: data.graphEligible,
      weeklyReviewEligible: data.weeklyReviewEligible,
      title: data.title,
      authors: data.authors,
      venue: data.venue,
      year: data.year,
      paperUrl: data.paperUrl || undefined,
      codeUrl: data.codeUrl || undefined,
      projectUrl: data.projectUrl || undefined,
      readDate: readDate ? new Date(`${readDate}T00:00:00.000Z`) : undefined,
      lastReviewed,
      status: data.status,
      depth: data.depth,
      priority: data.priority,
      difficulty: data.difficulty,
      readingTimeMinutes: completedSessions.reduce((total, session) => total + session.minutes, 0),
      tags: data.tags,
      relatedTopics: data.relatedTopics,
      abstract: "",
      sourceExcerpt: "",
      selfScore: undefined,
      selfReflection: "",
      reviewVisibility: presentationVisibility(data.visibility),
      visibility: presentationVisibility(data.visibility),
      oneLineSummary: data.oneLineSummary,
      coreQuestion: data.coreQuestion,
      coreIdea: data.coreIdea,
      mainFormula: data.mainFormula,
      formulaInterpretation: data.formulaInterpretation,
      formulaTerms: [] as Array<{ symbol: string; meaning: string }>,
      formulaRecallPrompts: [] as string[],
      experimentTakeaway: data.experimentTakeaway,
      strengths: data.strengths,
      weaknesses: data.weaknesses,
      myConnection: data.myConnection,
      nextAction: data.nextAction,
      reviewAfterDays: data.reviewAfterDays,
      reviewSchedule: [data.reviewAfterDays],
      nextReviewAt: data.nextReviewAt,
      reviewHistory: data.reviewHistory.map((review) => ({
        date: review.reviewedAt,
        type: review.reviewer === "ai" ? "ai-review" as const : "manual" as const,
        note: review.summary
      })),
      feedReviews: data.reviewHistory,
      readingSessions: data.readingSessions,
      formulaRecallAttempts: data.formulaRecallAttempts,
      oralExams: data.oralExams,
      implementationAttempts: data.implementationAttempts,
      futureMe: {
        oneThingToRemember: "",
        whyItMatters: "",
        whenToUseThis: "",
        whatToRevisit: "",
        warning: ""
      },
      featured: false,
      draft: false
    };
  })
});

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    locale: localeSchema,
    translationKey: z.string().min(1),
    translationStatus: z.enum(["complete", "partial", "source-only"]).default("complete"),
    contentStage: contentStageSchema.default("working"),
    metricEligible: z.boolean().default(true),
    graphEligible: z.boolean().default(true),
    weeklyReviewEligible: z.boolean().default(true),
    title: z.string(),
    description: z.string(),
    startedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    status: z.enum(["active", "paused", "complete", "archived"]),
    tags: z.array(z.string()).min(1),
    repoUrl: optionalUrl,
    demoUrl: optionalUrl,
    paperUrl: optionalUrl,
    visibility: z.enum(["public", "unlisted", "hidden"]).default("public"),
    featured: z.boolean().default(false)
  })
});

export const collections = { blog, papers, projects };

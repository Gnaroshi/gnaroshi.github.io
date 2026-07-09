import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const optionalUrl = z.union([z.url(), z.literal("")]).optional();
const optionalNullableString = z
  .string()
  .nullable()
  .optional()
  .transform((value) => value || undefined);
const optionalNullableUrl = z
  .union([z.url(), z.literal(""), z.null()])
  .optional()
  .transform((value) => value || undefined);
const optionalNullableDate = z
  .preprocess((value) => (value === null || value === "" ? undefined : value), z.coerce.date().optional());
const optionalNullableNumber = z
  .union([z.number(), z.null()])
  .optional()
  .transform((value) => value ?? undefined);
const optionalPaperDate = z.preprocess(
  (value) => (value === null || value === "" ? undefined : value),
  z.coerce.date().optional()
);

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: optionalNullableDate,
    draft: z.boolean(),
    tags: z.array(z.string()).min(1),
    series: optionalNullableString,
    seriesOrder: optionalNullableNumber.pipe(z.number().int().positive().optional()),
    heroImage: optionalNullableUrl,
    readingTime: z
      .union([z.string(), z.number(), z.null()])
      .optional()
      .transform((value) => value || undefined),
    featured: z.boolean().default(false),
    canonicalUrl: optionalNullableUrl,
    ogImage: optionalNullableUrl
  })
});

const papers = defineCollection({
  loader: glob({ base: "./src/content/papers", pattern: "**/*.{md,mdx}" }),
  schema: z
    .object({
      title: z.string(),
      authors: z.array(z.string()).min(1),
      venue: z.string(),
      year: z.number().int(),
      paperUrl: optionalNullableUrl,
      codeUrl: optionalNullableUrl,
      projectUrl: optionalNullableUrl,
      readDate: optionalPaperDate,
      lastReviewed: optionalPaperDate,
      status: z.enum(["planned", "pass1", "pass2", "pass3", "read", "implemented", "abandoned"]),
      depth: z.enum(["skim", "understand", "deep", "reproduce", "implement"]),
      priority: z.enum(["low", "medium", "high"]),
      difficulty: z.number().int().min(1).max(5),
      readingTimeMinutes: z.number().int().nonnegative(),
      tags: z.array(z.string()).min(1),
      relatedTopics: z.array(z.string()).default([]),
      abstract: z.string().default(""),
      sourceExcerpt: z.string().default(""),
      selfScore: z
        .union([
          z.number().int().min(0).max(100),
          z.object({
            overall: z.number().int().min(0).max(100),
            confidence: z.enum(["low", "medium", "high"]),
            note: z.string()
          }),
          z.null()
        ])
        .optional()
        .transform((value) => value ?? undefined),
      selfReflection: z.string().default(""),
      reviewVisibility: z.enum(["public", "hidden"]).default("public"),
      oneLineSummary: z.string(),
      coreQuestion: z.string(),
      coreIdea: z.string(),
      mainFormula: z.string().default(""),
      formulaInterpretation: z.string().default(""),
      experimentTakeaway: z.string().default(""),
      strengths: z.array(z.string()).default([]),
      weaknesses: z.array(z.string()).default([]),
      myConnection: z.string().default(""),
      nextAction: z.string().default(""),
      reviewAfterDays: z.number().int().positive().optional(),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false)
    })
    .superRefine((data, context) => {
      if (data.status !== "planned" && !data.readDate) {
        context.addIssue({
          code: "custom",
          path: ["readDate"],
          message: "readDate is required unless status is planned"
        });
      }
    })
});

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    startedAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    status: z.enum(["active", "paused", "complete", "archived"]),
    tags: z.array(z.string()).min(1),
    repoUrl: optionalUrl,
    demoUrl: optionalUrl,
    paperUrl: optionalUrl,
    featured: z.boolean().default(false)
  })
});

export const collections = { blog, papers, projects };

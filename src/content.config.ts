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
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    authors: z.array(z.string()).min(1),
    venue: z.string().optional(),
    year: z.number().int(),
    paperUrl: optionalUrl,
    pdfUrl: optionalUrl,
    codeUrl: optionalUrl,
    projectUrl: optionalUrl,
    readStartedAt: z.coerce.date(),
    lastReadAt: z.coerce.date(),
    status: z.enum(["queued", "pass-1", "pass-2", "pass-3", "paused", "done", "revisit"]),
    depth: z.number().int().min(0).max(4),
    difficulty: z.number().int().min(1).max(5),
    readingMinutes: z.number().int().nonnegative(),
    implemented: z.boolean(),
    reproduced: z.boolean(),
    tags: z.array(z.string()).min(1),
    summary: z.string(),
    keyTakeaway: z.string().optional()
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

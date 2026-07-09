import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const optionalUrl = z.union([z.url(), z.literal("")]).optional();

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    draft: z.boolean(),
    tags: z.array(z.string()).min(1),
    series: z.string().optional(),
    seriesOrder: z.number().int().positive().optional(),
    canonicalUrl: optionalUrl,
    ogImage: optionalUrl
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


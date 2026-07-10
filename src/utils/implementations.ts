import type { Locale } from "../i18n/types";
import { getContentSlug } from "./localizedContent";
import { getPublishedPapers } from "./papers";

export type ImplementationStatus = "planned" | "in-progress" | "reproduced" | "partially-reproduced" | "failed" | "abandoned" | "shipped";

export type ImplementationEntry = {
  id: string;
  data: {
    locale: Locale;
    title: string;
    date: Date;
    status: ImplementationStatus;
    relatedPapers: string[];
    relatedProjects: string[];
    repoUrl?: string;
    demoUrl?: string;
    paperUrl?: string;
    goal: string;
    result: string;
    failureReason: string;
    lessons: string[];
    tags: string[];
    visibility: "public";
  };
};

export const implementationStatusLabels: Record<ImplementationStatus, string> = {
  planned: "Planned",
  "in-progress": "In progress",
  reproduced: "Reproduced",
  "partially-reproduced": "Partially reproduced",
  failed: "Failed",
  abandoned: "Abandoned",
  shipped: "Shipped"
};

export async function getAllImplementationAttempts(locale: Locale = "en"): Promise<ImplementationEntry[]> {
  const papers = await getPublishedPapers(locale);
  const attempts = papers.flatMap((paper) => paper.data.implementationAttempts.map((attempt) => ({
    id: attempt.id,
    data: {
      locale,
      title: attempt.title,
      date: new Date(`${attempt.date}T00:00:00.000Z`),
      status: attempt.status,
      relatedPapers: attempt.paperIds,
      relatedProjects: attempt.projectIds,
      repoUrl: attempt.repoUrl || undefined,
      demoUrl: attempt.demoUrl || undefined,
      paperUrl: paper.data.paperUrl,
      goal: attempt.goal,
      result: attempt.result,
      failureReason: attempt.failureReason,
      lessons: attempt.lessons,
      tags: attempt.tags,
      visibility: "public" as const
    }
  })));
  return sortImplementationAttempts([...new Map(attempts.map((attempt) => [attempt.id, attempt])).values()]);
}

export async function getPublishedImplementationAttempts(locale: Locale = "en"): Promise<ImplementationEntry[]> {
  return getAllImplementationAttempts(locale);
}

export async function getBuildableImplementationAttempts(locale: Locale = "en"): Promise<ImplementationEntry[]> {
  return getAllImplementationAttempts(locale);
}

export function sortImplementationAttempts(attempts: ImplementationEntry[]): ImplementationEntry[] {
  return [...attempts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.data.title.localeCompare(b.data.title));
}

export function getImplementationAttemptsForPaper(attempts: ImplementationEntry[], paperSlug: string): ImplementationEntry[] {
  return attempts.filter((attempt) => attempt.data.relatedPapers.includes(getContentSlug(paperSlug)));
}

export function getImplementationAttemptsForProject(attempts: ImplementationEntry[], projectSlug: string): ImplementationEntry[] {
  return attempts.filter((attempt) => attempt.data.relatedProjects.includes(projectSlug));
}

export function getImplementationTags(attempts: ImplementationEntry[]): string[] {
  return [...new Set(attempts.flatMap((attempt) => attempt.data.tags.map((tag) => tag.trim().toLowerCase())))].filter(Boolean).sort();
}

export function toImplementationDateKey(date?: Date): string | undefined {
  return date?.toISOString().slice(0, 10);
}

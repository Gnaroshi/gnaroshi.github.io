import { getCollection, type CollectionEntry } from "astro:content";
import { shouldBuildDetailPage, shouldShowInIndex } from "./visibility";
import type { Locale } from "../i18n/types";
import { getContentSlug } from "./localizedContent";

export type ImplementationEntry = CollectionEntry<"implementations">;

export type ImplementationStatus = ImplementationEntry["data"]["status"];

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
  const attempts = await getCollection("implementations");
  return sortImplementationAttempts(attempts.filter((attempt) => !getContentSlug(attempt.id).startsWith("_") && attempt.data.locale === locale));
}

export async function getPublishedImplementationAttempts(locale: Locale = "en"): Promise<ImplementationEntry[]> {
  const attempts = await getAllImplementationAttempts(locale);
  return attempts.filter((attempt) => shouldShowInIndex(attempt.data));
}

export async function getBuildableImplementationAttempts(locale: Locale = "en"): Promise<ImplementationEntry[]> {
  const attempts = await getAllImplementationAttempts(locale);
  return attempts.filter((attempt) =>
    shouldBuildDetailPage(attempt.data, {
      includeHidden: !import.meta.env.PROD
    })
  );
}

export function sortImplementationAttempts(attempts: ImplementationEntry[]): ImplementationEntry[] {
  return [...attempts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.data.title.localeCompare(b.data.title));
}

export function getImplementationAttemptsForPaper(attempts: ImplementationEntry[], paperSlug: string): ImplementationEntry[] {
  return attempts.filter((attempt) => attempt.data.relatedPapers.includes(paperSlug));
}

export function getImplementationAttemptsForProject(attempts: ImplementationEntry[], projectSlug: string): ImplementationEntry[] {
  return attempts.filter((attempt) => attempt.data.relatedProjects.includes(projectSlug));
}

export function getImplementationTags(attempts: ImplementationEntry[]): string[] {
  return [...new Set(attempts.flatMap((attempt) => attempt.data.tags.map((tag) => tag.trim().toLowerCase())))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}

export function toImplementationDateKey(date?: Date): string | undefined {
  if (!date) return undefined;
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0")
  ].join("-");
}

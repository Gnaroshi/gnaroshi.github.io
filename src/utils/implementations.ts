import type { Locale } from "../i18n/types";
import { readContentFeedJson } from "./contentFeed";

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
    goal: string;
    result?: string;
    failureReason?: string;
    lessons: string[];
    tags: string[];
    visibility: "public" | "unlisted";
  };
};

type FeedImplementation = {
  id: string;
  schemaVersion: number;
  visibility: "public" | "unlisted";
  paperIds: string[];
  projectIds: string[];
  date: string;
  status: ImplementationStatus;
  title: string;
  goal: string;
  result?: string;
  failureReason?: string;
  lessons?: string[];
  tags: string[];
  repoUrl?: string;
  demoUrl?: string;
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

export async function getAllImplementationAttempts(_locale: Locale = "en"): Promise<ImplementationEntry[]> {
  const records = readContentFeedJson<FeedImplementation[]>("data/implementations/index.json", []).filter((item) => item.schemaVersion === 1);
  return sortImplementationAttempts(records.map((item) => ({
    id: item.id,
    data: {
      locale: "en",
      title: item.title,
      date: new Date(`${item.date}T00:00:00.000Z`),
      status: item.status,
      relatedPapers: item.paperIds,
      relatedProjects: item.projectIds,
      ...(item.repoUrl ? { repoUrl: item.repoUrl } : {}),
      ...(item.demoUrl ? { demoUrl: item.demoUrl } : {}),
      goal: item.goal,
      ...(item.result ? { result: item.result } : {}),
      ...(item.failureReason ? { failureReason: item.failureReason } : {}),
      lessons: item.lessons ?? [],
      tags: item.tags,
      visibility: item.visibility
    }
  })));
}

export const getPublishedImplementationAttempts = getAllImplementationAttempts;
export const getBuildableImplementationAttempts = getAllImplementationAttempts;
export function sortImplementationAttempts(attempts: ImplementationEntry[]): ImplementationEntry[] { return [...attempts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || a.data.title.localeCompare(b.data.title)); }
export function getImplementationAttemptsForPaper(attempts: ImplementationEntry[], paperId: string): ImplementationEntry[] { return attempts.filter((attempt) => attempt.data.relatedPapers.includes(paperId)); }
export function getImplementationAttemptsForProject(attempts: ImplementationEntry[], projectId: string): ImplementationEntry[] { return attempts.filter((attempt) => attempt.data.relatedProjects.includes(projectId)); }
export function getImplementationTags(attempts: ImplementationEntry[]): string[] { return [...new Set(attempts.flatMap((attempt) => attempt.data.tags.map((tag) => tag.trim().toLowerCase())))].filter(Boolean).sort(); }
export function toImplementationDateKey(date?: Date): string | undefined { return date?.toISOString().slice(0, 10); }

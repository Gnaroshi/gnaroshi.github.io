import type { Locale } from "../i18n/types";
import { getLocalePath } from "../i18n/utils";
import { readContentFeedJson } from "./contentFeed";

export type QueuePriority = "urgent" | "high" | "medium" | "low";
export type QueueStatus = "next" | "reading" | "queued" | "converted" | "skipped" | "archived";
export type QueueSource = "advisor" | "lab" | "citation" | "arxiv" | "github" | "blog" | "social" | "course" | "self" | "other";

export type QueueEntry = {
  id: string;
  body?: string;
  data: {
    locale: Locale;
    title: string;
    authors: string[];
    venue: string;
    year: number;
    paperUrl?: string;
    codeUrl?: string;
    source: QueueSource;
    addedDate: Date;
    targetDate?: Date;
    priority: QueuePriority;
    status: QueueStatus;
    reasonToRead: string;
    relatedTopics: string[];
    relatedProjects: string[];
    tags: string[];
    estimatedDifficulty: number;
    estimatedReadingTimeMinutes: number;
  };
};

export type QueueRecord = {
  id: string;
  href: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  paperUrl?: string;
  codeUrl?: string;
  source: QueueSource;
  addedDate: string;
  targetDate?: string;
  priority: QueuePriority;
  status: QueueStatus;
  reasonToRead: string;
  relatedTopics: string[];
  relatedProjects: string[];
  tags: string[];
  estimatedDifficulty: number;
  estimatedReadingTimeMinutes: number;
};

type StoredQueueItem = Omit<QueueRecord, "href" | "addedDate" | "targetDate"> & {
  locale?: Locale;
  addedDate: string;
  targetDate?: string;
  visibility?: string;
  body?: string;
};

const PRIORITY_RANK: Record<QueuePriority, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
const STATUS_RANK: Record<QueueStatus, number> = { next: 6, reading: 5, queued: 4, converted: 3, skipped: 2, archived: 1 };

function loadQueueItems(): QueueEntry[] {
  const stored = readContentFeedJson<StoredQueueItem[]>("data/queue/index.json", []);
  return stored.filter((item) => item.visibility === undefined || item.visibility === "public").map((item) => ({
    id: item.id,
    body: item.body,
    data: {
      locale: item.locale ?? "en",
      title: item.title,
      authors: item.authors,
      venue: item.venue,
      year: item.year,
      paperUrl: item.paperUrl,
      codeUrl: item.codeUrl,
      source: item.source,
      addedDate: new Date(`${item.addedDate}T00:00:00.000Z`),
      targetDate: item.targetDate ? new Date(`${item.targetDate}T00:00:00.000Z`) : undefined,
      priority: item.priority,
      status: item.status,
      reasonToRead: item.reasonToRead,
      relatedTopics: item.relatedTopics,
      relatedProjects: item.relatedProjects,
      tags: item.tags,
      estimatedDifficulty: item.estimatedDifficulty,
      estimatedReadingTimeMinutes: item.estimatedReadingTimeMinutes
    }
  }));
}

export async function getAllQueueItems(locale: Locale = "en"): Promise<QueueEntry[]> {
  return sortQueueItems(loadQueueItems().filter((item) => item.data.locale === locale));
}

export async function getPublishedQueueItems(locale: Locale = "en"): Promise<QueueEntry[]> {
  return getAllQueueItems(locale);
}

export async function getBuildableQueueItems(locale: Locale = "en"): Promise<QueueEntry[]> {
  return getAllQueueItems(locale);
}

export function sortQueueItems(items: QueueEntry[]): QueueEntry[] {
  return [...items].sort((a, b) => {
    const statusDelta = STATUS_RANK[b.data.status] - STATUS_RANK[a.data.status];
    if (statusDelta !== 0) return statusDelta;
    const priorityDelta = PRIORITY_RANK[b.data.priority] - PRIORITY_RANK[a.data.priority];
    if (priorityDelta !== 0) return priorityDelta;
    const aTarget = toQueueDateKey(a.data.targetDate) ?? "9999-99-99";
    const bTarget = toQueueDateKey(b.data.targetDate) ?? "9999-99-99";
    return aTarget.localeCompare(bTarget) || b.data.addedDate.getTime() - a.data.addedDate.getTime();
  });
}

export function getNextQueueItem(items: QueueEntry[]): QueueEntry | undefined {
  return sortQueueItems(items.filter((item) => ["next", "reading", "queued"].includes(item.data.status)))[0];
}

export function getQueueTags(items: QueueEntry[]): string[] {
  return [...new Set(items.flatMap((item) => item.data.tags.map((tag) => tag.trim().toLowerCase())))].filter(Boolean).sort();
}

export function getQueueTopics(items: QueueEntry[]): string[] {
  return [...new Set(items.flatMap((item) => item.data.relatedTopics.map((topic) => topic.trim().toLowerCase())))].filter(Boolean).sort();
}

export function toQueueRecord(item: QueueEntry): QueueRecord {
  return {
    id: item.id,
    href: getLocalePath(item.data.locale, `/queue/${item.id}/`),
    title: item.data.title,
    authors: item.data.authors,
    venue: item.data.venue,
    year: item.data.year,
    paperUrl: item.data.paperUrl,
    codeUrl: item.data.codeUrl,
    source: item.data.source,
    addedDate: toQueueDateKey(item.data.addedDate) ?? "",
    targetDate: toQueueDateKey(item.data.targetDate),
    priority: item.data.priority,
    status: item.data.status,
    reasonToRead: item.data.reasonToRead,
    relatedTopics: item.data.relatedTopics,
    relatedProjects: item.data.relatedProjects,
    tags: item.data.tags,
    estimatedDifficulty: item.data.estimatedDifficulty,
    estimatedReadingTimeMinutes: item.data.estimatedReadingTimeMinutes
  };
}

export function toQueueDateKey(date?: Date): string | undefined {
  return date?.toISOString().slice(0, 10);
}

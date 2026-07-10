import { getCollection, type CollectionEntry } from "astro:content";
import { shouldBuildDetailPage, shouldShowInIndex } from "./visibility";

export type QueueEntry = CollectionEntry<"queue">;

export type QueueRecord = {
  id: string;
  href: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  paperUrl?: string;
  codeUrl?: string;
  source: QueueEntry["data"]["source"];
  addedDate: string;
  targetDate?: string;
  priority: QueueEntry["data"]["priority"];
  status: QueueEntry["data"]["status"];
  reasonToRead: string;
  relatedTopics: string[];
  relatedProjects: string[];
  tags: string[];
  estimatedDifficulty: number;
  estimatedReadingTimeMinutes: number;
};

const PRIORITY_RANK: Record<QueueEntry["data"]["priority"], number> = {
  urgent: 4,
  high: 3,
  medium: 2,
  low: 1
};

const STATUS_RANK: Record<QueueEntry["data"]["status"], number> = {
  next: 6,
  reading: 5,
  queued: 4,
  converted: 3,
  skipped: 2,
  archived: 1
};

export async function getAllQueueItems(): Promise<QueueEntry[]> {
  const items = await getCollection("queue");
  return sortQueueItems(items.filter((item) => !item.id.startsWith("_")));
}

export async function getPublishedQueueItems(): Promise<QueueEntry[]> {
  const items = await getAllQueueItems();
  return items.filter((item) => shouldShowInIndex(item.data));
}

export async function getBuildableQueueItems(): Promise<QueueEntry[]> {
  const items = await getAllQueueItems();
  return items.filter((item) => shouldBuildDetailPage(item.data, { includeHidden: !import.meta.env.PROD }));
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
  return [...new Set(items.flatMap((item) => item.data.tags.map((tag) => tag.trim().toLowerCase())))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}

export function getQueueTopics(items: QueueEntry[]): string[] {
  return [...new Set(items.flatMap((item) => item.data.relatedTopics.map((topic) => topic.trim().toLowerCase())))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}

export function toQueueRecord(item: QueueEntry): QueueRecord {
  return {
    id: item.id,
    href: `/queue/${item.id}/`,
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
    relatedProjects: item.data.relatedProjects.filter(Boolean),
    tags: item.data.tags,
    estimatedDifficulty: item.data.estimatedDifficulty,
    estimatedReadingTimeMinutes: item.data.estimatedReadingTimeMinutes
  };
}

export function toQueueDateKey(date?: Date): string | undefined {
  if (!date) return undefined;
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0")
  ].join("-");
}

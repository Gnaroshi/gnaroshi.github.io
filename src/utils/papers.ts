import { getCollection, type CollectionEntry } from "astro:content";

export type PaperEntry = CollectionEntry<"papers">;

type PaperStats = {
  total: number;
  activeDays: number;
  currentStreak: number;
  longestStreak: number;
  thisWeek: number;
  thisMonth: number;
  thisYear: number;
  deepReads: number;
  implemented: number;
  totalReadingMinutes: number;
};

const ACTIVE_STATUSES = new Set(["pass1", "pass2", "pass3", "read", "implemented"]);
const DEEP_DEPTHS = new Set(["deep", "reproduce", "implement"]);

export async function getAllPapers(): Promise<PaperEntry[]> {
  const papers = await getCollection("papers");
  return sortPapersByReadDate(papers.filter((paper) => !paper.id.startsWith("_")));
}

export async function getPublishedPapers(): Promise<PaperEntry[]> {
  const papers = await getAllPapers();
  return papers.filter((paper) => (import.meta.env.PROD ? !paper.data.draft : true));
}

export function sortPapersByReadDate(papers: PaperEntry[]): PaperEntry[] {
  return [...papers].sort((a, b) => {
    const aDate = getPaperActivityDate(a) ?? "0000-00-00";
    const bDate = getPaperActivityDate(b) ?? "0000-00-00";
    return bDate.localeCompare(aDate) || a.data.title.localeCompare(b.data.title);
  });
}

export function groupPapersByDate(papers: PaperEntry[]): Map<string, PaperEntry[]> {
  const groups = new Map<string, PaperEntry[]>();

  for (const paper of papers) {
    const date = getPaperActivityDate(paper);
    if (!date) continue;
    groups.set(date, [...(groups.get(date) ?? []), paper]);
  }

  return new Map([...groups.entries()].sort(([a], [b]) => b.localeCompare(a)));
}

export function countPapersByDate(papers: PaperEntry[]): Map<string, number> {
  const counts = new Map<string, number>();

  for (const [date, papersOnDate] of groupPapersByDate(getActivePapers(papers))) {
    counts.set(date, papersOnDate.length);
  }

  return counts;
}

export function getPaperStats(papers: PaperEntry[], today = getTodayKey()): PaperStats {
  const activePapers = getActivePapers(papers);
  const counts = countPapersByDate(papers);

  return {
    total: papers.length,
    activeDays: counts.size,
    currentStreak: getCurrentStreak(counts, today),
    longestStreak: getLongestStreak(counts),
    thisWeek: getPapersThisWeek(activePapers, today).length,
    thisMonth: getPapersThisMonth(activePapers, today).length,
    thisYear: getPapersThisYear(activePapers, today).length,
    deepReads: getDeepReadCount(papers),
    implemented: getImplementedCount(papers),
    totalReadingMinutes: papers.reduce((sum, paper) => sum + paper.data.readingTimeMinutes, 0)
  };
}

export function getCurrentStreak(countsOrPapers: Map<string, number> | PaperEntry[], today = getTodayKey()): number {
  const activeDates = getActiveDateSet(countsOrPapers);
  let cursor = parseDateKey(today);

  if (!activeDates.has(toDateKey(cursor))) {
    cursor = addDays(cursor, -1);
  }

  let streak = 0;

  while (activeDates.has(toDateKey(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

export function getLongestStreak(countsOrPapers: Map<string, number> | PaperEntry[]): number {
  const dates = [...getActiveDateSet(countsOrPapers)].sort();
  let longest = 0;
  let current = 0;
  let previous: Date | undefined;

  for (const dateKey of dates) {
    const date = parseDateKey(dateKey);
    const isConsecutive = previous ? toDateKey(addDays(previous, 1)) === dateKey : false;
    current = isConsecutive ? current + 1 : 1;
    longest = Math.max(longest, current);
    previous = date;
  }

  return longest;
}

export function getPapersThisWeek(papers: PaperEntry[], today = getTodayKey()): PaperEntry[] {
  const todayDate = parseDateKey(today);
  const day = todayDate.getUTCDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const start = toDateKey(addDays(todayDate, mondayOffset));
  const end = toDateKey(addDays(parseDateKey(start), 6));
  return getActivePapers(papers).filter((paper) => isPaperInRange(paper, start, end));
}

export function getPapersThisMonth(papers: PaperEntry[], today = getTodayKey()): PaperEntry[] {
  const [year, month] = today.split("-");
  const prefix = `${year}-${month}`;
  return getActivePapers(papers).filter((paper) => getPaperActivityDate(paper)?.startsWith(prefix));
}

export function getPapersThisYear(papers: PaperEntry[], today = getTodayKey()): PaperEntry[] {
  const year = today.slice(0, 4);
  return getActivePapers(papers).filter((paper) => getPaperActivityDate(paper)?.startsWith(year));
}

export function getDeepReadCount(papers: PaperEntry[]): number {
  return papers.filter((paper) => DEEP_DEPTHS.has(paper.data.depth)).length;
}

export function getImplementedCount(papers: PaperEntry[]): number {
  return papers.filter((paper) => paper.data.status === "implemented" || paper.data.depth === "implement").length;
}

export function normalizePaperTags(papers: PaperEntry[]): string[] {
  return [...new Set(papers.flatMap((paper) => paper.data.tags.map((tag) => tag.trim().toLowerCase())))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}

export function getPaperActivityDate(paper: PaperEntry): string | undefined {
  return paper.data.readDate ? toDateKey(paper.data.readDate) : undefined;
}

export function isActivePaper(paper: PaperEntry): boolean {
  return !paper.data.draft && ACTIVE_STATUSES.has(paper.data.status) && Boolean(paper.data.readDate);
}

export function getActivePapers(papers: PaperEntry[]): PaperEntry[] {
  return papers.filter(isActivePaper);
}

export function toDateKey(date: Date): string {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0")
  ].join("-");
}

export function getTodayKey(date = new Date()): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function getActiveDateSet(countsOrPapers: Map<string, number> | PaperEntry[]): Set<string> {
  if (countsOrPapers instanceof Map) {
    return new Set(countsOrPapers.keys());
  }

  return new Set(getActivePapers(countsOrPapers).map((paper) => getPaperActivityDate(paper)).filter(Boolean) as string[]);
}

function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function isPaperInRange(paper: PaperEntry, start: string, end: string): boolean {
  const date = getPaperActivityDate(paper);
  return Boolean(date && date >= start && date <= end);
}

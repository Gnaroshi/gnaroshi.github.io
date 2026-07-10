import type { PaperEntry } from "./papers";

export type ReviewDueRecord = {
  id: string;
  href: string;
  title: string;
  oneLineSummary: string;
  status: PaperEntry["data"]["status"];
  depth: PaperEntry["data"]["depth"];
  readDate?: string;
  lastReviewed?: string;
  nextReviewDate?: string;
  daysUntilDue?: number;
  isDue: boolean;
  isOverdue: boolean;
  reviewCount: number;
  tags: string[];
  mainFormula: string;
  retrievalQuestion: string;
};

export function getNextReviewDate(paper: PaperEntry): string | undefined {
  const baseDate = getLatestReviewBaseDate(paper);
  if (!baseDate) return undefined;

  const schedule = getReviewSchedule(paper);
  const completedReviews = getReviewHistoryDates(paper).length;
  const interval = schedule[Math.min(completedReviews, schedule.length - 1)];
  return addDays(baseDate, interval);
}

export function isReviewDue(paper: PaperEntry, date = getTodayKey()): boolean {
  const nextReviewDate = getNextReviewDate(paper);
  return Boolean(nextReviewDate && nextReviewDate <= date);
}

export function getDueReviews(papers: PaperEntry[], date = getTodayKey()): PaperEntry[] {
  return papers.filter((paper) => isReviewCandidate(paper) && isReviewDue(paper, date));
}

export function getOverdueReviews(papers: PaperEntry[], date = getTodayKey()): PaperEntry[] {
  return papers.filter((paper) => {
    const nextReviewDate = getNextReviewDate(paper);
    return Boolean(isReviewCandidate(paper) && nextReviewDate && nextReviewDate < date);
  });
}

export function getReviewLoadByDay(papers: PaperEntry[]): Map<string, number> {
  const load = new Map<string, number>();

  for (const paper of papers.filter(isReviewCandidate)) {
    const nextReviewDate = getNextReviewDate(paper);
    if (!nextReviewDate) continue;
    load.set(nextReviewDate, (load.get(nextReviewDate) ?? 0) + 1);
  }

  return new Map([...load.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

export function getReviewCompletionRate(papers: PaperEntry[], windowDays: number, today = getTodayKey()): number {
  const start = addDays(today, -windowDays + 1);
  const histories = papers.flatMap((paper) => getReviewHistoryDates(paper));
  const completedInWindow = histories.filter((date) => date >= start && date <= today).length;
  const dueInWindow = [...getReviewLoadByDay(papers).keys()].filter((date) => date >= start && date <= today).length;
  const denominator = completedInWindow + dueInWindow;
  return denominator === 0 ? 0 : Math.round((completedInWindow / denominator) * 100);
}

export function getReviewCompletionStreak(papers: PaperEntry[], today = getTodayKey()): number {
  const reviewDates = new Set(papers.flatMap((paper) => getReviewHistoryDates(paper)));
  let cursor = today;
  let streak = 0;

  while (reviewDates.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

export function toReviewDueRecord(paper: PaperEntry, today = getTodayKey()): ReviewDueRecord {
  const nextReviewDate = getNextReviewDate(paper);
  const daysUntilDue = nextReviewDate ? differenceInDays(nextReviewDate, today) : undefined;
  return {
    id: paper.id,
    href: `/papers/${paper.id}/`,
    title: paper.data.title,
    oneLineSummary: paper.data.oneLineSummary,
    status: paper.data.status,
    depth: paper.data.depth,
    readDate: toDateKey(paper.data.readDate),
    lastReviewed: getLatestReviewBaseDate(paper),
    nextReviewDate,
    daysUntilDue,
    isDue: Boolean(nextReviewDate && nextReviewDate <= today),
    isOverdue: Boolean(nextReviewDate && nextReviewDate < today),
    reviewCount: getReviewHistoryDates(paper).length,
    tags: paper.data.tags,
    mainFormula: paper.data.mainFormula,
    retrievalQuestion: paper.data.coreQuestion || paper.data.oneLineSummary
  };
}

export function getReviewSchedule(paper: PaperEntry): number[] {
  if (paper.data.reviewSchedule && paper.data.reviewSchedule.length > 0) return paper.data.reviewSchedule;
  if (paper.data.status === "pass1") return [1, 7];
  if (paper.data.status === "pass2") return [1, 7, 30];
  if (paper.data.status === "pass3" || paper.data.status === "implemented" || paper.data.depth === "deep") {
    return [1, 7, 30, 90];
  }
  return [7, 30];
}

export function isReviewCandidate(paper: PaperEntry): boolean {
  return !paper.data.draft && !["planned", "abandoned"].includes(paper.data.status) && Boolean(paper.data.readDate);
}

function getLatestReviewBaseDate(paper: PaperEntry): string | undefined {
  const dates = [...getReviewHistoryDates(paper)];
  const lastReviewed = toDateKey(paper.data.lastReviewed);
  if (lastReviewed) dates.push(lastReviewed);
  const readDate = toDateKey(paper.data.readDate);
  if (dates.length === 0 && readDate) return readDate;
  return dates.sort().at(-1);
}

function getReviewHistoryDates(paper: PaperEntry): string[] {
  return paper.data.reviewHistory.map((item) => toDateKey(item.date)).filter(Boolean) as string[];
}

function toDateKey(date?: Date): string | undefined {
  if (!date) return undefined;
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0")
  ].join("-");
}

function getTodayKey(date = new Date()): string {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function addDays(dateKey: string, days: number): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + days);
  return toDateKey(date) ?? dateKey;
}

function differenceInDays(dateKey: string, baseKey: string): number {
  const [year, month, day] = dateKey.split("-").map(Number);
  const [baseYear, baseMonth, baseDay] = baseKey.split("-").map(Number);
  const date = Date.UTC(year, month - 1, day);
  const base = Date.UTC(baseYear, baseMonth - 1, baseDay);
  return Math.round((date - base) / 86_400_000);
}

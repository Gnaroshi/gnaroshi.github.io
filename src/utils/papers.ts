import { getCollection, type CollectionEntry } from "astro:content";
import type { PaperReviewSummary } from "./paperReviews";
import { isReviewDue } from "./reviewDue";
import { shouldBuildDetailPage, shouldShowInIndex } from "./visibility";
import type { Locale } from "../i18n/types";
import { getLocalePath } from "../i18n/utils";
import { getContentSlug } from "./localizedContent";
import { getActivityCalendar, type ActivityDay } from "./feedData";
import { getContentFeedRecordCount } from "./contentFeed";

export type PaperEntry = CollectionEntry<"papers">;

export type PaperStats = {
  total: number;
  activeDays: number;
  sessionsToday: number;
  papersTouchedToday: number;
  minutesToday: number;
  currentStreak: number;
  longestStreak: number;
  distinctPapersThisMonth: number;
  deepSessions: number;
  implementations: number;
  totalReadingMinutes: number;
};

export type PaperRecord = {
  id: string;
  href: string;
  title: string;
  authors: string[];
  venue: string;
  year: number;
  paperUrl?: string;
  codeUrl?: string;
  projectUrl?: string;
  readDate?: string;
  lastReviewed?: string;
  status: PaperEntry["data"]["status"];
  depth: PaperEntry["data"]["depth"];
  priority: PaperEntry["data"]["priority"];
  difficulty: number;
  readingTimeMinutes?: number;
  tags: string[];
  relatedTopics: string[];
  oneLineSummary?: string;
  coreQuestion?: string;
  coreIdea?: string;
  mainFormula?: string;
  formulaInterpretation?: string;
  experimentTakeaway?: string;
  strengths: string[];
  weaknesses: string[];
  myConnection?: string;
  nextAction?: string;
  futureMe?: {
    oneThingToRemember?: string;
    whyItMatters?: string;
    whenToUseThis?: string;
    whatToRevisit?: string;
    warning?: string;
  };
  futureMeExcerpt: string;
  reviewAfterDays?: number;
  featured: boolean;
  draft: boolean;
  review?: PaperReviewSummary;
  reviewDue: boolean;
};

type PaperActivityOptions = {
  includeDrafts?: boolean;
};

const ACTIVE_STATUSES = new Set(["pass1", "pass2", "pass3", "read", "implemented"]);
const DEEP_DEPTHS = new Set(["deep", "reproduce", "implement"]);

export async function getAllPapers(locale: Locale = "en"): Promise<PaperEntry[]> {
  if (getContentFeedRecordCount("papers") === 0) return [];
  const papers = await getCollection("papers");
  return sortPapersByReadDate(papers.filter((paper) => !getContentSlug(paper.id).startsWith("_") && paper.data.locale === locale));
}

export async function getPublishedPapers(locale: Locale = "en"): Promise<PaperEntry[]> {
  const papers = await getAllPapers(locale);
  return papers.filter((paper) => shouldShowInIndex(paper.data, { includeDrafts: !import.meta.env.PROD }));
}

export async function getBuildablePapers(locale: Locale = "en"): Promise<PaperEntry[]> {
  const papers = await getAllPapers(locale);
  return papers.filter((paper) =>
    shouldBuildDetailPage(paper.data, {
      includeDrafts: !import.meta.env.PROD,
      includeHidden: !import.meta.env.PROD
    })
  );
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

export function countPapersByDate(papers: PaperEntry[], options: PaperActivityOptions = {}): Map<string, number> {
  const counts = new Map<string, number>();

  for (const [date, papersOnDate] of groupPapersByDate(getActivePapers(papers, options))) {
    counts.set(date, papersOnDate.length);
  }

  return counts;
}

export function getActivityCountsByDate(activity = getActivityCalendar()): Map<string, number> {
  return new Map(activity.map((day) => [day.date, day.readingSessions]));
}

export function getPaperStats(papers: PaperEntry[], today = getTodayKey(), activity: ActivityDay[] = getActivityCalendar()): PaperStats {
  const counts = getActivityCountsByDate(activity);

  return {
    total: papers.length,
    activeDays: counts.size,
    sessionsToday: activity.find((day) => day.date === today)?.readingSessions ?? 0,
    papersTouchedToday: activity.find((day) => day.date === today)?.distinctPapersTouched ?? 0,
    minutesToday: activity.find((day) => day.date === today)?.readingMinutes ?? 0,
    currentStreak: getCurrentStreak(counts, today),
    longestStreak: getLongestStreak(counts),
    distinctPapersThisMonth: new Set(activity.filter((day) => day.date.startsWith(today.slice(0, 7))).flatMap((day) => day.paperIds)).size,
    deepSessions: activity.reduce((total, day) => total + day.deepSessions, 0),
    implementations: activity.reduce((total, day) => total + day.implementations, 0),
    totalReadingMinutes: activity.reduce((total, day) => total + day.readingMinutes, 0)
  };
}

export function getPapersToday(papers: PaperEntry[], today = getTodayKey()): PaperEntry[] {
  return getActivePapers(papers).filter((paper) => getPaperActivityDate(paper) === today);
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
  return papers.filter(
    (paper) => paper.data.status === "implemented" || paper.data.depth === "reproduce" || paper.data.depth === "implement"
  ).length;
}

export function normalizePaperTags(papers: PaperEntry[]): string[] {
  return [...new Set(papers.flatMap((paper) => paper.data.tags.map((tag) => tag.trim().toLowerCase())))]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}

export function getPaperActivityDate(paper: PaperEntry): string | undefined {
  return paper.data.readDate ? toDateKey(paper.data.readDate) : undefined;
}

export function getPaperLastReviewedDate(paper: PaperEntry): string | undefined {
  return paper.data.lastReviewed ? toDateKey(paper.data.lastReviewed) : undefined;
}

export function toPaperRecord(paper: PaperEntry, review?: PaperReviewSummary, today = getTodayKey()): PaperRecord {
  return {
    id: paper.data.canonicalSlug,
    href: getLocalePath(paper.data.locale, `/papers/${paper.data.canonicalSlug}/`),
    title: paper.data.title,
    authors: paper.data.authors,
    venue: paper.data.venue,
    year: paper.data.year,
    paperUrl: paper.data.paperUrl,
    codeUrl: paper.data.codeUrl,
    projectUrl: paper.data.projectUrl,
    readDate: getPaperActivityDate(paper),
    lastReviewed: getPaperLastReviewedDate(paper),
    status: paper.data.status,
    depth: paper.data.depth,
    priority: paper.data.priority,
    difficulty: paper.data.difficulty,
    readingTimeMinutes: paper.data.readingTimeMinutes,
    tags: paper.data.tags,
    relatedTopics: paper.data.relatedTopics,
    oneLineSummary: paper.data.oneLineSummary,
    coreQuestion: paper.data.coreQuestion,
    coreIdea: paper.data.coreIdea,
    mainFormula: paper.data.mainFormula,
    formulaInterpretation: paper.data.formulaInterpretation,
    experimentTakeaway: paper.data.experimentTakeaway,
    strengths: paper.data.strengths ?? [],
    weaknesses: paper.data.weaknesses ?? [],
    myConnection: paper.data.myConnection,
    nextAction: paper.data.nextAction,
    futureMe: paper.data.futureMe,
    futureMeExcerpt: getFutureMeExcerpt(paper),
    reviewAfterDays: paper.data.reviewAfterDays,
    featured: paper.data.featured,
    draft: paper.data.draft,
    review,
    reviewDue: isReviewDue(paper, today) || Boolean(review?.nextReviewDate && review.nextReviewDate <= today)
  };
}

export function isActivePaper(paper: PaperEntry, options: PaperActivityOptions = {}): boolean {
  return (options.includeDrafts || !paper.data.draft) && ACTIVE_STATUSES.has(paper.data.status) && Boolean(paper.data.readDate);
}

export function getActivePapers(papers: PaperEntry[], options: PaperActivityOptions = {}): PaperEntry[] {
  return papers.filter((paper) => isActivePaper(paper, options));
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

function getFutureMeExcerpt(paper: PaperEntry): string {
  const futureMe = paper.data.futureMe;
  if (!futureMe) return "";
  return (
    futureMe.oneThingToRemember ||
    futureMe.whyItMatters ||
    futureMe.whenToUseThis ||
    futureMe.whatToRevisit ||
    futureMe.warning ||
    ""
  );
}

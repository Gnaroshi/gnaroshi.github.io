#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, extname, join, relative } from "node:path";
import matter from "gray-matter";

const root = process.cwd();
const weeklyDir = join(root, "src", "generated", "weekly-reviews");
const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

try {
  const requestedWeek = args.week ? weekInfoFromId(args.week) : getIsoWeekInfo(new Date());
  const today = getTodayKey();
  if (requestedWeek.startDate > today) {
    throw new Error(`Cannot build future week ${requestedWeek.weekId}.`);
  }
  const week = {
    ...requestedWeek,
    endDate: requestedWeek.endDate > today ? today : requestedWeek.endDate
  };
  const review = buildWeeklyReview(week);
  writeWeeklyReview(review, args.force);
  console.log(`Weekly review ${review.weekId}: ${review.summary}`);
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
}

function parseArgs(values) {
  const parsed = { force: false, help: false, week: "" };

  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (value === "--help" || value === "-h") parsed.help = true;
    else if (value === "--force") parsed.force = true;
    else if (value === "--week") {
      parsed.week = values[index + 1] ?? "";
      index += 1;
    } else fail(`Unknown argument: ${value}`);
  }

  return parsed;
}

function printHelp() {
  console.log(`Build a static weekly research review JSON.

Usage:
  npm run week:build
  npm run week:build -- --week 2026-W28
  npm run week:build -- --force

Options:
  --week <YYYY-Www>  Build a specific ISO week.
  --force            Overwrite the generated weekly review when content changed.
  --help, -h         Show this help message.

The script reads public Markdown/MDX content and generated review JSON. It does not call an AI API.`);
}

function buildWeeklyReview(week) {
  const papers = loadContentItems("papers");
  const blogPosts = loadContentItems("blog");
  const implementations = loadContentItems("implementations");
  const publicPaperSlugs = new Set(papers.map((paper) => paper.slug));
  const paperReviews = loadGeneratedJson("paper-reviews").filter(
    (review) => (review.reviewVisibility ?? "public") === "public" && publicPaperSlugs.has(review.paperSlug)
  );
  const oralExams = loadGeneratedJson("oral-exams");
  const formulaRecalls = loadGeneratedJson("formula-recall");

  const papersThisWeek = papers.filter((paper) => isPaperActive(paper) && dateInWeek(paper.data.readDate, week));
  const deepReads = papersThisWeek.filter((paper) => ["deep", "reproduce", "implement"].includes(paper.data.depth)).length;
  const blogThisWeek = blogPosts.filter((post) => dateInWeek(post.data.pubDate, week));
  const implementationThisWeek = implementations.filter((attempt) => dateInWeek(attempt.data.date, week));
  const reviewsThisWeek = paperReviews.filter((review) => dateInWeek(review.reviewedAt, week));
  const oralExamsThisWeek = oralExams.filter((exam) => dateInWeek(getGeneratedDate(exam), week));
  const formulaRecallsThisWeek = formulaRecalls.filter((recall) => dateInWeek(getGeneratedDate(recall), week));

  const metrics = {
    papersRead: papersThisWeek.length,
    deepReads,
    aiReviews: reviewsThisWeek.length,
    oralExams: oralExamsThisWeek.length,
    formulaRecalls: formulaRecallsThisWeek.length,
    blogPosts: blogThisWeek.length,
    projectUpdates: implementationThisWeek.length,
    githubContributions: 0
  };
  const dimensions = [
    { key: "paper reading", value: metrics.papersRead + metrics.deepReads },
    { key: "writing", value: metrics.blogPosts },
    { key: "implementation", value: metrics.projectUpdates },
    { key: "review", value: metrics.aiReviews + metrics.oralExams + metrics.formulaRecalls }
  ];
  const strongestDimension = [...dimensions].sort((a, b) => b.value - a.value || a.key.localeCompare(b.key))[0]?.key ?? "paper reading";
  const weakestDimension = [...dimensions].sort((a, b) => a.value - b.value || a.key.localeCompare(b.key))[0]?.key ?? "implementation";
  const featuredItems = [
    ...blogThisWeek.map((post) => ({ type: "blog", slug: post.slug, title: post.data.title, href: `/blog/${post.slug}/` })),
    ...papersThisWeek.map((paper) => ({ type: "paper", slug: paper.slug, title: paper.data.title, href: `/papers/${paper.slug}/` })),
    ...implementationThisWeek.map((attempt) => ({
      type: "implementation",
      slug: attempt.slug,
      title: attempt.data.title,
      href: `/implementations/${attempt.slug}/`
    }))
  ].slice(0, 8);

  return {
    schemaVersion: "1.0.0",
    weekId: week.weekId,
    startDate: week.startDate,
    endDate: week.endDate,
    generatedAt: new Date().toISOString(),
    visibility: "public",
    summary: buildSummary(metrics),
    metrics,
    strongestDimension,
    weakestDimension,
    wins: buildWins({ papersThisWeek, blogThisWeek, implementationThisWeek }),
    openLoops: buildOpenLoops({ papersThisWeek, implementationThisWeek, weakestDimension }),
    nextWeekFocus: buildNextWeekFocus(weakestDimension),
    featuredItems
  };
}

function loadContentItems(collection) {
  const directory = join(root, "src", "content", collection);
  if (!existsSync(directory)) return [];

  return listMarkdownFiles(directory)
    .filter((filePath) => !basename(filePath).startsWith("_"))
    .map((filePath) => {
      const raw = readFileSync(filePath, "utf8");
      const parsed = matter(raw);
      return {
        slug: basename(filePath, extname(filePath)),
        relativePath: relative(root, filePath),
        data: parsed.data,
        body: parsed.content.trim()
      };
    })
    .filter((item) => item.data.draft !== true && (item.data.visibility ?? "public") === "public");
}

function loadGeneratedJson(directoryName) {
  const directory = join(root, "src", "generated", directoryName);
  if (!existsSync(directory)) return [];

  return listJsonFiles(directory)
    .map((filePath) => JSON.parse(readFileSync(filePath, "utf8")))
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .filter((value) => value && typeof value === "object" && (value.visibility ?? value.reviewVisibility ?? "public") === "public");
}

function listMarkdownFiles(directory) {
  const files = [];

  for (const entry of readdirSync(directory)) {
    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) files.push(...listMarkdownFiles(fullPath));
    else if (entry.endsWith(".md") || entry.endsWith(".mdx")) files.push(fullPath);
  }

  return files;
}

function listJsonFiles(directory) {
  const files = [];

  for (const entry of readdirSync(directory)) {
    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) files.push(...listJsonFiles(fullPath));
    else if (entry.endsWith(".json")) files.push(fullPath);
  }

  return files;
}

function isPaperActive(paper) {
  return Boolean(paper.data.readDate) && !["planned", "abandoned"].includes(paper.data.status);
}

function buildSummary(metrics) {
  const parts = [];
  if (metrics.papersRead > 0) parts.push(`${metrics.papersRead} paper${metrics.papersRead === 1 ? "" : "s"} read`);
  if (metrics.blogPosts > 0) parts.push(`${metrics.blogPosts} blog post${metrics.blogPosts === 1 ? "" : "s"} published`);
  if (metrics.projectUpdates > 0) parts.push(`${metrics.projectUpdates} implementation update${metrics.projectUpdates === 1 ? "" : "s"}`);
  if (metrics.aiReviews > 0) parts.push(`${metrics.aiReviews} AI review${metrics.aiReviews === 1 ? "" : "s"}`);
  return parts.length > 0 ? parts.join(", ") : "A quiet week with no public research outputs recorded yet.";
}

function buildWins({ papersThisWeek, blogThisWeek, implementationThisWeek }) {
  const wins = [
    ...blogThisWeek.map((post) => `Published: ${post.data.title}`),
    ...papersThisWeek.map((paper) => `Logged paper: ${paper.data.title}`),
    ...implementationThisWeek.map((attempt) => `Recorded implementation attempt: ${attempt.data.title}`)
  ];
  return wins.length > 0 ? wins.slice(0, 6) : ["Kept the weekly review loop available for the next recorded output."];
}

function buildOpenLoops({ papersThisWeek, implementationThisWeek, weakestDimension }) {
  const loops = [
    ...papersThisWeek.map((paper) => paper.data.nextAction).filter(Boolean),
    ...implementationThisWeek.map((attempt) => attempt.data.failureReason || attempt.data.result).filter(Boolean)
  ];
  if (loops.length > 0) return loops.slice(0, 6);
  return [`Strengthen the ${weakestDimension} loop with one concrete public note next week.`];
}

function buildNextWeekFocus(weakestDimension) {
  if (weakestDimension === "implementation") return "Turn one paper note into a small implementation attempt.";
  if (weakestDimension === "writing") return "Promote one structured note into a short public post.";
  if (weakestDimension === "review") return "Review one existing note and add retrieval questions.";
  return "Read one paper with a clear next action and connection to current research questions.";
}

function getGeneratedDate(value) {
  return value.date ?? value.createdAt ?? value.generatedAt ?? value.reviewedAt ?? value.scoredAt;
}

function dateInWeek(value, week) {
  const key = normalizeDateKey(value);
  return Boolean(key && key >= week.startDate && key <= week.endDate);
}

function normalizeDateKey(value) {
  if (!value) return undefined;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function getIsoWeekInfo(date) {
  const current = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = current.getUTCDay() || 7;
  const monday = addDays(current, 1 - day);
  const thursday = addDays(monday, 3);
  const weekYear = thursday.getUTCFullYear();
  const firstThursday = new Date(Date.UTC(weekYear, 0, 4));
  const firstDay = firstThursday.getUTCDay() || 7;
  const firstMonday = addDays(firstThursday, 1 - firstDay);
  const weekNumber = Math.floor((monday.getTime() - firstMonday.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;

  return {
    weekId: `${weekYear}-W${String(weekNumber).padStart(2, "0")}`,
    startDate: toDateKey(monday),
    endDate: toDateKey(addDays(monday, 6))
  };
}

function weekInfoFromId(weekId) {
  const match = /^(\d{4})-W(\d{2})$/.exec(weekId);
  if (!match) throw new Error("--week must use YYYY-Www format, for example 2026-W28.");

  const year = Number(match[1]);
  const week = Number(match[2]);
  if (week < 1 || week > 53) throw new Error("ISO week must be between 01 and 53.");

  const firstThursday = new Date(Date.UTC(year, 0, 4));
  const firstDay = firstThursday.getUTCDay() || 7;
  const firstMonday = addDays(firstThursday, 1 - firstDay);
  const monday = addDays(firstMonday, (week - 1) * 7);

  return {
    weekId,
    startDate: toDateKey(monday),
    endDate: toDateKey(addDays(monday, 6))
  };
}

function addDays(date, days) {
  const next = new Date(date);
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function toDateKey(date) {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0")
  ].join("-");
}

function getTodayKey(date = new Date()) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function writeWeeklyReview(review, force) {
  mkdirSync(weeklyDir, { recursive: true });
  const outputPath = join(weeklyDir, `${review.weekId}.json`);

  if (!existsSync(outputPath)) {
    writeFileSync(outputPath, `${JSON.stringify(review, null, 2)}\n`);
    console.log(`Created ${relative(root, outputPath)}`);
    return;
  }

  const current = JSON.parse(readFileSync(outputPath, "utf8"));
  const currentComparable = JSON.stringify({ ...current, generatedAt: "" });
  const nextComparable = JSON.stringify({ ...review, generatedAt: "" });

  if (currentComparable === nextComparable) {
    console.log(`${relative(root, outputPath)} is already up to date.`);
    return;
  }

  if (!force) {
    throw new Error(`${relative(root, outputPath)} already exists and content changed. Re-run with --force to overwrite.`);
  }

  writeFileSync(outputPath, `${JSON.stringify(review, null, 2)}\n`);
  console.log(`Updated ${relative(root, outputPath)}`);
}

function fail(message) {
  console.error(`week:build: ${message}`);
  console.error("Run npm run week:build -- --help for usage.");
  process.exit(1);
}

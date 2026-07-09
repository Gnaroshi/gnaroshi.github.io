import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, extname, join, relative } from "node:path";
import matter from "gray-matter";

export const PAPERS_DIR = join(process.cwd(), "src", "content", "papers");

export function loadPaperBySlug(slug) {
  const papers = loadAllPaperLogs();
  const paper = papers.find((item) => item.slug === slug);

  if (!paper) {
    throw new Error(`No paper log found for slug "${slug}" under src/content/papers/.`);
  }

  return paper;
}

export function loadAllPaperLogs() {
  if (!existsSync(PAPERS_DIR)) return [];

  return listPaperFiles(PAPERS_DIR)
    .filter((filePath) => !basename(filePath).startsWith("_"))
    .map(loadPaperFile)
    .sort((a, b) => {
      const aDate = normalizeDateValue(a.frontmatter.readDate) ?? "0000-00-00";
      const bDate = normalizeDateValue(b.frontmatter.readDate) ?? "0000-00-00";
      return bDate.localeCompare(aDate) || a.slug.localeCompare(b.slug);
    });
}

export function loadPaperFile(filePath) {
  const raw = readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  const slug = basename(filePath, extname(filePath));
  const frontmatter = normalizeFrontmatter(parsed.data);

  return {
    slug,
    filePath,
    relativePath: relative(process.cwd(), filePath),
    frontmatter,
    body: parsed.content.trim()
  };
}

export function getChangedPaperLogs() {
  const changedPaths = getChangedPaperPaths();
  return changedPaths
    .filter((filePath) => existsSync(filePath))
    .filter((filePath) => [".md", ".mdx"].includes(extname(filePath)))
    .filter((filePath) => !basename(filePath).startsWith("_"))
    .map(loadPaperFile);
}

export function getChangedPaperPaths() {
  const baseSha = process.env.BASE_SHA;
  let args;
  if (baseSha && !/^0+$/.test(baseSha)) {
    args = ["diff", "--name-only", "--diff-filter=ACMRTUXB", baseSha, "HEAD", "--", "src/content/papers"];
  } else if (process.env.GITHUB_ACTIONS) {
    args = ["diff", "--name-only", "--diff-filter=ACMRTUXB", "HEAD~1", "HEAD", "--", "src/content/papers"];
  } else {
    args = ["diff", "--name-only", "--diff-filter=ACMRTUXB", "HEAD", "--", "src/content/papers"];
  }

  const tracked = runGit(args);
  const staged = runGit(["diff", "--name-only", "--cached", "--diff-filter=ACMRTUXB", "--", "src/content/papers"]);
  const untracked = runGit(["ls-files", "--others", "--exclude-standard", "--", "src/content/papers"]);

  return [...new Set([...tracked, ...staged, ...untracked])]
    .filter((item) => item.endsWith(".md") || item.endsWith(".mdx"))
    .map((item) => join(process.cwd(), item));
}

export function isReviewablePaper(paper) {
  return paper.frontmatter.draft !== true;
}

export function getPaperReviewInput(paper) {
  return {
    slug: paper.slug,
    frontmatter: {
      ...paper.frontmatter,
      readDate: normalizeDateValue(paper.frontmatter.readDate),
      lastReviewed: normalizeDateValue(paper.frontmatter.lastReviewed)
    },
    body: paper.body
  };
}

function listPaperFiles(directory) {
  const entries = readdirSync(directory);
  const files = [];

  for (const entry of entries) {
    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      files.push(...listPaperFiles(fullPath));
    } else if (entry.endsWith(".md") || entry.endsWith(".mdx")) {
      files.push(fullPath);
    }
  }

  return files;
}

function normalizeFrontmatter(data) {
  return {
    ...data,
    readDate: normalizeDateValue(data.readDate),
    lastReviewed: normalizeDateValue(data.lastReviewed),
    abstract: data.abstract ?? "",
    sourceExcerpt: data.sourceExcerpt ?? "",
    selfScore: data.selfScore ?? undefined,
    selfReflection: data.selfReflection ?? "",
    reviewVisibility: data.reviewVisibility === "hidden" ? "hidden" : "public"
  };
}

function normalizeDateValue(value) {
  if (!value) return undefined;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function runGit(args) {
  try {
    const output = execFileSync("git", args, { cwd: process.cwd(), encoding: "utf8" });
    return output
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

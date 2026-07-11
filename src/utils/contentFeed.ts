import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

const projectRoot = process.cwd();
export const contentFeedRoot = resolve(process.env.CONTENT_FEED_PATH || join(projectRoot, ".content-feed"));

export type ContentFeedManifest = {
  schemaVersion: number;
  generatedAt?: string | null;
  contentHash?: string;
  state?: string;
  sourceCommits?: { paperLab: string; writing: string };
  sourceRepository?: string;
  sourceCommit?: string;
  counts?: Record<string, number>;
  entries?: Record<string, number>;
};

export type ContentFeedBuildInfo = {
  schemaVersion: number;
  contentFeedCommit: string | null;
  generatedAt: string | null;
  contentHash: string | null;
  state: string;
  counts: Record<string, number>;
  sourceCommits: Record<string, string>;
};

export type WebsiteBuildInfo = {
  schemaVersion: 1;
  websiteCommit: string | null;
  contentFeedCommit: string | null;
  builtAt: string;
  workflowRunId: string;
  workflowRunAttempt: string;
  environment: "local" | "ci" | "production";
  contentHash: string | null;
  feedSchemaVersion: number;
};

let manifestCache: ContentFeedManifest | undefined;

function safePath(path: string): string {
  const target = resolve(contentFeedRoot, path);
  if (target !== contentFeedRoot && !target.startsWith(`${contentFeedRoot}${sep}`)) {
    throw new Error(`Content feed path escapes root: ${path}`);
  }
  return target;
}

export function getContentFeedManifest(): ContentFeedManifest {
  if (!manifestCache) {
    manifestCache = JSON.parse(readFileSync(safePath("manifest.json"), "utf8")) as ContentFeedManifest;
  }
  return manifestCache;
}

export function readContentFeedJson<T>(path: string, fallback: T): T {
  const target = safePath(path);
  return existsSync(target) ? JSON.parse(readFileSync(target, "utf8")) as T : fallback;
}

export function getContentFeedRecordCount(kind: "papers" | "blog"): number | undefined {
  const manifest = getContentFeedManifest();
  return kind === "papers"
    ? manifest.counts?.papers ?? manifest.entries?.papers
    : manifest.counts?.blogPosts ?? manifest.entries?.blog;
}

export function getContentFeedCommit(): string | null {
  if (process.env.CONTENT_FEED_COMMIT) return process.env.CONTENT_FEED_COMMIT;
  try {
    return execFileSync("git", ["-C", contentFeedRoot, "rev-parse", "HEAD"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return null;
  }
}

function getGitCommit(directory: string): string | null {
  try {
    return execFileSync("git", ["-C", directory, "rev-parse", "HEAD"], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return null;
  }
}

export function getWebsiteBuildInfo(): WebsiteBuildInfo {
  const manifest = getContentFeedManifest();
  const environment = process.env.DEPLOYMENT_ENVIRONMENT;
  return {
    schemaVersion: 1,
    websiteCommit: process.env.WEBSITE_COMMIT ?? process.env.GITHUB_SHA ?? getGitCommit(projectRoot),
    contentFeedCommit: getContentFeedCommit(),
    builtAt: process.env.BUILD_TIMESTAMP ?? new Date().toISOString(),
    workflowRunId: process.env.GITHUB_RUN_ID ?? "local",
    workflowRunAttempt: process.env.GITHUB_RUN_ATTEMPT ?? "0",
    environment: environment === "production" || environment === "ci" ? environment : "local",
    contentHash: manifest.contentHash ?? null,
    feedSchemaVersion: manifest.schemaVersion
  };
}

export function getContentFeedBuildInfo(): ContentFeedBuildInfo {
  const manifest = getContentFeedManifest();
  const sourceCommits = manifest.sourceCommits ?? (
    manifest.sourceRepository && manifest.sourceCommit
      ? { [manifest.sourceRepository]: manifest.sourceCommit }
      : {}
  );
  return {
    schemaVersion: manifest.schemaVersion,
    contentFeedCommit: getContentFeedCommit(),
    generatedAt: manifest.generatedAt ?? null,
    contentHash: manifest.contentHash ?? null,
    state: manifest.state ?? "generated",
    counts: manifest.counts ?? manifest.entries ?? {},
    sourceCommits
  };
}

export function listContentFeedAssets(root = safePath("assets")): Array<{ path: string; absolutePath: string }> {
  if (!existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith(".")) return [];
    const absolutePath = join(root, entry.name);
    if (entry.isDirectory()) return listContentFeedAssets(absolutePath);
    if (!entry.isFile()) return [];
    return [{ path: relative(safePath("assets"), absolutePath).split(sep).join("/"), absolutePath }];
  });
}

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve, sep } from "node:path";

const projectRoot = process.cwd();
export const contentFeedRoot = resolve(process.env.CONTENT_FEED_PATH || join(projectRoot, ".content-feed"));

export type ContentFeedManifest = {
  schemaVersion: number;
  generatedAt: string | null;
  contentHash: string;
  state: "bootstrap-empty" | "generated" | "invalid";
  sourceCommits: { paperLab: string; writing: string };
  counts: Record<string, number>;
  metricEligible?: boolean;
  graphEligible?: boolean;
  weeklyReviewEligible?: boolean;
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
    ? manifest.counts.papers
    : manifest.counts.blogPosts;
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
  return {
    schemaVersion: manifest.schemaVersion,
    contentFeedCommit: getContentFeedCommit(),
    generatedAt: manifest.generatedAt,
    contentHash: manifest.contentHash,
    state: manifest.state,
    counts: manifest.counts,
    sourceCommits: manifest.sourceCommits
  };
}

export function listContentFeedAssets(): Array<{ path: string; absolutePath: string; mediaType: string }> {
  const declared = readContentFeedJson<Array<{ publicPath: string; mediaType: string }>>("assets/index.json", []);
  return declared.map((asset) => {
    if (!/^\/assets\/[a-f0-9]{64}\/[^/]+$/.test(asset.publicPath)) throw new Error(`Invalid declared asset path: ${asset.publicPath}`);
    const path = asset.publicPath.slice("/assets/".length);
    const absolutePath = safePath(asset.publicPath.slice(1));
    if (!existsSync(absolutePath)) throw new Error(`Declared asset is missing: ${asset.publicPath}`);
    return { path, absolutePath, mediaType: asset.mediaType };
  });
}

export type PublicAssetMetadata = {
  publicPath: string;
  mediaType: "image/avif" | "image/webp" | "image/png" | "image/jpeg" | "image/svg+xml";
  width: number;
  height: number;
  alt: string;
};

export function getPublicAssetMetadata(publicPath?: string): PublicAssetMetadata | undefined {
  if (!publicPath) return undefined;
  return readContentFeedJson<PublicAssetMetadata[]>("assets/index.json", []).find((asset) => asset.publicPath === publicPath);
}

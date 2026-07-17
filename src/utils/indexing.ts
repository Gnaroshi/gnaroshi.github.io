import { getContentFeedManifest, readContentFeedJson } from "./contentFeed";

export type RobotsDirective = "index, follow" | "noindex, follow";

const NOINDEX_PATHS = new Set(["/404", "/404.html", "/ko/404", "/ko/404/"]);

export function getDefaultRobots(pathname: string): RobotsDirective {
  const normalized = normalize(pathname);
  if (NOINDEX_PATHS.has(normalized) || normalized.startsWith("/dev-diagnostics/")) return "noindex, follow";

  const route = normalized.startsWith("/ko/") ? normalized.slice(3) || "/" : normalized;
  const root = `/${route.split("/").filter(Boolean)[0] ?? ""}`;
  const manifest = getContentFeedManifest();

  if (root === "/blog") return manifest.counts.blogPosts > 0 ? "index, follow" : "noindex, follow";
  if (root === "/papers") return manifest.counts.papers > 0 ? "index, follow" : "noindex, follow";
  if (root === "/contact") return "noindex, follow";
  if (root === "/growth") {
    const growth = readContentFeedJson<{ metricEligible?: boolean; score?: number | null } | null>("data/growth-snapshot.json", null);
    return growth?.metricEligible && typeof growth.score === "number" ? "index, follow" : "noindex, follow";
  }
  if (root === "/queue") return hasArrayEntries("data/queue/index.json") ? "index, follow" : "noindex, follow";
  if (root === "/reviews") return hasArrayEntries("data/reviews/index.json") ? "index, follow" : "noindex, follow";
  if (root === "/formula") return hasArrayEntries("data/formula-recall/index.json") ? "index, follow" : "noindex, follow";
  if (root === "/questions") return hasArrayEntries("data/question-bank/index.json") ? "index, follow" : "noindex, follow";
  if (root === "/implementations") return hasArrayEntries("data/implementations/index.json") ? "index, follow" : "noindex, follow";
  if (root === "/week") return hasArrayEntries("data/weekly-reviews/index.json") ? "index, follow" : "noindex, follow";
  if (root === "/graph") {
    const graph = readContentFeedJson<{ graphEligible?: boolean; nodes?: unknown[] } | null>("data/research-graph.json", null);
    return graph?.graphEligible && (graph.nodes?.length ?? 0) > 0 ? "index, follow" : "noindex, follow";
  }

  return "index, follow";
}

function hasArrayEntries(path: string): boolean {
  const value = readContentFeedJson<unknown[] | Record<string, unknown>>(path, []);
  if (Array.isArray(value)) return value.length > 0;
  return Object.values(value).some((entry) => Array.isArray(entry) && entry.length > 0);
}

function normalize(pathname: string): string {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/$/, "");
}

#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");
if (!existsSync(dist)) {
  console.error("dist/ does not exist. Run npm run build first.");
  process.exit(1);
}

const warnings = [];
const primaryRoutes = ["/", "/research", "/projects", "/blog", "/papers", "/about"];
const emptyTools = [
  ["/papers", "One useful note is enough to begin"],
  ["/queue", "No papers are waiting"],
  ["/reviews", "Nothing is scheduled yet"],
  ["/formula", "No saved formula to reconstruct"],
  ["/questions", "No retrieval questions yet"],
  ["/implementations", "No public implementation attempt yet"],
  ["/graph", "The research graph is not ready yet"]
];

for (const route of primaryRoutes) {
  const html = readRoute(route);
  if (!/<h1(?:\s|>)/i.test(html)) warnings.push(`${route}: missing h1`);
  const visibleText = html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&\w+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (visibleText.split(" ").length < 45) warnings.push(`${route}: primary page has very little public content`);
}

for (const [route, marker] of emptyTools) {
  const html = readRoute(route);
  if (!html.includes(marker)) continue;
  const islands = (html.match(/<astro-island\b/g) ?? []).length;
  if (islands > 0) warnings.push(`${route}: empty state hydrates ${islands} React island(s)`);
  const zeroStats = (html.match(/<strong>0(?:%|<)/g) ?? []).length;
  if (zeroStats > 1) warnings.push(`${route}: empty state exposes ${zeroStats} zero-value stats`);
}

if (warnings.length > 0) {
  console.warn("Empty-shell check warnings:");
  for (const warning of warnings) console.warn(`- ${warning}`);
} else {
  console.log(`Empty-shell check passed (${primaryRoutes.length} primary routes, ${emptyTools.length} application routes).`);
}

function readRoute(route) {
  const file = route === "/" ? join(dist, "index.html") : join(dist, route.slice(1), "index.html");
  if (!existsSync(file)) {
    console.error(`${route}: built route is missing`);
    process.exit(1);
  }
  return readFileSync(file, "utf8");
}

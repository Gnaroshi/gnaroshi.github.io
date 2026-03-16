import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { SSG_ROUTE_PATHS } from "../src/routes/routeDefinitions.js";

const ROOT_DIR = process.cwd();
const DIST_DIR = path.resolve(ROOT_DIR, "dist");
const SERVER_DIR = path.resolve(DIST_DIR, "server");
const SERVER_ENTRY = path.resolve(SERVER_DIR, "entry-server.js");
const ROOT_HTML_FILE = path.resolve(DIST_DIR, "index.html");

const ROOT_CONTAINER_PATTERN = /<div id="root">[\s\S]*?<\/div>/;

const toOutputFile = (routePath) => {
  if (routePath === "/") {
    return ROOT_HTML_FILE;
  }

  const routeDir = routePath.replace(/^\/+/, "");
  return path.resolve(DIST_DIR, routeDir, "index.html");
};

async function prerender() {
  const template = await readFile(ROOT_HTML_FILE, "utf-8");
  if (!ROOT_CONTAINER_PATTERN.test(template)) {
    throw new Error("Unable to find #root mount point in dist/index.html");
  }

  const serverModule = await import(pathToFileURL(SERVER_ENTRY).href);
  if (typeof serverModule.render !== "function") {
    throw new Error("entry-server.js must export a render(url) function");
  }

  const renderedRoutes = [];

  for (const routePath of SSG_ROUTE_PATHS) {
    const appHtml = serverModule.render(routePath);
    const html = template.replace(ROOT_CONTAINER_PATTERN, `<div id="root">${appHtml}</div>`);
    const outputFile = toOutputFile(routePath);

    await mkdir(path.dirname(outputFile), { recursive: true });
    await writeFile(outputFile, html, "utf-8");
    renderedRoutes.push(routePath);
  }

  await rm(SERVER_DIR, { recursive: true, force: true });
  console.log(`Prerendered ${renderedRoutes.length} routes: ${renderedRoutes.join(", ")}`);
}

prerender().catch((error) => {
  console.error(error);
  process.exit(1);
});

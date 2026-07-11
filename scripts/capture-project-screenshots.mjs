import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "@playwright/test";

const baseUrl = process.env.MEDIA_REVIEW_BASE_URL ?? "http://127.0.0.1:4330";
const output = resolve("media-sources/evidence/gnaroshi-dev");
await mkdir(output, { recursive: true });

const browser = await chromium.launch();
try {
  for (const capture of [
    { path: "/", file: "home-desktop.png", viewport: { width: 1440, height: 1000 } },
    { path: "/ko/", file: "home-ko-mobile.png", viewport: { width: 390, height: 844 } }
  ]) {
    const context = await browser.newContext({ viewport: capture.viewport, deviceScaleFactor: 2, colorScheme: "light" });
    const page = await context.newPage();
    await page.goto(new URL(capture.path, baseUrl).toString(), { waitUntil: "networkidle" });
    await page.screenshot({ path: resolve(output, capture.file), animations: "disabled" });
    await context.close();
  }

  const response = await fetch(new URL("/build-info.json", baseUrl));
  if (!response.ok) throw new Error(`build-info.json returned ${response.status}`);
  const info = await response.json();
  const safeInfo = {
    schemaVersion: info.schemaVersion,
    environment: info.environment,
    websiteCommit: info.websiteCommit,
    contentFeed: {
      commit: info.contentFeedCommit,
      schemaVersion: info.feedSchemaVersion,
      contentHash: info.contentHash
    }
  };
  await writeFile(resolve(output, "build-info.json"), `${JSON.stringify(safeInfo, null, 2)}\n`);
} finally {
  await browser.close();
}

console.log(`[media:capture] saved Retina screenshots from ${baseUrl}`);

#!/usr/bin/env node
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";

const root = process.cwd();
const variants = [
  ["public/og/default.svg", "public/og/default-en.png"],
  ["public/og/default-ko.svg", "public/og/default-ko.png"]
];

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  for (const [source, target] of variants) {
    await page.goto(pathToFileURL(resolve(root, source)).toString());
    await page.screenshot({ path: resolve(root, target), type: "png", animations: "disabled" });
  }
} finally {
  await browser.close();
}

console.log("Rendered 1200x630 social preview images.");

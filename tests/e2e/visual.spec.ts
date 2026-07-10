import { mkdir } from "node:fs/promises";
import path from "node:path";
import { test } from "@playwright/test";

const routes = [
  "/",
  "/about",
  "/research",
  "/projects",
  "/blog",
  "/papers",
  "/growth",
  "/now",
  "/contact",
  "/queue",
  "/reviews",
  "/formula",
  "/questions",
  "/implementations",
  "/graph",
  "/week",
  "/404.html"
];

const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet", width: 1024, height: 768 },
  { name: "mobile", width: 390, height: 844 }
] as const;

for (const viewport of viewports) {
  for (const theme of ["light", "dark"] as const) {
    test(`@visual ${theme} ${viewport.name} route audit`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.addInitScript((selectedTheme) => localStorage.setItem("theme", selectedTheme), theme);
      const visualSet = process.env.VISUAL_SET ?? "final";
      const directory = path.join("artifacts", "design-audit-v2", visualSet, `${viewport.name}-${theme}`);
      await mkdir(directory, { recursive: true });

      for (const route of routes) {
        await page.goto(route);
        await page.waitForLoadState("networkidle");
        const filename = route === "/" ? "home" : route.replace(/^\//, "").replaceAll("/", "-").replace(/\.html$/, "");
        await page.screenshot({ path: path.join(directory, `${filename}.png`), fullPage: true });
      }
    });
  }
}

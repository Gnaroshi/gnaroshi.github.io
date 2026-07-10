import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { test } from "@playwright/test";
import { qaRoutes, qaViewports } from "./qa-routes";

const visualSet = process.env.VISUAL_SET ?? "final";
const visualRoot = path.join("artifacts", "design-audit-v2", visualSet);

test.beforeAll(async () => {
  await rm(visualRoot, { recursive: true, force: true });
  await mkdir(visualRoot, { recursive: true });
});

for (const viewport of qaViewports) {
  for (const theme of ["light", "dark"] as const) {
    test(`@visual ${theme} ${viewport.name} route audit`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.addInitScript((selectedTheme) => localStorage.setItem("theme", selectedTheme), theme);
      const directory = path.join(visualRoot, `${viewport.name}-${theme}`);
      await rm(directory, { recursive: true, force: true });
      await mkdir(directory, { recursive: true });

      for (const route of qaRoutes) {
        await page.goto(route);
        await page.waitForLoadState("networkidle");
        const filename = route === "/" ? "en-home" : route === "/ko/" ? "ko-home" : route.replace(/^\//, "").replaceAll("/", "-");
        await page.screenshot({ path: path.join(directory, `${filename}.png`), fullPage: true });
      }
    });
  }
}

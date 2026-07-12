import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { expect, test } from "@playwright/test";

const viewports = [
  { name: "desktop-1440", width: 1440, height: 1000 },
  { name: "tablet-1024", width: 1024, height: 768 },
  { name: "mobile-360", width: 360, height: 800 }
] as const;

const routes = [
  { name: "en-home", route: "/", variant: "compact" },
  { name: "ko-home", route: "/ko/", variant: "compact" },
  { name: "en-project", route: "/projects/gnaroshi-dev/", variant: "full" },
  { name: "ko-project", route: "/ko/projects/gnaroshi-dev/", variant: "full" }
] as const;

const outputRoot = path.join("artifacts", "public-system-workflow");

test.describe("system workflow visual review", { tag: "@visual-v3" }, () => {
  test.beforeAll(async () => {
    await rm(outputRoot, { recursive: true, force: true });
    await mkdir(outputRoot, { recursive: true });
  });

  for (const viewport of viewports) {
    for (const theme of ["light", "dark"] as const) {
      test(`${viewport.name} ${theme} workflow screenshots`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.addInitScript((selectedTheme) => localStorage.setItem("theme", selectedTheme), theme);
        const directory = path.join(outputRoot, `${viewport.name}-${theme}`);
        await mkdir(directory, { recursive: true });

        for (const item of routes) {
          await page.goto(item.route);
          await page.addStyleTag({ content: ".site-header { position: static !important; } .skip-link { display: none !important; }" });
          const workflow = page.locator(`[data-system-workflow="${item.variant}"]`);
          await expect(workflow).toBeVisible();
          await workflow.screenshot({ path: path.join(directory, `${item.name}.png`) });
          expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), item.route).toBeLessThanOrEqual(1);
        }
      });
    }
  }
});

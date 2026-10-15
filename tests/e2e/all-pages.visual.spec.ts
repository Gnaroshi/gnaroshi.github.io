import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { expect, test } from "@playwright/test";
import { qaRoutes, qaViewports } from "./qa-routes";

const outputRoot = path.join("artifacts", "public-page-checklist");
const routeName = (route: string) => route === "/" ? "en-home" : route === "/ko/" ? "ko-home" : route.replace(/^\//, "").replaceAll("/", "-").replace(/-$/, "");

test.describe("all public page visual checklist", { tag: "@visual-v3" }, () => {
  test.describe.configure({ timeout: 60_000 });
  test.beforeAll(async () => {
    await rm(outputRoot, { recursive: true, force: true });
    await mkdir(outputRoot, { recursive: true });
  });

  for (const viewport of qaViewports) {
    for (const theme of ["light", "dark"] as const) {
      test(`${viewport.name} ${theme} all-route capture`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.addInitScript((selectedTheme) => localStorage.setItem("theme", selectedTheme), theme);
        const directory = path.join(outputRoot, `${viewport.name}-${theme}`);
        await mkdir(directory, { recursive: true });
        const report = [];

        for (const route of qaRoutes) {
          await page.goto(route);
          // Empty Reading is an intentional document redirect, not a renderable page.
          if(/^\/(?:ko\/)?papers\/?$/.test(route))await page.waitForLoadState("networkidle");
          await page.evaluate(async () => {
            window.scrollTo({top:0,behavior:"instant"});
            await document.fonts.ready;
            const visible=[...document.images].filter(image=>{
              if(image.closest('[inert],[hidden],[aria-hidden="true"],dialog:not([open])'))return false;
              const box=image.getBoundingClientRect();
              return box.width>0&&box.height>0&&box.top<innerHeight&&box.bottom>0;
            });
            await Promise.all(visible.map(image=>image.decode().catch(()=>undefined)));
            await new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));
          });
          const metrics = await page.evaluate(() => ({
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
            images: document.querySelectorAll("main img").length,
            h1: document.querySelectorAll("main h1").length
          }));
          expect(metrics.overflow, route).toBeLessThanOrEqual(1);
          expect(metrics.h1, route).toBe(1);
          report.push({ route, ...metrics });
          await page.screenshot({ path: path.join(directory, `${routeName(route)}.png`), fullPage: false, animations: "disabled" });
        }

        await writeFile(path.join(directory, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
      });
    }
  }
});

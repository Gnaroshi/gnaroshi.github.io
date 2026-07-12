import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { expect, test } from "@playwright/test";

const slugs = ["gnaroshi-vla", "gnaroshi-dev", "gnaroshi-studio", "paperflow", "arxiv-discovery", "runshelf", "tr-gpu-monitor", "contentdeck"] as const;
const routes = ["/projects/", ...slugs.map((slug) => `/projects/${slug}/`), "/ko/projects/", ...slugs.map((slug) => `/ko/projects/${slug}/`)];
const viewports = [
  { name:"desktop-1440",width:1440,height:1000 }, { name:"tablet-1024",width:1024,height:768 }, { name:"tablet-768",width:768,height:1024 },
  { name:"mobile-430",width:430,height:932 }, { name:"mobile-390",width:390,height:844 }, { name:"mobile-360",width:360,height:800 }
] as const;
const outputRoot = path.join("artifacts","project-stories");
const nameFor = (route: string) => route.replace(/^\//,"").replaceAll("/","-").replace(/-$/,"");

test.describe("project story visual matrix", { tag:"@visual-v3" }, () => {
  test.describe.configure({ timeout:120_000 });
  test.beforeAll(async () => { await rm(outputRoot,{recursive:true,force:true}); await mkdir(outputRoot,{recursive:true}); });
  for (const viewport of viewports) for (const theme of ["light","dark"] as const) {
    test(`${viewport.name} ${theme} full project stories`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.addInitScript((value) => localStorage.setItem("theme",value),theme);
      const directory = path.join(outputRoot,`${viewport.name}-${theme}`);
      await mkdir(directory,{recursive:true});
      for (const route of routes) {
        await page.goto(route);
        await page.evaluate(async () => {
          document.documentElement.style.scrollBehavior="auto";
          for (let top=0;top<document.documentElement.scrollHeight;top+=window.innerHeight) { window.scrollTo(0,top); await new Promise((resolve) => setTimeout(resolve,20)); }
          await Promise.all([...document.images].map((image) => image.decode().catch(() => undefined)));
          window.scrollTo(0,0);
        });
        expect(await page.evaluate(() => document.documentElement.scrollWidth-document.documentElement.clientWidth),route).toBeLessThanOrEqual(1);
        await page.screenshot({path:path.join(directory,`${nameFor(route)}.png`),fullPage:true});
      }
    });
  }
});

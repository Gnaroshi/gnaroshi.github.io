import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/research/",
  "/projects/",
  "/blog/",
  "/papers/",
  "/growth/",
  "/about/",
  "/ko/",
  "/ko/research/",
  "/ko/projects/",
  "/ko/blog/",
  "/ko/papers/",
  "/ko/growth/",
  "/ko/about/"
] as const;

const viewports = [
  { name: "desktop-1440", width: 1440, height: 1000 },
  { name: "desktop-1280", width: 1280, height: 900 },
  { name: "tablet-1024", width: 1024, height: 768 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "mobile-430", width: 430, height: 932 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-360", width: 360, height: 800 }
] as const;

const visualSet = process.env.VISUAL_SET ?? "final";
const visualRoot = path.join("artifacts", "visual-audit-v3", visualSet);

const filenameFor = (route: string) => route === "/"
  ? "en-home"
  : route === "/ko/"
    ? "ko-home"
    : route.replace(/^\//, "").replaceAll("/", "-").replace(/-$/, "");

test.describe("visual system v3", { tag: "@visual-v3" }, () => {
test.beforeAll(async () => {
  await rm(visualRoot, { recursive: true, force: true });
  await mkdir(visualRoot, { recursive: true });
});

for (const viewport of viewports) {
  for (const theme of ["light", "dark"] as const) {
    test(`@visual-v3 ${theme} ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.addInitScript((selectedTheme) => localStorage.setItem("theme", selectedTheme), theme);
      const directory = path.join(visualRoot, `${viewport.name}-${theme}`);
      await mkdir(directory, { recursive: true });
      const measurements = [];

      for (const route of routes) {
        await page.goto(route);
        await page.waitForLoadState("networkidle");
        await page.evaluate(async () => {
          document.documentElement.style.scrollBehavior = "auto";
          for (let top = 0; top < document.documentElement.scrollHeight; top += window.innerHeight) {
            window.scrollTo(0, top);
            await new Promise((resolve) => setTimeout(resolve, 30));
          }
          await Promise.all([...document.images].map((image) => image.complete ? image.decode().catch(() => undefined) : new Promise<void>((resolve) => {
            image.addEventListener("load", () => resolve(), { once: true });
            image.addEventListener("error", () => resolve(), { once: true });
          })));
          window.scrollTo(0, 0);
          await new Promise((resolve) => setTimeout(resolve, 60));
        });
        const pageMeasurements = await page.evaluate(() => {
          const header = document.querySelector<HTMLElement>(".site-header");
          const main = document.querySelector<HTMLElement>("main");
          const title = document.querySelector<HTMLElement>("main h1");
          const headerRect = header?.getBoundingClientRect();
          const mainRect = main?.getBoundingClientRect();
          const titleRect = title?.getBoundingClientRect();
          return {
            titleStartY: titleRect ? Math.round(titleRect.top) : null,
            titleStartX: titleRect ? Math.round(titleRect.left) : null,
            mainStartX: mainRect ? Math.round(mainRect.left) : null,
            mainWidth: mainRect ? Math.round(mainRect.width) : null,
            headerHeight: headerRect ? Math.round(headerRect.height) : null,
            horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
          };
        });
        measurements.push({ route, ...pageMeasurements });
        expect(pageMeasurements.horizontalOverflow, route).toBeLessThanOrEqual(1);
        await page.screenshot({
          path: path.join(directory, `${filenameFor(route)}.png`),
          fullPage: false
        });
      }

      await writeFile(
        path.join(directory, "measurements.json"),
        `${JSON.stringify(measurements, null, 2)}\n`
      );
    });
  }
}

test("theme SVG is optically centered in both themes", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const theme of ["light", "dark"] as const) {
    await page.addInitScript((selectedTheme) => localStorage.setItem("theme", selectedTheme), theme);
    await page.goto("/");
    const button = page.locator(".theme-toggle");
    const icon = button.locator(theme === "light" ? ".theme-toggle__icon--moon svg" : ".theme-toggle__icon--sun svg");
    const [buttonBox, iconBox] = await Promise.all([button.boundingBox(), icon.boundingBox()]);
    expect(buttonBox).not.toBeNull();
    expect(iconBox).not.toBeNull();
    const buttonCenter = { x: buttonBox!.x + buttonBox!.width / 2, y: buttonBox!.y + buttonBox!.height / 2 };
    const iconCenter = { x: iconBox!.x + iconBox!.width / 2, y: iconBox!.y + iconBox!.height / 2 };
    expect(Math.abs(buttonCenter.x - iconCenter.x)).toBeLessThanOrEqual(1);
    expect(Math.abs(buttonCenter.y - iconCenter.y)).toBeLessThanOrEqual(1);
  }
});

test("page title starts align within each shell", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const routesInShell of [["/research/", "/projects/", "/blog/", "/about/"], ["/papers/", "/growth/"]]) {
    const starts = [];
    for (const route of routesInShell) {
      await page.goto(route);
      starts.push(Math.round((await page.locator("main h1").boundingBox())!.y));
    }
    expect(Math.max(...starts) - Math.min(...starts)).toBeLessThanOrEqual(4);
  }
});

test("header switches before navigation can wrap", async ({ page }) => {
  for (const width of [1440, 1280, 1024]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    const nav = page.locator(".desktop-nav");
    await expect(nav).toBeVisible();
    const linkTops = await nav.locator("a").evaluateAll((links) => [...new Set(links.map((link) => Math.round(link.getBoundingClientRect().top)))]);
    expect(linkTops).toHaveLength(1);
    expect(Math.round((await page.locator(".site-header").boundingBox())!.height)).toBe(width >= 1024 ? 68 : 64);
  }
  for (const width of [768, 480, 360]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    await expect(page.locator(".desktop-nav")).toBeHidden();
    await expect(page.locator("[data-mobile-nav-trigger]")).toBeVisible();
  }
});

test("approved Hero and evidence media stay measurable", async ({ page }) => {
  for (const locale of ["/", "/ko/"]) {
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
      await page.setViewportSize(viewport);
      await page.goto(locale);
      const copy = await page.locator(".identity-hero__copy").boundingBox();
      expect(copy).not.toBeNull();
      await expect(page.locator(".identity-hero__media picture img")).toBeVisible();
      expect(copy!.x + copy!.width).toBeLessThanOrEqual(viewport.width);
      const writingAvailable = await page.locator('.desktop-nav [data-nav-href$="/blog"]').count();
      await expect(page.locator(".identity-hero__actions .button")).toHaveCount(1 + writingAvailable);
      await expect(page.locator('.identity-hero__actions a[href$="/research/"]')).toHaveCount(1);
      await expect(page.locator('.identity-hero__actions a[href$="/blog/"]')).toHaveCount(writingAvailable);
      const images = page.locator("main img");
      for (let index = 0; index < await images.count(); index += 1) {
        const image = images.nth(index);
        await expect(image).toHaveAttribute("alt", /.+/);
        const dimensions = await image.evaluate((element: HTMLImageElement) => ({ width: element.naturalWidth, height: element.naturalHeight }));
        expect(dimensions.width).toBeGreaterThan(0);
        expect(dimensions.height).toBeGreaterThan(0);
      }
    }
  }
});
});

import { existsSync } from "node:fs";
import { resolve } from "node:path";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const publicFeed = resolve(process.env.CONTENT_FEED_PATH ?? ".content-feed");
const hasPhiZero = existsSync(resolve(publicFeed, "blog/ko/phizero-physical-language.mdx"));
const route = "/ko/blog/phizero-physical-language/";

test.describe("published article reading surface", () => {
  test.skip(!hasPhiZero, "Requires the selected public feed containing the PhiZero article.");

  for (const viewport of [
    { name: "mobile", width: 390, height: 844 },
    { name: "tablet", width: 980, height: 680 },
    { name: "desktop", width: 1440, height: 1000 },
    { name: "wide", width: 2155, height: 1111 }
  ]) {
    for (const theme of ["light", "dark"]) {
      test(`${viewport.name} ${theme} prioritizes the article without redundant chrome`, async ({ page }) => {
        await page.setViewportSize(viewport);
        await page.addInitScript((value) => localStorage.setItem("theme", value), theme);
        const response = await page.goto(route);
        expect(response?.status()).toBe(200);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        const article = page.locator("article.blog-post");
        await expect(article.locator("h1")).toHaveCount(1);
        await expect(article.locator(".eyebrow, .content-language-badge")).toHaveCount(0);
        await expect(article).not.toContainText(/읽는 데\s*\d+분|\d+ min read|한국어 콘텐츠|영어 번역 없음/);
        await expect(article.locator(".blog-meta time").first()).toBeVisible();
        await expect(article.locator(".prose")).toContainText("개인적인 정리와 해석");
        await expect(article.locator(".prose").getByRole("link", { name: "논문 원문", exact: true })).toBeVisible();
        await expect(article.locator(".breadcrumbs").getByRole("link", { name: "Home", exact: true })).toHaveAttribute("href", "/ko/");
        await expect(article.locator(".breadcrumbs").getByRole("link", { name: "Writing", exact: true })).toHaveAttribute("href", "/ko/blog/");
        await expect(article.locator(".post-nav")).toHaveCount(0);

        const prose = await article.locator(".prose").boundingBox();
        const heading = await article.locator("h1").boundingBox();
        const toc = article.locator("[data-article-toc]");
        expect(prose).not.toBeNull();
        expect(heading).not.toBeNull();
        expect(Math.abs(prose!.width - heading!.width)).toBeLessThanOrEqual(1);
        expect(await article.locator(".prose").evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize))).toBeGreaterThanOrEqual(18);
        if (viewport.width >= 1280) {
          expect(prose!.width).toBeGreaterThanOrEqual(840);
          expect(prose!.width).toBeLessThanOrEqual(920);
          await expect(toc).toHaveAttribute("open", "");
          const tocBounds = (await toc.boundingBox())!;
          expect(tocBounds.x).toBeGreaterThan(prose!.x + prose!.width);
          expect(Math.abs(tocBounds.y - prose!.y)).toBeLessThanOrEqual(1);
        } else {
          await expect(toc).not.toHaveAttribute("open");
          expect((await toc.boundingBox())!.height).toBeLessThan(72);
          expect(prose!.width).toBeGreaterThanOrEqual(Math.min(840, viewport.width - 48));
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
      });
    }
  }

  test("contents keyboard navigation preserves focus, history, and sticky offset", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route);
    const toc = page.locator("[data-article-toc]");
    const summary = toc.locator("summary");
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(toc).toHaveAttribute("open", "");
    await page.keyboard.press("Escape");
    await expect(toc).not.toHaveAttribute("open");
    await expect(summary).toBeFocused();
    await page.keyboard.press("Enter");
    const link = toc.locator("a[data-in-page-link]").nth(2);
    const hash = (await link.getAttribute("href"))!;
    const title = (await link.textContent())!.trim();
    await link.focus();
    await page.keyboard.press("Enter");
    await expect(toc).not.toHaveAttribute("open");
    await expect.poll(() => page.evaluate(() => decodeURIComponent(window.location.hash))).toBe(hash);
    const target = page.locator(`[id="${hash.slice(1)}"]`);
    await expect(target).toBeFocused();
    await expect(toc.locator("[aria-current=location]")).toHaveCount(1);
    await expect(toc.locator("[data-in-page-current]")).toHaveText(title);
    const headerBottom = (await page.locator(".site-header").boundingBox())!.height;
    expect((await target.boundingBox())!.y).toBeGreaterThanOrEqual(headerBottom);
    await page.goBack();
    await expect(page).toHaveURL(new RegExp(`${route}$`));
    await page.goForward();
    await expect(target).toBeFocused();
    await page.reload();
    await expect(target).toBeFocused();
  });

  test("article reading surface has no automatically detectable accessibility violations", { tag: "@a11y" }, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test("contents follows scrolling after a clicked heading retains focus", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 700 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route);
    const toc = page.locator("[data-article-toc]");
    const links = toc.locator("a[data-in-page-link]");
    await links.first().click();
    await expect(links.first()).toHaveAttribute("aria-current", "location");
    const firstHash = (await links.first().getAttribute("href"))!;
    await expect(page.locator(`[id="${firstHash.slice(1)}"]`)).toBeFocused();
    await page.mouse.move(600, 500);
    await page.mouse.wheel(0, 1600);
    await expect(links.last()).toHaveAttribute("aria-current", "location");
    await expect(links.first()).not.toHaveAttribute("aria-current");
    await expect(toc.locator("[aria-current=location]")).toHaveCount(1);
    await expect(toc.locator("[data-in-page-current]")).toHaveText((await links.last().textContent())!.trim());
  });
});

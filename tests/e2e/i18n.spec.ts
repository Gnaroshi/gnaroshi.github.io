import { expect, test } from "@playwright/test";

test("English remains the unprefixed default and Korean uses /ko", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("link", { name: "한국어" }).first()).toHaveAttribute("href", "/ko/");

  await page.goto("/ko/");
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  await expect(page.getByRole("link", { name: "EN" }).first()).toHaveAttribute("href", "/");
  await expect(page.getByRole("navigation", { name: "주요 메뉴" })).toBeVisible();
});

test("language switch preserves an equivalent static route", async ({ page }) => {
  await page.goto("/research/?view=current");
  await expect(page.getByRole("link", { name: "한국어" }).first()).toHaveAttribute("href", "/ko/research/?view=current");
  await page.goto("/ko/research/");
  await expect(page.getByRole("link", { name: "EN" }).first()).toHaveAttribute("href", "/research/");
});

test("blog translations are paired without changing English slugs", async ({ page }) => {
  await page.goto("/blog/paper-reading-method/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("link", { name: "한국어" }).first()).toHaveAttribute("href", "/ko/blog/paper-reading-method/");

  await page.goto("/ko/blog/paper-reading-method/");
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  await expect(page.getByRole("link", { name: "EN" }).first()).toHaveAttribute("href", "/blog/paper-reading-method/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("논문");
});

test("localized SEO, date formatting, RSS, and sitemap are emitted", async ({ page, request }) => {
  await page.goto("/ko/blog/first-post/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://gnaroshi.dev/ko/blog/first-post/");
  await expect(page.locator('link[hreflang="en"]')).toHaveAttribute("href", "https://gnaroshi.dev/blog/first-post/");
  await expect(page.locator('link[hreflang="ko"]')).toHaveAttribute("href", "https://gnaroshi.dev/ko/blog/first-post/");
  await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute("href", "https://gnaroshi.dev/blog/first-post/");
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "ko_KR");
  await expect(page.locator("time").first()).toContainText(/2026년/);

  expect((await request.get("/rss.xml")).ok()).toBeTruthy();
  expect((await request.get("/ko/rss.xml")).ok()).toBeTruthy();
  const sitemap = await (await request.get("/sitemap-0.xml")).text();
  expect(sitemap).toContain("https://gnaroshi.dev/ko/");
});

test("Korean Paper Lab renders translated shell and controls", async ({ page }) => {
  await page.goto("/ko/papers/");
  await expect(page.getByRole("navigation", { name: "논문 연구실 메뉴" })).toBeVisible();
  await expect(page.getByText("3단계 읽기", { exact: true })).toBeVisible();
  await expect(page.getByText("Paper Reading Queue", { exact: true })).toHaveCount(0);
});

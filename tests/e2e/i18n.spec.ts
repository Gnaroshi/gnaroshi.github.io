import { expect, test } from "@playwright/test";

test("English remains the unprefixed default and Korean uses /ko", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator(".utility-nav .language-switcher__current")).toHaveText("EN");
  await expect(page.locator('.utility-nav .language-switcher a[lang="en"]')).toHaveCount(0);
  await expect(page.getByRole("link", { name: "한국어" }).first()).toHaveAttribute("href", "/ko/");

  await page.goto("/ko/");
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  await expect(page.locator(".utility-nav .language-switcher__current")).toHaveText("한국어");
  await expect(page.locator('.utility-nav .language-switcher a[lang="ko"]')).toHaveCount(0);
  await expect(page.getByRole("link", { name: "EN" }).first()).toHaveAttribute("href", "/");
  await expect(page.getByRole("navigation", { name: "주요 메뉴" })).toBeVisible();
});

test("language switch preserves an equivalent static route", async ({ page }) => {
  await page.goto("/research/?view=current");
  await expect(page.getByRole("link", { name: "한국어" }).first()).toHaveAttribute("href", "/ko/research/?view=current");
  await page.goto("/ko/research/");
  await expect(page.getByRole("link", { name: "EN" }).first()).toHaveAttribute("href", "/research/");
});

for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 }
] as const) {
  test(`language switch preserves query, shared hash, and focus on ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto("/papers/?view=method");
    await page.getByRole("navigation", { name: "Reading navigation" }).getByRole("link", { name: "Reading method" }).click();
    if (viewport.name === "mobile") await page.getByRole("button", { name: "Menu" }).click();
    const switcher = viewport.name === "mobile" ? page.locator(".mobile-nav__panel .language-switcher") : page.locator(".utility-nav .language-switcher");
    await expect(switcher.getByRole("link", { name: "한국어" })).toHaveAttribute("href", "/ko/papers/?view=method#reading-method");
    await switcher.getByRole("link", { name: "한국어" }).click();
    await expect(page).toHaveURL(/\/ko\/papers\/\?view=method#reading-method$/);
    await expect(page.locator("#reading-method")).toBeFocused();

    if (viewport.name === "mobile") await page.getByRole("button", { name: "메뉴" }).click();
    const koreanSwitcher = viewport.name === "mobile" ? page.locator(".mobile-nav__panel .language-switcher") : page.locator(".utility-nav .language-switcher");
    await koreanSwitcher.getByRole("link", { name: "EN" }).click();
    await expect(page).toHaveURL(/\/papers\/\?view=method#reading-method$/);
    await expect(page.locator("#reading-method")).toBeFocused();
  });
}

test("blog locale indexes preserve the public route structure", async ({ page }) => {
  await page.goto("/blog/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("link", { name: "한국어" }).first()).toHaveAttribute("href", "/ko/blog/");

  await page.goto("/ko/blog/");
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  await expect(page.getByRole("link", { name: "EN" }).first()).toHaveAttribute("href", "/blog/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("localized SEO, date formatting, RSS, and sitemap are emitted", async ({ page, request }) => {
  await page.goto("/ko/blog/");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://gnaroshi.dev/ko/blog/");
  await expect(page.locator('link[hreflang="en"]')).toHaveAttribute("href", "https://gnaroshi.dev/blog/");
  await expect(page.locator('link[hreflang="ko"]')).toHaveAttribute("href", "https://gnaroshi.dev/ko/blog/");
  await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute("href", "https://gnaroshi.dev/blog/");
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "ko_KR");

  expect((await request.get("/rss.xml")).ok()).toBeTruthy();
  expect((await request.get("/ko/rss.xml")).ok()).toBeTruthy();
  const sitemap = await (await request.get("/sitemap-0.xml")).text();
  expect(sitemap).toContain("https://gnaroshi.dev/ko/");
});

test("Korean Reading page renders translated shell and controls", async ({ page }) => {
  await page.goto("/ko/papers/");
  await expect(page.getByRole("navigation", { name: "논문 읽기 메뉴" })).toBeVisible();
  await expect(page.getByText("3단계 읽기", { exact: true })).toBeVisible();
  await expect(page.getByText("Paper Reading Queue", { exact: true })).toHaveCount(0);
});

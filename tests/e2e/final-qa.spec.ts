import { expect, test } from "@playwright/test";
import { englishQaRoutes, koreanQaRoutes, qaRoutes, qaViewports } from "./qa-routes";

for (const viewport of qaViewports) {
  test(`all QA routes are structurally sound at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);

    for (const route of qaRoutes) {
      const errors: string[] = [];
      const onConsole = (message: { type(): string; text(): string }) => {
        if (message.type() === "error") errors.push(message.text());
      };
      const onPageError = (error: Error) => errors.push(error.message);
      page.on("console", onConsole);
      page.on("pageerror", onPageError);

      const response = await page.goto(route);
      if (route.endsWith("/404") || route === "/404") expect([200, 404]).toContain(response?.status());
      else expect(response?.status(), route).toBe(200);
      await expect(page.locator("main#content"), route).toBeVisible();
      await expect(page.locator("h1"), route).toHaveCount(1);
      await expect(page.locator('a[href=""], a:not([href])'), `${route} empty links`).toHaveCount(0);
      const imagesWithoutDimensions = await page.locator("img").evaluateAll((images) =>
        images.filter((image) => !image.hasAttribute("width") || !image.hasAttribute("height")).length
      );
      expect(imagesWithoutDimensions, `${route} images without dimensions`).toBe(0);

      const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth
      }));
      expect(dimensions.scrollWidth - dimensions.clientWidth, `${route} horizontal overflow`).toBeLessThanOrEqual(1);
      expect(errors, `${route} browser errors`).toEqual([]);

      page.off("console", onConsole);
      page.off("pageerror", onPageError);
    }
  });
}

for (const [locale, route, navName, menuName] of [
  ["en", "/", "Primary navigation", "Menu"],
  ["ko", "/ko/", "주요 메뉴", "메뉴"]
] as const) {
  test(`${locale} navigation, theme, language, and mobile drawer controls remain stable`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(route);
    const nav = page.getByRole("navigation", { name: navName });
    await expect(nav).toBeVisible();
    const navLines = await nav.getByRole("link").evaluateAll((links) => [...new Set(links.map((link) => Math.round(link.getBoundingClientRect().top)))]);
    expect(navLines).toHaveLength(1);

    const themeButton = page.locator(".utility-nav .theme-toggle");
    const themeButtonCount = await themeButton.count();
    expect(themeButtonCount).toBe(1);
    const headerBefore = await page.locator(".site-header").boundingBox();
    await themeButton.click();
    const headerAfter = await page.locator(".site-header").boundingBox();
    expect(headerAfter?.height).toBe(headerBefore?.height);

    const counterpart = locale === "en" ? "/ko/" : "/";
    const languageLink = page.locator(`.utility-nav .language-switcher a[href="${counterpart}"]`);
    await expect(languageLink).toHaveCount(1);
    await expect(page.locator(".utility-nav .language-switcher")).toHaveAttribute("aria-label", locale === "en" ? "Language" : "언어");

    await page.setViewportSize({ width: 360, height: 800 });
    await page.reload();
    const menu = page.getByRole("button", { name: menuName });
    const headerMobileBefore = await page.locator(".site-header").boundingBox();
    await menu.click();
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("[data-mobile-nav-panel]")).toBeVisible();
    const headerMobileAfter = await page.locator(".site-header").boundingBox();
    expect(headerMobileAfter?.height).toBe(headerMobileBefore?.height);
    await page.keyboard.press("Escape");
    await expect(page.locator("[data-mobile-nav-panel]")).toBeHidden();
    await expect(menu).toBeFocused();
  });
}

test("locale shells and dates remain consistent", async ({ page }) => {
  for (const route of englishQaRoutes) {
    await page.goto(route);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  }
  for (const route of koreanQaRoutes) {
    await page.goto(route);
    await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  }
  await page.goto("/blog/first-post/");
  await expect(page.locator("time").first()).toContainText(/Jul|2026/);
  await page.goto("/ko/blog/first-post/");
  await expect(page.locator("time").first()).toContainText(/2026년/);
});

test("homepage, blog, evidence gates, and empty tools remain truthful", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".home-editorial > .home-band")).toHaveCount(4);
  await expect(page.locator(".home-editorial > .identity-hero")).toHaveCount(1);
  await expect(page.locator(".paper-stat-card")).toHaveCount(0);

  await page.goto("/blog");
  await expect(page.locator(".blog-search")).toHaveCount(0);
  const featuredHrefs = await page.locator("[data-featured-posts] a[href]").evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  const recentHrefs = await page.locator("[data-recent-posts] a[href]").evaluateAll((links) => links.map((link) => link.getAttribute("href")));
  expect(featuredHrefs.filter((href) => recentHrefs.includes(href))).toEqual([]);

  await page.goto("/papers");
  await expect(page.locator(".paper-stats, .paper-heatmap, .paper-filter-panel, astro-island")).toHaveCount(0);
  await expect(page.locator("#new-paper-template")).not.toHaveAttribute("open", "");

  await page.goto("/growth");
  await expect(page.locator(".momentum-score__value")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Collecting evidence" })).toBeVisible();

  for (const route of ["/queue", "/reviews", "/formula", "/questions", "/implementations", "/graph"]) {
    await page.goto(route);
    await expect(page.locator("astro-island"), route).toHaveCount(0);
    await expect(page.locator(".paper-stat-card"), route).toHaveCount(0);
    await expect(page.locator("main .button--primary"), `${route} primary actions`).toHaveCount(1);
  }
});

test("technical prose and reduced-motion behavior remain contained", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  for (const route of ["/blog/research-workflow/", "/ko/blog/research-workflow/", "/blog/paper-reading-method/", "/ko/blog/paper-reading-method/"]) {
    await page.goto(route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${route} technical content overflow`).toBeLessThanOrEqual(1);
  }

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
});

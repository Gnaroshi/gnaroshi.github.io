import { expect, test } from "@playwright/test";

const fixtureLocale = process.env.TRANSLATION_FIXTURE_LOCALE;
const fixture = fixtureLocale === "ko"
  ? {
      route: "/ko/blog/korean-only/",
      menu: "메뉴",
      current: "한국어",
      alternateLanguage: "en",
      alternateTarget: "/blog/",
      notice: "번역 준비 중 · 목록으로 이동"
    }
  : {
      route: "/blog/english-only/",
      menu: "Menu",
      current: "EN",
      alternateLanguage: "ko",
      alternateTarget: "/ko/blog/",
      notice: "Translation unavailable; opens the collection."
    };

test.describe("unpaired translation navigation", () => {
  test.skip(!fixtureLocale, "Runs against unpaired public-feed contract fixtures.");

  for (const viewport of [
    { name: "desktop", width: 1440, height: 1000 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "mobile", width: 390, height: 844 }
  ] as const) {
    test(`${fixtureLocale} ${viewport.name} exposes a visible collection fallback without reload-only current locale`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(`${fixture.route}?from=detail#missing-section`);

      const utilitySwitcher = page.locator(".utility-nav .language-switcher");
      let switcher = utilitySwitcher;
      if (viewport.name === "mobile") {
        await expect(utilitySwitcher).toBeHidden();
        await page.getByRole("button", { name: fixture.menu }).click();
        switcher = page.locator(".mobile-nav__panel .language-switcher");
      }

      await expect(switcher).toBeVisible();
      await expect(switcher.locator(".language-switcher__notice")).toHaveText(fixture.notice);
      await expect(switcher.locator(".language-switcher__current")).toHaveText(fixture.current);
      await expect(switcher.locator(".language-switcher__current")).toHaveAttribute("aria-current", "page");
      expect(await switcher.locator(".language-switcher__current").evaluate((element) => element.tagName)).toBe("SPAN");
      await expect(switcher.locator(`a[lang="${fixture.alternateLanguage}"]`)).toHaveAttribute("href", fixture.alternateTarget);
      await expect(switcher.locator("a[title]")).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    });
  }
});

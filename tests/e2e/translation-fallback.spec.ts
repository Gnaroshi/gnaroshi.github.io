import { expect, test } from "@playwright/test";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const hasPhiZero = existsSync(resolve(process.env.CONTENT_FEED_PATH ?? ".content-feed", "blog/ko/phizero-physical-language.mdx"));
const fixtureLocale = process.env.TRANSLATION_FIXTURE_LOCALE ?? (hasPhiZero ? "ko" : undefined);
const fixture = fixtureLocale === "ko"
  ? {
      route: process.env.TRANSLATION_FIXTURE_LOCALE ? "/ko/blog/korean-only/" : "/ko/blog/phizero-physical-language/",
      menu: "메뉴",
      current: "한국어",
      alternateLanguage: "en",
      alternateTarget: "/blog/",
      notice: "영어 번역이 없는 글입니다."
    }
  : {
      route: "/blog/english-only/",
      menu: "Menu",
      current: "EN",
      alternateLanguage: "ko",
      alternateTarget: "/ko/blog/",
      notice: "This page has no Korean translation."
    };

test.describe("unpaired translation navigation", () => {
  test.skip(!fixtureLocale, "Runs against unpaired public-feed contract fixtures.");

  for (const viewport of [
    { name: "desktop", width: 1440, height: 1000 },
    { name: "tablet", width: 768, height: 1024 },
    { name: "mobile", width: 390, height: 844 }
  ] as const) {
    test(`${fixtureLocale} ${viewport.name} explains the collection fallback only on request`, async ({ page }) => {
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
      const disclosure = switcher.locator("details");
      const trigger = disclosure.locator("summary");
      const options = disclosure.locator(".language-switcher__options");
      await expect(options).toBeHidden();
      await expect(switcher.locator(".language-switcher__notice")).toHaveCount(0);
      const headerBefore = await page.locator(".site-header").boundingBox();
      await trigger.focus();
      await page.keyboard.press("Enter");
      await expect(options).toBeVisible();
      await expect(options.locator("p")).toHaveText(fixture.notice);
      const bounds = (await options.boundingBox())!;
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(viewport.width);
      expect((await page.locator(".site-header").boundingBox())?.height).toBe(headerBefore?.height);
      await expect(switcher.locator(".language-switcher__current")).toHaveText(fixture.current);
      await expect(switcher.locator(".language-switcher__current")).toHaveAttribute("aria-current", "page");
      expect(await switcher.locator(".language-switcher__current").evaluate((element) => element.tagName)).toBe("SPAN");
      await expect(switcher.locator(`a[lang="${fixture.alternateLanguage}"]`)).toHaveAttribute("href", fixture.alternateTarget);
      await expect(switcher.locator("a[title]")).toHaveCount(0);
      await page.keyboard.press("Escape");
      await expect(options).toBeHidden();
      await expect(trigger).toBeFocused();
      if (viewport.name === "mobile") await expect(page.locator("[data-mobile-nav-panel]")).toBeVisible();
      await trigger.click();
      if (viewport.name === "mobile") {
        const panel = (await page.locator("[data-mobile-nav-panel]").boundingBox())!;
        await page.mouse.click(viewport.width - 8, Math.min(viewport.height - 8, panel.y + panel.height + 16));
      } else await page.locator("h1").click();
      await expect(options).toBeHidden();
      if (viewport.name === "mobile") await page.getByRole("button", { name: fixture.menu }).click();
      await trigger.click();
      await options.getByRole("link").click();
      await expect(page).toHaveURL(new RegExp(`${fixture.alternateTarget}$`));
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    });
  }
});

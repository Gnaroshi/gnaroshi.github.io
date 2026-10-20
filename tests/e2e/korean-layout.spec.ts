import { gotoPublicRoute } from "./compatibilityNavigation";
import { expect, test } from "@playwright/test";

const routes = ["/ko/", "/ko/research/", "/ko/projects/", "/ko/blog/", "/ko/papers/", "/ko/growth/"];
const viewports = [
  { width: 1440, height: 1000 },
  { width: 1024, height: 768 },
  { width: 390, height: 844 }
];

for (const viewport of viewports) {
  test(`Korean core pages do not overflow at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    for (const route of routes) {
      await gotoPublicRoute(page, route);
      await expect(page.locator(".site-header")).toHaveCount(1);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${route} overflows horizontally`).toBeLessThanOrEqual(1);
      await expect(page.locator("html")).toHaveAttribute("lang", "ko");
    }
  });
}

test("Korean mobile navigation fits in the menu", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoPublicRoute(page, "/ko/");
  const trigger = page.getByRole("button", { name: "메뉴" });
  await trigger.click();
  const panel = page.locator("[data-mobile-nav-panel]");
  await expect(panel).toBeVisible();
  await expect(page.locator(".utility-nav .language-switcher")).toHaveAttribute("aria-label", "언어");
  const box = await panel.boundingBox();
  expect(box?.width ?? 9999).toBeLessThanOrEqual(390);
});

test("Korean growth empty state keeps a readable text column on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await gotoPublicRoute(page, "/ko/growth/");
  const width = await page.locator(".app-empty-state").evaluate((item) => item.getBoundingClientRect().width);
  expect(width).toBeGreaterThan(240);
});

import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { qaRoutes } from "./qa-routes";

test.describe("accessibility", { tag: "@a11y" }, () => {
  for (const route of qaRoutes) {
    test(`${route} has no automatically detectable accessibility violations`, async ({ page }) => {
      await page.goto(route);
      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
    });
  }

  test("keyboard focus is visible and theme selection is honored", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("theme", "dark"));
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.keyboard.press("Tab");
    await expect(page.locator(".skip-link")).toBeFocused();
    const focusStyle = await page.locator(".skip-link").evaluate((element) => {
      const style = getComputedStyle(element);
      return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth };
    });
    expect(focusStyle.outlineStyle).not.toBe("none");
    expect(Number.parseFloat(focusStyle.outlineWidth)).toBeGreaterThan(0);
  });
});

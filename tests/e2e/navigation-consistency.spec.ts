import { expect, test } from "@playwright/test";
import { englishQaRoutes, koreanQaRoutes } from "./qa-routes";

test("primary and utility navigation capability snapshots are stable across every route and locale", async ({ page }) => {
  const expected = ["/research", "/projects", "/papers", "/about"];
  for (const [locale, routes] of [["en", englishQaRoutes], ["ko", koreanQaRoutes]] as const) {
    for (const route of routes) {
      await page.goto(route === "/404" ? "/404.html" : route);
      if (route === "/404") {
        // GitHub Pages serves one locale-detecting 404 document for every unknown path.
        // It intentionally uses minimal chrome so a Korean unknown URL never shows English navigation.
        await expect(page.locator(".site-header")).toHaveCount(0);
        await expect(page.locator('[data-not-found-locale="en"] .not-found-links a')).toHaveCount(3);
        continue;
      }
      const desktop = await page.locator(".desktop-nav [data-nav-href]").evaluateAll((items) => items.map((item) => item.getAttribute("data-nav-href")));
      const utility = await page.locator(".utility-nav [data-nav-href]").evaluateAll((items) => items.map((item) => item.getAttribute("data-nav-href")));
      const normalized = [...desktop, ...utility].map((href) => String(href).replace(/^\/ko(?=\/|$)/, "").replace(/\/$/, "") || "/");
      expect(normalized, `${locale} ${route}`).toEqual(expected);

      const mobile = await page.locator("[data-mobile-nav-panel] [data-nav-href]").evaluateAll((items) => items.map((item) => item.getAttribute("data-nav-href")));
      expect(mobile.map((href) => String(href).replace(/^\/ko(?=\/|$)/, "").replace(/\/$/, "") || "/"), `${locale} ${route} mobile`).toEqual(expected);
    }
  }
});

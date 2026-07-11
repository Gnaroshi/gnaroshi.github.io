import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";

const budget = JSON.parse(readFileSync(new URL("../../performance-budget.json", import.meta.url), "utf8")) as {
  shared: { maxLcpMs: number; maxCls: number };
  routes: Record<string, { maxHydratedIslands: number; forbiddenStyles: string[] }>;
};

declare global {
  interface Window { __routeMetrics?: { cls: number; lcp: number } }
}

test.describe("route performance budgets", { tag: "@performance" }, () => {
  for (const [route, routeBudget] of Object.entries(budget.routes)) {
    test(`${route} keeps route CSS and runtime work bounded`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.addInitScript(() => {
        window.__routeMetrics = { cls: 0, lcp: 0 };
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) window.__routeMetrics!.lcp = entry.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as Array<PerformanceEntry & { value: number; hadRecentInput: boolean }>) {
            if (!entry.hadRecentInput) window.__routeMetrics!.cls += entry.value;
          }
        }).observe({ type: "layout-shift", buffered: true });
      });

      await page.coverage.startCSSCoverage({ resetOnNavigation: false });
      await page.goto(route, { waitUntil: "networkidle" });
      await page.waitForTimeout(150);
      const coverage = await page.coverage.stopCSSCoverage();
      const metrics = await page.evaluate(() => window.__routeMetrics ?? { cls: 0, lcp: 0 });
      const islands = await page.locator("astro-island").count();
      const styles = await page.locator('link[rel="stylesheet"]').evaluateAll((links) => links.map((link) => (link as HTMLLinkElement).href));
      const totalCss = coverage.reduce((total, entry) => total + (entry.text?.length ?? 0), 0);
      const usedCss = coverage.reduce((total, entry) => total + entry.ranges.reduce((sum, range) => sum + range.end - range.start, 0), 0);
      const unusedPercent = totalCss === 0 ? 0 : Math.round((1 - usedCss / totalCss) * 1000) / 10;

      console.log(`${route}: LCP ${Math.round(metrics.lcp)}ms, CLS ${metrics.cls.toFixed(3)}, unused CSS ${unusedPercent}%, islands ${islands}`);
      expect(metrics.lcp).toBeLessThanOrEqual(budget.shared.maxLcpMs);
      expect(metrics.cls).toBeLessThanOrEqual(budget.shared.maxCls);
      expect(islands).toBeLessThanOrEqual(routeBudget.maxHydratedIslands);
      for (const forbidden of routeBudget.forbiddenStyles) expect(styles.some((href) => href.includes(`/${forbidden}.`))).toBe(false);
    });
  }
});

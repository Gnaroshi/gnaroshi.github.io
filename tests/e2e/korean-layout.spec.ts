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
      await page.goto(route);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${route} overflows horizontally`).toBeLessThanOrEqual(1);
      await expect(page.locator("html")).toHaveAttribute("lang", "ko");
    }
  });
}

test("Korean mobile navigation fits in the menu", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ko/");
  const trigger = page.getByRole("button", { name: "메뉴" });
  await trigger.click();
  const panel = page.locator("[data-mobile-nav-panel]");
  await expect(panel).toBeVisible();
  await expect(panel.getByText("언어", { exact: true })).toBeVisible();
  const box = await panel.boundingBox();
  expect(box?.width ?? 9999).toBeLessThanOrEqual(390);
});

test("Korean growth actions keep a readable text column on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/ko/growth/");
  const widths = await page.locator(".momentum-next-actions li p").evaluateAll((items) =>
    items.map((item) => item.getBoundingClientRect().width)
  );
  expect(widths).toHaveLength(3);
  expect(Math.min(...widths)).toBeGreaterThan(240);
});

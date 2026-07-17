import { expect, test } from "@playwright/test";

test.describe("populated Reading navigation", () => {
  test.skip(process.env.PAPER_NAV_POPULATED !== "true", "Runs against the populated public-feed contract fixture.");

  for (const [route, navName, currentLabel] of [
    ["/reviews/due/", "Reading navigation", "Reviews Due"],
    ["/ko/reviews/due/", "논문 읽기 메뉴", "복습 예정"]
  ] as const) {
    test(`${route} reveals its active item in the mobile scroller`, async ({ page }) => {
      await page.setViewportSize({ width: 360, height: 800 });
      await page.goto(route);
      const navigation = page.getByRole("navigation", { name: navName });
      const scroller = navigation.locator(".paper-lab-nav__groups");
      const current = navigation.locator('[aria-current="page"], [aria-current="location"]');

      await expect(current).toHaveCount(1);
      await expect(current).toHaveText(currentLabel);
      await expect.poll(async () => current.evaluate((element) => {
        const item = element.getBoundingClientRect();
        const viewport = element.parentElement!.getBoundingClientRect();
        return item.left >= viewport.left - 1 && item.right <= viewport.right + 1;
      })).toBe(true);
      const overflows = await scroller.evaluate((element) => element.scrollWidth > element.clientWidth + 1);
      if (overflows) await expect(scroller).toHaveAttribute("data-overflow", "");
      else await expect(scroller).not.toHaveAttribute("data-overflow");
      expect(await scroller.evaluate((element) => getComputedStyle(element).maskImage === "none")).toBe(!overflows);
      await expect(navigation.locator(".paper-lab-nav__brand")).toBeHidden();
    });
  }
});

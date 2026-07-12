import { expect, test } from "@playwright/test";

test.describe("approved public media", () => {
  for (const route of ["/", "/ko/"]) {
    test(`${route} renders a loaded Hero and project evidence image`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator(".identity-hero picture img")).toHaveCount(1);
      await expect(page.locator(".home-featured-project picture img")).toHaveCount(1);
      const images = page.locator("main picture img");
      await expect(images).toHaveCount(2);
      for (let index = 0; index < await images.count(); index += 1) {
        const image = images.nth(index);
        await expect(image).toHaveAttribute("width", /\d+/);
        await expect(image).toHaveAttribute("height", /\d+/);
        expect(await image.evaluate((item: HTMLImageElement) => item.complete && item.naturalWidth > 0)).toBe(true);
      }
    });
  }

  for (const [route, localeSuffix] of [["/research/", "-en"], ["/ko/research/", "-ko"]] as const) {
    test(`${route} renders one concrete scene and two locale-matched diagrams`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator(".research-theme picture img")).toHaveCount(3);
      await expect(page.locator('source[srcset*="research-vla-task"]')).toHaveCount(2);
      await expect(page.locator(`source[srcset*="efficient-execution${localeSuffix}"]`)).toHaveCount(2);
      await expect(page.locator(`source[srcset*="research-workflow${localeSuffix}"]`)).toHaveCount(2);
    });
  }

  for (const route of ["/projects/", "/ko/projects/"]) {
    test(`${route} renders evidence for both projects`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator(".project-feature picture img")).toHaveCount(2);
    });
  }

  for (const route of ["/projects/gnaroshi-vla/", "/projects/gnaroshi-dev/", "/ko/projects/gnaroshi-vla/", "/ko/projects/gnaroshi-dev/"]) {
    test(`${route} renders project-specific evidence`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator(".project-case__evidence picture img")).toHaveCount(1);
    });
  }

  test("empty evidence-gated routes do not gain decorative media", async ({ page }) => {
    for (const route of ["/blog/", "/papers/", "/growth/", "/queue/", "/reviews/", "/formula/", "/questions/", "/implementations/", "/graph/", "/week/"]) {
      await page.goto(route);
      await expect(page.locator("main picture, main img"), route).toHaveCount(0);
    }
  });
});

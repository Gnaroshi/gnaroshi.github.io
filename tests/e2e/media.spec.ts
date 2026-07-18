import { expect, test } from "@playwright/test";

test.describe("approved public media", () => {
  test("primary site identity keeps the full mascot face", async ({ page }) => {
    await page.goto("/");
    const mark = page.locator(".site-header__mark");
    await expect(mark).toHaveAttribute("src", "/media/identity/gnaroshi-site-mark-64.png");
    expect(await mark.evaluate((image: HTMLImageElement) => ({
      complete: image.complete,
      width: image.naturalWidth,
      height: image.naturalHeight,
      rendering: getComputedStyle(image).imageRendering,
    }))).toEqual({ complete: true, width: 64, height: 64, rendering: "auto" });

    const lowerFaceCoverage = await mark.evaluate((image: HTMLImageElement) => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const context = canvas.getContext("2d", { willReadFrequently: true })!;
      context.drawImage(image, 0, 0, 64, 64);
      const pixels = context.getImageData(0, 0, 64, 64).data;
      const background = [pixels[0], pixels[1], pixels[2]];
      let active = 0;
      let sampled = 0;
      for (let y = 32; y < 58; y += 1) {
        for (let x = 12; x < 52; x += 1) {
          const offset = (y * 64 + x) * 4;
          const distance = Math.abs(pixels[offset] - background[0]) + Math.abs(pixels[offset + 1] - background[1]) + Math.abs(pixels[offset + 2] - background[2]);
          sampled += 1;
          if (distance > 45) active += 1;
        }
      }
      return active / sampled;
    });
    expect(lowerFaceCoverage).toBeGreaterThanOrEqual(0.5);
  });

  for (const route of ["/", "/ko/"]) {
    test(`${route} renders a loaded Hero and project evidence image`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator(".identity-hero picture img")).toHaveCount(1);
      await expect(page.locator(".identity-hero__media[aria-hidden]")).toHaveCount(0);
      await expect(page.locator(".identity-hero picture img")).not.toHaveAttribute("alt", "");
      await expect(page.locator(".home-featured-project picture img")).toHaveCount(1);
      await expect(page.locator(".home-featured-project__media")).not.toHaveAttribute("aria-hidden", "true");
      await expect(page.locator(".home-featured-project__media")).not.toHaveAttribute("tabindex", "-1");
      await expect(page.locator(".home-featured-project__figure figcaption")).toBeVisible();
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
      await expect(page.locator(".research-theme__media > picture > img")).toHaveCount(3);
      await expect(page.locator('.research-theme__media > picture source[srcset*="research-vla-task"]')).toHaveCount(2);
      await expect(page.locator(`.research-theme__media > picture source[srcset*="efficient-execution${localeSuffix}"]`)).toHaveCount(2);
      await expect(page.locator(`.research-theme__media > picture source[srcset*="research-workflow${localeSuffix}"]`)).toHaveCount(2);
      await expect(page.locator(".research-theme figcaption")).toHaveCount(3);
      await expect(page.locator(".research-theme figcaption").first()).toContainText(route.startsWith("/ko/") ? "생성한 개념 장면" : "Generated concept scene");
      await expect(page.locator(".research-theme figcaption").nth(1)).toContainText(route.startsWith("/ko/") ? "기술 도식" : "Technical diagram");
    });
  }

  for (const route of ["/projects/", "/ko/projects/"]) {
    test(`${route} renders selected evidence and approved featured-app screenshots`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator(".selected-project picture img")).toHaveCount(2);
      await expect(page.locator(".featured-app picture img")).toHaveCount(3);
      await expect(page.locator(".featured-app__media[aria-hidden], .selected-project__media[aria-hidden]")).toHaveCount(0);
      await expect(page.locator(".featured-app__figure figcaption")).toHaveCount(3);
      await expect(page.locator(".selected-project__figure figcaption")).toHaveCount(2);
    });
  }

  for (const route of ["/projects/gnaroshi-vla/", "/projects/gnaroshi-dev/", "/ko/projects/gnaroshi-vla/", "/ko/projects/gnaroshi-dev/"]) {
    test(`${route} renders project-specific evidence`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator(".primary-evidence picture img")).toHaveCount(1);
    });
  }

  test("empty evidence-gated routes do not gain decorative media", async ({ page }) => {
    for (const route of ["/blog/", "/papers/", "/growth/", "/queue/", "/reviews/", "/formula/", "/questions/", "/implementations/", "/graph/", "/week/"]) {
      await page.goto(route);
      await expect(page.locator("main picture, main img"), route).toHaveCount(0);
    }
  });

  test("aria-hidden containers never retain meaningful image alternatives", async ({ page }) => {
    for (const route of ["/", "/research/", "/projects/", "/ko/", "/ko/research/", "/ko/projects/"]) {
      await page.goto(route);
      const contradictions = await page.locator('[aria-hidden="true"] img').evaluateAll((images) => images.filter((image) => Boolean(image.getAttribute("alt")?.trim())).length);
      expect(contradictions, route).toBe(0);
    }
  });
});

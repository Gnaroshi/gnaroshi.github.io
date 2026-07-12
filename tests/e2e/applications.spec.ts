import { expect, test } from "@playwright/test";

const applicationSlugs = ["gnaroshi-studio", "paperflow", "arxiv-discovery", "runshelf", "tr-gpu-monitor", "contentdeck"] as const;
const projectTemplates = new Map([
  ["gnaroshi-vla","research"],["gnaroshi-dev","infrastructure"],
  ...applicationSlugs.map((slug) => [slug,"application"] as const)
]);
const publicRepositories = new Map([
  ["paperflow", "https://github.com/Gnaroshi/paperflow"],
  ["arxiv-discovery", "https://github.com/Gnaroshi/Arxiv-newest-paper-crawler"],
  ["contentdeck", "https://github.com/Gnaroshi/content-looper"]
]);

test.describe("verified Gnaroshi applications", () => {
  for (const route of ["/projects/", "/ko/projects/"] as const) {
    test(`${route} keeps selected, featured, and supporting work distinct`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator(".selected-project")).toHaveCount(2);
      await expect(page.locator(".featured-app")).toHaveCount(3);
      await expect(page.locator(".supporting-app")).toHaveCount(3);
      await expect(page.locator(".supporting-app-group")).toHaveCount(3);
      for (const group of ["research-workflow", "system-utilities", "learning-tools"]) {
        await expect(page.locator(`.supporting-app-group[data-application-group="${group}"]`)).toHaveCount(1);
      }
      await expect(page.locator(".featured-app picture img")).toHaveCount(3);
      await expect(page.locator(".supporting-app picture")).toHaveCount(0);
      for (const slug of applicationSlugs) expect(await page.locator(`main a[href$="/projects/${slug}/"]`).count()).toBeGreaterThanOrEqual(2);
      const cards = page.locator("[data-project-id]");
      for (let index=0;index<await cards.count();index+=1) {
        const card=cards.nth(index);
        await expect(card.locator("[data-card-summary]")).toHaveCount(1);
        await expect(card.locator("time")).toHaveCount(0);
        const max=(await card.getAttribute("class"))?.includes("supporting-app") ? 3 : 4;
        expect(await card.locator('[data-tech-stack="strip"] li').count()).toBeLessThanOrEqual(max);
      }
    });
  }

  for (const localePrefix of ["", "/ko"] as const) for (const [slug,template] of projectTemplates) {
    test(`${localePrefix || "/en"} ${slug} uses the ${template} template`, async ({ page }) => {
      await page.goto(`${localePrefix}/projects/${slug}/`);
      await expect(page.locator(`[data-project-template="${template}"]`)).toHaveCount(1);
      await expect(page.locator("[data-project-template]")).toHaveCount(1);
      const techItems=page.locator('[data-tech-stack="grid"] li');
      expect(await techItems.count()).toBeGreaterThanOrEqual(3);
      for(let index=0;index<await techItems.count();index+=1){await expect(techItems.nth(index).locator("svg")).toHaveAttribute("aria-label",/.+/);await expect(techItems.nth(index).locator("span")).not.toHaveText("");}
      const disclosure=page.locator(".scenario figcaption span,.scenario__disclosure");
      expect(await disclosure.count()).toBeGreaterThan(0);
      for(let index=0;index<await disclosure.count();index+=1) await expect(disclosure.nth(index)).not.toHaveText("");
    });
  }

  for (const localePrefix of ["", "/ko"] as const) {
    for (const slug of applicationSlugs) {
      test(`${localePrefix || "/en"} ${slug} shows approved evidence and complete facts`, async ({ page }) => {
        await page.goto(`${localePrefix}/projects/${slug}/`);
        await expect(page.locator(".primary-evidence picture img")).toHaveCount(1);
        await expect(page.locator(".scenario picture img")).toHaveCount(3);
        await expect(page.locator(".scenario figcaption")).toHaveCount(3);
        expect(await page.locator(".tech-groups li").count()).toBeGreaterThanOrEqual(3);
        await expect(page.locator(".technical-facts code")).toHaveText(/[0-9a-f]{12}/);
        await expect(page.locator("[data-product-status]")).toHaveCount(1);
        await expect(page.locator("[data-studio-integration-status]")).toHaveCount(1);
        expect(await page.locator("[data-product-status]").getAttribute("data-product-status")).not.toBe(
          await page.locator("[data-studio-integration-status]").getAttribute("data-studio-integration-status")
        );
        await expect(page.locator("main")).not.toContainText("Integration in review");
      });
    }
  }

  test("only public application repositories receive public links", async ({ page }) => {
    for (const slug of applicationSlugs) {
      await page.goto(`/projects/${slug}/`);
      const links = page.locator(".project-links a");
      const expected = publicRepositories.get(slug);
      if (expected) { await expect(links).toHaveCount(1); await expect(links).toHaveAttribute("href", expected); }
      else await expect(links).toHaveCount(0);
    }
  });

  test("publishing and managed-application diagrams remain separate", async ({ page }) => {
    await page.goto("/projects/gnaroshi-dev/");
    await expect(page.locator('#repository-workflow[data-system-workflow="full"]')).toHaveCount(1);
    await expect(page.locator(".managed-applications")).toHaveCount(1);
  });

  for (const width of [768, 430, 390, 360]) {
    test(`project routes do not overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ["/projects/", ...applicationSlugs.map((slug) => `/projects/${slug}/`)]) {
        await page.goto(route);
        expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), route).toBeLessThanOrEqual(1);
      }
    });
  }
});

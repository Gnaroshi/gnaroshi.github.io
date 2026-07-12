import { expect, test } from "@playwright/test";

const repositoryNames = [
  "gnaroshi-paper-lab",
  "gnaroshi-writing",
  "gnaroshi-studio",
  "gnaroshi-api",
  "gnaroshi-content-feed",
  "gnaroshi.github.io"
] as const;

const publicRepositories = new Map([
  ["content-feed", "https://github.com/Gnaroshi/gnaroshi-content-feed"],
  ["website", "https://github.com/Gnaroshi/gnaroshi.github.io"]
]);

test.describe("public system workflow", () => {
  for (const route of ["/", "/ko/"] as const) {
    test(`${route} replaces the old Research Loop with one compact workflow`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator('[data-system-workflow="compact"]')).toHaveCount(1);
      await expect(page.locator('[data-system-workflow="full"]')).toHaveCount(0);
      await expect(page.locator(".home-loop, #research-loop-heading")).toHaveCount(0);
      await expect(page.locator('[data-system-workflow="compact"] img')).toHaveCount(0);

      const sourceStage = page.locator('[data-system-stage$="-sources"]');
      await expect(sourceStage.locator('[data-repository-id="paper-lab"]')).toHaveCount(1);
      await expect(sourceStage.locator('[data-repository-id="writing"]')).toHaveCount(1);
      await expect(page.locator('[data-repository-id="api"] .system-badge--optional')).toBeVisible();
    });
  }

  for (const route of ["/projects/gnaroshi-dev/", "/ko/projects/gnaroshi-dev/"] as const) {
    test(`${route} renders all six repositories with the same public boundary`, async ({ page }) => {
      await page.goto(route);
      const workflow = page.locator('#repository-workflow[data-system-workflow="full"]');
      await expect(workflow).toBeVisible();

      for (const repositoryName of repositoryNames) {
        await expect(workflow.getByText(repositoryName, { exact: true })).toBeVisible();
      }

      for (const id of ["paper-lab", "writing", "studio", "api"] as const) {
        await expect(workflow.locator(`[data-repository-id="${id}"] a`)).toHaveCount(0);
      }

      for (const [id, href] of publicRepositories) {
        const link = workflow.locator(`[data-repository-id="${id}"] a`);
        await expect(link).toHaveAttribute("href", href);
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute("rel", /noopener/);
      }

      const details = workflow.locator(".system-build-details");
      await expect(details).toHaveCount(1);
      const buildText = await details.textContent();
      expect(buildText).not.toMatch(/dirty state|branch name|API health|private CI/i);
    });
  }

  test("English and Korean variants expose the same repository model", async ({ page }) => {
    const idsByLocale: string[][] = [];
    for (const route of ["/projects/gnaroshi-dev/", "/ko/projects/gnaroshi-dev/"]) {
      await page.goto(route);
      idsByLocale.push(await page.locator('#repository-workflow [data-repository-id]').evaluateAll((items) => items.map((item) => item.getAttribute("data-repository-id") ?? "")));
    }
    expect(idsByLocale[0]).toEqual(idsByLocale[1]);
    expect(idsByLocale[0]).toEqual(["paper-lab", "writing", "studio", "api", "content-feed", "website"]);
  });

  test("mobile workflow keeps source-to-output order without overflow", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/ko/");
    const workflow = page.locator('[data-system-workflow="compact"]');
    const positions = await workflow.locator(":scope > .system-workflow__flow > .system-stage").evaluateAll((stages) => stages.map((stage) => Math.round(stage.getBoundingClientRect().top)));
    expect(positions).toEqual([...positions].sort((a, b) => a - b));

    const [studioTop, apiTop, feedTop, websiteTop] = await Promise.all([
      workflow.locator('[data-repository-id="studio"]').evaluate((item) => item.getBoundingClientRect().top),
      workflow.locator('[data-repository-id="api"]').evaluate((item) => item.getBoundingClientRect().top),
      workflow.locator('[data-repository-id="content-feed"]').evaluate((item) => item.getBoundingClientRect().top),
      workflow.locator('[data-repository-id="website"]').evaluate((item) => item.getBoundingClientRect().top)
    ]);
    expect(studioTop).toBeLessThan(apiTop);
    expect(apiTop).toBeLessThan(feedTop);
    expect(feedTop).toBeLessThan(websiteTop);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  });

  test("bootstrap-empty rendering makes no browser-side GitHub API request", async ({ page }) => {
    const githubApiRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().startsWith("https://api.github.com/")) githubApiRequests.push(request.url());
    });
    await page.goto("/");
    await expect(page.locator('[data-system-workflow="compact"]')).toBeVisible();
    await expect(page.locator(".home-notes")).toHaveCount(0);
    expect(githubApiRequests).toEqual([]);
  });
});

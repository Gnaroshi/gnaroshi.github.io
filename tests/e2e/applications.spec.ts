import { expect, test } from "@playwright/test";

const applicationSlugs = [
  "gnaroshi-studio",
  "paperflow",
  "arxiv-discovery",
  "runshelf",
  "tr-gpu-monitor",
  "contentdeck"
] as const;

const publicRepositories = new Map([
  ["paperflow", "https://github.com/Gnaroshi/paperflow"],
  ["arxiv-discovery", "https://github.com/Gnaroshi/Arxiv-newest-paper-crawler"],
  ["contentdeck", "https://github.com/Gnaroshi/content-looper"]
]);

test.describe("verified Gnaroshi applications", () => {
  for (const route of ["/projects/", "/ko/projects/"] as const) {
    test(`${route} preserves the requested grouping and feature hierarchy`, async ({ page }) => {
      await page.goto(route);
      const applications = page.locator(".applications");
      await expect(applications.locator(".application-card")).toHaveCount(6);
      await expect(applications.locator(".application-card--featured")).toHaveCount(3);
      await expect(applications.locator('#application-group-research-workflow + .application-grid .application-card')).toHaveCount(4);
      await expect(applications.locator('#application-group-system-utilities + .application-grid .application-card')).toHaveCount(1);
      await expect(applications.locator('#application-group-learning-tools + .application-grid .application-card')).toHaveCount(1);

      for (const slug of applicationSlugs) {
        await expect(applications.locator(`a[href$="/projects/${slug}/"]`)).toHaveCount(2);
      }
    });
  }

  test("only public application repositories receive public links", async ({ page }) => {
    for (const slug of applicationSlugs) {
      await page.goto(`/projects/${slug}/`);
      const links = page.locator(".project-case > .link-row a");
      const expected = publicRepositories.get(slug);
      if (expected) {
        await expect(links).toHaveCount(1);
        await expect(links).toHaveAttribute("href", expected);
      } else {
        await expect(links).toHaveCount(0);
      }
      await expect(page.locator(".project-case__evidence")).toHaveCount(0);
      await expect(page.getByRole("heading", { name: "Relationship with Studio" })).toHaveCount(1);
    }
  });

  test("publishing repositories and managed applications remain separate diagrams", async ({ page }) => {
    await page.goto("/projects/gnaroshi-dev/");
    const publishing = page.locator('#repository-workflow[data-system-workflow="full"]');
    const managed = page.locator(".managed-applications");
    await expect(publishing).toHaveCount(1);
    await expect(managed).toHaveCount(1);
    await expect(publishing.getByRole("heading", { name: "Publishing workflow: from private notes to the public site" })).toHaveCount(1);
    await expect(managed.getByRole("heading", { name: "Independent apps coordinated by Studio" })).toHaveCount(1);
    await expect(managed.locator(".managed-map__center")).toContainText("Gnaroshi Studio");
    await expect(managed.locator(".managed-map__side a")).toHaveCount(5);
    await expect(managed).not.toContainText("gnaroshi-content-feed");
    await expect(managed).not.toContainText("gnaroshi.github.io");
  });

  test("application grouping and managed map do not overflow on a narrow screen", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    for (const route of ["/projects/", "/projects/gnaroshi-dev/"]) {
      await page.goto(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
    }
  });
});

import { expect, test } from "@playwright/test";

const navigationSignature = "research|projects|writing|paper-lab|about";
const publicRoutes = ["/", "/ko/", "/research/", "/papers/"];
const scaffoldPhrases = [
  "editable in src",
  "lorem ipsum",
  "placeholder content",
  "sample content",
  "scaffold"
];

test.describe("production deployment smoke", { tag: "@smoke" }, () => {
  test("build provenance uses the supported public schema", async ({ request }) => {
    const response = await request.get("/build-info.json");
    expect(response.status()).toBe(200);
    const info = await response.json();
    expect(info).toMatchObject({
      schemaVersion: 1,
      feedSchemaVersion: 1
    });
    expect(info.websiteCommit).toMatch(/^[a-f0-9]{40}$/);
    expect(info.contentFeedCommit).toMatch(/^[a-f0-9]{40}$/);
    expect(info.contentHash).toMatch(/^[a-f0-9]{64}$/);
    expect(["local", "ci", "production"]).toContain(info.environment);
  });

  for (const route of publicRoutes) {
    test(`${route} exposes the expected navigation and no scaffold copy`, async ({ page }) => {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      await expect(page.locator(".site-header")).toHaveAttribute("data-navigation-signature", navigationSignature);
      const publicText = (await page.locator("body").innerText()).toLowerCase();
      for (const phrase of scaffoldPhrases) expect(publicText).not.toContain(phrase);
    });
  }
});

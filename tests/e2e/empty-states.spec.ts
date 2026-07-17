import { expect, test } from "@playwright/test";

test("empty Reading page uses onboarding without dashboard machinery", async ({ page }) => {
  await page.goto("/papers");
  await expect(page.getByRole("heading", { name: "No reading notes have been published yet." })).toBeVisible();
  await expect(page.locator(".paper-stats")).toHaveCount(0);
  await expect(page.locator(".paper-heatmap")).toHaveCount(0);
  await expect(page.locator(".paper-filter-panel")).toHaveCount(0);
  await expect(page.locator("astro-island")).toHaveCount(0);
  await expect(page.locator("#new-paper-template")).toHaveCount(0);
  await expect(page.locator(".paper-onboarding .button--primary")).toHaveAttribute("href", "#reading-method");
});

test("Activity stays non-numeric before enough records exist", async ({ page }) => {
  await page.goto("/growth");
  await expect(page.getByRole("heading", { name: "There is not enough activity to show a meaningful overview yet." })).toBeVisible();
  await expect(page.locator(".momentum-score__value")).toHaveCount(0);
  await expect(page.locator(".momentum-methodology")).toHaveCount(0);
  await expect(page.getByText(/public feed|eligibility|evidence gate/i)).toHaveCount(0);
});

test("empty Writing, archive, and Contact routes are noindex with one next action", async ({ page, request }) => {
  for (const route of ["/blog/", "/ko/blog/", "/blog/archive/", "/ko/blog/archive/", "/contact/", "/ko/contact/"]) {
    await page.goto(route);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
  }
  for (const route of ["/blog/", "/ko/blog/", "/blog/archive/", "/ko/blog/archive/"]) {
    await page.goto(route);
    await expect(page.locator(".app-empty-state .button")).toHaveCount(1);
  }
  await page.goto("/week/");
  await expect(page.locator(".app-empty-state .button")).toHaveAttribute("href", "/papers/#reading-method");

  const sitemap = await (await request.get("/sitemap-0.xml")).text();
  for (const path of ["/blog/", "/ko/blog/", "/blog/archive/", "/ko/blog/archive/", "/contact/", "/ko/contact/"]) {
    expect(sitemap).not.toContain(`https://gnaroshi.dev${path}`);
  }
});

const emptyTools = [
  ["/queue", "No papers are waiting."],
  ["/reviews", "Nothing needs another look yet."],
  ["/formula", "No formula is ready to revisit."],
  ["/questions", "No questions have been saved yet."],
  ["/implementations", "No implementation note has been published yet."],
  ["/graph", "There are not enough connections to show yet."]
] as const;

for (const [route, heading] of emptyTools) {
  test(`${route} has a focused static empty state`, async ({ page }) => {
    await page.goto(route);
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    await expect(page.locator("astro-island")).toHaveCount(0);
    await expect(page.locator(".paper-stat-card")).toHaveCount(0);
  });
}

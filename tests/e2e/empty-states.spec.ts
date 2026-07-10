import { expect, test } from "@playwright/test";

test("empty Paper Log uses onboarding without dashboard machinery", async ({ page }) => {
  await page.goto("/papers");
  await expect(page.getByRole("heading", { name: "One useful note is enough to begin" })).toBeVisible();
  await expect(page.locator(".paper-stats")).toHaveCount(0);
  await expect(page.locator(".paper-heatmap")).toHaveCount(0);
  await expect(page.locator(".paper-filter-panel")).toHaveCount(0);
  await expect(page.locator("astro-island")).toHaveCount(0);
  await expect(page.locator("#new-paper-template")).not.toHaveAttribute("open", "");
});

test("Momentum stays non-numeric before evidence eligibility", async ({ page }) => {
  await page.goto("/growth");
  await expect(page.getByRole("heading", { name: "Collecting evidence" })).toBeVisible();
  await expect(page.locator(".momentum-score__value")).toHaveCount(0);
  await expect(page.getByText("Meaningful evidence events")).toBeVisible();
});

const emptyTools = [
  ["/queue", "No papers are waiting"],
  ["/reviews", "Nothing is scheduled yet"],
  ["/formula", "No saved formula to reconstruct"],
  ["/questions", "No retrieval questions yet"],
  ["/implementations", "No public implementation attempt yet"],
  ["/graph", "The research graph is not ready yet"]
] as const;

for (const [route, heading] of emptyTools) {
  test(`${route} has a focused static empty state`, async ({ page }) => {
    await page.goto(route);
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    await expect(page.locator("astro-island")).toHaveCount(0);
    await expect(page.locator(".paper-stat-card")).toHaveCount(0);
  });
}

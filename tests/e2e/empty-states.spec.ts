import { expect, test } from "@playwright/test";
import { preferredPublicBlogRecords } from "../helpers/publicBlogInventory";
import { hasPublicPaperCollection } from "./public-paper-fixture";

test("retired empty Reading page forwards to an existing research question", async ({ page }) => {
  test.skip(hasPublicPaperCollection(), "The selected feed has public paper notes.");
  await page.goto("/papers");
  await expect(page).toHaveURL(/\/research\/#human-ai-research-tools$/);
  await expect(page.locator("#human-ai-research-tools")).toBeFocused();
  await expect(page.locator(".paper-stats")).toHaveCount(0);
  await expect(page.locator(".paper-heatmap")).toHaveCount(0);
  await expect(page.locator(".paper-filter-panel")).toHaveCount(0);
  await expect(page.locator("astro-island")).toHaveCount(0);
  await expect(page.locator("#new-paper-template")).toHaveCount(0);
  await expect(page.locator(".paper-lab-nav")).toHaveCount(0);
});

test("Activity stays non-numeric before enough records exist", async ({ page }) => {
  await page.goto("/growth");
  await expect(page.getByRole("heading", { name: "Not enough public activity yet." })).toBeVisible();
  await expect(page.locator(".momentum-score__value")).toHaveCount(0);
  await expect(page.locator(".momentum-methodology")).toHaveCount(0);
  await expect(page.getByText(/public feed|eligibility|evidence gate/i)).toHaveCount(0);
});

test("Blog and archive indexing follow public work across both languages", async ({ page, request }) => {
  const sitemap = await (await request.get("/sitemap-0.xml")).text();
  for (const locale of ["en", "ko"] as const) {
    const prefix = locale === "ko" ? "/ko" : "";
    const posts = preferredPublicBlogRecords(locale);
    for (const route of [`${prefix}/blog/`, `${prefix}/blog/archive/`]) {
      await page.goto(route);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", posts.length > 0 ? "index, follow" : "noindex, follow");
      if (posts.length === 0) {
        await expect(page.locator(".app-empty-state .button")).toHaveCount(1);
        await expect(page.locator(".app-empty-state .button")).toHaveAttribute("href", `${prefix}/research/`);
        expect(sitemap).not.toContain(`https://gnaroshi.dev${route}`);
      } else {
        await expect(page.locator(".app-empty-state")).toHaveCount(0);
        for (const post of posts) {
          await expect(page.locator(`main a[href="${post.href}"]`)).toHaveCount(1);
        }
        expect(sitemap).toContain(`https://gnaroshi.dev${route}`);
      }
    }
  }
  await page.goto("/week/");
  await expect(page.locator(".app-empty-state .button")).toHaveAttribute("href", "/research/");

  for (const path of ["/contact/", "/ko/contact/"]) {
    await page.goto(path);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
    expect(sitemap).not.toContain(`https://gnaroshi.dev${path}`);
  }
});

const emptyTools = [
  ["/queue", "No papers are waiting."],
  ["/reviews", "Nothing needs another look yet."],
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

test("retired learning tools keep the actual paper collection reachable", async ({ page }) => {
  for (const locale of ["en", "ko"]) {
    const prefix = locale === "ko" ? "/ko" : "";
    for (const route of ["formula", "questions"]) {
      await page.goto(`${prefix}/${route}/`);
      if (hasPublicPaperCollection()) {
        await expect(page).toHaveURL(new RegExp(`${prefix}/papers/$`));
        await expect(page.locator("#reading-method, .reading-method, [data-reading-checklist]")).toHaveCount(0);
      } else await expect(page).toHaveURL(new RegExp(`${prefix}/research/#human-ai-research-tools$`));
    }
  }
});

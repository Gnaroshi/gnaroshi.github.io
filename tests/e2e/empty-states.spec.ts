import { expect, test } from "@playwright/test";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { contentFeedRoot } from "../../src/utils/contentFeed";

function publicBlogSlugs(locale: "en" | "ko") {
  const directory = join(contentFeedRoot, "blog", locale);
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { recursive: true })
    .filter((file): file is string => typeof file === "string" && /\.mdx?$/.test(file))
    .flatMap((file) => {
      const source = readFileSync(join(directory, file), "utf8");
      const metadata = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1] ?? "";
      if (!/^visibility:\s*(['"]?)public\1\s*$/m.test(metadata)) return [];
      const slug = metadata.match(/^canonicalSlug:\s*(['"]?)([^\s'"]+)\1\s*$/m)?.[2];
      if (!slug) throw new Error(`Validated public blog record is missing canonicalSlug: ${file}`);
      return [slug];
    });
}

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

test("Writing and archive indexing follow actual public content in each locale", async ({ page, request }) => {
  const sitemap = await (await request.get("/sitemap-0.xml")).text();
  for (const locale of ["en", "ko"] as const) {
    const prefix = locale === "ko" ? "/ko" : "";
    const slugs = publicBlogSlugs(locale);
    for (const route of [`${prefix}/blog/`, `${prefix}/blog/archive/`]) {
      await page.goto(route);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", slugs.length > 0 ? "index, follow" : "noindex, follow");
      if (slugs.length === 0) {
        await expect(page.locator(".app-empty-state .button")).toHaveCount(1);
        await expect(page.locator(".app-empty-state .button")).toHaveAttribute("href", `${prefix}/research/`);
        expect(sitemap).not.toContain(`https://gnaroshi.dev${route}`);
      } else {
        await expect(page.locator(".app-empty-state")).toHaveCount(0);
        for (const slug of slugs) {
          await expect(page.locator(`main a[href="${prefix}/blog/${slug}/"]`)).toHaveCount(1);
        }
        expect(sitemap).toContain(`https://gnaroshi.dev${route}`);
      }
    }
  }
  await page.goto("/week/");
  await expect(page.locator(".app-empty-state .button")).toHaveAttribute("href", "/papers/#reading-method");

  for (const path of ["/contact/", "/ko/contact/"]) {
    await page.goto(path);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
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

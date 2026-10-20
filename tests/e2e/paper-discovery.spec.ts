import { expect, test } from "@playwright/test";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parseFrontmatter } from "@astrojs/markdown-remark";
import { contentFeedRoot } from "../../src/utils/contentFeed";

type Paper = { locale: "en" | "ko"; family: string; title: string; href: string };
const papers: Paper[] = (["en", "ko"] as const).flatMap((locale) => {
  const directory = join(contentFeedRoot, "papers", locale);
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { recursive: true }).flatMap((file) => {
    if (typeof file !== "string" || !/\.mdx?$/.test(file)) return [];
    const { frontmatter } = parseFrontmatter(readFileSync(join(directory, file), "utf8"));
    if (frontmatter.visibility !== "public" || frontmatter.draft === true) return [];
    const slug = String(frontmatter.canonicalSlug);
    return [{ locale, family: String(frontmatter.translationKey || `${locale}/${file}`), title: String(frontmatter.title), href: `${locale === "ko" ? "/ko" : ""}/papers/${slug}/` }];
  });
});

function preferredPapers(locale: "en" | "ko") {
  const families = new Map<string, Paper>();
  for (const paper of papers) {
    const previous = families.get(paper.family);
    if (!previous || (previous.locale !== locale && paper.locale === locale)) families.set(paper.family, paper);
  }
  return [...families.values()];
}

test.describe("Paper discovery across content languages", () => {
  test.skip(!process.env.PAPER_DISCOVERY_FIXTURE, "Runs on validated isolated Korean-only and mixed paper fixtures.");

  for (const locale of ["en", "ko"] as const) {
    const route = `${locale === "ko" ? "/ko" : ""}/papers/`;

    test(`${locale} collection retains each actual public family once`, async ({ page, request }) => {
      await page.goto(route);
      const expected = preferredPapers(locale);
      const records = page.locator("#paper-notes .paper-note-list article, #paper-notes .paper-card");
      await expect(records).toHaveCount(expected.length);
      for (const paper of expected) {
        const record = records.filter({ has: page.locator(`:is(h2,h3) a[href="${paper.href}"]`) });
        await expect(record).toHaveCount(1);
        await expect(record.locator(":is(h2,h3)")).toHaveText(paper.title);
        await expect(record.locator(":is(h2,h3)")).toHaveAttribute("lang", paper.locale);
        expect((await request.get(paper.href)).ok()).toBeTruthy();
      }
      await expect(page.locator("#reading-method, [data-reading-checklist], .paper-method-panel, .paper-depth-badge")).toHaveCount(0);
      await expect(page.getByRole("link", { name: /Reading method|읽는 방법|Practice|연습/ })).toHaveCount(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    });

    test(`${locale} collection opens the existing Korean-only detail rather than inventing an English route`, async ({ page, request }) => {
      await page.goto(route);
      const actualLink = page.locator('#paper-notes :is(h2,h3) a[href="/ko/papers/korean-only-paper/"]');
      await expect(actualLink).toHaveCount(1);
      await actualLink.focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(/\/ko\/papers\/korean-only-paper\/$/);
      await expect(page.locator("html")).toHaveAttribute("lang", "ko");
      await expect(page.locator("h1")).toHaveText("한국어 논문 정리");
      expect((await request.get("/papers/korean-only-paper/")).status()).toBe(404);
    });
  }

  test("mixed paper filtering preserves the actual language route and removes learning-stage choices", async ({ page }) => {
    test.skip(process.env.PAPER_DISCOVERY_FIXTURE !== "mixed", "Filters are shown only once real public families justify them.");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/papers/");
    const search = page.locator(".paper-filter-panel input[type=search]");
    await search.scrollIntoViewIfNeeded();
    await search.fill("한국어 논문 정리");
    await expect(page.locator(".paper-results .paper-card")).toHaveCount(1);
    await expect(page.locator(".paper-card h3 a")).toHaveAttribute("href", "/ko/papers/korean-only-paper/");
    const status = page.locator('.paper-filter-panel select').first();
    await expect(status.locator('option[value="reading"]')).toHaveCount(1);
    await expect(status.locator('option[value="pass1"], option[value="pass2"], option[value="pass3"]')).toHaveCount(0);
    await expect(page.locator('.paper-filter-panel select option[value="skim"], .paper-filter-panel select option[value="understand"], .paper-filter-panel select option[value="deep"]')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  });

  test("unrelated same-slug papers keep distinct cards through filtering and reordering", async ({ page }) => {
    test.skip(process.env.PAPER_DISCOVERY_FIXTURE !== "mixed", "The isolated mixed fixture includes distinct cross-locale slug collisions.");
    await page.goto("/papers/");
    const search = page.locator(".paper-filter-panel input[type=search]");
    const sort = page.locator('.paper-filter-panel select').filter({ has: page.locator('option[value="title"]') });
    const links = page.locator(".paper-results .paper-card h3 a");
    await search.scrollIntoViewIfNeeded();
    await search.fill("Collision");
    await expect(links).toHaveCount(2);
    await sort.selectOption("difficulty");
    await expect(links).toHaveText(["Collision Z 한국어 정리", "Collision A English note"]);
    await expect(links.nth(0)).toHaveAttribute("href", "/ko/papers/shared-paper-slug/");
    await expect(links.nth(1)).toHaveAttribute("href", "/papers/shared-paper-slug/");
    await sort.selectOption("title");
    await expect(links).toHaveText(["Collision A English note", "Collision Z 한국어 정리"]);
    await expect(links.nth(0)).toHaveAttribute("href", "/papers/shared-paper-slug/");
    await expect(links.nth(1)).toHaveAttribute("href", "/ko/papers/shared-paper-slug/");
    await search.fill("English note");
    await expect(links).toHaveCount(1);
    await expect(links).toHaveAttribute("href", "/papers/shared-paper-slug/");
    await search.fill("한국어 정리");
    await expect(links).toHaveCount(1);
    await expect(links).toHaveAttribute("href", "/ko/papers/shared-paper-slug/");
    await search.fill("");
    await expect(links).toHaveCount(preferredPapers("en").length);
    await expect(links.filter({ hasText: "Collision A English note" })).toHaveCount(1);
    await expect(links.filter({ hasText: "Collision Z 한국어 정리" })).toHaveCount(1);
    await search.fill("Collision");
    await sort.selectOption("difficulty");
    await expect(links).toHaveText(["Collision Z 한국어 정리", "Collision A English note"]);
  });

  test("Paper collection remains a real linked list without JavaScript", async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    try {
      const page = await context.newPage();
      await page.goto("/papers/");
      await expect(page.locator("#paper-notes .paper-note-list article, #paper-notes .paper-card")).toHaveCount(preferredPapers("en").length);
      await page.locator('#paper-notes :is(h2,h3) a[href="/ko/papers/korean-only-paper/"]').click();
      await expect(page).toHaveURL(/\/ko\/papers\/korean-only-paper\/$/);
      await expect(page.locator("h1")).toHaveText("한국어 논문 정리");
    } finally { await context.close(); }
  });
});

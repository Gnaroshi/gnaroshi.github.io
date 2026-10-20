import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { preferredPublicBlogRecords, publicBlogInventory } from "../helpers/publicBlogInventory";

const inventory = publicBlogInventory();

for (const locale of ["en", "ko"] as const) {
  const prefix = locale === "ko" ? "/ko" : "";
  const posts = preferredPublicBlogRecords(locale);

  test(`Blog ${locale} discovers all public families without inventing locale routes`, async ({ page, request }) => {
    await page.goto(`${prefix}/blog/`);
    const cards = page.locator(".writing-index > ol > li, .blog-search__results li");
    await expect(cards).toHaveCount(posts.length);
    for (const post of posts) {
      const card = cards.filter({ has: page.locator(`:is(h2,h3) a[href="${post.href}"]`) });
      await expect(card).toHaveCount(1);
      await expect(card.locator(":is(h2,h3)")).toHaveAttribute("lang", post.locale);
      const versions = inventory.filter((record) => record.translationKey === post.translationKey);
      await expect(card.locator(".blog-languages")).toHaveCount(versions.length > 1 ? 1 : 0);
      if (versions.length > 1) {
        const other = versions.find((record) => record.locale !== post.locale)!;
        await expect(card.locator(`.blog-languages a[hreflang="${other.locale}"]`)).toHaveAttribute("href", other.href);
        await expect(card.locator(`.blog-languages a[hreflang="${post.locale}"]`)).toHaveCount(0);
      }
      expect((await request.get(post.href)).ok()).toBeTruthy();
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  });

  test(`Blog ${locale} archive, tags, Home and RSS retain real alternate-language entries`, async ({ page, request }) => {
    await page.goto(`${prefix}/blog/archive/`);
    await expect(page.locator(".archive-list .card__title a")).toHaveCount(posts.length);
    for (const post of posts) await expect(page.locator(`.archive-list .card__title a[href="${post.href}"]`)).toHaveCount(1);
    const tagLink = page.locator(".archive-list .blog-tag-list a").first();
    const tagHref = await tagLink.count() ? await tagLink.getAttribute("href") : null;
    await page.goto(`${prefix}/`);
    const recent = posts.filter((post) => post.stage === "substantive" && post.category !== "build-note").slice(0, 3);
    const writingGroup = page.locator(".home-notes__columns > div").filter({ has: page.locator(`.home-list-heading a[href="${prefix}/blog/"]`) });
    await expect(writingGroup).toHaveCount(recent.length > 0 ? 1 : 0);
    await expect(writingGroup.locator(".editorial-record-list a")).toHaveCount(recent.length);
    for (const href of await writingGroup.locator(".editorial-record-list a").evaluateAll((links) => links.map((link) => link.getAttribute("href")))) {
      expect(posts.some((post) => post.stage === "substantive" && post.category !== "build-note" && post.href === href)).toBeTruthy();
    }

    const rss = await (await request.get(`${prefix}/rss.xml`)).text();
    expect((rss.match(/<item>/g) ?? []).length).toBe(posts.length);
    for (const post of posts) {
      expect(rss).toContain(`https://gnaroshi.dev${post.href}`);
      expect(rss).toContain(`<dc:language>${post.locale}</dc:language>`);
    }
    if (tagHref) {
      expect((await request.get(tagHref)).ok()).toBeTruthy();
      await page.goto(tagHref);
      // The validated discovery fixtures share the canonical research tag.
      if (process.env.BLOG_DISCOVERY_FIXTURE) await expect(page.locator(".card-list .card__title a")).toHaveCount(posts.length);
      for (const href of await page.locator(".card-list .card__title a").evaluateAll((links) => links.map((link) => link.getAttribute("href")))) {
        expect(posts.some((post) => post.href === href)).toBeTruthy();
      }
    }
  });

  test(`Blog ${locale} paired-version links navigate to the real counterpart`, async ({ page }) => {
    const pair = posts.find((post) => inventory.filter((record) => record.translationKey === post.translationKey).length > 1);
    test.skip(!pair, "No public translation pair exists in this selected feed.");
    const counterpart = inventory.find((record) => record.translationKey === pair!.translationKey && record.locale !== pair!.locale)!;
    await page.goto(`${prefix}/blog/`);
    const card = page.locator(".writing-index > ol > li, .blog-search__results li").filter({ has: page.locator(`:is(h2,h3) a[href="${pair!.href}"]`) });
    await card.locator(`.blog-languages a[href="${counterpart.href}"]`).focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`${counterpart.href}$`));
    await expect(page.locator("html")).toHaveAttribute("lang", counterpart.locale);
    await expect(page.locator("h1")).toHaveText(counterpart.title);
  });

  test(`Blog ${locale} spaced-tag language links use the built slug route`, async ({ page, request }) => {
    test.skip(!process.env.BLOG_DISCOVERY_FIXTURE, "The isolated mixed fixture includes the raw world model tag.");
    const otherLocale = locale === "en" ? "ko" : "en";
    const otherPrefix = otherLocale === "ko" ? "/ko" : "";
    const route = `${prefix}/blog/tags/world-model/`;
    const counterpart = `${otherPrefix}/blog/tags/world-model/`;
    expect((await request.get(route)).ok()).toBeTruthy();
    expect((await request.get(counterpart)).ok()).toBeTruthy();
    await page.goto(route);
    await expect(page.locator(`head link[rel=alternate][hreflang="${otherLocale}"]`)).toHaveAttribute("href", `https://gnaroshi.dev${counterpart}`);
    const switcher = page.locator(`.language-switcher:not(.language-switcher--mobile) a[lang="${otherLocale}"]`);
    await expect(switcher).toHaveAttribute("href", counterpart);
    await switcher.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`${counterpart}$`));
    await expect(page.locator("html")).toHaveAttribute("lang", otherLocale);
    await expect(page.locator('.card-list .card__title a[href="/ko/blog/korean-only-1/"]')).toHaveCount(1);
  });
}

test("Blog search returns the actual content locale after filtering", async ({ page }) => {
  test.skip(!process.env.BLOG_DISCOVERY_FIXTURE, "Runs on the generated mixed-language discovery fixture.");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/blog/");
  const search = page.locator(".blog-search input[type=search]");
  await search.scrollIntoViewIfNeeded();
  await expect(page.locator(".blog-search [role=status]")).toHaveCount(0);
  const controlsBefore = (await page.locator(".blog-search__controls").boundingBox())!;
  await page.getByRole("button", { name: "research", exact: true }).click();
  await expect(page.getByRole("button", { name: "research", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "All", exact: true })).toHaveAttribute("aria-pressed", "false");
  await page.getByRole("button", { name: "All", exact: true }).click();
  await expect(page.locator(".blog-search [role=status]")).toHaveCount(0);
  await search.fill("korean-only-1");
  await expect(page.locator(".blog-search [role=status]")).toHaveText("1 post");
  const controlsAfter = (await page.locator(".blog-search__controls").boundingBox())!;
  expect(controlsAfter.height).toBe(controlsBefore.height);
  const result = page.locator(".blog-search__results li h2 a");
  await expect(result).toHaveCount(1);
  await expect(result).toHaveAttribute("href", "/ko/blog/korean-only-1/");
  await result.click();
  await expect(page).toHaveURL(/\/ko\/blog\/korean-only-1\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  await expect(page.locator("h1")).toHaveText("Post korean-only-1");
});

test("Blog paired language controls retain geometry on light/dark narrow/wide surfaces", async ({ page }, testInfo) => {
  test.skip(!process.env.BLOG_DISCOVERY_FIXTURE, "Runs on the generated mixed-language discovery fixture.");
  for (const theme of ["light", "dark"]) {
    for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 1000 }]) {
      await page.setViewportSize(viewport);
      await page.addInitScript((value) => localStorage.setItem("theme", value), theme);
      await page.goto("/blog/");
      await expect(page.locator(".blog-search__results li")).toHaveCount(6);
      await expect(page.getByRole("heading", { name: "All posts", exact: true })).toHaveCount(0);
      await expect(page.getByRole("heading", { name: "Find a post", exact: true })).toHaveCount(0);
      await expect(page.getByRole("heading", { name: "Topics", exact: true })).toHaveCount(0);
      const heading = (await page.locator(".page-header h1").boundingBox())!;
      const search = (await page.locator(".blog-search__controls").boundingBox())!;
      const firstPost = (await page.locator(".blog-search__results li h2").first().boundingBox())!;
      expect(search.y - heading.y - heading.height).toBeLessThanOrEqual(40);
      expect(firstPost.y).toBeLessThan(400);
      for (const card of await page.locator(".blog-search__results li").all()) {
        const title = (await card.locator("h2").boundingBox())!;
        const description = (await card.locator("p").first().boundingBox())!;
        const metadata = (await card.locator("p.metadata").boundingBox())!;
        expect(Math.abs(title.x - description.x)).toBeLessThanOrEqual(1);
        expect(Math.abs(title.x - metadata.x)).toBeLessThanOrEqual(1);
      }
      const languageLink = page.locator(".blog-languages a").first();
      await languageLink.scrollIntoViewIfNeeded();
      await languageLink.focus();
      const geometry = await languageLink.boundingBox();
      const pairedMetadata = (await languageLink.locator("xpath=../..").locator("p.metadata").boundingBox())!;
      expect(geometry?.height).toBeGreaterThanOrEqual(32);
      expect(geometry!.x).toBeGreaterThanOrEqual(0);
      expect(geometry!.x + geometry!.width).toBeLessThanOrEqual(viewport.width);
      expect(Math.abs(geometry!.y + geometry!.height / 2 - pairedMetadata.y - pairedMetadata.height / 2)).toBeLessThanOrEqual(1);
      await expect(languageLink).toBeFocused();
      console.log(`[blog-geometry] ${JSON.stringify({ theme, viewport, headingBottom: heading.y + heading.height, searchTop: search.y, firstPostTop: firstPost.y, pairedLanguageTargetHeight: geometry!.height, metadataCenter: pairedMetadata.y + pairedMetadata.height / 2, languageCenter: geometry!.y + geometry!.height / 2 })}`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: testInfo.outputPath(`blog-languages-${theme}-${viewport.width}.png`), fullPage: true });
    }
  }
});

test("Blog discovery remains a complete real-route list without JavaScript", async ({ browser }) => {
  test.skip(!process.env.BLOG_DISCOVERY_FIXTURE, "Runs on the generated mixed-language discovery fixture.");
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("/blog/");
    await expect(page.locator(".blog-search__results li")).toHaveCount(6);
    const link = page.locator('.blog-search__results h2 a[href="/ko/blog/korean-only-1/"]');
    await link.click();
    await expect(page).toHaveURL(/\/ko\/blog\/korean-only-1\/$/);
    await expect(page.locator("h1")).toHaveText("Post korean-only-1");
  } finally { await context.close(); }
});

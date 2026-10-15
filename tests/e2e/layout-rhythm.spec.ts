import { expect, test } from "@playwright/test";

for (const locale of ["", "/ko"]) {
  test(`compact home introduction reveals its next section ${locale || "en"}`, async ({ page }) => {
    for (const viewport of [{ width:320, height:568 }, { width:390, height:844 }, { width:1024, height:768 }]) {
      await page.setViewportSize(viewport);
      await page.goto(`${locale}/`);
      const nextHeading = page.locator(".home-desk h2");
      const box = await nextHeading.boundingBox();
      expect(box!.y + box!.height).toBeLessThan(viewport.height);
      await expect(page.locator("[data-desk-select]").first()).toBeInViewport();
      const actions = await page.locator(".identity-hero__actions .button").all();
      for (const action of actions) {
        const actionBox = await action.boundingBox();
        expect(actionBox!.y + actionBox!.height).toBeLessThan(viewport.height);
        expect(actionBox!.width).toBeGreaterThanOrEqual(44);
      }
    }
  });
}

for (const width of [1440, 1024, 768, 390, 360]) {
  for (const locale of ["", "/ko"]) {
    test(`stable content rhythm ${locale || "en"} ${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ["/research/", "/projects/"]) {
        await page.goto(`${locale}${route}`);
        await page.waitForTimeout(800);
        const header = page.locator(".page-header");
        const nav = page.locator(".section-nav");
        const firstSection = page.locator(".research-theme, .project-section").first();
        const rhythm = await page.evaluate(() => {
          const pageHeader = document.querySelector(".page-header")!;
          const header = (pageHeader.closest("[data-scene-surface]") ?? pageHeader).getBoundingClientRect();
          const nav = document.querySelector(".section-nav")!.getBoundingClientRect();
          const heading = document.querySelector(".research-heading h2, .project-section h2")!.getBoundingClientRect();
          const controls = document.querySelector("[data-research-controls]")?.getBoundingClientRect();
          const filters=document.querySelector("[data-project-filters]")?.getBoundingClientRect();
          return { headerToNav: (filters?.top ?? controls?.top ?? nav.top) - header.bottom, filtersToNav:filters?nav.top-filters.bottom:null, controlsToNav: controls ? nav.top - controls.bottom : 0, navToContent: heading.top - nav.bottom };
        });
        expect(rhythm.headerToNav).toBeGreaterThanOrEqual(16);
        expect(rhythm.headerToNav).toBeLessThanOrEqual(33);
        if(rhythm.filtersToNav!==null){expect(rhythm.filtersToNav).toBeGreaterThanOrEqual(16);expect(rhythm.filtersToNav).toBeLessThanOrEqual(33);}
        if(route === "/research/")expect(rhythm.controlsToNav).toBeLessThanOrEqual(24);
        expect(rhythm.navToContent).toBeGreaterThanOrEqual(16);
        expect(rhythm.navToContent).toBeLessThanOrEqual(75);
        await expect(nav).toHaveCSS("transform", "none");
        await expect(firstSection).toHaveCSS("transform", "none");
        const before = await firstSection.boundingBox();
        await page.emulateMedia({ reducedMotion: "reduce" });
        const after = await firstSection.boundingBox();
        expect(after!.y).toBeCloseTo(before!.y, 0);
        expect(after!.height).toBeCloseTo(before!.height, 0);
        await expect(header.locator("h1")).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
        await page.emulateMedia({ reducedMotion: "no-preference" });
      }
    });
  }
}

test("paired information blocks start at the same content line", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/projects/paperflow/");
  const pair = page.locator(".split-section").first();
  const firstContentTops = await pair.locator(":scope > div").evaluateAll((blocks) => blocks.map((block) => {
    const heading = block.querySelector("h2")!.getBoundingClientRect();
    const content = block.querySelector("p, ul")!.getBoundingClientRect();
    return content.top - heading.bottom;
  }));
  expect(Math.abs(firstContentTops[0]! - firstContentTops[1]!)).toBeLessThanOrEqual(1);
  await expect(page.locator(".scenario")).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(page.locator(".scenario")).toHaveCSS("border-bottom-width", "0px");
  await expect(page.locator(".scenario")).toHaveCSS("padding-bottom", "0px");
});

test("public content never inherits undefined legacy typography tokens", async ({ page }) => {
  await page.goto("/projects/");
  await expect(page.locator(".tech-stack li").first()).toHaveCSS("font-size", "14px");
  await page.goto("/");
  await expect(page.locator('[data-desk-story="0"] .home-desk__open ul')).toHaveCSS("list-style-type", "disc");
});

test("workflow motion traces the selected public path without moving content", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/projects/gnaroshi-dev/");
  const diagram = page.locator("[data-system-explorer]");
  const control = diagram.locator('.system-diagram__svg--desktop [data-explorer-control="studio"]');
  await control.click();
  const downstream = diagram.locator('.system-diagram__svg--desktop .system-diagram__edge[data-relation="downstream"]').first();
  await expect(downstream).toHaveCSS("animation-name", "system-flow-trace");
  const frames = await downstream.evaluate((edge) => {
    const animation = edge.getAnimations()[0]!;
    animation.pause();
    animation.currentTime = 0;
    const start = getComputedStyle(edge).strokeDashoffset;
    animation.currentTime = 650;
    const end = getComputedStyle(edge).strokeDashoffset;
    return { start, end };
  });
  expect(frames.start).not.toBe(frames.end);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(downstream).toHaveCSS("animation-name", "none");
  await page.setViewportSize({ width: 390, height: 844 });
  const fallback = diagram.locator('.system-diagram__fallback-control[data-explorer-control="website"]');
  const before = await fallback.boundingBox();
  await fallback.click();
  const after = await fallback.boundingBox();
  expect(after!.height).toBeCloseTo(before!.height, 0);
});

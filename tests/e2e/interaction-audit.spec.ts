import { expect, test, type Page } from "@playwright/test";
import { qaRoutes } from "./qa-routes";

const readingCases = [
  { locale: "en", route: "/papers/", nav: "Reading navigation", overview: "Overview", method: "Reading method" },
  { locale: "ko", route: "/ko/papers/", nav: "논문 읽기 메뉴", overview: "개요", method: "읽는 방법" }
] as const;

const readingViewports = [
  { name: "desktop-900", width: 1440, height: 900 },
  { name: "desktop-1000", width: 1440, height: 1000 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
  { name: "mobile-320", width: 320, height: 568 }
] as const;

for (const readingCase of readingCases) {
  for (const viewport of readingViewports) {
    test(`${readingCase.locale} Reading method exposes and focuses its target at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(readingCase.route);
      const localNav = page.getByRole("navigation", { name: readingCase.nav });
      const link = localNav.getByRole("link", { name: readingCase.method });
      const overview = localNav.getByRole("link", { name: readingCase.overview, exact: true });
      const target = page.locator("#reading-method");

      await link.click();
      await expect(page).toHaveURL(new RegExp(`${readingCase.route.replaceAll("/", "\\/")}#reading-method$`));
      await expect(target).toBeFocused();
      await expect(link).toHaveAttribute("aria-current", "location");
      await expectExactlyOnePaperCurrent(localNav, readingCase.method);
      await expect(overview).not.toHaveAttribute("aria-current");
      await expectNotVisuallyCurrent(overview);
      await expectTargetBelowStickyNavigation(page, target);

      await overview.click();
      await expect(page).toHaveURL(new RegExp(`${readingCase.route.replaceAll("/", "\\/")}$`));
      await expectExactlyOnePaperCurrent(localNav, readingCase.overview);

      await link.click();
      await page.goBack();
      await expect(page).toHaveURL(new RegExp(`${readingCase.route.replaceAll("/", "\\/")}$`));
      await expectExactlyOnePaperCurrent(localNav, readingCase.overview);
      await expect(link).not.toHaveAttribute("aria-current", "location");

      await page.goForward();
      await expect(page).toHaveURL(new RegExp("#reading-method$"));
      await expect(target).toBeFocused();
      await expectExactlyOnePaperCurrent(localNav, readingCase.method);
      await expectTargetBelowStickyNavigation(page, target);

      await page.goto(`${readingCase.route}#reading-method`);
      await expect(target).toBeFocused();
      await expectExactlyOnePaperCurrent(localNav, readingCase.method);
      await expectTargetBelowStickyNavigation(page, target);

      await page.goto(readingCase.route);
      await link.focus();
      await page.keyboard.press("Enter");
      await expect(page).toHaveURL(new RegExp("#reading-method$"));
      await expect(target).toBeFocused();
      await expectExactlyOnePaperCurrent(localNav, readingCase.method);
    });
  }
}

test("Reading overview remains an operable link while its current state changes", async ({ page }) => {
  for (const [route, navName, overview] of [
    ["/papers/", "Reading navigation", "Overview"],
    ["/ko/papers/", "논문 읽기 메뉴", "개요"]
  ] as const) {
    await page.goto(route);
    const nav = page.getByRole("navigation", { name: navName });
    const current = nav.getByRole("link", { name: overview, exact: true });
    await expect(current).toHaveAttribute("aria-current", "page");
    expect(await current.evaluate((element) => element.tagName)).toBe("A");
    await expectExactlyOnePaperCurrent(nav, overview);

    await nav.getByRole("link", { name: /Reading method|읽는 방법/ }).click();
    await expect(current).not.toHaveAttribute("aria-current");
    await expectNotVisuallyCurrent(current);
    await current.focus();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(new RegExp(`${route.replaceAll("/", "\\/")}$`));
    await expectExactlyOnePaperCurrent(nav, overview);
  }
});

test("same-page links expose a real target and update the hash", async ({ page }) => {
  for (const route of qaRoutes) {
    await page.goto(route);
    const anchors = page.locator('main a[href*="#"]:visible');
    const hrefs = await anchors.evaluateAll((links) => links
      .map((link) => link.getAttribute("href"))
      .filter((href): href is string => {
        if (!href) return false;
        const target = new URL(href, window.location.href);
        const current = new URL(window.location.href);
        return target.origin === current.origin && target.pathname.replace(/\/$/, "") === current.pathname.replace(/\/$/, "");
      }));
    for (const href of [...new Set(hrefs)]) {
      await page.goto(route);
      const link = page.locator(`main a[href=${JSON.stringify(href)}]`).first();
      const targetId = new URL(href, "https://gnaroshi.dev").hash.slice(1);
      if (!targetId) continue;
      const target = page.locator(`[id=${JSON.stringify(decodeURIComponent(targetId))}]`);
      await expect(target, `${route} target for ${href}`).toHaveCount(1);
      await link.click();
      await expect(page, `${route} hash for ${href}`).toHaveURL(new RegExp(`#${escapeRegExp(targetId)}$`));
      await expect(target, `${route} visibility for ${href}`).toBeInViewport();
      await expect(target, `${route} focus for ${href}`).toBeFocused();
    }
  }
});

test("every visible button has an observable action", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const route of qaRoutes) {
    await page.goto(route);
    const buttons = page.locator("button:visible:not([disabled]):not([data-heading-link])");
    const count = await buttons.count();
    for (let index = 0; index < count; index += 1) {
      await page.goto(route);
      const button = page.locator("button:visible:not([disabled]):not([data-heading-link])").nth(index);
      const before = await controlState(page, button);
      await button.click();
      const after = await controlState(page, button);
      expect(after, `${route}: ${before.label}`).not.toEqual(before);
    }
  }
});

test("theme, locale, and mobile-menu controls preserve observable state", async ({ page }) => {
  await page.goto("/");
  const theme = page.locator(".utility-nav [data-theme-toggle]");
  const beforeTheme = await page.locator("html").getAttribute("data-theme");
  const beforeMeta = await page.locator('meta[name="theme-color"]').getAttribute("content");
  await theme.click();
  await expect(page.locator("html")).not.toHaveAttribute("data-theme", beforeTheme ?? "");
  await expect(page.locator('meta[name="theme-color"]')).not.toHaveAttribute("content", beforeMeta ?? "");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", beforeTheme === "dark" ? "light" : "dark");

  await page.getByRole("link", { name: "한국어" }).first().click();
  await expect(page).toHaveURL(/\/ko\/$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  const trigger = page.getByRole("button", { name: "메뉴" });
  await trigger.click();
  await expect(page.locator("[data-mobile-nav-panel]")).toBeVisible();
  await page.mouse.click(4, 400);
  await expect(page.locator("[data-mobile-nav-panel]")).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("project kind and product status are visible while Studio integration stays secondary", async ({ page }) => {
  for (const route of ["/projects/", "/ko/projects/"]) {
    await page.goto(route);
    for (const kind of ["research", "application", "infrastructure"]) {
      const projects = page.locator(`[data-project-kind="${kind}"]`);
      expect(await projects.count(), `${route}: ${kind}`).toBeGreaterThan(0);
      await expect(projects.first().locator("[data-project-kind-label]")).toBeVisible();
    }
  }

  for (const route of ["/projects/gnaroshi-studio/", "/ko/projects/gnaroshi-studio/"]) {
    await page.goto(route);
    await expect(page.locator("[data-product-status]")).toBeVisible();
    const integration = page.locator("[data-studio-integration-status]");
    await expect(integration).toBeVisible();
    const productText = await page.locator("[data-product-status]").innerText();
    const integrationText = await integration.innerText();
    expect(integrationText).not.toBe(productText);
    expect(await integration.evaluate((element) => Boolean(element.closest(".technical-facts")))).toBeTruthy();
  }
});

test("bootstrap Reading view does not expose controls without public evidence", async ({ page }) => {
  for (const route of ["/papers/", "/ko/papers/"]) {
    await page.goto(route);
    await expect(page.locator(".paper-stats, .paper-heatmap, .paper-filter-panel, #new-paper-template, #ai-review-workflow, .paper-recall-trend")).toHaveCount(0);
    await expect(page.locator("#reading-method")).toBeVisible();
  }
});

test("three-pass checklist is local-only, persistent, and resettable", async ({ page }) => {
  await page.goto("/papers/");
  const checklist = page.locator("[data-reading-checklist]");
  const inputs = checklist.getByRole("checkbox");
  const reset = checklist.getByRole("button", { name: "Reset" });
  await expect(inputs).toHaveCount(3);
  await expect(reset).toBeDisabled();
  await inputs.first().check();
  await expect(reset).toBeEnabled();
  await page.reload();
  await expect(inputs.first()).toBeChecked();
  await reset.click();
  await expect(inputs.first()).not.toBeChecked();
  await expect(reset).toBeDisabled();
  await expect(inputs.first()).toBeFocused();
  await expect(page.locator(".paper-stats, .paper-heatmap")).toHaveCount(0);
});

test("Projects section overview moves focus to each ordered section", async ({ page }) => {
  for (const route of ["/projects/", "/ko/projects/"]) {
    await page.goto(route);
    const overview = page.locator(".projects-overview");
    await expect(overview.getByRole("link")).toHaveCount(3);
    for (const id of ["selected-projects", "featured-applications", "supporting-applications"]) {
      await page.goto(route);
      const link = overview.locator(`a[href$="#${id}"]`);
      await link.click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect(page.locator(`#${id}`)).toBeFocused();
      await expect(link).toHaveAttribute("aria-current", "location");
      await expect(overview.locator('[aria-current="location"]')).toHaveCount(1);
    }

    await page.goto(`${route}#featured-applications`);
    await expect(page.locator("#featured-applications")).toBeFocused();
    await expect(overview.locator('[aria-current="location"]')).toHaveAttribute("href", /#featured-applications$/);
    await overview.locator('a[href$="#supporting-applications"]').click();
    await page.goBack();
    await expect(page.locator("#featured-applications")).toBeFocused();
    await expect(overview.locator('[aria-current="location"]')).toHaveAttribute("href", /#featured-applications$/);
    await page.goForward();
    await expect(page.locator("#supporting-applications")).toBeFocused();
    await expect(overview.locator('[aria-current="location"]')).toHaveAttribute("href", /#supporting-applications$/);
  }
});

test("Research navigation and diagram zoom preserve focus and scroll state", async ({ page }) => {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 768, height: 1024 },
    { width: 390, height: 844 },
    { width: 320, height: 568 }
  ]) {
    await page.setViewportSize(viewport);
    for (const route of ["/research/", "/ko/research/"]) {
      await page.goto(route);
      const navigation = page.locator(".research-overview");
      await expect(navigation).not.toContainText(/Question [123]|질문 [123]/);
      const link = navigation.getByRole("link").nth(1);
      const hash = new URL((await link.getAttribute("href"))!, "https://gnaroshi.dev").hash;
      await link.click();
      await expect(page).toHaveURL(new RegExp(`${escapeRegExp(hash)}$`));
      await expect(navigation.locator('[aria-current="location"]')).toHaveCount(1);
      await expect(page.locator(hash)).toBeFocused();

      const trigger = page.getByRole("button", { name: /larger diagram|도식 크게 보기/ }).first();
      await trigger.click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      await expect(page.locator("body")).toHaveClass(/media-dialog-open/);
      await page.keyboard.press("Tab");
      await expect(dialog.locator(":focus")).toHaveCount(1);
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
      await expect(page.locator("body")).not.toHaveClass(/media-dialog-open/);
      await expect(trigger).toBeFocused();
    }
  }
});

test("editorial section indexes track scroll with exactly one current item", async ({ page }) => {
  for (const { route, navigationSelector, targetId } of [
    { route: "/research/", navigationSelector: ".research-overview", targetId: "human-ai-research-tools" },
    { route: "/ko/research/", navigationSelector: ".research-overview", targetId: "human-ai-research-tools" },
    { route: "/projects/", navigationSelector: ".projects-overview", targetId: "supporting-applications" },
    { route: "/ko/projects/", navigationSelector: ".projects-overview", targetId: "supporting-applications" }
  ]) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    const navigation = page.locator(navigationSelector);
    const scroller = navigation.locator("[data-in-page-scroller]");
    const firstLink = navigation.locator("[data-in-page-link]").first();
    await expect(firstLink).toHaveAttribute("aria-current", "location");
    await expect.poll(() => firstLink.evaluate((link) => {
      const container = link.closest<HTMLElement>("[data-in-page-scroller]");
      if (!container) return false;
      const linkBounds = link.getBoundingClientRect();
      const containerBounds = container.getBoundingClientRect();
      return linkBounds.left >= containerBounds.left - 1 && linkBounds.right <= containerBounds.right + 1;
    })).toBe(true);
    await page.locator(`#${targetId}`).evaluate((target) => target.scrollIntoView({ block: "start" }));
    await expect(navigation.locator('[aria-current="location"]')).toHaveCount(1);
    await expect(navigation.locator('[aria-current="location"]')).toHaveAttribute("href", new RegExp(`#${escapeRegExp(targetId)}$`));
    await expect.poll(() => scroller.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "auto" }));
    await expect(firstLink).toHaveAttribute("aria-current", "location");
    await expect.poll(() => scroller.evaluate((element) => element.scrollLeft)).toBe(0);
  }
});

test("long editorial pages expose native scroll progress and stop motion on request", async ({ page }) => {
  for (const route of ["/research/", "/projects/", "/projects/gnaroshi-dev/"]) {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(route);
    await expect(page.locator("body")).toHaveAttribute("data-page-progress", "true");
    const progress = page.locator(".site-header__progress");
    const animationName = await progress.evaluate((element) => getComputedStyle(element).animationName);
    if (animationName !== "none") {
      const startTransform = await progress.evaluate((element) => getComputedStyle(element).transform);
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await expect.poll(() => progress.evaluate((element) => getComputedStyle(element).transform)).not.toBe(startTransform);
    }

    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect.poll(() => progress.evaluate((element) => getComputedStyle(element).animationName)).toBe("none");
  }

  await page.goto("/");
  await expect(page.locator("body")).not.toHaveAttribute("data-page-progress", "true");
});

test("signature motion is perceptible and remains optional", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");

  const heroTitle = page.locator(".identity-hero h1");
  await expect(heroTitle).toHaveCSS("animation-name", "site-hero-copy-enter");
  const heroDuration = await heroTitle.evaluate((element) => {
    const value = getComputedStyle(element).animationDuration.split(",")[0]!.trim();
    return value.endsWith("ms") ? Number.parseFloat(value) : Number.parseFloat(value) * 1000;
  });
  expect(heroDuration).toBeGreaterThanOrEqual(600);

  await page.goto("/about/");
  const pageHeader = page.locator(".page-header");
  await expect(pageHeader).toHaveCSS("animation-name", "site-page-rail-enter");
  const railSizes = await pageHeader.evaluate((element) => {
    const [animation] = element.getAnimations();
    if (!animation) return null;
    animation.pause();
    animation.currentTime = 0;
    const start = getComputedStyle(element).backgroundSize;
    animation.currentTime = animation.effect?.getTiming().duration as number;
    const end = getComputedStyle(element).backgroundSize;
    return { start, end };
  });
  expect(railSizes).not.toBeNull();
  expect(railSizes!.start).not.toBe(railSizes!.end);

  await page.goto("/");
  const evidence = page.locator("[data-motion-media]").first();
  await evidence.scrollIntoViewIfNeeded();
  await evidence.hover();
  await expect.poll(() => evidence.locator("img").evaluate((image) => new DOMMatrix(getComputedStyle(image).transform).a)).toBeGreaterThan(1.04);
  await expect.poll(() => evidence.evaluate((element) => Number.parseFloat(getComputedStyle(element, "::after").opacity))).toBeGreaterThan(.8);

  await page.goto("/research/");
  await expect(page.locator(".site-header__progress")).toHaveCSS("height", "4px");
  const sectionAnimation = await page.locator(".research-theme").first().evaluate((element) => ({
    name: getComputedStyle(element).animationName,
    timeline: getComputedStyle(element).animationTimeline
  }));
  if (sectionAnimation.timeline !== "auto") expect(sectionAnimation.name).toContain("site-section-reveal");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".identity-hero h1")).toHaveCSS("animation-name", "none");
  const reducedEvidence = page.locator("[data-motion-media]").first();
  await reducedEvidence.scrollIntoViewIfNeeded();
  await reducedEvidence.hover();
  await expect(reducedEvidence.locator("img")).toHaveCSS("transform", "none");
  await expect.poll(() => reducedEvidence.evaluate((element) => Number.parseFloat(getComputedStyle(element, "::after").opacity))).toBe(0);
});

test("Research navigation restores direct and history-managed locations", async ({ page }) => {
  for (const route of ["/research/", "/ko/research/"]) {
    await page.goto(route);
    const navigation = page.locator(".research-overview");
    const links = navigation.getByRole("link");
    const secondHash = new URL((await links.nth(1).getAttribute("href"))!, "https://gnaroshi.dev").hash;
    const thirdHash = new URL((await links.nth(2).getAttribute("href"))!, "https://gnaroshi.dev").hash;

    await page.goto(`${route}${secondHash}`);
    await expect(page.locator(secondHash)).toBeFocused();
    await expect(navigation.locator('[aria-current="location"]')).toHaveAttribute("href", new RegExp(`${escapeRegExp(secondHash)}$`));
    await links.nth(2).click();
    await page.goBack();
    await expect(page.locator(secondHash)).toBeFocused();
    await page.goForward();
    await expect(page.locator(thirdHash)).toBeFocused();
    await expect(navigation.locator('[aria-current="location"]')).toHaveAttribute("href", new RegExp(`${escapeRegExp(thirdHash)}$`));
  }
});

test("long project headings expose stable copy links with accessible feedback", async ({ page }) => {
  for (const route of ["/projects/gnaroshi-dev/", "/ko/projects/gnaroshi-dev/"]) {
    await page.goto(route);
    const headings = page.locator(".project-detail h2[id]");
    expect(await headings.count()).toBeGreaterThan(8);
    await expect(page.locator("[data-heading-link]")).toHaveCount(await headings.count());
    const button = page.locator("[data-heading-link]").first();
    const firstHeadingId = await headings.first().getAttribute("id");
    await button.click();
    await expect(page).toHaveURL(new RegExp(`#${escapeRegExp(firstHeadingId!)}$`));
    await expect(page.locator("[data-heading-link-status]")).not.toHaveText("");
  }
});

test("project detail table of contents supports direct hash and history", async ({ page }) => {
  await page.goto("/projects/gnaroshi-dev/#repository-boundaries");
  await expect(page.locator("#repository-boundaries")).toBeFocused();
  await page.locator(".project-section-nav a[href$='#current-state']").click();
  await expect(page.locator("#current-state")).toBeFocused();
  await expect(page.locator(".project-section-nav [aria-current='location']")).toHaveAttribute("href", /#current-state$/);
  await page.goBack();
  await expect(page.locator("#repository-boundaries")).toBeFocused();
});

async function expectTargetBelowStickyNavigation(page: Page, target: ReturnType<Page["locator"]>) {
  await expect(target).toBeInViewport();
  const geometry = await page.evaluate(() => {
    const target = document.querySelector("#reading-method")?.getBoundingClientRect();
    const localNav = document.querySelector(".paper-lab-nav")?.getBoundingClientRect();
    return { targetTop: target?.top ?? -1, localNavBottom: localNav?.bottom ?? 0 };
  });
  expect(geometry.targetTop).toBeGreaterThanOrEqual(geometry.localNavBottom - 1);
}

async function expectExactlyOnePaperCurrent(navigation: ReturnType<Page["locator"]>, label: string) {
  const current = navigation.locator('[aria-current="page"], [aria-current="location"]');
  await expect(current).toHaveCount(1);
  await expect(current).toHaveText(label);
  const visualMarkers = await navigation.locator(".paper-lab-nav__groups > a").evaluateAll((items) => items.filter((item) => {
    const borderColor = getComputedStyle(item).borderBottomColor;
    return borderColor !== "transparent" && borderColor !== "rgba(0, 0, 0, 0)";
  }).length);
  expect(visualMarkers).toBe(1);
  if (label !== "Overview" && label !== "개요") {
    await expect(navigation.locator('[data-paper-nav-route-current]')).not.toHaveAttribute("aria-current", "page");
  }
}

async function expectNotVisuallyCurrent(item: ReturnType<Page["locator"]>) {
  const style = await item.evaluate((element) => {
    const computed = getComputedStyle(element);
    return { border: computed.borderBottomColor, color: computed.color };
  });
  const selected = await item.locator("xpath=..").locator('[aria-current="page"], [aria-current="location"]').evaluateAll((items) => items.map((element) => getComputedStyle(element).color));
  expect(selected).not.toContain(style.color);
  expect(style.border).toMatch(/transparent|rgba\(0, 0, 0, 0\)/);
}

async function controlState(page: Page, button: ReturnType<Page["locator"]>) {
  return {
    label: await button.getAttribute("aria-label") ?? await button.innerText(),
    url: page.url(),
    expanded: await button.getAttribute("aria-expanded"),
    pressed: await button.getAttribute("aria-pressed"),
    disabled: await button.isDisabled(),
    theme: await page.locator("html").getAttribute("data-theme"),
    bodyClass: await page.locator("body").getAttribute("class"),
    liveText: await page.locator('[aria-live]:visible').allInnerTexts()
  };
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

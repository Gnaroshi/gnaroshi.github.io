import { expect, test, type Page } from "@playwright/test";
import { qaRoutes } from "./qa-routes";

const readingCases = [
  { locale: "en", route: "/papers/", nav: "Reading navigation", overview: "Overview", method: "Reading method" },
  { locale: "ko", route: "/ko/papers/", nav: "논문 읽기 메뉴", overview: "개요", method: "읽는 방법" }
] as const;

const readingViewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 }
] as const;

for (const readingCase of readingCases) {
  for (const viewport of readingViewports) {
    test(`${readingCase.locale} Reading method exposes and focuses its target at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto(readingCase.route);
      const localNav = page.getByRole("navigation", { name: readingCase.nav });
      const link = localNav.getByRole("link", { name: readingCase.method });
      const target = page.locator("#reading-method");

      await link.click();
      await expect(page).toHaveURL(new RegExp(`${readingCase.route.replaceAll("/", "\\/")}#reading-method$`));
      await expect(target).toBeFocused();
      await expect(link).toHaveAttribute("aria-current", "location");
      await expectExactlyOnePaperCurrent(localNav, readingCase.method);
      await expectTargetBelowStickyNavigation(page, target);

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

test("active Reading overview is a current label instead of a self-link", async ({ page }) => {
  for (const [route, navName, overview] of [
    ["/papers/", "Reading navigation", "Overview"],
    ["/ko/papers/", "논문 읽기 메뉴", "개요"]
  ] as const) {
    await page.goto(route);
    const nav = page.getByRole("navigation", { name: navName });
    await expect(nav.getByRole("link", { name: overview, exact: true })).toHaveCount(0);
    await expect(nav.locator('[aria-current="page"]', { hasText: overview })).toHaveCount(1);
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
    const buttons = page.locator("button:visible:not([disabled])");
    const count = await buttons.count();
    for (let index = 0; index < count; index += 1) {
      await page.goto(route);
      const button = page.locator("button:visible:not([disabled])").nth(index);
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

test("Projects section overview moves focus to each ordered section", async ({ page }) => {
  for (const route of ["/projects/", "/ko/projects/"]) {
    await page.goto(route);
    const overview = page.locator(".projects-overview");
    await expect(overview.getByRole("link")).toHaveCount(3);
    for (const id of ["selected-projects", "featured-applications", "supporting-applications"]) {
      await page.goto(route);
      await overview.locator(`a[href="#${id}"]`).click();
      await expect(page).toHaveURL(new RegExp(`#${id}$`));
      await expect(page.locator(`#${id}`)).toBeFocused();
    }
  }
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
  if (label !== "Overview" && label !== "개요") {
    await expect(navigation.locator('[data-paper-nav-route-current]')).not.toHaveAttribute("aria-current", "page");
  }
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

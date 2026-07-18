import { expect, test } from "@playwright/test";
import { getCurrentFocusFreshness } from "../../src/utils/currentFocus";

test("home emits raster social metadata and factual structured data", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "index, follow");
  await expect(page.locator('meta[name="referrer"]')).toHaveAttribute("content", "strict-origin-when-cross-origin");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /default-en\.png$/);
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");
  await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute("content", "630");
  await expect(page.locator('meta[property="og:image:alt"]')).toHaveAttribute("content", /Gnaroshi/);

  const records = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) => scripts.map((script) => JSON.parse(script.textContent ?? "{}")));
  const graphTypes = records.flatMap((record) => (record["@graph"] ?? []).map((entry: { "@type": string }) => entry["@type"]));
  expect(graphTypes).toEqual(expect.arrayContaining(["Person", "WebSite", "ProfilePage"]));
  const person = records.flatMap((record) => record["@graph"] ?? []).find((entry) => entry["@type"] === "Person");
  expect(person).not.toHaveProperty("jobTitle");
  expect(person).not.toHaveProperty("homeLocation");
});

test("project detail has breadcrumbs and source-code structured data", async ({ page }) => {
  for (const slug of ["gnaroshi-vla", "gnaroshi-dev"]) {
    await page.goto(`/projects/${slug}/`);
    await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
    const records = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) => scripts.map((script) => JSON.parse(script.textContent ?? "{}")));
    expect(records.some((record) => record["@type"] === "BreadcrumbList")).toBe(true);
    expect(records.some((record) => record["@type"] === "SoftwareSourceCode")).toBe(true);
  }
  await page.goto("/projects/gnaroshi-vla/");
  await expect(page.getByRole("heading", { level: 2, name: "Current evidence" })).toBeVisible();
  await expect(page.getByText("The current evidence establishes", { exact: false })).toBeVisible();
});

test("404 variants are noindex and root 404 localizes the preserved path", async ({ page }) => {
  await page.goto("/404.html");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
  await expect(page.locator('[data-not-found-locale="en"]')).toBeVisible();

  await page.goto("/ko/404/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("페이지를 찾을 수 없습니다");

  const response = await page.goto("/ko/missing-hardening-route");
  expect(response?.status()).toBe(404);
  await expect(page.locator("html")).toHaveAttribute("lang", "ko");
  await expect(page.locator('[data-not-found-locale="ko"]')).toBeVisible();
  await expect(page.locator('[data-not-found-locale="ko"]:not([hidden]) [data-not-found-path]')).toHaveText("/ko/missing-hardening-route");
});

test("theme toggle updates color, label, icon state, and follows system without an override", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
  await page.goto("/");
  const toggle = page.locator(".utility-nav .theme-toggle");
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#f4f5f2");
  await expect(toggle).toHaveAttribute("aria-label", /dark/i);
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute("content", "#0f1311");
  await expect(toggle).toHaveAttribute("aria-label", /light/i);
  await expect(toggle.locator(".theme-toggle__icon--sun")).toHaveCSS("opacity", "1");

  await page.evaluate(() => localStorage.removeItem("theme"));
  await page.emulateMedia({ colorScheme: "dark" });
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("editorial and empty application routes keep feature boundaries", async ({ page }) => {
  for (const route of ["/", "/about/", "/research/", "/projects/"]) {
    await page.goto(route);
    const styles = await page.locator('link[rel="stylesheet"]').evaluateAll((links) => links.map((link) => (link as HTMLLinkElement).href));
    expect(styles.some((href) => /\/(blog|papers|insights|katex)[._-]/.test(href)), route).toBe(false);
    await expect(page.locator("astro-island"), route).toHaveCount(0);
  }

  await page.goto("/papers/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
  await expect(page.locator("astro-island")).toHaveCount(0);
  const paperStyles = await page.locator('link[rel="stylesheet"]').evaluateAll((links) => links.map((link) => (link as HTMLLinkElement).href));
  expect(paperStyles.some((href) => href.includes("/papers."))).toBe(true);
  expect(paperStyles.some((href) => href.includes("/katex."))).toBe(false);
});

test("About and current-focus surfaces keep truthful semantics", async ({ page }) => {
  await page.goto("/about/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("About");
  await expect(page.locator(".about-monogram")).toHaveCount(0);
  const skillGroups = page.locator(".about-skill-list");
  expect(await skillGroups.count()).toBeGreaterThan(0);
  for (const group of await skillGroups.all()) {
    expect(await group.evaluate((element) => ["UL", "OL"].includes(element.tagName))).toBe(true);
    expect(await group.getByRole("listitem").count()).toBeGreaterThan(0);
  }

  await page.goto("/now/");
  const state = await page.locator("[data-current-focus-state]").getAttribute("data-current-focus-state");
  expect(["fresh", "stale", "future", "invalid"]).toContain(state);
  if (state === "fresh") {
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("What I’m doing now");
    await expect(page.locator(".now-freshness-notice")).toHaveCount(0);
  } else {
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Last recorded focus");
    await expect(page.locator(".now-freshness-notice")).toBeVisible();
    await expect(page.locator(".now-freshness-notice a")).toHaveAttribute("href", "/research/");
  }

  await page.goto("/");
  await expect(page.locator(".home-editorial")).toHaveAttribute("data-current-focus-state", state!);
  await expect(page.locator(".identity-hero__focus")).toHaveCount(state === "fresh" ? 1 : 0);
  if (state === "fresh") {
    await expect(page.locator(".identity-hero__focus")).toHaveAttribute("href", "/now/");
    await expect(page.locator(".identity-hero__focus time")).toHaveAttribute("datetime", /^\d{4}-\d{2}-\d{2}$/);
  }
});

test("current-focus freshness policy has explicit fresh, stale, future, and invalid boundaries", () => {
  const now = new Date("2026-07-17T12:00:00.000Z");
  expect(getCurrentFocusFreshness("2026-06-02", now)).toEqual({ ageDays: 45, status: "fresh", isFresh: true });
  expect(getCurrentFocusFreshness("2026-06-01", now)).toEqual({ ageDays: 46, status: "stale", isFresh: false });
  expect(getCurrentFocusFreshness("2026-07-18", now)).toEqual({ ageDays: -1, status: "future", isFresh: false });
  expect(getCurrentFocusFreshness("not-a-date", now)).toEqual({ ageDays: null, status: "invalid", isFresh: false });
});

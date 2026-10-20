import { gotoPublicRoute } from "./compatibilityNavigation";
import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { hasPublicPaperCollection } from "./public-paper-fixture";

for (const prefix of ["", "/ko"]) {
  test(`expanded media remains accessible ${prefix || "en"}`, { tag: "@a11y" }, async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    for (const theme of ["light", "dark"]) {
      await gotoPublicRoute(page, `${prefix}/research/`);
      await page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
      await page.locator('[data-research-figure]:not([aria-hidden]) [data-media-zoom-open]').click();
      const dialog = page.getByRole("dialog");
      await expect(dialog.locator("[data-media-zoom-close]")).toBeFocused();
      await page.keyboard.press("Tab");
      await expect(dialog.locator("footer a")).toBeFocused();
      expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
    }
  });

  test(`concise core pages preserve useful content ${prefix || "en"}`, async ({ page }) => {
    await gotoPublicRoute(page, `${prefix}/`);
    await expect(page.locator(".identity-hero__headline")).toBeVisible();
    await expect(page.locator("[data-project-desk]")).toHaveCSS("border-bottom-width", "0px");
    await expect(page.locator(".identity-hero__bio, .home-research, [data-system-workflow]")).toHaveCount(0);
    expect(await page.locator("main section").count()).toBeLessThanOrEqual(3);
    await page.locator("[data-desk-flip]").click();
    await expect(page.locator('[data-desk-back][aria-hidden="false"] ol')).toHaveCount(1);
    await expect(page.locator("[data-desk-workflow], .home-desk__open")).toHaveCount(0);

    await gotoPublicRoute(page, `${prefix}/about/`);
    await expect(page.locator(".interactive-identity")).toBeVisible();
    await expect(page.locator(".interactive-identity figcaption, #about-skills, [data-tool-connections]")).toHaveCount(0);
    await expect(page.locator(".prose-stack p")).toHaveCount(1);
    await expect(page.locator("#about-values, #about-tools, #about-links")).toHaveCount(0);

    await gotoPublicRoute(page, `${prefix}/research/`);
    await expect(page.locator(".page-header .eyebrow, .page-header .lede")).toHaveCount(0);
    await expect(page.locator(".research-theme__media figcaption").first()).toContainText(prefix ? "실험 결과 아님" : "not experiment evidence");

    await gotoPublicRoute(page, `${prefix}/projects/gnaroshi-studio/`);
    await expect(page.locator("#current-limitations")).toBeVisible();
    await expect(page.locator("#data-privacy")).toBeVisible();
    await expect(page.locator(".at-a-glance dt")).toHaveCount(2);
    await expect(page.locator(".project-technical-details")).not.toHaveAttribute("open", "");
    await expect(page.locator("[data-studio-integration-status]")).toBeHidden();
    await page.locator(".project-technical-details > summary").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("[data-studio-integration-status]")).toBeVisible();
    await expect(page.locator(".technical-facts code")).toHaveText(/[0-9a-f]{12}/);
    await gotoPublicRoute(page, `${prefix}/projects/gnaroshi-studio/#technical-notes`);
    await expect(page.locator(".project-technical-details")).toHaveAttribute("open", "");
    await expect(page.locator("#technical-notes")).toBeFocused();
    await gotoPublicRoute(page, `${prefix}/projects/gnaroshi-studio/#project-overview`);
    await expect(page.locator(".project-technical-details")).toHaveAttribute("open", "");
    await expect(page.locator("#project-overview")).toBeFocused();
  });

  test(`empty tools say the state once ${prefix || "en"}`, async ({ page }) => {
    for (const route of ["queue", "reviews", "implementations", "graph", "week", "growth"]) {
      await gotoPublicRoute(page, `${prefix}/${route}/`);
      await expect(page.locator("main h1")).toHaveCount(1);
      await expect(page.locator(".app-empty-state .eyebrow, .app-empty-state p, .page-header .lede, .paper-hero .lede")).toHaveCount(0);
      await expect(page.locator(".app-empty-state .button")).toHaveCount(1);
    }
    for (const route of ["formula", "questions"]) {
      await gotoPublicRoute(page, `${prefix}/${route}/`);
      const destination = hasPublicPaperCollection() ? `${prefix}/papers/` : `${prefix}/research/#human-ai-research-tools`;
      await expect(page).toHaveURL(new URL(destination, page.url()).href);
      await expect(page.locator("#reading-method, [data-reading-checklist]")).toHaveCount(0);
    }
  });
}

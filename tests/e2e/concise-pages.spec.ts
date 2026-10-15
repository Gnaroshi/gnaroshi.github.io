import { expect, test } from "@playwright/test";

for (const prefix of ["", "/ko"]) {
  test(`concise core pages preserve useful content ${prefix || "en"}`, async ({ page }) => {
    await page.goto(`${prefix}/`);
    await expect(page.locator(".identity-hero__headline")).toBeVisible();
    await expect(page.locator("[data-project-desk]")).toHaveCSS("border-bottom-width", "0px");
    await expect(page.locator(".identity-hero__bio, .home-research, [data-system-workflow]")).toHaveCount(0);
    expect(await page.locator("main section").count()).toBeLessThanOrEqual(3);
    await page.locator("[data-desk-flip]").click();
    await expect(page.locator('[data-desk-back][aria-hidden="false"] ol')).toHaveCount(1);
    await expect(page.locator("[data-desk-workflow], .home-desk__open")).toHaveCount(0);

    await page.goto(`${prefix}/about/`);
    await expect(page.locator(".interactive-identity")).toBeVisible();
    await expect(page.locator(".interactive-identity figcaption, #about-skills, [data-tool-connections]")).toHaveCount(0);
    await expect(page.locator(".prose-stack p")).toHaveCount(1);
    await expect(page.locator("#about-values, #about-tools, #about-links")).toHaveCount(0);

    await page.goto(`${prefix}/research/`);
    await expect(page.locator(".page-header .eyebrow, .page-header .lede")).toHaveCount(0);
    await expect(page.locator(".research-theme__media figcaption").first()).toContainText(prefix ? "실험 결과 아님" : "not experiment evidence");

    await page.goto(`${prefix}/projects/gnaroshi-studio/`);
    await expect(page.locator("#current-limitations")).toBeVisible();
    await expect(page.locator("#data-privacy")).toBeVisible();
    await expect(page.locator(".at-a-glance dt")).toHaveCount(2);
    await expect(page.locator(".project-technical-details")).not.toHaveAttribute("open", "");
    await expect(page.locator("[data-studio-integration-status]")).toBeHidden();
    await page.locator(".project-technical-details > summary").focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("[data-studio-integration-status]")).toBeVisible();
    await expect(page.locator(".technical-facts code")).toHaveText(/[0-9a-f]{12}/);
    await page.goto(`${prefix}/projects/gnaroshi-studio/#technical-notes`);
    await expect(page.locator(".project-technical-details")).toHaveAttribute("open", "");
    await expect(page.locator("#technical-notes")).toBeFocused();
    await page.goto(`${prefix}/projects/gnaroshi-studio/#project-overview`);
    await expect(page.locator(".project-technical-details")).toHaveAttribute("open", "");
    await expect(page.locator("#project-overview")).toBeFocused();
  });

  test(`empty tools say the state once ${prefix || "en"}`, async ({ page }) => {
    for (const route of ["queue", "reviews", "formula", "questions", "implementations", "graph", "week", "growth"]) {
      await page.goto(`${prefix}/${route}/`);
      await expect(page.locator("main h1")).toHaveCount(1);
      await expect(page.locator(".app-empty-state .eyebrow, .app-empty-state p, .page-header .lede, .paper-hero .lede")).toHaveCount(0);
      await expect(page.locator(".app-empty-state .button")).toHaveCount(1);
    }
  });
}

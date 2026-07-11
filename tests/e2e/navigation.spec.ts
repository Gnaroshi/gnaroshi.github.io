import { expect, test } from "@playwright/test";

test("desktop navigation stays concise", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const primary = page.getByRole("navigation", { name: "Primary navigation" });
  await expect(primary.getByRole("link")).toHaveCount(4);
  await expect(primary.getByRole("link", { name: "Writing" })).toHaveCount(0);
  await expect(primary.getByRole("link", { name: "Paper Lab" })).toHaveAttribute("href", "/papers");
  await expect(page.locator(".utility-nav").getByRole("link", { name: "Growth" })).toHaveCount(0);
  await expect(page.locator(".site-footer").getByRole("link", { name: /Writing|Growth|RSS/ })).toHaveCount(0);
  await expect(page.locator(".home-notes")).toHaveCount(0);
  await expect(page.locator('.identity-hero__actions a[href="/blog/"]')).toHaveCount(0);
});

test("mobile menu traps focus, locks scroll, and returns focus on Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const trigger = page.getByRole("button", { name: /menu/i });
  const panel = page.locator("[data-mobile-nav-panel]");

  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(panel).toBeVisible();
  await expect(page.locator("body")).toHaveClass(/mobile-nav-open/);
  await expect(panel.getByRole("link").first()).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(panel).toBeHidden();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("body")).not.toHaveClass(/mobile-nav-open/);
  await expect(trigger).toBeFocused();
});

test("empty Paper Lab navigation exposes only onboarding", async ({ page }) => {
  await page.goto("/papers");
  const localNav = page.getByRole("navigation", { name: "Paper Lab navigation" });
  await expect(localNav).toBeVisible();
  await expect(localNav.locator("details")).toHaveCount(1);
  await localNav.locator("summary").click();
  await expect(localNav.locator("details").getByRole("link")).toHaveCount(2);
  await expect(localNav.getByRole("link", { name: "Overview" })).toHaveAttribute("href", "/papers/");
  await expect(localNav.getByRole("link", { name: "Reading method" })).toHaveAttribute("href", "/papers/#reading-method");
  await expect(localNav.locator('a[href^="/queue"], a[href^="/reviews"], a[href^="/formula"], a[href^="/questions"], a[href^="/implementations"], a[href^="/week"], a[href^="/graph"]')).toHaveCount(0);
});

test("English and Korean bootstrap navigation are capability-equivalent", async ({ page }) => {
  const signatures = [];
  for (const route of ["/", "/ko/"]) {
    await page.goto(route);
    signatures.push(await page.locator(".site-header").getAttribute("data-navigation-signature"));
  }
  expect(signatures).toEqual(["research|projects|paper-lab|about", "research|projects|paper-lab|about"]);
});

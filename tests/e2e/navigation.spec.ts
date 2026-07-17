import { expect, test } from "@playwright/test";

test("desktop navigation stays concise", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const primary = page.getByRole("navigation", { name: "Primary navigation" });
  await expect(primary.getByRole("link")).toHaveCount(4);
  await expect(primary.getByRole("link", { name: "Writing" })).toHaveCount(0);
  await expect(primary.getByRole("link", { name: "Reading" })).toHaveAttribute("href", "/papers/");
  await expect(page.getByRole("link", { name: "Activity", exact: true })).toHaveCount(0);
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

test("Reading local navigation exposes only available destinations without expandable menus", async ({ page }) => {
  await page.goto("/papers/");
  const localNav = page.getByRole("navigation", { name: "Reading navigation" });
  await expect(localNav).toBeVisible();
  await expect(localNav.locator("details")).toHaveCount(0);
  await expect(localNav.getByRole("link")).toHaveCount(2);
  await expect(localNav.getByRole("link", { name: "Overview" })).toHaveAttribute("href", "/papers/");
  await expect(localNav.getByRole("link", { name: "Overview" })).toHaveAttribute("aria-current", "page");
  await expect(localNav.getByRole("link", { name: "Reading method" })).toHaveAttribute("href", "/papers/#reading-method");
  await expect(localNav.getByRole("link", { name: "Read", exact: true })).toHaveCount(0);
  await expect(localNav).not.toContainText("+");
});

test("current locale and footer location are inert current labels", async ({ page }) => {
  await page.goto("/about/");
  await expect(page.locator(".utility-nav .language-switcher__current")).toHaveText("EN");
  await expect(page.locator('.utility-nav .language-switcher a[lang="en"]')).toHaveCount(0);
  const footer = page.getByRole("navigation", { name: "Footer navigation" });
  await expect(footer.getByRole("link", { name: "About", exact: true })).toHaveCount(0);
  await expect(footer.locator('[aria-current="page"]')).toHaveText("About");
});

test("evidence-gated Reading routes show parent context without advertising unavailable tools", async ({ page }) => {
  for (const [route, label] of [
    ["/growth/", "Back to Reading"],
    ["/week/", "Back to Reading"],
    ["/graph/", "Back to Reading"],
    ["/ko/growth/", "논문 읽기로 돌아가기"],
    ["/ko/week/", "논문 읽기로 돌아가기"],
    ["/ko/graph/", "논문 읽기로 돌아가기"]
  ] as const) {
    await page.goto(route);
    const navigation = page.getByRole("navigation", { name: route.startsWith("/ko/") ? "논문 읽기 메뉴" : "Reading navigation" });
    await expect(navigation.getByRole("link", { name: label })).toHaveAttribute("href", route.startsWith("/ko/") ? "/ko/papers/" : "/papers/");
    await expect(navigation.locator('[aria-current]')).toHaveCount(0);
    await expect(navigation).not.toContainText(/Reviews|Formula|Graph|복습|수식|연결/);
  }
});

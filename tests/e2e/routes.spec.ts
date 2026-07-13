import { expect, test } from "@playwright/test";

const routes = [
  "/",
  "/about",
  "/research",
  "/projects",
  "/blog",
  "/papers",
  "/growth",
  "/now",
  "/contact",
  "/queue",
  "/reviews",
  "/formula",
  "/questions",
  "/implementations",
  "/graph",
  "/week"
];

for (const route of routes) {
  test(`${route} renders without browser errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("pageerror", (error) => errors.push(error.message));

    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main#content")).toBeVisible();
    await expect(page.locator("h1")).toHaveCount(1);
    expect(errors).toEqual([]);
  });
}

test("custom 404 renders useful navigation", async ({ page }) => {
  const response = await page.goto("/404.html");
  expect([200, 404]).toContain(response?.status());
  await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
  const recovery = page.getByRole("region", { name: "Useful links" });
  await expect(recovery.getByRole("link", { name: "Home" })).toBeVisible();
  await expect(recovery.getByRole("link", { name: "Projects" })).toBeVisible();
  await expect(recovery.getByRole("link", { name: "Reading" })).toBeVisible();
});

test("main routes do not overflow at 390px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of routes) {
    await page.goto(route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, `${route} horizontal overflow`).toBeLessThanOrEqual(1);
  }
});

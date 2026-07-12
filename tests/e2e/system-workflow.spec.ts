import { expect, test } from "@playwright/test";

const repositoryNames = [
  "gnaroshi-paper-lab",
  "gnaroshi-writing",
  "gnaroshi-studio",
  "gnaroshi-api",
  "gnaroshi-content-feed",
  "gnaroshi.github.io"
] as const;

const publicRepositories = new Map([
  ["content-feed", "https://github.com/Gnaroshi/gnaroshi-content-feed"],
  ["website", "https://github.com/Gnaroshi/gnaroshi.github.io"]
]);

test.describe("public system workflow", () => {
  for (const route of ["/", "/ko/"] as const) {
    test(`${route} renders one compact static flow diagram`, async ({ page }) => {
      await page.goto(route);
      const workflow = page.locator('[data-system-workflow="compact"]');
      await expect(workflow).toHaveCount(1);
      await expect(workflow.locator(".system-diagram")).toBeVisible();
      await expect(workflow.locator("astro-island")).toHaveCount(0);
      await expect(workflow.locator(".system-repository")).toHaveCount(0);
      await expect(page.locator(".home-loop, #research-loop-heading")).toHaveCount(0);

      for (const repositoryName of repositoryNames) {
        await expect(workflow.locator("svg").first().getByText(repositoryName, { exact: true })).toHaveCount(1);
      }
      await expect(workflow.locator('[data-connection-type="optional-service"]').first()).toHaveClass(/system-diagram__edge--optional/);
    });
  }

  for (const route of ["/projects/gnaroshi-dev/", "/ko/projects/gnaroshi-dev/"] as const) {
    test(`${route} renders the diagram before collapsed repository boundaries`, async ({ page }) => {
      await page.goto(route);
      const workflow = page.locator('#repository-workflow[data-system-workflow="full"]');
      await expect(workflow).toBeVisible();
      await expect(workflow.locator(".system-diagram")).toBeVisible();
      await expect(workflow.locator(".system-workflow__boundaries")).not.toHaveAttribute("open", "");

      for (const repositoryName of repositoryNames) {
        await expect(workflow.locator(".system-workflow__boundaries").getByText(repositoryName, { exact: true })).toHaveCount(1);
      }

      for (const id of ["paper-lab", "writing", "studio", "api"] as const) {
        await expect(workflow.locator(`[data-repository-id="${id}"] a`)).toHaveCount(0);
      }

      for (const [id, href] of publicRepositories) {
        const link = workflow.locator(`[data-repository-id="${id}"] a`);
        await expect(link).toHaveAttribute("href", href);
        await expect(link).toHaveAttribute("target", "_blank");
        await expect(link).toHaveAttribute("rel", /noopener/);
      }

      const details = workflow.locator(".system-build-details");
      await expect(details).toHaveCount(1);
      expect(await details.textContent()).not.toMatch(/dirty state|branch name|API health|private CI/i);
    });
  }

  test("English and Korean variants expose the same repository and edge model", async ({ page }) => {
    const models = [];
    for (const route of ["/projects/gnaroshi-dev/", "/ko/projects/gnaroshi-dev/"]) {
      await page.goto(route);
      const diagram = page.locator(".system-diagram__svg--desktop");
      models.push({
        nodes: await diagram.locator("[data-diagram-node]").evaluateAll((items) => items.map((item) => item.getAttribute("data-diagram-node"))),
        edges: await diagram.locator("[data-connection-from]").evaluateAll((items) => items.map((item) => `${item.getAttribute("data-connection-from")}->${item.getAttribute("data-connection-to")}:${item.getAttribute("data-connection-type")}`))
      });
    }
    expect(models[0]).toEqual(models[1]);
  });

  test("step numbers are mathematically centered in desktop and mobile diagrams", async ({ page }) => {
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 360, height: 800 }]) {
      await page.setViewportSize(viewport);
      await page.goto("/projects/gnaroshi-dev/");
      const visibleDiagram = page.locator(viewport.width < 768 ? ".system-diagram__svg--mobile" : ".system-diagram__svg--desktop");
      const offsets = await visibleDiagram.locator(".system-diagram__step").evaluateAll((steps) => steps.map((step) => {
        const circle = step.querySelector("circle")!.getBBox();
        const text = step.querySelector("text")!.getBBox();
        return {
          x: Math.abs((circle.x + circle.width / 2) - (text.x + text.width / 2)),
          y: Math.abs((circle.y + circle.height / 2) - (text.y + text.height / 2))
        };
      }));
      for (const offset of offsets) {
        expect(offset.x).toBeLessThanOrEqual(0.75);
        expect(offset.y).toBeLessThanOrEqual(1.25);
      }
    }
  });

  test("mobile diagram preserves source-to-site order without page overflow", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/ko/");
    const diagram = page.locator(".system-diagram__svg--mobile");
    const positions = await diagram.locator("[data-diagram-node]").evaluateAll((nodes) =>
      Object.fromEntries(
        nodes.map((node) => {
          const group = node as SVGGElement;
          return [group.getAttribute("data-diagram-node"), group.getBBox().y];
        }),
      ),
    );
    expect(positions["paper-lab"]).toBeLessThan(positions.studio);
    expect(positions.writing).toBeLessThan(positions.studio);
    expect(positions.studio).toBeLessThan(positions["content-feed"]);
    expect(positions["content-feed"]).toBeLessThan(positions.website);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  });

  test("bootstrap-empty rendering makes no browser-side GitHub API request", async ({ page }) => {
    const githubApiRequests: string[] = [];
    page.on("request", (request) => {
      if (request.url().startsWith("https://api.github.com/")) githubApiRequests.push(request.url());
    });
    await page.goto("/");
    await expect(page.locator('[data-system-workflow="compact"]')).toBeVisible();
    await expect(page.locator(".home-notes")).toHaveCount(0);
    expect(githubApiRequests).toEqual([]);
  });
});

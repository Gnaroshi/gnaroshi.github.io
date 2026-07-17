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

  test("step numbers are mathematically centered in desktop and compact diagrams", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/projects/gnaroshi-dev/");
    const offsets = await page.locator(".system-diagram__svg--desktop .system-diagram__step").evaluateAll((steps) => steps.map((step) => {
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

    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/projects/gnaroshi-dev/");
    for (const marker of await page.locator(".system-diagram__fallback-step").all()) {
      const offset = await marker.evaluate((element) => {
        const outer = element.getBoundingClientRect();
        const inner = element.firstElementChild!.getBoundingClientRect();
        return {
          x: Math.abs((outer.left + outer.width / 2) - (inner.left + inner.width / 2)),
          y: Math.abs((outer.top + outer.height / 2) - (inner.top + inner.height / 2))
        };
      });
      expect(offset.x).toBeLessThanOrEqual(0.75);
      expect(offset.y).toBeLessThanOrEqual(0.75);
    }
  });

  test("mobile diagram preserves source-to-site order without page overflow", async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto("/ko/");
    const stages = page.locator(".system-diagram__fallback [data-flow-stage]");
    await expect(stages).toHaveCount(4);
    expect(await stages.evaluateAll((items) => items.map((item) => item.getAttribute("data-flow-stage")))).toEqual(["1", "2", "3", "4"]);
    for (const stage of await stages.all()) {
      await expect(stage.locator("strong")).not.toHaveText("");
      await expect(stage.locator("div > span")).not.toHaveText("");
    }
    const positions = await stages.evaluateAll((items) => items.map((item) => item.getBoundingClientRect().top));
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(1);
  });

  test("workflow labels remain legible at tablet and desktop widths", async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 900 });
    await page.goto("/projects/gnaroshi-dev/");
    const fallback = page.locator(".system-diagram__fallback");
    await expect(fallback).toBeVisible();
    const fallbackSizes = await fallback.locator("strong, li > div > span").evaluateAll((items) => items.map((item) => Number.parseFloat(getComputedStyle(item).fontSize)));
    expect(Math.min(...fallbackSizes)).toBeGreaterThanOrEqual(14);
    const stagePositions = await fallback.locator("[data-flow-stage]").evaluateAll((items) => items.map((item) => item.getBoundingClientRect().top));
    expect(stagePositions).toEqual([...stagePositions].sort((a, b) => a - b));
    expect(new Set(stagePositions).size).toBe(stagePositions.length);

    await page.setViewportSize({ width: 1024, height: 900 });
    await page.goto("/projects/gnaroshi-dev/");
    const labels = page.locator(".system-diagram__svg--desktop .system-diagram__repo");
    await expect(labels.first()).toBeVisible();
    const renderedHeights = await labels.evaluateAll((items) => items.map((item) => item.getBoundingClientRect().height));
    expect(Math.min(...renderedHeights)).toBeGreaterThanOrEqual(12);
    const fills = await labels.evaluateAll((items) => items.map((item) => getComputedStyle(item).fill));
    const secondary = await page.locator("html").evaluate(() => {
      const probe = document.createElement("span");
      probe.style.color = "var(--color-text-secondary)";
      document.body.append(probe);
      const value = getComputedStyle(probe).color;
      probe.remove();
      return value;
    });
    expect(new Set(fills)).toEqual(new Set([secondary]));
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

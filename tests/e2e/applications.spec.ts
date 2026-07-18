import { expect, test } from "@playwright/test";

const applicationSlugs = ["gnaroshi-studio", "paperflow", "arxiv-discovery", "runshelf", "tr-gpu-monitor", "contentdeck"] as const;
const selectedProjectSlugs = ["gnaroshi-vla", "gnaroshi-dev"] as const;
const projectTemplates = new Map([
  ["gnaroshi-vla","research"],["gnaroshi-dev","infrastructure"],
  ...applicationSlugs.map((slug) => [slug,"application"] as const)
]);
const publicRepositories = new Map([
  ["paperflow", "https://github.com/Gnaroshi/paperflow"],
  ["arxiv-discovery", "https://github.com/Gnaroshi/Arxiv-newest-paper-crawler"],
  ["contentdeck", "https://github.com/Gnaroshi/content-looper"]
]);

test.describe("verified Gnaroshi applications", () => {
  for (const route of ["/projects/", "/ko/projects/"] as const) {
    test(`${route} keeps selected, featured, and supporting work distinct`, async ({ page }) => {
      await page.goto(route);
      await expect(page.locator(".selected-project")).toHaveCount(2);
      await expect(page.locator(".featured-app")).toHaveCount(3);
      await expect(page.locator(".supporting-app")).toHaveCount(3);
      for (const group of ["research-workflow", "system-utilities", "learning-tools"]) {
        await expect(page.locator(`.supporting-app[data-application-group="${group}"]`)).toHaveCount(1);
      }
      await expect(page.locator(".featured-app picture img")).toHaveCount(3);
      await expect(page.locator(".supporting-app picture")).toHaveCount(0);
      for (const slug of applicationSlugs) {
        const expectedLinks = ["gnaroshi-studio", "paperflow", "arxiv-discovery"].includes(slug) ? 2 : 1;
        await expect(page.locator(`main a[href$="/projects/${slug}/"]`)).toHaveCount(expectedLinks);
      }
      const cards = page.locator("[data-project-id]");
      for (let index=0;index<await cards.count();index+=1) {
        const card=cards.nth(index);
        await expect(card.locator("[data-card-summary]")).toHaveCount(1);
        await expect(card.locator("time")).toHaveCount(0);
        const max=(await card.getAttribute("class"))?.includes("supporting-app") ? 3 : 4;
        expect(await card.locator('[data-tech-stack="strip"] li').count()).toBeLessThanOrEqual(max);
      }
    });
  }

  for (const localePrefix of ["", "/ko"] as const) for (const [slug,template] of projectTemplates) {
    test(`${localePrefix || "/en"} ${slug} uses the ${template} template`, async ({ page }) => {
      await page.goto(`${localePrefix}/projects/${slug}/`);
      await expect(page.locator(`[data-project-template="${template}"]`)).toHaveCount(1);
      await expect(page.locator("[data-project-template]")).toHaveCount(1);
      const techItems=page.locator('[data-tech-stack="grid"] li');
      expect(await techItems.count()).toBeGreaterThanOrEqual(3);
      for(let index=0;index<await techItems.count();index+=1){await expect(techItems.nth(index).locator("svg")).toHaveAttribute("aria-label",/.+/);await expect(techItems.nth(index).locator("span")).not.toHaveText("");}
      const disclosure=page.locator(".scenario figcaption span,.scenario__disclosure");
      expect(await disclosure.count()).toBeGreaterThan(0);
      for(let index=0;index<await disclosure.count();index+=1) await expect(disclosure.nth(index)).not.toHaveText("");
    });
  }

  for (const localePrefix of ["", "/ko"] as const) {
    for (const slug of selectedProjectSlugs) {
      test(`${localePrefix || "/en"} ${slug} shows complete evidence and project facts`, async ({ page }) => {
        await page.goto(`${localePrefix}/projects/${slug}/`);
        await expect(page.locator(".primary-evidence picture img")).toHaveCount(1);
        await expect(page.locator(".primary-evidence figcaption")).toHaveCount(1);
        await expect(page.locator(".at-a-glance")).toHaveCount(1);
        await expect(page.locator("[data-project-template] .split-section")).toHaveCount(3);

        for (const width of [1440, 360]) {
          await page.setViewportSize({ width, height: 900 });
          await page.reload();
          const geometry = await page.locator(".primary-evidence").evaluate((element) => {
            const media = element.querySelector(".primary-evidence__frame")!.getBoundingClientRect();
            const caption = element.querySelector("figcaption")!.getBoundingClientRect();
            const figure = element.getBoundingClientRect();
            return {
              order: caption.top - media.bottom,
              containment: figure.bottom - caption.bottom,
              overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
            };
          });
          expect(geometry.order).toBeGreaterThanOrEqual(-1);
          expect(geometry.containment).toBeGreaterThanOrEqual(-1);
          expect(geometry.overflow).toBeLessThanOrEqual(1);
        }
      });
    }

    for (const slug of applicationSlugs) {
      test(`${localePrefix || "/en"} ${slug} shows approved evidence and complete facts`, async ({ page }) => {
        await page.goto(`${localePrefix}/projects/${slug}/`);
        await expect(page.locator(".primary-evidence picture img")).toHaveCount(1);
        await expect(page.locator(".primary-evidence figcaption")).toHaveCount(1);
        await expect(page.locator(".scenario picture img")).toHaveCount(2);
        await expect(page.locator(".scenario figcaption")).toHaveCount(2);
        const imageSources = await page.locator(".primary-evidence img,.scenario img").evaluateAll((images) => images.map((image) => (image as HTMLImageElement).currentSrc));
        expect(new Set(imageSources).size).toBe(imageSources.length);
        for (const figure of await page.locator(".primary-evidence,.scenario figure").all()) {
          const containment = await figure.evaluate((element) => {
            const figureBox = element.getBoundingClientRect();
            const captionBox = element.querySelector("figcaption")?.getBoundingClientRect();
            if (!captionBox) throw new Error("Expected every evidence figure to contain a caption");
            return figureBox.bottom - captionBox.bottom;
          });
          expect(containment).toBeGreaterThanOrEqual(-1);
        }

        await page.setViewportSize({ width: 360, height: 800 });
        await page.reload();
        await expect(page.locator(".primary-evidence figcaption")).toHaveCount(1);
        await expect(page.locator(".scenario figcaption")).toHaveCount(2);
        for (const figure of await page.locator(".primary-evidence,.scenario figure").all()) {
          const geometry = await figure.evaluate((element) => {
            const media = element.querySelector(".primary-evidence__frame,.scenario__media")!.getBoundingClientRect();
            const caption = element.querySelector("figcaption")!.getBoundingClientRect();
            const figureBox = element.getBoundingClientRect();
            return { order: caption.top - media.bottom, containment: figureBox.bottom - caption.bottom };
          });
          expect(geometry.order).toBeGreaterThanOrEqual(-1);
          expect(geometry.containment).toBeGreaterThanOrEqual(-1);
        }
        expect(await page.locator(".tech-groups li").count()).toBeGreaterThanOrEqual(3);
        await expect(page.locator(".technical-facts code")).toHaveText(/[0-9a-f]{12}/);
        await expect(page.locator("[data-product-status]")).toHaveCount(1);
        await expect(page.locator("[data-studio-integration-status]")).toHaveCount(1);
        expect(await page.locator("[data-product-status]").getAttribute("data-product-status")).not.toBe(
          await page.locator("[data-studio-integration-status]").getAttribute("data-studio-integration-status")
        );
        await expect(page.locator("main")).not.toContainText("Integration in review");
      });
    }
  }

  test("application cards expose distinct pixel role identities", async ({ page }) => {
    await page.goto("/projects/");
    const keyColors = new Set<string>();
    for (const slug of applicationSlugs) {
      const icon = page.locator(`[data-project-id="${slug}"] [data-app-id="${slug}"]`);
      await expect(icon).toHaveCount(1);
      const image = icon.locator("img");
      await expect(image).toHaveAttribute("src", `/media/identity/apps/${slug}-64.png`);
      expect(await image.evaluate((element: HTMLImageElement) => ({
        complete: element.complete,
        width: element.naturalWidth,
        rendering: getComputedStyle(element).imageRendering,
      }))).toEqual({ complete: true, width: 64, rendering: "pixelated" });
      const keyColor = await icon.evaluate((element) => getComputedStyle(element).getPropertyValue("--app-key").trim());
      expect(keyColor, slug).not.toBe("");
      keyColors.add(keyColor);
    }
    expect(keyColors.size).toBe(applicationSlugs.length);
  });

  test("only public application repositories receive public links", async ({ page }) => {
    for (const slug of applicationSlugs) {
      await page.goto(`/projects/${slug}/`);
      const links = page.locator(".project-links a");
      const expected = publicRepositories.get(slug);
      if (expected) { await expect(links).toHaveCount(1); await expect(links).toHaveAttribute("href", expected); }
      else await expect(links).toHaveCount(0);
    }
  });

  test("publishing and managed-application diagrams remain separate", async ({ page }) => {
    await page.goto("/projects/gnaroshi-dev/");
    await expect(page.locator('#repository-workflow[data-system-workflow="full"]')).toHaveCount(1);
    await expect(page.locator(".managed-applications")).toHaveCount(1);
  });

  for (const localePrefix of ["", "/ko"] as const) for (const theme of ["light", "dark"] as const) {
    test(`${localePrefix || "/en"} ${theme} project card rows stay aligned`, async ({ page }) => {
      await page.addInitScript((selectedTheme) => localStorage.setItem("theme", selectedTheme), theme);

      const assertAligned = async (root: string, parts: readonly string[], expectedCount: number, tolerance = 1) => {
        for (const part of parts) {
          const tops = await page.locator(`${root} [data-card-part="${part}"]`).evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().top));
          expect(tops, `${root} ${part} hook count`).toHaveLength(expectedCount);
          expect(Math.max(...tops) - Math.min(...tops), `${root} ${part}`).toBeLessThanOrEqual(tolerance);
        }
      };

      for (const width of [1024, 1100, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.goto(`${localePrefix}/projects/`);
        if (width >= 1100) await assertAligned(".featured-app--paired", ["media", "header", "meta", "summary", "stack"], 2);
        await assertAligned(width < 1100 ? ".supporting-app:nth-child(-n+2)" : ".supporting-app", ["group", "header", "meta", "summary", "platforms", "stack"], width < 1100 ? 2 : 3);
      }

      for (const card of await page.locator(".selected-project,.featured-app,.supporting-app").all()) {
        const hrefs = await card.locator("a[href]").evaluateAll((links) => links.map((link) => link.getAttribute("href")));
        const counts = new Map<string | null, number>();
        for (const href of hrefs) counts.set(href, (counts.get(href) ?? 0) + 1);
        expect(Math.max(...counts.values())).toBeLessThanOrEqual(2);
      }
    });
  }

  test("tablet project cards reflow without narrow three-column cards", async ({ page }) => {
    for (const width of [768, 1024]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/projects/");
      const widths = await page.locator(".supporting-app").evaluateAll((elements) => elements.map((element) => Math.round(element.getBoundingClientRect().width)));
      expect(widths[0], `${width}px first card`).toBeGreaterThanOrEqual(300);
      expect(widths[0]).toBe(widths[1]);
      expect(widths[2]).toBeGreaterThan(widths[0] * 1.9);
    }

    await page.setViewportSize({ width: 1100, height: 1000 });
    await page.goto("/projects/");
    const desktopWidths = await page.locator(".supporting-app").evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().width));
    expect(Math.min(...desktopWidths)).toBeGreaterThanOrEqual(320);
  });

  test("project layout changes at the declared breakpoints", async ({ page }) => {
    for (const [width, expectedColumns] of [[899, "1fr"], [900, "1.15fr 0.85fr"], [1099, "1.15fr 0.85fr"], [1100, "1fr"]] as const) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/projects/");
      const columns = await page.locator('.featured-app[data-project-id="paperflow"]').evaluate((element) => getComputedStyle(element).gridTemplateColumns);
      const columnCount = columns.split(" ").length;
      expect(columnCount, `${width}px columns: ${columns}`).toBe(expectedColumns === "1fr" ? 1 : 2);
    }

    for (const { width, mode } of [{ width:699, mode:"one" }, { width:700, mode:"two" }, { width:1099, mode:"two" }, { width:1100, mode:"three" }] as const) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto("/projects/");
      const cards = page.locator(".supporting-app");
      const containerWidth = (await page.locator(".supporting-apps").boundingBox())!.width;
      const ratios = await cards.evaluateAll((elements, parentWidth) => elements.map((element) => element.getBoundingClientRect().width / parentWidth), containerWidth);
      if (mode === "one") expect(Math.min(...ratios), `${width}px one column`).toBeGreaterThan(.95);
      if (mode === "two") {
        expect(Math.max(...ratios.slice(0, 2)), `${width}px first row`).toBeLessThan(.55);
        expect(ratios[2], `${width}px trailing card`).toBeGreaterThan(.95);
      }
      if (mode === "three") expect(Math.max(...ratios), `${width}px three columns`).toBeLessThan(.35);
    }
  });

  for (const width of [430, 390, 360]) {
    test(`project card content remains ordered at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/ko/projects/");
      for (const card of await page.locator(".featured-app,.supporting-app").all()) {
        const parts = await card.locator("[data-card-part]").evaluateAll((elements) => elements.map((element) => {
          const box = element.getBoundingClientRect();
          return { part: element.getAttribute("data-card-part"), top: box.top, bottom: box.bottom };
        }));
        for (let index = 1; index < parts.length; index += 1) {
          expect(parts[index].top, `${parts[index - 1].part} before ${parts[index].part}`).toBeGreaterThanOrEqual(parts[index - 1].bottom - 1);
        }
      }
    });
  }

  for (const width of [768, 430, 390, 360]) {
    test(`project routes do not overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      for (const route of ["/projects/", ...projectTemplates.keys()].map((slug) => slug === "/projects/" ? slug : `/projects/${slug}/`)) {
        await page.goto(route);
        expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth), route).toBeLessThanOrEqual(1);
      }
    });
  }
});

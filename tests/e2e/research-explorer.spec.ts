import {expect,test} from "@playwright/test";

for(const locale of ["","/ko"])for(const width of [1843,1440,768,390,320])test(`research image gestures stay coupled to the question ${locale||"en"} ${width}`,async({page})=>{
  await page.setViewportSize({width,height:900});await page.goto(`${locale}/research/`);
  const root=page.locator("[data-research-explorer]"),viewport=root.locator("[data-research-viewport]");
  await expect(root).toHaveAttribute("data-selected-topic","0");
  await viewport.scrollIntoViewIfNeeded();
  const box=(await viewport.boundingBox())!;
  await page.mouse.move(box.x+box.width*.8,box.y+Math.min(box.height*.3,100));await page.mouse.down();
  await page.mouse.move(box.x+box.width*.2,box.y+Math.min(box.height*.3,100),{steps:12});await page.mouse.up();
  await expect(root).toHaveAttribute("data-selected-topic","1");
  await expect(root.locator('[data-research-topic]:visible')).toHaveCount(1);
  await expect(root.locator('[data-research-topic-heading]:visible')).toHaveAttribute("id","efficient-model-execution");
  await expect(root.locator('[data-research-figure]:not([aria-hidden])')).toHaveCount(1);
  await expect(root.locator('.research-overview [aria-current]')).toHaveCount(1);
  await expect(page).toHaveURL(/#efficient-model-execution$/);
  await expect(page.locator('.language-switcher a[lang="'+(locale?"en":"ko")+'"]').first()).toHaveAttribute("href",`${locale?"":"/ko"}/research/#efficient-model-execution`);
  await viewport.focus();await viewport.press("End");await expect(root).toHaveAttribute("data-selected-topic","2");
  await page.goBack();await expect(root).toHaveAttribute("data-selected-topic","1");
  await page.goForward();await expect(root).toHaveAttribute("data-selected-topic","2");
  await page.goBack();await page.goBack();await expect(root).toHaveAttribute("data-selected-topic","0");
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  await expect(root.locator(".research-theme__header:visible")).toHaveCSS("outline-style","none");
});

test("changing a research question closes stale media and restores usable focus",async({page})=>{
  await page.goto("/research/");
  const root=page.locator("[data-research-explorer]");
  await root.locator('[data-research-next]').click();
  await expect(root).toHaveAttribute("data-selected-topic","1");
  await root.locator('[data-research-figure]:not([aria-hidden]) [data-media-zoom-open]').click();
  await expect(page.locator('dialog[open]')).toHaveCount(1);
  await page.goBack();
  await expect(root).toHaveAttribute("data-selected-topic","0");
  await expect(page.locator('dialog[open]')).toHaveCount(0);
  await expect(page.locator('body')).not.toHaveClass(/media-dialog-open/);
  await expect(root.locator('[data-research-viewport]')).toBeFocused();
});

test("reduced-motion research navigation is immediate and does not autoplay",async({page})=>{
  await page.emulateMedia({reducedMotion:"reduce"});await page.goto("/research/");
  const root=page.locator("[data-research-explorer]"),viewport=root.locator("[data-research-viewport]");
  await viewport.focus();await viewport.press("End");await expect(root).toHaveAttribute("data-selected-topic","2");
  const position=await root.locator("[data-research-track]").getAttribute("style");
  await page.waitForTimeout(700);expect(await root.locator("[data-research-track]").getAttribute("style")).toBe(position);
});

import {expect,test,type Locator,type Page} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {projectFacts} from "../../src/data/facts/projects";

async function ordered(first:Locator,second:Locator,gap=0) {
  const a=await first.elementHandle(),b=await second.elementHandle();
  const bounds=await a!.evaluate((first,second)=>({first:first.getBoundingClientRect().toJSON(),second:second!.getBoundingClientRect().toJSON()}),b);
  expect(bounds.second.y,`${await first.getAttribute("class")} before ${await second.getAttribute("class")}`).toBeGreaterThanOrEqual(bounds.first.y+bounds.first.height+gap-1);
}

async function checkGeometry(page:Page) {
  expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  await expect(page.locator("h1")).toHaveCount(1);
  for(const item of await page.locator('main button:visible, main input[type="range"]:visible, [data-walkthrough-open]:visible').all()) {
    const box=(await item.boundingBox())!;
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.x).toBeGreaterThanOrEqual(-1);
    expect(box.x+box.width).toBeLessThanOrEqual(await page.evaluate(()=>innerWidth)+1);
  }
  for(const root of await page.locator(".walkthrough").all()) {
    await ordered(root.locator(".walkthrough__screens"),root.locator(".walkthrough__controls"),8);
    await ordered(root.locator(".walkthrough__controls"),root.locator(".walkthrough__notes"),8);
    await expect(root.locator('[data-walkthrough-screen][data-active="true"]')).toHaveCount(1);
    await expect(root.locator('[data-walkthrough-note][data-active="true"]')).toHaveCount(1);
  }
  if(await page.locator(".about-introduction").count())await ordered(page.locator(".about-introduction"),page.locator("#about-skills").locator(".."),16);
  if(await page.locator("[data-research-explorer]").count()) {
    await ordered(page.locator("[data-research-controls]"),page.locator(".research-overview"));
    await ordered(page.locator(".research-overview"),page.locator(".research-theme:visible").first(),8);
    for(const topic of await page.locator(".research-theme:visible").all()) {
      const {copy,media}=await topic.evaluate(topic=>({copy:topic.querySelector(".research-theme__copy")!.getBoundingClientRect().toJSON(),media:topic.querySelector(".research-theme__media")!.getBoundingClientRect().toJSON()}));
      if(media.y < copy.y+copy.height-1)expect(media.x).toBeGreaterThanOrEqual(copy.x+copy.width+15);
      else expect(media.y).toBeGreaterThanOrEqual(copy.y+copy.height+15);
      if(await topic.locator(".research-lens__comparison:visible").count()) {
        const gaps=await topic.locator(".research-lens__comparison > div").evaluateAll(items=>items.map(item=>item.querySelector("p")!.getBoundingClientRect().top-item.querySelector("h3")!.getBoundingClientRect().bottom));
        expect(Math.abs(gaps[0]-gaps[1])).toBeLessThanOrEqual(1);
      }
    }
  }
}

async function checkActiveControl(page:Page) {
  const state=await page.evaluate(()=>{
    const control=document.activeElement;
    if(!(control instanceof HTMLButtonElement || control instanceof HTMLInputElement))return null;
    const box=control.getBoundingClientRect();
    const hit=document.elementFromPoint(box.x+box.width/2,box.y+box.height/2);
    return {visible:box.top>=0&&box.bottom<=innerHeight,uncovered:Boolean(hit&&control.contains(hit))};
  });
  if(state){expect(state.visible).toBe(true);expect(state.uncovered).toBe(true);}
}

async function loadVisibleMedia(page:Page) {
  for(const image of await page.locator("main img:visible").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(()=>image.evaluate((image:HTMLImageElement)=>image.complete&&image.naturalWidth>0)).toBe(true);
  }
  await page.evaluate(()=>scrollTo({top:0,behavior:"instant"}));
  await page.waitForTimeout(100);
}

for(const locale of ["","/ko"]) {
  test(`tool connections reflect verified project stacks ${locale||"en"}`,async({page})=>{
    await page.goto(`${locale}/about/`);const root=page.locator("[data-tool-connections]");
    await expect(root).toHaveAttribute("data-enhanced","true");
    for(const tool of ["python","typescript","swift","react","shell"]) {
      await root.locator(`[data-tool-choice="${tool}"]`).click();
      await expect(root.locator('[aria-pressed="true"]')).toHaveCount(1);
      const expected=projectFacts.filter(project=>(project.techStack as readonly string[]).includes(tool)).map(project=>project.id);
      const actual=await root.locator('[data-connected="true"] a').evaluateAll(links=>links.map(link=>link.getAttribute("href")!.split("/").filter(Boolean).at(-1)));
      expect(actual).toEqual(expected);
    }
    const current=root.locator('[data-tool-choice="shell"]');await current.press("ArrowDown");
    await expect(root.locator('[data-tool-choice="python"]')).toBeFocused();
    await expect(root.locator('[data-tool-choice="python"]')).toHaveAttribute("aria-pressed","true");
  });

  for(const width of [1440,768,390,320])test(`research focus, comparison and history ${locale||"en"} ${width}`,async({page})=>{
    await page.setViewportSize({width,height:900});await page.goto(`${locale}/research/`);
    const topics=page.locator("[data-research-topic]");const nav=page.locator(".research-overview");
    await expect(topics.filter({visible:true})).toHaveCount(1);
    for(let index=0;index<3;index++) {
      await nav.locator("a").nth(index).click();const topic=topics.nth(index);
      await expect(topic).toBeVisible();await expect(topic).toBeFocused();
      await expect(topics.filter({visible:true})).toHaveCount(1);
      await expect(nav.locator('[aria-current]')).toHaveCount(1);
      await expect(nav.locator('[aria-current]')).toHaveAttribute("href",new RegExp(`#${await topic.getAttribute("id")}$`));
      const bounds=(await topic.boundingBox())!,navBounds=(await nav.boundingBox())!;expect(bounds.y).toBeGreaterThanOrEqual(navBounds.y+navBounds.height-1);
      const lens=topic.locator("[data-research-lens]");await lens.getByRole("tab").nth(2).click();
      await expect(lens.locator(".research-lens__comparison")).toBeVisible();
      await expect(lens.locator('[role="tab"][aria-selected="true"]')).toHaveCount(1);
      await checkActiveControl(page);
      await page.evaluate(()=>scrollTo({top:0,behavior:"instant"}));
      await checkGeometry(page);
    }
    await page.goBack();await expect(topics.nth(1)).toBeVisible();await expect(topics.nth(1)).toBeFocused();
    await page.goForward();await expect(topics.nth(2)).toBeVisible();
    await page.locator('[data-research-mode="all"]').click();await expect(topics.filter({visible:true})).toHaveCount(3);
    await nav.locator("a").last().click();await expect(topics.filter({visible:true})).toHaveCount(3);
    await page.reload();await expect(topics.nth(2)).toBeVisible();await expect(topics.nth(2)).toBeFocused();
    await expect(topics.filter({visible:true})).toHaveCount(1);
  });

  test(`application screens are real ordered captures ${locale||"en"}`,async({page})=>{
    await page.goto(`${locale}/projects/`);
    for(const root of await page.locator("[data-walkthrough]").all()) {
      const range=root.locator("input");await range.focus();await range.press("Home");
      const height=(await root.boundingBox())!.height;
      const images=[];
      for(let index=0;index<3;index++) {
        if(index)await range.press("ArrowRight");await expect(root).toHaveAttribute("data-step",String(index));
        const image=root.locator('[data-active="true"] img');await expect(image).not.toHaveAttribute("alt","");await expect(image).toHaveCSS("object-fit","contain");
        images.push(await image.getAttribute("src"));
        const original=await root.locator("[data-walkthrough-open]").getAttribute("href");
        expect(original).toContain(await root.locator('[data-active="true"][data-walkthrough-screen]').getAttribute("data-walkthrough-original"));
        await expect(root.locator('[data-walkthrough-note][data-active="true"]')).toContainText(locale?"데모":"demo");
        expect((await root.boundingBox())!.height).toBeCloseTo(height,0);
        await checkGeometry(page);
      }
      expect(new Set(images).size).toBe(3);
      await expect(root.locator("[data-walkthrough-next]")).toBeDisabled();
      await root.locator("[data-walkthrough-previous]").click();await expect(root).toHaveAttribute("data-step","1");
    }
  });
}

test("new interactions retain static reading without JavaScript",async({browser,baseURL})=>{
  const context=await browser.newContext({baseURL,javaScriptEnabled:false});const page=await context.newPage();
  try {
    await page.goto("/about/");await expect(page.locator("[data-tool-project]:visible")).toHaveCount(9);
    await page.goto("/research/");await expect(page.locator("[data-research-topic]:visible")).toHaveCount(3);await expect(page.locator("[data-research-controls]")).toBeHidden();
    await page.goto("/projects/");await expect(page.locator(".walkthrough img:visible")).toHaveCount(3);await expect(page.locator(".walkthrough__controls:visible")).toHaveCount(0);
  }finally{await context.close();}
});

for(const locale of ["","/ko"])for(const theme of ["light","dark"])test(`content interaction accessibility ${locale||"en"} ${theme}`,{tag:"@a11y"},async({page})=>{
  await page.setViewportSize({width:390,height:844});
  for(const route of ["about","research","projects"]) {
    await page.goto(`${locale}/${route}/`);await page.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);
    if(route==="about")await page.locator('[data-tool-choice="swift"]').click();
    if(route==="research"){await page.locator(".research-overview a").last().click();await page.locator(".research-theme:visible [role=tab]").last().click();}
    if(route==="projects")for(const range of await page.locator("[data-walkthrough-range]").all()){await range.focus();await range.press("End");}
    expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
  }
});

for(const width of [1440,1024,768,430,390,360,320])for(const locale of ["","/ko"])for(const theme of ["light","dark"])test(`content interaction matrix ${locale||"en"} ${width} ${theme}`,{tag:["@visual","@visual-v3"]},async({page})=>{
  const errors:string[]=[];page.on("pageerror",error=>errors.push(error.message));
  await page.setViewportSize({width,height:width>=1024?1000:844});await page.emulateMedia({reducedMotion:"no-preference"});
  for(const route of ["about","research","projects"]) {
    await page.goto(`${locale}/${route}/`);await page.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);await page.waitForTimeout(350);
    await checkGeometry(page);
    await loadVisibleMedia(page);
    await page.screenshot({path:`artifacts/content-interactions/${route}-${locale?"ko":"en"}-${width}-${theme}-initial.png`,fullPage:true,scale:"css"});
    if(route==="about")await page.locator('[data-tool-choice="swift"]').click();
    if(route==="research"){await page.locator(".research-overview a").last().click();await page.locator(".research-theme:visible [role=tab]").last().click();}
    if(route==="projects")for(const range of await page.locator("[data-walkthrough-range]").all()){await range.focus();await range.press("End");}
    await page.waitForTimeout(350);await checkActiveControl(page);
    await loadVisibleMedia(page);
    await checkGeometry(page);
    await page.screenshot({path:`artifacts/content-interactions/${route}-${locale?"ko":"en"}-${width}-${theme}-selected.png`,fullPage:true,scale:"css"});
    const before=await page.locator(".page-shell").boundingBox();await page.emulateMedia({reducedMotion:"reduce"});const after=await page.locator(".page-shell").boundingBox();
    expect(after!.height).toBeCloseTo(before!.height,0);await page.emulateMedia({reducedMotion:"no-preference"});
  }
  expect(errors).toEqual([]);
});

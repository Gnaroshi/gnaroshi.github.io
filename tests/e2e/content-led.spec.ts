import {expect,test} from "@playwright/test";
import {mkdir} from "node:fs/promises";
import sharp from "sharp";

const routes=["/","/research/","/projects/","/about/"];
for(const locale of ["en","ko"] as const){
  test(`${locale} editorial pages do not start an unrelated GPU scene`,async({page})=>{
    const scripts:string[]=[],errors:string[]=[];
    page.on("request",request=>{if(request.resourceType()==="script")scripts.push(request.url());});
    page.on("pageerror",error=>errors.push(error.message));
    for(const route of routes){
      await page.goto(locale==="ko"?`/ko${route}`:route);
      await expect(page.locator("main canvas,[data-spatial-scene]")).toHaveCount(0);
      await expect(page.locator("h1")).toHaveCount(1);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
    }
    expect(scripts.filter(url=>/three|spatialSceneRenderer|identityScene/.test(url))).toEqual([]);
    expect(errors).toEqual([]);
  });

  test(`${locale} real research figures can be inspected with keyboard and reset`,async({page})=>{
    await page.goto(locale==="ko"?"/ko/research/":"/research/");
    const inspector=page.locator('[data-research-slide][data-active="true"] [data-evidence-inspector]');
    const root=await inspector.count()?inspector:page.locator('[data-evidence-inspector]:visible').first();
    await root.scrollIntoViewIfNeeded();
    const image=root.locator("img");await expect(image).toBeVisible();
    await image.evaluate((image:HTMLImageElement)=>image.decode());
    const pixels=await sharp(await image.screenshot()).stats();
    expect(Math.max(...pixels.channels.slice(0,3).map(channel=>channel.stdev))).toBeGreaterThan(15);
    await root.locator('[data-inspector-in]').click();await expect(root).toHaveAttribute("data-zoom","1.5");
    const viewport=root.locator('[data-inspector-viewport]');await viewport.focus();await page.keyboard.press("+");
    await expect(root).toHaveAttribute("data-zoom","2");await page.keyboard.press("ArrowRight");
    expect(await root.locator("picture").getAttribute("style")).toContain("-40px");
    const bounds=(await viewport.boundingBox())!;
    await page.mouse.move(bounds.x+bounds.width*.7,bounds.y+bounds.height*.5);await page.mouse.down();
    await page.mouse.move(bounds.x+bounds.width*.3,bounds.y+bounds.height*.5,{steps:8});await page.mouse.up();
    await expect(page.locator('[data-research-explorer]')).toHaveAttribute("data-selected-topic","0");
    await page.keyboard.press("Escape");await expect(root).toHaveAttribute("data-zoom","1");
    await expect(root.locator('[data-inspector-reset]')).toBeDisabled();
  });

  test(`${locale} project purpose filters expose real matching records and restore anchors`,async({page})=>{
    await page.goto(locale==="ko"?"/ko/projects/":"/projects/");
    const root=page.locator('[data-project-filters]');
    for(const [key,count] of [["all",9],["experiments",3],["papers",4],["tools",4]] as const){
      await root.locator(`[data-project-filter="${key}"]`).click();
      await expect(page.locator('[data-project-id]:visible')).toHaveCount(count);
      await expect(root.locator('[aria-pressed="true"]')).toHaveCount(1);
    }
    await root.locator('[data-project-filter="all"]').click();
    await expect(page.locator('[data-project-id]:visible')).toHaveCount(9);
    await root.locator('[data-project-filter="tools"]').click();
    await page.evaluate(()=>{location.hash="selected-projects";});
    await expect(root.locator('[data-project-filter="all"]')).toHaveAttribute("aria-pressed","true");
    await expect(page.locator('#selected-projects')).toBeVisible();
  });

  test(`${locale} app scenario only fetches selected captures and preserves the current screen on failure`,async({page})=>{
    await page.goto(locale==="ko"?"/ko/projects/":"/projects/");
    const root=page.locator('[data-walkthrough]').first();await root.scrollIntoViewIfNeeded();
    await expect(root.locator("img")).toHaveCount(1);await expect(root.locator("template")).toHaveCount(2);
    const initial=await root.getAttribute("data-step");const buttons=root.locator('[data-walkthrough-select]');
    const target=initial==="0"?1:0;
    await buttons.nth(target).click();await expect(root).toHaveAttribute("data-step",String(target));
    await expect(root.locator('[aria-pressed="true"]')).toHaveCount(1);
    await expect(root.locator('[data-walkthrough-counter]')).toHaveText(`${target+1} / 3`);
    const last=2;
    await page.route('**/media/approved/**',route=>route.abort());
    await buttons.nth(last).click();await expect(root.locator('[data-walkthrough-feedback]')).toBeVisible();
    await expect(root).not.toHaveAttribute("aria-busy","true");
    await expect(root).toHaveAttribute("data-step",String(target));
    await expect(root.locator('[data-walkthrough-counter]')).toHaveText(`${target+1} / 3`);
    await page.unrouteAll();await buttons.nth(last).click();await expect(root).toHaveAttribute("data-step","2");
  });

  test(`${locale} a slow scenario image cannot replace the latest selection`,async({page})=>{
    await page.goto(locale==="ko"?"/ko/projects/":"/projects/");
    const root=page.locator('[data-walkthrough]').first();await root.scrollIntoViewIfNeeded();
    const source=await root.locator('[data-walkthrough-screen="1"]').getAttribute("data-walkthrough-original");
    const id=source!.split("/").at(-1)!.replace(/-\d+\.webp$/,"");
    let release:()=>void=()=>{},requested=false;
    const pending=new Promise<void>(resolve=>{release=resolve;});
    await page.route('**/media/approved/**',async route=>{
      if(route.request().url().includes(id)){requested=true;await pending;}
      await route.continue();
    });
    try{
      await root.locator('[data-walkthrough-select="1"]').click();await expect.poll(()=>requested).toBe(true);
      await root.locator('[data-walkthrough-select="2"]').click();await expect(root).toHaveAttribute("data-step","2");
      release();await expect(root.locator('[data-walkthrough-screen="1"] img')).toHaveJSProperty("complete",true);
      await expect(root).toHaveAttribute("data-step","2");
      await expect(root.locator('[data-walkthrough-select="1"]')).toHaveAttribute("aria-pressed","false");
    }finally{release();await page.unrouteAll({behavior:"wait"});}
  });
}

for(const width of [1440,1024,768,430,390,360])for(const locale of ["en","ko"] as const)for(const theme of ["light","dark"] as const){
  test(`content-led layout ${width} ${locale} ${theme}`,{tag:"@visual-content"},async({page})=>{
    await page.setViewportSize({width,height:1000});
    await page.addInitScript(theme=>localStorage.setItem("theme",theme),theme);
    const directory=`artifacts/content-led-2026-10-15/matrix/${width}-${locale}-${theme}`;await mkdir(directory,{recursive:true});
    for(const route of routes){
      await page.goto(locale==="ko"?`/ko${route}`:route);
      // Paint each lazy region in its real viewport before a full-page capture.
      for(const image of await page.locator('main img').all())if(await image.isVisible()&&!await image.evaluate(img=>Boolean(img.closest('[inert],[aria-hidden="true"]')))){await image.scrollIntoViewIfNeeded();await image.evaluate((img:HTMLImageElement)=>img.decode());}
      await page.evaluate(()=>scrollTo({top:0,behavior:"instant"}));
      await page.screenshot({path:`${directory}/${route.replaceAll("/","")||"home"}.png`,fullPage:true});
      expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
      await expect(page.locator("main canvas")).toHaveCount(0);
    }
  });
}

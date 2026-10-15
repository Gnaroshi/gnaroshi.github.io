import {expect,test,type Locator} from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import sharp from "sharp";

async function expectEvidencePainted(image:Locator) {
  await image.evaluate(element=>element.scrollIntoView({block:"center",behavior:"instant"}));
  await image.evaluate((image:HTMLImageElement)=>image.decode());
  const expected=await image.evaluate((image:HTMLImageElement)=>{
    const rect=image.getBoundingClientRect(),canvas=document.createElement("canvas");
    // Element screenshots include the enclosing device-pixel bounds, not rounded CSS dimensions.
    const offsetX=rect.left-Math.floor(rect.left),offsetY=rect.top-Math.floor(rect.top);
    canvas.width=Math.ceil(rect.right)-Math.floor(rect.left);
    canvas.height=Math.ceil(rect.bottom)-Math.floor(rect.top);
    const context=canvas.getContext("2d")!;
    context.fillStyle=getComputedStyle(image.closest("[data-desk-front]")!).backgroundColor;
    context.fillRect(0,0,canvas.width,canvas.height);
    const scale=Math.min(rect.width/image.naturalWidth,rect.height/image.naturalHeight);
    const width=image.naturalWidth*scale,height=image.naturalHeight*scale;
    context.drawImage(image,offsetX+(rect.width-width)/2,offsetY+(rect.height-height)/2,width,height);
    return canvas.toDataURL("image/png").split(",")[1]!;
  });
  const screenshot=await image.screenshot({scale:"css"});
  const referenceImage=Buffer.from(expected,"base64");
  const actualSize=await sharp(screenshot).metadata(),referenceSize=await sharp(referenceImage).metadata();
  // Fractional CSS edges have compositor coverage pixels; compare the actual image interior.
  const region={left:2,top:2,width:Math.min(actualSize.width!,referenceSize.width!)-4,height:Math.min(actualSize.height!,referenceSize.height!)-4};
  const actual=await sharp(screenshot).extract(region).resize(64,64,{fit:"fill"}).removeAlpha().raw().toBuffer();
  const reference=await sharp(referenceImage).extract(region).resize(64,64,{fit:"fill"}).removeAlpha().raw().toBuffer();
  const error=actual.reduce((sum,value,index)=>sum+Math.abs(value-reference[index]!),0)/actual.length;
  const meanA=actual.reduce((sum,value)=>sum+value,0)/actual.length;
  const meanB=reference.reduce((sum,value)=>sum+value,0)/reference.length;
  let covariance=0,varianceA=0,varianceB=0;
  for(let index=0;index<actual.length;index++){
    const a=actual[index]!-meanA,b=reference[index]!-meanB;
    covariance+=a*b;varianceA+=a*a;varianceB+=b*b;
  }
  const correlation=covariance/Math.max(1,Math.sqrt(varianceA*varianceB));
  if(error>=8||correlation<=.95){
    await test.info().attach("painted-evidence",{body:screenshot,contentType:"image/png"});
    await test.info().attach("decoded-source-reference",{body:Buffer.from(expected,"base64"),contentType:"image/png"});
  }
  // Normalize compositor subpixel resampling, but reject missing structure or colors.
  expect(error,"painted evidence must match the decoded approved screenshot").toBeLessThan(8);
  expect(correlation,"painted evidence must retain the source image structure").toBeGreaterThan(.95);
}

for(const locale of ["","/ko"]) {
  test(`project desk changes evidence and workflow, not just hover ${locale||"en"}`,async ({page})=>{
    const errors:string[]=[];page.on("pageerror",error=>errors.push(error.message));
    await page.emulateMedia({reducedMotion:"no-preference"});
    await page.goto(`${locale}/`);
    const desk=page.locator("[data-project-desk]");const stage=desk.locator("[data-desk-stage]");
    await stage.scrollIntoViewIfNeeded();await expect(desk).toHaveAttribute("data-renderer","3d");
    await page.waitForTimeout(1000);
    const first=await stage.screenshot();
    const firstPixels=await sharp(first).stats();
    expect(firstPixels.channels[0].stdev).toBeGreaterThan(25);
    const viewport=(await stage.boundingBox())!,imageBounds=(await desk.locator('[data-desk-sheet="0"] img').boundingBox())!;
    expect(imageBounds.y).toBeGreaterThanOrEqual(viewport.y);
    expect(imageBounds.y+imageBounds.height).toBeLessThanOrEqual(viewport.y+viewport.height);
    await desk.locator('[data-desk-select="1"]').click();
    await expect(desk).toHaveAttribute("data-selected","1");
    await expect(desk.locator('[data-desk-select][aria-pressed="true"]')).toHaveCount(1);
    await expect(desk.locator('[data-desk-story="1"]')).toContainText("Gnaroshi Studio");
    await expect(desk.locator('[data-desk-story="0"]')).toHaveAttribute("inert","");
    await page.waitForTimeout(1000);
    expect((await stage.screenshot()).equals(first)).toBe(false);
    const geometry=await stage.boundingBox();
    await desk.locator("[data-desk-flip]").click();await expect(desk).toHaveAttribute("data-side","workflow");
    await page.waitForTimeout(1000);
    await expect(desk.locator('[data-desk-sheet="1"] [data-desk-back]')).toHaveAttribute("aria-hidden","false");
    await expect(desk.locator('[data-desk-sheet="1"] [data-desk-front]')).toHaveAttribute("inert","");
    await expect(desk.locator('[data-desk-story="1"] .home-desk__summary')).toBeVisible();
    await expect(desk.getByRole("list")).toHaveCount(1);
    await expect(desk.locator("[data-desk-workflow], .home-desk__open")).toHaveCount(0);
    const changed=await stage.boundingBox();
    expect(changed!.width).toBeCloseTo(geometry!.width,0);
    expect(changed!.height).toBeCloseTo(geometry!.height,0);
    await desk.locator("[data-desk-reset]").click();await expect(desk).toHaveAttribute("data-selected","0");await expect(desk).toHaveAttribute("data-side","evidence");
    await stage.focus();await stage.press("ArrowRight");await expect(desk).toHaveAttribute("data-selected","1");
    await stage.press("Space");await expect(desk).toHaveAttribute("data-side","workflow");await stage.press("Escape");await expect(desk).toHaveAttribute("data-side","evidence");
    const bounds=(await stage.boundingBox())!;
    await page.mouse.move(bounds.x+bounds.width*.6,bounds.y+bounds.height*.5);await page.mouse.down();
    await page.mouse.move(bounds.x+bounds.width*.25,bounds.y+bounds.height*.5,{steps:12});await page.mouse.up();
    await expect(desk).toHaveAttribute("data-selected","2");await expect(desk.locator("[data-desk-stage]")).toBeFocused();
    await page.waitForTimeout(1100);const frame=await desk.locator("[data-desk-renderer]").getAttribute("data-frame");
    await page.waitForTimeout(200);expect(await desk.locator("[data-desk-renderer]").getAttribute("data-frame")).toBe(frame);
    await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await page.waitForTimeout(200);
    const hidden=await desk.locator("[data-desk-renderer]").getAttribute("data-frame");
    await page.waitForTimeout(200);expect(await desk.locator("[data-desk-renderer]").getAttribute("data-frame")).toBe(hidden);
    expect(errors).toEqual([]);
  });

  test(`project desk reduced-motion keeps selection without the engine ${locale||"en"}`,async ({page})=>{
    const requests:string[]=[];page.on("request",request=>{if(request.url().includes("projectDeskScene"))requests.push(request.url());});
    await page.emulateMedia({reducedMotion:"reduce"});await page.goto(`${locale}/`);
    const desk=page.locator("[data-project-desk]");await expect(desk).toHaveAttribute("data-enhanced","true");
    await desk.locator('[data-desk-select="2"]').click();await desk.locator("[data-desk-flip]").click();
    await expect(desk).toHaveAttribute("data-selected","2");await expect(desk).toHaveAttribute("data-side","workflow");
    await expect(desk.locator('[data-desk-sheet="2"] [data-desk-back]')).toBeVisible();expect(requests).toHaveLength(0);
    await page.emulateMedia({reducedMotion:"no-preference"});await expect(desk).toHaveAttribute("data-renderer","3d");
    await page.emulateMedia({reducedMotion:"reduce"});await expect(desk.locator("[data-desk-renderer] > div")).toHaveCount(0);
    await expect(desk).toHaveAttribute("data-side","workflow");await expect(desk.locator('[data-desk-sheet="2"] [data-desk-back]')).toBeVisible();
  });
}

test("project desk stays useful with no JavaScript or a failed scene import",async ({browser,page,baseURL})=>{
  const context=await browser.newContext({javaScriptEnabled:false,baseURL});const fallback=await context.newPage();
  try {await fallback.goto("/");await expect(fallback.locator('[data-desk-sheet="0"] img')).toBeVisible();await expect(fallback.locator('[data-desk-story="0"] a')).toHaveAttribute("href","/projects/gnaroshi-vla/");await expect(fallback.locator("[data-desk-select]").first()).toBeDisabled();}finally{await context.close();}
  await page.route("**/*projectDeskScene*.js",route=>route.abort());await page.goto("/");
  const desk=page.locator("[data-project-desk]");await desk.locator("[data-desk-stage]").scrollIntoViewIfNeeded();await expect(desk).toHaveAttribute("data-renderer","flat");
  await desk.locator('[data-desk-select="1"]').click();await expect(desk.locator('[data-desk-sheet="1"] img')).toBeVisible();
  await desk.locator("[data-desk-flip]").click();await expect(desk.locator('[data-desk-sheet="1"] [data-desk-back]')).toHaveAttribute("aria-hidden","false");
});

test("project desk touch gestures preserve ordinary vertical scrolling",async ({browser,baseURL,browserName})=>{
  test.skip(browserName!=="chromium","Chromium CDP sends real touch input; other engines use pointer and keyboard tests.");
  const context=await browser.newContext({baseURL,viewport:{width:390,height:844},isMobile:true,hasTouch:true,reducedMotion:"no-preference"});const page=await context.newPage();
  try {
    await page.goto("/");const desk=page.locator("[data-project-desk]");const stage=desk.locator("[data-desk-stage]");
    await stage.scrollIntoViewIfNeeded();await expect(desk).toHaveAttribute("data-renderer","3d");
    const session=await context.newCDPSession(page);const bounds=(await stage.boundingBox())!;
    const x=bounds.x+bounds.width*.7,y=bounds.y+bounds.height*.5;
    await session.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x,y}]});
    for(let step=1;step<=8;step++)await session.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:x-step*15,y}]});
    await session.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});await expect(desk).toHaveAttribute("data-selected","1");
    const before=await page.evaluate(()=>scrollY);
    await session.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x,y}]});
    for(let step=1;step<=8;step++)await session.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x,y:y-step*15}]});
    await session.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
    await expect(desk).toHaveAttribute("data-selected","1");expect(await page.evaluate(()=>scrollY)).toBeGreaterThan(before);
  } finally {await context.close();}
});

test("zoom uses a readable flat view and preserves the selected project",async({page,context,browserName})=>{
  test.skip(browserName!=="chromium","Chromium CDP emulates browser viewport zoom.");
  await page.goto("/");const desk=page.locator("[data-project-desk]");await desk.locator('[data-desk-select="1"]').click();
  await expect(desk).toHaveAttribute("data-renderer","3d");const session=await context.newCDPSession(page);
  await session.send("Emulation.setPageScaleFactor",{pageScaleFactor:2});await expect(desk).toHaveAttribute("data-renderer","flat");
  await expect(desk).toHaveAttribute("data-selected","1");await expect(desk.locator('[data-desk-sheet="1"] img')).toBeVisible();
  await session.send("Emulation.setPageScaleFactor",{pageScaleFactor:1});await expect(desk).toHaveAttribute("data-renderer","3d");
});

for(const locale of ["","/ko"])for(const theme of ["light","dark"])test(`project desk accessible selected and flipped ${locale||"en"} ${theme}`,{tag:"@a11y"},async({page})=>{
  await page.setViewportSize({width:390,height:844});await page.goto(`${locale}/`);await page.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);
  const desk=page.locator("[data-project-desk]");await desk.locator('[data-desk-select="1"]').click();
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
  await desk.locator("[data-desk-flip]").click();expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
});

for(const width of [1440,1024,768,430,390,360,320])for(const locale of ["","/ko"])for(const theme of ["light","dark"])test(`project desk visual ${locale||"en"} ${width} ${theme}`,{tag:["@visual","@visual-v3"]},async({page})=>{
  await page.setViewportSize({width,height:width>=1024?1000:844});await page.goto(`${locale}/`);await page.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);
  await page.emulateMedia({reducedMotion:"no-preference"});
  const desk=page.locator("[data-project-desk]");const stage=desk.locator("[data-desk-stage]");
  await expect(desk.locator("h2")).toBeInViewport();await stage.scrollIntoViewIfNeeded();await expect(desk).toHaveAttribute("data-renderer","3d");await page.waitForTimeout(1000);
  for(let index=0;index<3;index++) {
    await desk.locator(`[data-desk-select="${index}"]`).click();await page.waitForTimeout(950);
    await expect(desk.locator(`[data-desk-sheet="${index}"] img`)).toHaveCSS("object-fit","contain");
    await desk.screenshot({path:`artifacts/project-desk/${locale?"ko":"en"}-${width}-${theme}-${index}-front.png`,scale:"css",style:".site-header { visibility: hidden !important; }"});
    await expectEvidencePainted(desk.locator(`[data-desk-sheet="${index}"] img`));
    await desk.locator("[data-desk-flip]").click();await page.waitForTimeout(950);
    if(width===320) {
      const list=desk.locator(`[data-desk-sheet="${index}"] [data-desk-back] ol`);
      const starts=await list.locator("li").evaluateAll(items=>items.map(item=>Math.round(item.getBoundingClientRect().left)));
      expect(new Set(starts).size).toBe(1);
    }
    await desk.screenshot({path:`artifacts/project-desk/${locale?"ko":"en"}-${width}-${theme}-${index}-back.png`,scale:"css",style:".site-header { visibility: hidden !important; }"});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
    const buttons=await desk.locator("button").all();for(const button of buttons){const bounds=(await button.boundingBox())!;expect(bounds.width).toBeGreaterThanOrEqual(42);expect(bounds.height).toBeGreaterThanOrEqual(42);}
  }
});

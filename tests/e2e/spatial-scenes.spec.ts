import { expect,test } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import sharp from "sharp";

const routes=["/","/research/","/projects/","/about/"];
for(const locale of ["en","ko"] as const)for(const route of routes){
  test(`${locale} ${route} exposes a first-viewport spatial scene and equivalent input`,async({page})=>{
    const errors:string[]=[];page.on("pageerror",error=>errors.push(error.message));
    page.on("console",message=>{if(message.type()==="error")errors.push(message.text());});
    await page.setViewportSize({width:1440,height:1000});
    const path=locale==="ko"?`/ko${route}`:route;
    await page.goto(path);
    const root=page.locator("[data-spatial-scene]"),host=root.locator("[data-scene-canvas]");
    await expect(root).toHaveAttribute("data-renderer","webgl");
    await expect(host.locator("canvas")).toBeVisible();
    expect((await host.boundingBox())!.y).toBeLessThan(250);
    const before=Number(await host.getAttribute("data-rotation"));
    await page.mouse.move(1438,80);
    await expect.poll(async()=>Math.abs(Number(await host.getAttribute("data-rotation"))-before)).toBeGreaterThan(.1);
    const pause=root.locator("[data-scene-pause]");await pause.click();
    const frozen=await host.getAttribute("data-frame");await page.waitForTimeout(250);
    await expect(host).toHaveAttribute("data-frame",frozen!);
    await host.focus();await page.keyboard.press("ArrowRight");
    expect(Number(await host.getAttribute("data-rotation"))).not.toBe(before);
    const unfold=root.locator("[data-scene-unfold]");
    if(await unfold.count()){await page.keyboard.press("Enter");await expect(unfold).toHaveAttribute("aria-pressed","true");await expect(host).toHaveAttribute("data-expansion","1");}
    await page.keyboard.press("Escape");
    await expect(host).toHaveAttribute("data-expansion","0");
    if(route==="/research/"){
      await page.locator(".research-overview a").nth(2).click();
      await expect(host).toHaveAttribute("data-topic","2");
      await expect(page.locator(".research-overview [aria-current]")).toHaveCount(1);
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
    expect(Number(await host.getAttribute("data-draw-calls"))).toBeLessThanOrEqual(7);
    expect(errors).toEqual([]);
  });
  test(`${locale} ${route} keeps reduced-motion and no-JavaScript content complete`,async({browser})=>{
    const path=locale==="ko"?`/ko${route}`:route;
    for(const javascriptEnabled of [true,false]){
      const context=await browser.newContext({javaScriptEnabled:javascriptEnabled,reducedMotion:"reduce"});
      try{const page=await context.newPage();await page.goto(path);await expect(page.locator("h1")).toHaveCount(1);
        if(javascriptEnabled){const root=page.locator("[data-spatial-scene]");await expect(root).toHaveAttribute("data-renderer","webgl");const host=root.locator("[data-scene-canvas]");const frame=await host.getAttribute("data-frame");await page.mouse.move(5,5);await page.waitForTimeout(300);await expect(host).toHaveAttribute("data-frame",frame!);}
        else if(route==="/research/"){await expect(page.locator("[data-research-topic]")).toHaveCount(3);for(const article of await page.locator("[data-research-topic]").all())await expect(article).toBeVisible();}
      }finally{await context.close();}
    }
  });
}

test("spatial renderer stops offscreen and respects a persisted pause",async({page})=>{
  await page.goto("/");const root=page.locator("[data-spatial-scene]"),host=root.locator("[data-scene-canvas]");
  await expect(root).toHaveAttribute("data-renderer","webgl");
  await page.evaluate(()=>scrollTo({top:document.documentElement.scrollHeight,behavior:"instant"}));await page.waitForTimeout(150);
  const frame=await host.getAttribute("data-frame");await page.waitForTimeout(350);await expect(host).toHaveAttribute("data-frame",frame!);
  await page.evaluate(()=>scrollTo({top:0,behavior:"instant"}));await root.locator("[data-scene-pause]").click();
  await page.goto("/ko/projects/");await expect(page.locator("[data-spatial-scene]")).toHaveAttribute("data-paused","true");
});

test("unavailable WebGL keeps complete content without dead scene controls",async({page})=>{
  await page.addInitScript(()=>{
    const original=HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext=function(this:HTMLCanvasElement,type:string,...args:unknown[]){
      if(type.startsWith("webgl"))return null;
      return original.apply(this,[type,...args] as Parameters<typeof original>);
    } as typeof original;
  });
  for(const route of routes){
    await page.goto(route);const root=page.locator("[data-spatial-scene]");
    await expect(root).toHaveAttribute("data-renderer","fallback");
    await expect(root).toHaveAttribute("aria-hidden","true");
    await expect(root.locator("[data-scene-controls]")).toBeHidden();
    await expect(root.locator("[data-scene-canvas]")).toHaveAttribute("tabindex","-1");
    await expect(page.locator("h1")).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
  }
});

test("mobile scene accepts horizontal touch without capturing vertical scrolling",async({page,context})=>{
  await page.setViewportSize({width:390,height:844});await page.goto("/");
  const root=page.locator("[data-spatial-scene]"),host=root.locator("[data-scene-canvas]");
  await expect(root).toHaveAttribute("data-renderer","webgl");
  await root.locator("[data-scene-pause]").click();const before=await host.getAttribute("data-rotation");
  const bounds=(await host.boundingBox())!,y=Math.min(570,bounds.y+bounds.height-110);
  const session=await context.newCDPSession(page);
  try{
    await session.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x:90,y}]});
    await session.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x:250,y}]});
    await session.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
    await expect.poll(()=>host.getAttribute("data-rotation")).not.toBe(before);
    expect(await host.evaluate(node=>getComputedStyle(node).touchAction)).toContain("pan-y");
  }finally{await session.detach();}
});

for(const width of [1843,1440,1024,768,430,390,360,320])for(const locale of ["en","ko"])for(const theme of ["light","dark"]){
  test(`spatial scene matrix ${width} ${locale} ${theme}`,{tag:"@visual-spatial"},async({page})=>{
    test.setTimeout(90_000);await page.setViewportSize({width,height:1000});
    await page.addInitScript(value=>localStorage.setItem("theme",value),theme);
    const directory="artifacts/immersive-scenes-2026-10-14/final";await mkdir(directory,{recursive:true});
    for(const route of routes){
      await page.goto(locale==="ko"?`/ko${route}`:route);
      const root=page.locator("[data-spatial-scene]"),host=root.locator("[data-scene-canvas]");await expect(root).toHaveAttribute("data-renderer","webgl");
      await root.locator("[data-scene-pause]").click();
      const name=route==="/"?"home":route.replaceAll("/","");
      const image=await host.locator("canvas").screenshot();
      const canvasBounds=(await host.boundingBox())!,copyBounds=(await page.locator("[data-scene-copy]").boundingBox())!;
      // Measure painted geometry, excluding HTML copy and the control row.
      const left=route==="/about/"||width<768?0:Math.min(Math.floor(canvasBounds.width)-1,Math.ceil(copyBounds.x+copyBounds.width-canvasBounds.x+20));
      const top=route==="/about/"?Math.max(0,Math.floor(canvasBounds.height)-60):width<768?Math.ceil(copyBounds.y+copyBounds.height-canvasBounds.y+16):0;
      const region={left,top,width:Math.max(1,Math.floor(canvasBounds.width)-left),height:Math.max(1,Math.floor(canvasBounds.height)-top-62)};
      if(route==="/about/"){
        const identity=(await page.locator(".interactive-identity").boundingBox())!;
        region.top=Math.min(Math.floor(canvasBounds.height)-1,Math.ceil(Math.max(copyBounds.y+copyBounds.height,identity.y+identity.height)-canvasBounds.y+16));
        region.height=Math.max(1,Math.floor(canvasBounds.height)-region.top);region.width=Math.max(1,region.width-110);
      }
      const pixels=await sharp(image).extract(region).stats();
      expect(Math.max(...pixels.channels.slice(0,3).map(channel=>channel.stdev))).toBeGreaterThan(route==="/about/"?2:15);
      await page.screenshot({path:`${directory}/${width}-${locale}-${theme}-${name}-initial.png`,fullPage:true});
      const original=await page.locator("h1").boundingBox();await host.focus();await page.keyboard.press("ArrowRight");
      if(await root.locator("[data-scene-unfold]").count())await root.locator("[data-scene-unfold]").click();
      await page.screenshot({path:`${directory}/${width}-${locale}-${theme}-${name}-changed.png`,fullPage:true});
      expect(await page.locator("h1").boundingBox()).toEqual(original);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
      const controls=(await root.locator("[data-scene-controls]").boundingBox())!;
      const surface=(await root.boundingBox())!;expect(controls.x).toBeGreaterThanOrEqual(surface.x);expect(controls.x+controls.width).toBeLessThanOrEqual(surface.x+surface.width+1);
      if(await root.getAttribute("data-paused")==="true")await root.locator("[data-scene-pause]").click();
    }
  });
}

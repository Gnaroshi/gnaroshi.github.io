import { expect,test } from "@playwright/test";
import sharp from "sharp";
import AxeBuilder from "@axe-core/playwright";

for (const locale of ["", "/ko"]) {
  test(`identity unlocks only after three plus three clicks ${locale || "en"}`,async ({page}) => {
    const errors:string[] = [];
    page.on("pageerror",error => errors.push(error.message));
    page.on("console",message => { if(message.type()==="error") errors.push(message.text()); });
    const sceneRequests:string[]=[];
    page.on("request",request => { if(request.url().includes("identityScene"))sceneRequests.push(request.url()); });
    await page.goto(`${locale}/about/`);
    const identity=page.locator("[data-interactive-identity]");
    const stage=identity.locator("[data-identity-stage]");
    await expect(identity).toHaveAttribute("data-ready","true");
    const initialBounds=await identity.boundingBox();
    expect(sceneRequests).toHaveLength(0);
    for(let count=1;count<=2;count++) {
      await stage.click(); await expect(identity).toHaveAttribute("data-clicks",String(count));
      await expect(identity).toHaveAttribute("data-mode","original");
      expect(sceneRequests).toHaveLength(0);
    }
    await stage.click();
    await expect(identity).toHaveAttribute("data-mode","dimensional");
    await expect(identity).toHaveAttribute("data-renderer","webgl");
    expect(sceneRequests.length).toBeGreaterThan(0);
    const canvas=identity.locator("canvas");
    await expect(canvas).toBeVisible();
    const bounds=await canvas.boundingBox();expect(bounds!.width).toBeGreaterThan(200);expect(bounds!.height).toBeGreaterThan(200);
    const pixels=await sharp(await canvas.screenshot()).stats();
    for(const channel of pixels.channels.slice(0,3))expect(channel.stdev).toBeGreaterThan(20);
    await page.mouse.move(0,0);await page.waitForTimeout(1000);
    const front=await canvas.screenshot();
    for(const channel of (await sharp(front).stats()).channels.slice(0,3))expect(channel.stdev).toBeGreaterThan(20);
    await stage.press("ArrowRight");await stage.press("ArrowRight");await page.waitForTimeout(750);
    expect((await canvas.screenshot()).equals(front)).toBe(false);
    await expect(identity.locator("[data-identity-canvas]")).toHaveAttribute("data-draw-calls","1");
    for(let count=4;count<=5;count++) { await stage.click();await expect(identity).toHaveAttribute("data-mode","dimensional"); }
    await stage.click();await expect(identity).toHaveAttribute("data-mode","foil");
    expect((await identity.boundingBox())!.height).toBeCloseTo(initialBounds!.height,0);
    await expect(identity.locator("[data-identity-dot][data-active]")).toHaveCount(6);
    await identity.locator("[data-identity-reset]").click();
    await expect(identity).toHaveAttribute("data-mode","original");await expect(canvas).toHaveCount(0);await expect(stage).toBeFocused();
    expect(errors).toEqual([]);
  });
  test(`identity keyboard and reduced-motion retain every state ${locale || "en"}`,async ({page}) => {
    await page.emulateMedia({ reducedMotion:"reduce" });await page.goto(`${locale}/about/`);
    const identity=page.locator("[data-interactive-identity]");const stage=identity.locator("[data-identity-stage]");
    await expect(identity).toHaveAttribute("data-ready","true");await stage.focus();
    for(let count=0;count<3;count++)await stage.press("Enter");
    await expect(identity).toHaveAttribute("data-renderer","webgl");
    await stage.press("ArrowRight");
    for(let count=0;count<3;count++)await stage.press("Space");
    await expect(identity).toHaveAttribute("data-mode","foil");
    expect(await stage.locator("img").evaluate(element=>element.getAnimations().length)).toBe(0);
    const host=identity.locator("[data-identity-canvas]");const frame=await host.getAttribute("data-frame");
    await page.waitForTimeout(250);expect(await host.getAttribute("data-frame")).toBe(frame);
    await identity.locator("[data-identity-reset]").click();await expect(identity.locator("canvas")).toHaveCount(0);
  });
}

test("3D rendering stops at rest, on pause, and offscreen",async ({page}) => {
  await page.goto("/about/");const identity=page.locator("[data-interactive-identity]");const stage=identity.locator("[data-identity-stage]");
  await expect(identity).toHaveAttribute("data-ready","true");for(let count=0;count<3;count++)await stage.click();
  await expect(identity).toHaveAttribute("data-renderer","webgl");const host=identity.locator("[data-identity-canvas]");
  await page.mouse.move(0,0);await page.waitForTimeout(1200);const settled=await host.getAttribute("data-frame");
  await page.waitForTimeout(250);expect(await host.getAttribute("data-frame")).toBe(settled);
  const pause=identity.locator("[data-identity-pause]");await pause.click();await expect(pause).toHaveAttribute("aria-pressed","true");
  const stopped=await host.getAttribute("data-frame");await stage.hover();await page.waitForTimeout(200);expect(await host.getAttribute("data-frame")).toBe(stopped);
  await pause.click();await page.evaluate(()=>scrollTo(0,document.documentElement.scrollHeight));await page.waitForTimeout(200);
  const hidden=await host.getAttribute("data-frame");await page.waitForTimeout(250);expect(await host.getAttribute("data-frame")).toBe(hidden);
});

test("reset safely cancels a pending 3D import",async ({page}) => {
  await page.route("**/*identityScene*.js",async route=> {await new Promise(resolve=>setTimeout(resolve,300));await route.continue();});
  await page.goto("/about/");const identity=page.locator("[data-interactive-identity]");const stage=identity.locator("[data-identity-stage]");
  await expect(identity).toHaveAttribute("data-ready","true");for(let count=0;count<3;count++)await stage.click();await identity.locator("[data-identity-reset]").click();
  await page.waitForTimeout(600);await expect(identity).toHaveAttribute("data-mode","original");await expect(identity.locator("canvas")).toHaveCount(0);
});

test("WebGL-unavailable keeps the full approved logo and honest fallback",async ({page}) => {
  await page.addInitScript(()=> {
    const original=HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext=function(this:HTMLCanvasElement,type:string,...args:unknown[]) {
      if(type.startsWith("webgl"))return null;
      return original.call(this,type as "2d",...args as []);
    } as typeof original;
  });
  await page.goto("/about/");const identity=page.locator("[data-interactive-identity]");const stage=identity.locator("[data-identity-stage]");
  await expect(identity).toHaveAttribute("data-ready","true");for(let count=0;count<6;count++)await stage.click();
  await expect(identity).toHaveAttribute("data-renderer","fallback");await expect(identity.locator("img")).toBeVisible();
  await expect(identity.locator("[data-identity-status]")).toContainText("unavailable");await expect(identity.locator("canvas")).toHaveCount(0);
});

test("research lenses retain height and support arrow-key selection",async ({page}) => {
  for(const locale of ["","/ko"]) {
    await page.goto(`${locale}/research/`);
    for(const lens of await page.locator("[data-research-lens]").all()) {
      const initial=await lens.boundingBox();const tabs=lens.getByRole("tab");await tabs.nth(1).click();
      await expect(tabs.nth(1)).toHaveAttribute("aria-selected","true");await expect(lens.locator('[role="tabpanel"]:not([aria-hidden])')).toHaveCount(1);
      await expect(lens.locator('[role="tab"][aria-selected="true"]')).toHaveCount(1);
      await expect(lens.locator('[role="tabpanel"][aria-hidden="true"]')).toHaveAttribute("inert","");
      expect((await lens.boundingBox())!.height).toBeCloseTo(initial!.height,0);
      await tabs.nth(1).press("ArrowLeft");await expect(tabs.nth(0)).toBeFocused();await expect(tabs.nth(0)).toHaveAttribute("aria-selected","true");
    }
  }
});

test("without JavaScript the identity and both research positions remain readable",async ({browser,baseURL}) => {
  const context=await browser.newContext({javaScriptEnabled:false,baseURL});const page=await context.newPage();
  try {
    await page.goto("/about/");await expect(page.locator("[data-identity-image]")).toBeVisible();await expect(page.locator("[data-identity-stage]")).toBeDisabled();
    await page.goto("/research/");
    const lens=page.locator("[data-research-lens]").first();
    await expect(lens.locator('[role="tabpanel"]').nth(0)).toBeVisible();await expect(lens.locator('[role="tabpanel"]').nth(1)).toBeVisible();
    await expect(lens).toContainText("What remains");
    await expect(page.getByRole("tab")).toHaveCount(0);
  } finally {await context.close();}
});

test("primary navigation warms only an intended public document",async ({page})=> {
  await page.setViewportSize({width:1440,height:1000});await page.goto("/about/");
  const warm=page.waitForResponse(response=>new URL(response.url()).pathname==="/research/"&&!response.request().isNavigationRequest());
  await page.locator('.desktop-nav a[href="/research/"]').hover();expect((await warm).status()).toBe(200);
  await page.locator('.desktop-nav a[href="/research/"]').click();await page.waitForURL("**/research/");await expect(page.locator("h1")).toHaveCount(1);
});

for(const locale of ["","/ko"])test(`identity and selected research states remain accessible ${locale||"en"}`,{tag:"@a11y"},async ({page})=> {
  for(const theme of ["light","dark"]) {
    await page.goto(`${locale}/about/`);await page.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);
    const identity=page.locator("[data-interactive-identity]");const stage=identity.locator("[data-identity-stage]");await expect(identity).toHaveAttribute("data-ready","true");
    for(let count=0;count<6;count++)await stage.click();await expect(identity).toHaveAttribute("data-renderer","webgl");
    expect((await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);
    await page.goto(`${locale}/research/`);await page.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);
    await expect(page.locator(".section-nav a").first()).toHaveCSS("transition-duration","0s");
    await page.locator("[data-research-lens]").first().getByRole("tab").nth(1).click();
    expect((await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);
  }
});

test("document navigation never blends old and new text",async ({page}) => {
  await page.setViewportSize({width:1440,height:1000});await page.goto("/about/");
  for(const destination of ["/research/","/projects/","/about/"]) {
    await page.locator(`.desktop-nav a[href="${destination}"]`).click();await page.waitForURL(`**${destination}`);
    expect(await page.locator("#cross-document-view-transition").evaluate(element=>element.textContent)).toContain("navigation: none");
    await expect(page.locator(".site-main")).toHaveCSS("animation-name","site-page-in");
    await expect(page.locator("h1")).toHaveCount(1);
  }
});

test("interactive identity stays framed in both themes and narrow locales",async ({page}) => {
  test.setTimeout(90_000);
  for(const width of [1440,1024,768,390,360])for(const locale of ["","/ko"])for(const theme of ["light","dark"]) {
    await page.setViewportSize({width,height:900});await page.goto(`${locale}/about/`);
    await page.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);
    const identity=page.locator("[data-interactive-identity]");const stage=identity.locator("[data-identity-stage]");await expect(identity).toHaveAttribute("data-ready","true");
    for(let count=0;count<6;count++)await stage.click();await expect(identity).toHaveAttribute("data-renderer","webgl");
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
    await page.mouse.move(0,0);await page.waitForTimeout(1100);
    const canvas=identity.locator("canvas");
    const bounds=await canvas.boundingBox();
    const scroll=await page.evaluate(()=>({x:scrollX,y:scrollY}));
    for(let capture=0;capture<2;capture++) {
      const full=await page.screenshot({path:capture?`artifacts/interactive-identity/${locale?"ko":"en"}-${width}-${theme}-foil.png`:undefined,fullPage:true,scale:"css"});
      const rendered=await sharp(full).extract({left:Math.round(bounds!.x+scroll.x),top:Math.round(bounds!.y+scroll.y),width:Math.floor(bounds!.width),height:Math.floor(bounds!.height)}).removeAlpha().raw().toBuffer({resolveWithObject:true});
      let coloredPixels=0;
      for(let offset=0;offset<rendered.data.length;offset+=rendered.info.channels) {
        const channels=[rendered.data[offset],rendered.data[offset+1],rendered.data[offset+2]];
        if(Math.max(...channels)-Math.min(...channels)>45)coloredPixels++;
      }
      // A neutral empty stage or its corner marks cannot satisfy this painted-area check.
      expect(coloredPixels/(rendered.info.width*rendered.info.height),`${locale}/${width}/${theme} settled full-page painted area #${capture}`).toBeGreaterThan(.03);
    }
  }
});

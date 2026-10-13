import {mkdir,writeFile} from "node:fs/promises";
import {expect,test} from "@playwright/test";
import sharp from "sharp";

const directory="artifacts/owner-feedback-final";
for(const width of [1843,1440,1024,768,430,390,360,320])for(const locale of ["en","ko"])for(const theme of ["light","dark"]) {
  test(`owner feedback ${width} ${locale} ${theme}`,{tag:"@visual-feedback"},async({page})=>{
    test.setTimeout(30_000);
    await mkdir(directory,{recursive:true});
    await page.setViewportSize({width,height:1000});
    await page.addInitScript(value=>localStorage.setItem("theme",value),theme);
    const prefix=locale === "ko"?"/ko":"";
    const stem=`${width}-${locale}-${theme}`;
    const geometry=[];
    await page.goto(`${prefix}/about/`);await page.waitForLoadState("networkidle");
    const identity=page.locator("[data-interactive-identity]"),stage=identity.locator("button");
    for(const [mode,clicks] of [["original",0],["dimensional",3],["foil",3]] as const) {
      for(let index=0;index<clicks;index++)await stage.click();
      if(clicks)await expect(identity).toHaveAttribute("data-renderer","webgl");
      await page.mouse.move(0,0);await page.evaluate(()=>scrollTo({top:0,behavior:"instant"}));await page.waitForTimeout(1100);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
      geometry.push({route:"about",mode,height:await page.evaluate(()=>document.documentElement.scrollHeight)});
      await page.screenshot({path:`${directory}/${stem}-about-${mode}.png`,fullPage:true});
      if(clicks) {
        const canvas=await identity.locator("canvas").screenshot();
        const stats=await sharp(canvas).removeAlpha().stats();
        const host=identity.locator("[data-identity-canvas]");
        expect(Math.abs(Number(await host.getAttribute("data-rotation-x")))).toBeLessThan(2);
        expect(Math.abs(Number(await host.getAttribute("data-rotation-y")))).toBeLessThan(2);
        const evidence=await identity.locator("canvas").evaluate((canvas:HTMLCanvasElement)=>{
          const gl=canvas.getContext("webgl2")!;const pixels=new Uint8Array(canvas.width*canvas.height*4);
          gl.readPixels(0,0,canvas.width,canvas.height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
          return {mode:canvas.closest<HTMLElement>("[data-interactive-identity]")!.dataset.mode,host:{...canvas.parentElement!.dataset},width:canvas.width,height:canvas.height,painted:pixels.filter((value,index)=>index%4 === 3 && value>0).length,lost:gl.isContextLost(),error:gl.getError(),attributes:gl.getContextAttributes()};
        });
        expect(Math.max(...stats.channels.slice(0,3).map(channel=>channel.stdev)),JSON.stringify(evidence)).toBeGreaterThan(20);
      }
    }
    await page.goto(`${prefix}/research/`);await page.waitForLoadState("networkidle");
    const root=page.locator("[data-research-explorer]");
    for(let index=0;index<3;index++) {
      await root.locator(".research-overview a").nth(index).click();
      await expect(root).toHaveAttribute("data-selected-topic",String(index));
      const active=root.locator('[data-research-figure]:not([aria-hidden])');
      await active.locator("picture > img").first().evaluate(async(image:HTMLImageElement)=>{image.loading="eager";await image.decode();});
      await page.waitForTimeout(500);
      await page.evaluate(()=>scrollTo({top:0,behavior:"instant"}));
      await expect.poll(()=>page.evaluate(()=>scrollY)).toBe(0);
      expect(await root.locator("[data-research-viewport]").evaluate(element=>element.scrollLeft)).toBe(0);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth)).toBeLessThanOrEqual(1);
      await expect(root.locator(".research-overview [aria-current]")).toHaveCount(1);
      const image=(await active.locator("picture > img").first().boundingBox())!;
      const viewport=(await root.locator("[data-research-viewport]").boundingBox())!;
      expect(image.x).toBeGreaterThanOrEqual(viewport.x-1);expect(image.x+image.width).toBeLessThanOrEqual(viewport.x+viewport.width+1);
      const painted=await page.screenshot({path:`${directory}/${stem}-research-${index}.png`,fullPage:true});
      const crop=await sharp(painted).extract({left:Math.round(image.x)+4,top:Math.round(image.y)+4,width:Math.floor(image.width)-8,height:Math.floor(image.height)-8}).removeAlpha().toBuffer();
      const pixels=await sharp(crop).stats();
      expect(Math.max(...pixels.channels.slice(0,3).map(channel=>channel.stdev)),`Research ${index} must be visibly painted, not just loaded`).toBeGreaterThan(20);
    }
    expect(new Set(geometry.map(entry=>entry.height)).size).toBe(1);
    await writeFile(`${directory}/${stem}.json`,JSON.stringify(geometry,null,2));
  });
}

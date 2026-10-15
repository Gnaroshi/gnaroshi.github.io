import type { ProjectDeskScene } from "./projectDeskScene";

export function mountProjectDesk(root:HTMLElement) {
  const stage=root.querySelector<HTMLElement>("[data-desk-stage]")!;
  const host=root.querySelector<HTMLElement>("[data-desk-renderer]")!;
  const original=root.querySelector<HTMLElement>("[data-desk-sheets]")!;
  const sheets=Array.from(root.querySelectorAll<HTMLElement>("[data-desk-sheet]"));
  const stories=Array.from(root.querySelectorAll<HTMLElement>("[data-desk-story]"));
  const choices=Array.from(root.querySelectorAll<HTMLButtonElement>("[data-desk-select]"));
  const flip=root.querySelector<HTMLButtonElement>("[data-desk-flip]")!;
  const reset=root.querySelector<HTMLButtonElement>("[data-desk-reset]")!;
  const labels=JSON.parse(root.dataset.labels!) as {workflow:string;evidence:string};
  const reduced=matchMedia("(prefers-reduced-motion: reduce)");
  const initialPixelRatio=window.devicePixelRatio;
  const zoomed=()=>Math.abs((window.visualViewport?.scale??1)-1)>.01 || Math.abs(window.devicePixelRatio-initialPixelRatio)>.01;
  let scene:ProjectDeskScene|undefined, selected=0, flipped=false, generation=0, loading=false, parked=false, inView=false;
  let gesture:{id:number;x:number;y:number;dx:number;horizontal:boolean}|undefined;
  let dragFrame=0,dragAmount=0;
  const cancelDrag=()=>{cancelAnimationFrame(dragFrame);dragFrame=0;};
  const setExposure=(element:HTMLElement,active:boolean) => {element.inert=!active;element.setAttribute("aria-hidden",String(!active));};
  const update=() => {
    root.dataset.selected=String(selected);root.dataset.side=flipped?"workflow":"evidence";
    choices.forEach((button,index)=>button.setAttribute("aria-pressed",String(index===selected)));
    sheets.forEach((sheet,index)=>{
      setExposure(sheet,index===selected);
      setExposure(sheet.querySelector<HTMLElement>("[data-desk-front]")!,index===selected&&!flipped);
      sheet.querySelector("img")!.alt=index===selected&&!flipped?sheet.dataset.deskAlt!:"";
      // The readable workflow lives below the scene, not twice in the AT tree.
      const back=sheet.querySelector<HTMLElement>("[data-desk-back]")!;
      back.setAttribute("aria-hidden","true");back.inert=index!==selected;
    });
    stories.forEach((story,index)=>{
      story.dataset.active=String(index===selected);setExposure(story,index===selected);
      setExposure(story.querySelector<HTMLElement>("[data-desk-summary]")!,index===selected&&!flipped);
      setExposure(story.querySelector<HTMLElement>("[data-desk-workflow]")!,index===selected&&flipped);
    });
    flip.querySelector("span")!.textContent=flipped?labels.evidence:labels.workflow;
    reset.disabled=selected===0&&!flipped;
    scene?.select(selected,flipped);
  };
  const select=(index:number)=>{selected=(index+sheets.length)%sheets.length;flipped=false;update();};
  const changeSide=()=>{flipped=!flipped;update();};
  root.querySelectorAll<HTMLButtonElement>("button").forEach(button=>button.disabled=false);
  choices.forEach((button,index)=>button.addEventListener("click",()=>select(index)));
  root.querySelector("[data-desk-previous]")!.addEventListener("click",()=>select(selected-1));
  root.querySelector("[data-desk-next]")!.addEventListener("click",()=>select(selected+1));
  flip.addEventListener("click",changeSide);
  reset.addEventListener("click",()=>{select(0);scene?.reset();});
  stage.addEventListener("keydown",event=>{
    if(event.key==="ArrowLeft"){event.preventDefault();select(selected-1);}
    if(event.key==="ArrowRight"){event.preventDefault();select(selected+1);}
    if(event.key===" " || event.key==="Enter"){event.preventDefault();changeSide();}
    if(event.key==="Escape"){flipped=false;update();}
  });
  stage.addEventListener("pointerdown",event=>{
    if(event.button!==0)return;
    gesture={id:event.pointerId,x:event.clientX,y:event.clientY,dx:0,horizontal:false};
  });
  stage.addEventListener("pointermove",event=>{
    if(!gesture || gesture.id!==event.pointerId)return;
    const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;
    if(!gesture.horizontal){
      if(Math.abs(dy)>12 && Math.abs(dy)>Math.abs(dx)){gesture=undefined;return;}
      if(Math.abs(dx)<12)return;
      gesture.horizontal=true;stage.setPointerCapture(event.pointerId);stage.focus({preventScroll:true});root.dataset.dragging="true";
    }
    gesture.dx=dx;dragAmount=dx/Math.max(stage.clientWidth*.35,100);
    if(!dragFrame)dragFrame=requestAnimationFrame(()=>{dragFrame=0;scene?.drag(dragAmount);});
  });
  const end=(event:PointerEvent,cancelled=false)=>{
    if(!gesture || gesture.id!==event.pointerId)return;
    const completed=gesture;gesture=undefined;cancelDrag();delete root.dataset.dragging;
    if(stage.hasPointerCapture(event.pointerId))stage.releasePointerCapture(event.pointerId);
    if(!cancelled && completed.horizontal && Math.abs(completed.dx)>55)select(selected+(completed.dx<0?1:-1));
    else if(!cancelled && !completed.horizontal){
      const sheet=(event.target as HTMLElement).closest<HTMLElement>("[data-desk-sheet]");
      if(sheet && Number(sheet.dataset.deskSheet)!==selected)select(Number(sheet.dataset.deskSheet));
      else if(sheet)changeSide();
    } else scene?.drag(0);
  };
  stage.addEventListener("pointerup",event=>end(event));
  stage.addEventListener("pointercancel",event=>end(event,true));
  // Touch first captures the inner image; transferring that capture is not cancel.
  stage.addEventListener("lostpointercapture",event=>{if(event.target===stage&&gesture)end(event,true);});
  const unload=()=>{
    generation++;cancelDrag();scene?.dispose();scene=undefined;sheets.forEach(sheet=>original.append(sheet));delete root.dataset.renderer;
  };
  const load=async()=>{
    if(scene || loading || reduced.matches || parked || zoomed())return;
    const token=++generation;loading=true;
    let cancelled=false;
    try {
      const {createProjectDeskScene}=await import("./projectDeskScene");
      if(token!==generation || reduced.matches || parked || zoomed()){cancelled=true;return;}
      scene=createProjectDeskScene(host,sheets);root.dataset.renderer="3d";scene.select(selected,flipped);
    } catch {unload();root.dataset.renderer="flat";}
    finally {loading=false;if(cancelled && inView && !parked && !reduced.matches && !zoomed())void load();}
  };
  const observer=new IntersectionObserver(([entry])=>{inView=Boolean(entry?.isIntersecting);if(inView)void load();},{rootMargin:"80px"});observer.observe(stage);
  // Entry clipping can defer an observer notification; check once after it ends.
  const entryTimer=window.setTimeout(()=>{const box=stage.getBoundingClientRect();inView=box.top<innerHeight+80&&box.bottom>-80;if(inView)void load();},350);
  reduced.addEventListener("change",()=>{if(reduced.matches)unload();else void load();});
  const onZoom=()=>{if(zoomed()){unload();root.dataset.renderer="flat";}else if(inView)void load();};
  window.visualViewport?.addEventListener("resize",onZoom);window.addEventListener("resize",onZoom);
  window.addEventListener("pagehide",()=>{parked=true;clearTimeout(entryTimer);observer.disconnect();unload();});
  window.addEventListener("pageshow",event=>{if(event.persisted){parked=false;observer.observe(stage);void load();}});
  root.dataset.enhanced="true";update();
}

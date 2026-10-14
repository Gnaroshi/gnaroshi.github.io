import type { SpatialRenderer } from "./spatialSceneRenderer";

export function mountSpatialScene(root: HTMLElement): void {
  const host=root.querySelector<HTMLElement>("[data-scene-canvas]")!;
  const controls=root.querySelector<HTMLElement>("[data-scene-controls]")!;
  const pause=root.querySelector<HTMLButtonElement>("[data-scene-pause]")!;
  const unfold=root.querySelector<HTMLButtonElement>("[data-scene-unfold]");
  const labels=JSON.parse(root.dataset.sceneLabels!) as {pause:string;play:string;resetDone:string};
  const reduced=matchMedia("(prefers-reduced-motion:reduce)");
  let renderer:SpatialRenderer | null=null,disposed=false,paused=root.dataset.paused==="true",expanded=unfold?.getAttribute("aria-pressed")==="true";
  try{paused=localStorage.getItem("spatial-motion-paused")==="true";}catch{ /* Storage is optional. */ }
  let loading=false,request=0,down:{x:number;y:number;id:number}|null=null;
  const events=new AbortController();
  const visible=()=>{const rect=root.getBoundingClientRect();return rect.width>0&&rect.height>0&&rect.bottom>0&&rect.top<innerHeight;};
  const toggle=()=>{
    if(!renderer||!unfold)return;
    expanded=!expanded;unfold.setAttribute("aria-pressed",String(expanded));renderer.unfold(expanded);
  };
  const reset=()=>{expanded=false;unfold?.setAttribute("aria-pressed","false");renderer?.reset();root.querySelector<HTMLElement>("[data-scene-status]")!.textContent=labels.resetDone;};
  const load=async()=>{
    if(loading||renderer||disposed||!visible())return;
    loading=true;
    try {
      const {createSpatialRenderer}=await import("./spatialSceneRenderer");
      if(disposed)return;
      renderer=createSpatialRenderer(host,root.dataset.variant!,reduced.matches);
      root.dataset.renderer="webgl";controls.hidden=false;host.tabIndex=0;
      root.removeAttribute("aria-hidden");
      const researchIndex=Number(document.querySelector<HTMLElement>("[data-research-explorer]")?.dataset.selectedTopic??0);
      if(root.dataset.variant==="terrain")renderer.topic(researchIndex);
      renderer.setPaused(paused);renderer.setVisible(visible());
      if(expanded)renderer.unfold(true);
      root.dataset.paused=String(paused);pause.setAttribute("aria-label",paused?labels.play:labels.pause);pause.title=paused?labels.play:labels.pause;
      root.querySelector("[data-pause-icon]")!.toggleAttribute("hidden",paused);root.querySelector("[data-play-icon]")!.toggleAttribute("hidden",!paused);
    } catch (error) {
      if(import.meta.env.DEV)console.warn("[spatial-scene]",error);
      root.dataset.renderer="fallback";controls.hidden=true;host.tabIndex=-1;
      root.setAttribute("aria-hidden","true");
    } finally {loading=false;}
  };
  const onPointer=(event:PointerEvent)=>{
    if(!renderer||paused||reduced.matches||document.hidden||!visible()||event.pointerType==="touch")return;
    const x=event.clientX/innerWidth*2-1,y=event.clientY/innerHeight*2-1;
    if(request)cancelAnimationFrame(request);
    request=requestAnimationFrame(()=>{request=0;renderer?.point(x,y);});
  };
  document.addEventListener("pointermove",onPointer,{passive:true,signal:events.signal});
  host.addEventListener("pointerdown",event=>{if(event.button===0)down={x:event.clientX,y:event.clientY,id:event.pointerId};},{signal:events.signal});
  host.addEventListener("pointermove",event=>{
    if(!down||down.id!==event.pointerId)return;
    const dx=event.clientX-down.x,dy=event.clientY-down.y;
    if(event.pointerType==="touch"&&Math.abs(dy)>Math.abs(dx))return;
    if(Math.abs(dx)>6)renderer?.drag(dx/host.clientWidth,dy/host.clientHeight);
  },{passive:true,signal:events.signal});
  host.addEventListener("pointerup",event=>{
    if(down&&Math.hypot(event.clientX-down.x,event.clientY-down.y)<8)toggle();
    down=null;
  },{signal:events.signal});
  host.addEventListener("pointercancel",()=>{down=null;},{signal:events.signal});
  host.addEventListener("keydown",event=>{
    if(["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(event.key)){event.preventDefault();renderer?.nudge(event.key);}
    else if(event.key==="Enter"||event.key===" "){event.preventDefault();toggle();}
    else if(event.key==="Escape")reset();
  },{signal:events.signal});
  unfold?.addEventListener("click",toggle,{signal:events.signal});
  root.querySelector("[data-scene-reset]")!.addEventListener("click",reset,{signal:events.signal});
  pause.addEventListener("click",()=>{
    paused=!paused;renderer?.setPaused(paused);root.dataset.paused=String(paused);
    if(paused){cancelAnimationFrame(request);request=0;}
    try{localStorage.setItem("spatial-motion-paused",String(paused));}catch{ /* Storage is optional. */ }
    pause.setAttribute("aria-label",paused?labels.play:labels.pause);pause.title=paused?labels.play:labels.pause;
    root.querySelector("[data-pause-icon]")!.toggleAttribute("hidden",paused);
    root.querySelector("[data-play-icon]")!.toggleAttribute("hidden",!paused);
  },{signal:events.signal});
  host.addEventListener("spatial:fallback",()=>{controls.hidden=true;host.tabIndex=-1;root.setAttribute("aria-hidden","true");renderer?.dispose();renderer=null;},{signal:events.signal});
  window.addEventListener("gnaroshi:research-topic",event=>renderer?.topic((event as CustomEvent<{index:number}>).detail.index),{signal:events.signal});
  reduced.addEventListener("change",()=>renderer?.setReduced(reduced.matches),{signal:events.signal});
  document.addEventListener("visibilitychange",()=>renderer?.setVisible(!document.hidden&&visible()),{signal:events.signal});
  const observer=new IntersectionObserver(()=>{renderer?.setVisible(visible());void load();},{rootMargin:"100px"});observer.observe(root);
  window.addEventListener("pagehide",()=>{
    disposed=true;observer.disconnect();events.abort();cancelAnimationFrame(request);renderer?.dispose();renderer=null;
    controls.hidden=true;host.tabIndex=-1;delete root.dataset.renderer;
    root.setAttribute("aria-hidden","true");
  },{once:true});
  const restore=(event:PageTransitionEvent)=>{if(event.persisted){window.removeEventListener("pageshow",restore);mountSpatialScene(root);}};
  window.addEventListener("pageshow",restore);
  void load();
}

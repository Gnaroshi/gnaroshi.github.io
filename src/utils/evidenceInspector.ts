export function mountEvidenceInspector(root:HTMLElement):void {
  const viewport=root.querySelector<HTMLElement>("[data-inspector-viewport]")!;
  const picture=viewport.querySelector<HTMLElement>("picture")!;
  const increase=root.querySelector<HTMLButtonElement>("[data-inspector-in]")!;
  const decrease=root.querySelector<HTMLButtonElement>("[data-inspector-out]")!;
  const reset=root.querySelector<HTMLButtonElement>("[data-inspector-reset]")!;
  const output=root.querySelector<HTMLOutputElement>("output")!;
  let zoom=1,x=0,y=0,frame=0,gesture:{id:number;x:number;y:number}|undefined;
  const paint=()=>{
    frame=0;const bounds=viewport.getBoundingClientRect();
    if(bounds.width&&bounds.height){const limitX=bounds.width*(zoom-1)/2,limitY=bounds.height*(zoom-1)/2;x=Math.max(-limitX,Math.min(limitX,x));y=Math.max(-limitY,Math.min(limitY,y));}
    picture.style.transform=`translate3d(${x}px,${y}px,0) scale(${zoom})`;
    root.dataset.zoomed=String(zoom>1);root.dataset.zoom=String(zoom);
    output.value=`${Math.round(zoom*100)}%`;increase.disabled=zoom>=3;decrease.disabled=reset.disabled=zoom<=1;
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(paint);};
  const scale=(value:number)=>{zoom=Math.max(1,Math.min(3,value));if(zoom===1)x=y=0;paint();};
  increase.addEventListener("click",()=>scale(zoom+.5));decrease.addEventListener("click",()=>scale(zoom-.5));reset.addEventListener("click",()=>scale(1));
  viewport.addEventListener("keydown",event=>{
    if(["+","="].includes(event.key))scale(zoom+.5);
    else if(event.key==="-")scale(zoom-.5);
    else if(["0","Escape"].includes(event.key))scale(1);
    else if(zoom>1&&event.key.startsWith("Arrow")){x+=event.key==="ArrowLeft"?40:event.key==="ArrowRight"?-40:0;y+=event.key==="ArrowUp"?40:event.key==="ArrowDown"?-40:0;paint();}
    else return;
    event.preventDefault();
  });
  viewport.addEventListener("pointerdown",event=>{if(zoom<=1||event.button!==0)return;gesture={id:event.pointerId,x:event.clientX,y:event.clientY};viewport.setPointerCapture(event.pointerId);root.dataset.panning="true";viewport.focus({preventScroll:true});});
  viewport.addEventListener("pointermove",event=>{if(!gesture||event.pointerId!==gesture.id)return;x+=event.clientX-gesture.x;y+=event.clientY-gesture.y;gesture.x=event.clientX;gesture.y=event.clientY;schedule();});
  const stop=()=>{gesture=undefined;delete root.dataset.panning;};
  for(const type of ["pointerup","pointercancel","lostpointercapture"])viewport.addEventListener(type,stop);
  const observer=new ResizeObserver(schedule);observer.observe(viewport);
  window.addEventListener("pagehide",()=>{observer.disconnect();cancelAnimationFrame(frame);frame=0;stop();});
  window.addEventListener("pageshow",event=>{if(event.persisted){observer.observe(viewport);paint();}});
  root.querySelector<HTMLElement>("[data-inspector-controls]")!.hidden=false;viewport.tabIndex=0;paint();
}

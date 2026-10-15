export function mountWalkthrough(root:HTMLElement):void {
  const screens=[...root.querySelectorAll<HTMLElement>("[data-walkthrough-screen]")];
  const notes=[...root.querySelectorAll<HTMLElement>("[data-walkthrough-note]")];
  const choices=[...root.querySelectorAll<HTMLButtonElement>("[data-walkthrough-select]")];
  const range=root.querySelector<HTMLInputElement>("[data-walkthrough-range]")!;
  const previous=root.querySelector<HTMLButtonElement>("[data-walkthrough-previous]")!;
  const next=root.querySelector<HTMLButtonElement>("[data-walkthrough-next]")!;
  const feedback=root.querySelector<HTMLElement>("[data-walkthrough-feedback]")!;
  const labels=JSON.parse(root.dataset.walkthroughLabels!) as {loading:string;error:string};
  let request=0,selected=Number(root.dataset.initial);
  const commit=(index:number)=>{
    selected=index;root.dataset.step=String(index);range.value=String(index);
    screens.forEach((screen,i)=>{screen.dataset.active=String(i===index);screen.inert=i!==index;screen.setAttribute("aria-hidden",String(i!==index));const image=screen.querySelector("img");if(image)image.alt=i===index?screen.dataset.walkthroughAlt!:"";});
    notes.forEach((note,i)=>{note.dataset.active=String(i===index);note.inert=i!==index;note.setAttribute("aria-hidden",String(i!==index));});
    choices.forEach((button,i)=>button.setAttribute("aria-pressed",String(i===index)));
    range.setAttribute("aria-valuetext",`${index+1}: ${notes[index]!.querySelector("[data-walkthrough-title]")!.textContent}`);
    root.querySelector("[data-walkthrough-counter]")!.textContent=`${index+1} / ${screens.length}`;
    root.querySelector<HTMLAnchorElement>("[data-walkthrough-open]")!.href=screens[index]!.dataset.walkthroughOriginal!;
    previous.disabled=index===0;next.disabled=index===screens.length-1;
  };
  const select=async(index:number)=>{
    const token=++request,screen=screens[index]!;
    const template=screen.querySelector<HTMLTemplateElement>("template");
    if(template&&!screen.querySelector("picture"))screen.append(template.content.cloneNode(true));
    const image=screen.querySelector<HTMLImageElement>("img")!;
    root.setAttribute("aria-busy","true");root.querySelector("[data-walkthrough-counter]")!.textContent="…";
    feedback.textContent=labels.loading;feedback.classList.add("sr-only");feedback.hidden=false;
    try{
      image.loading="eager";await image.decode();
      if(token!==request)return;
      commit(index);feedback.hidden=true;
    }catch{
      if(token!==request)return;
      if(index!==selected)screen.querySelector("picture")?.remove();
      commit(selected);feedback.textContent=labels.error;feedback.classList.remove("sr-only");
    }finally{if(token===request)root.removeAttribute("aria-busy");}
  };
  choices.forEach((button,index)=>button.addEventListener("click",()=>void select(index)));
  range.addEventListener("input",()=>void select(Number(range.value)));
  previous.addEventListener("click",()=>void select(Math.max(0,selected-1)));
  next.addEventListener("click",()=>void select(Math.min(screens.length-1,selected+1)));
  root.querySelector<HTMLElement>("[data-walkthrough-controls]")!.hidden=false;
  root.querySelector<HTMLElement>("[data-walkthrough-steps]")!.hidden=false;
  root.dataset.enhanced="true";commit(selected);
  window.addEventListener("pagehide",()=>{request++;root.removeAttribute("aria-busy");feedback.hidden=true;commit(selected);});
}

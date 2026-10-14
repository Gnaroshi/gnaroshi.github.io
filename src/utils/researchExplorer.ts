import EmblaCarousel, { type EmblaCarouselType } from "embla-carousel";

export function mountResearchExplorer(root:HTMLElement):void {
  const topics = [...root.querySelectorAll<HTMLElement>("[data-research-topic]")];
  const headings = topics.map(topic => topic.querySelector<HTMLElement>("[data-research-topic-heading]")!);
  const figures = topics.map(topic => topic.querySelector<HTMLElement>("[data-research-figure]")!);
  const imageAlts = figures.map(figure => [...figure.querySelectorAll<HTMLImageElement>("img")].map(image => ({image,alt:image.alt})));
  const headingHost = root.querySelector<HTMLElement>("[data-research-heading]")!;
  const gallery = root.querySelector<HTMLElement>("[data-research-gallery]")!;
  const viewport = root.querySelector<HTMLElement>("[data-research-viewport]")!;
  const track = root.querySelector<HTMLElement>("[data-research-track]")!;
  const links = [...root.querySelectorAll<HTMLAnchorElement>("[data-in-page-link]")];
  const modeButton = root.querySelector<HTMLButtonElement>("[data-research-mode]")!;
  const previous = root.querySelector<HTMLButtonElement>("[data-research-previous]")!;
  const next = root.querySelector<HTMLButtonElement>("[data-research-next]")!;
  const labels = JSON.parse(root.dataset.explorerLabels!) as {all:string;explore:string};
  const reduced = matchMedia("(prefers-reduced-motion:reduce)");
  let mode = "focus", selected = 0;
  let carousel:EmblaCarouselType | null = null;
  const indexForHash = (hash:string) => {
    try { return headings.findIndex(heading => heading.id === decodeURIComponent(hash.slice(1))); }
    catch { return -1; }
  };
  const synchronize = (index:number) => {
    const nextIndex = Math.max(0,Math.min(topics.length-1,index));
    if(nextIndex !== selected)root.querySelectorAll<HTMLDialogElement>("dialog[open]").forEach(dialog=>dialog.close());
    selected = nextIndex;
    window.dispatchEvent(new CustomEvent("gnaroshi:research-topic",{detail:{index:selected}}));
    root.dataset.selectedTopic = String(selected); root.dataset.mode = mode;
    topics.forEach((topic,i) => {topic.hidden=mode === "focus" && i !== selected;topic.inert=topic.hidden;topic.dataset.selected=String(i === selected);});
    headings.forEach((heading,i) => {heading.hidden=mode === "focus" && i !== selected;});
    figures.forEach((figure,i) => {figure.dataset.selected=String(i === selected);figure.inert=mode === "focus" && i !== selected;if(figure.inert)figure.setAttribute("aria-hidden","true");else figure.removeAttribute("aria-hidden");});
    imageAlts.forEach((images,i)=>images.forEach(({image,alt})=>{image.alt=mode === "focus" && i !== selected?"":alt;}));
    links.forEach((link,i) => {if(i === selected)link.setAttribute("aria-current","location");else link.removeAttribute("aria-current");});
    previous.disabled=selected === 0;next.disabled=selected === topics.length-1;
  };
  const onSlide = () => {
    if(!carousel)return;
    synchronize(carousel.selectedScrollSnap());
    const hash=`#${headings[selected]!.id}`;
    if(location.hash !== hash){history.pushState(null,"",hash);window.dispatchEvent(new Event("gnaroshi:locationchange"));}
  };
  const mountCarousel = () => {
    carousel?.destroy();
    carousel=EmblaCarousel(viewport,{align:"start",loop:false,containScroll:"trimSnaps",startIndex:selected,duration:reduced.matches?0:30,watchFocus:false,watchDrag:(_api,event)=>!(event.target as Element).closest("a,button,input")});
    carousel.on("select",onSlide);
  };
  const setMode = (value:string) => {
    mode=value;carousel?.destroy();carousel=null;
    if(mode === "focus") {
      headings.forEach(heading=>headingHost.append(heading));figures.forEach(figure=>track.append(figure));
      headingHost.hidden=false;gallery.hidden=false;synchronize(selected);mountCarousel();
    } else {
      topics.forEach((topic,i)=>{topic.prepend(headings[i]!);topic.append(figures[i]!);});
      headingHost.hidden=true;gallery.hidden=true;synchronize(selected);
    }
    modeButton.querySelector("[data-research-view-label]")!.textContent=mode === "focus"?labels.all:labels.explore;
    root.querySelector("[data-research-list-icon]")!.toggleAttribute("hidden",mode !== "focus");
    root.querySelector("[data-research-gallery-icon]")!.toggleAttribute("hidden",mode === "focus");
    window.dispatchEvent(new Event("resize"));
  };
  const reveal = (hash:string) => {
    const index=hash ? indexForHash(hash) : 0;if(index < 0)return;
    synchronize(index);carousel?.scrollTo(index,true);
  };
  previous.addEventListener("click",()=>carousel?.scrollPrev(reduced.matches));
  next.addEventListener("click",()=>carousel?.scrollNext(reduced.matches));
  viewport.addEventListener("keydown",event=>{
    if(event.target !== viewport)return;
    const index=event.key === "ArrowLeft"?selected-1:event.key === "ArrowRight"?selected+1:event.key === "Home"?0:event.key === "End"?topics.length-1:null;
    if(index === null)return;
    event.preventDefault();carousel?.scrollTo(Math.max(0,Math.min(topics.length-1,index)),reduced.matches);
  });
  // The engine owns horizontal position; native focus scrolling must not add an offset.
  viewport.addEventListener("scroll",()=>{
    if(viewport.scrollLeft)viewport.scrollTo({left:0,behavior:"instant"});
  },{passive:true});
  modeButton.addEventListener("click",()=>{setMode(mode === "focus"?"all":"focus");headings[selected]!.scrollIntoView({block:"start",behavior:"instant"});});
  window.addEventListener("gnaroshi:reveal-anchor",event=>reveal((event as CustomEvent<{hash:string}>).detail.hash));
  window.addEventListener("popstate",()=>reveal(location.hash));
  window.addEventListener("hashchange",()=>reveal(location.hash));
  reduced.addEventListener("change",()=>carousel?.reInit({duration:reduced.matches?0:30}));
  window.addEventListener("pagehide",()=>{carousel?.destroy();carousel=null;});
  window.addEventListener("pageshow",event=>{if(event.persisted && mode === "focus")mountCarousel();});
  selected=Math.max(0,indexForHash(location.hash));
  root.dataset.enhanced="true";setMode("focus");modeButton.hidden=false;
  // Moving an already-focused hash heading between hosts can drop browser focus.
  if(indexForHash(location.hash) >= 0)requestAnimationFrame(()=>{
    headings[selected]!.focus({preventScroll:true});
    headings[selected]!.scrollIntoView({block:"start",behavior:"instant"});
  });
}

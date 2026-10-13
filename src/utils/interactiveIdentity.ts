import type { IdentityScene } from "./identityScene";

type Labels = { original:string; dimensional:string; foil:string; activate:string; unavailable:string; loading:string; paused:string };

export function mountInteractiveIdentity(root:HTMLElement):void {
  const labels = JSON.parse(root.dataset.labels!) as Labels;
  const stage = root.querySelector<HTMLButtonElement>("[data-identity-stage]")!;
  const image = root.querySelector<HTMLImageElement>("[data-identity-image]")!;
  const host = root.querySelector<HTMLElement>("[data-identity-canvas]")!;
  const status = root.querySelector<HTMLElement>("[data-identity-status]")!;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let clicks = 0;
  let paused = false;
  let scene:IdentityScene | null = null;
  let loading:Promise<void> | null = null;
  let generation = 0;
  let pulse:Animation | null = null;
  let pointerListeners:AbortController | null = null;
  let pointerFrame = 0;

  const cancelPointerFrame = () => { cancelAnimationFrame(pointerFrame); pointerFrame = 0; };
  const stopPointerTracking = () => {
    pointerListeners?.abort(); pointerListeners = null;
    cancelPointerFrame();
    delete root.dataset.pointerTracking;
  };
  const startPointerTracking = () => {
    stopPointerTracking();
    pointerListeners = new AbortController();
    const { signal } = pointerListeners;
    let clientX = 0, clientY = 0;
    document.addEventListener("pointermove",event => {
      if (!["mouse","pen"].includes(event.pointerType) || !scene || paused || reduced.matches || document.hidden) return;
      clientX = event.clientX; clientY = event.clientY;
      if (pointerFrame) return;
      pointerFrame = requestAnimationFrame(() => {
        pointerFrame = 0;
        const rect = stage.getBoundingClientRect();
        if (!rect.width || rect.bottom <= 0 || rect.top >= innerHeight) return;
        const centerX = rect.left + rect.width / 2, centerY = rect.top + rect.height / 2;
        const x = (clientX - centerX) / Math.max(centerX,innerWidth - centerX,1);
        const y = (clientY - centerY) / Math.max(centerY,innerHeight - centerY,1);
        scene?.point(Math.max(-1,Math.min(1,x)),Math.max(-1,Math.min(1,y)));
      });
    },{ passive:true,signal });
    const neutral = () => { cancelPointerFrame(); if (!reduced.matches) scene?.point(0,0); };
    document.addEventListener("pointerleave",neutral,{ signal });
    document.addEventListener("visibilitychange",() => { if (document.hidden) cancelPointerFrame(); },{ signal });
    window.addEventListener("blur",neutral,{ signal });
    root.dataset.pointerTracking = "true";
  };

  const synchronize = () => {
    const mode = clicks >= 6 ? "foil" : clicks >= 3 ? "dimensional" : "original";
    root.dataset.clicks = String(clicks);
    root.dataset.mode = mode;
    const state = loading && !scene ? labels.loading : root.dataset.renderer === "fallback" ? labels.unavailable : labels[mode];
    const description = paused ? `${state}. ${labels.paused}` : state;
    status.textContent = description;
    stage.setAttribute("aria-label",`${labels.activate}. ${Math.min(clicks,6)}/6`);
    root.dataset.paused = String(paused);
    scene?.setFoil(clicks >= 6);
  };

  const loadScene = async () => {
    const token = generation;
    status.textContent = labels.loading;
    try {
      const { createIdentityScene } = await import("./identityScene");
      const next = await createIdentityScene(host,image.src,reduced.matches);
      if (generation !== token) { next.dispose(); return; }
      scene = next;
      root.dataset.renderer = "webgl";
      scene.setPaused(paused);
      scene.setFoil(clicks >= 6);
      scene.impulse(clicks);
      startPointerTracking();
    } catch {
      if (generation === token) root.dataset.renderer = "fallback";
    } finally {
      if (generation === token) { loading = null; synchronize(); }
    }
  };

  stage.addEventListener("click",() => {
    clicks += 1;
    pulse?.cancel();
    if (!reduced.matches) {
      pulse = image.animate([
        { transform:"scale(1) rotate(0)" },
        { transform:`scale(.91) rotate(${clicks % 2 ? -7 : 7}deg)`,offset:.25 },
        { transform:"scale(1.04) rotate(0)",offset:.65 },
        { transform:"scale(1) rotate(0)" }
      ],{ duration:480,easing:"cubic-bezier(.2,.8,.2,1)" });
    }
    synchronize();
    if (clicks >= 3 && !scene && !loading && root.dataset.renderer !== "fallback") loading = loadScene();
    scene?.impulse(clicks);
  });
  const reset = () => {
    generation += 1;
    loading = null;
    stopPointerTracking();
    scene?.dispose(); scene = null;
    pulse?.cancel();
    clicks = 0; paused = false;
    delete root.dataset.renderer;
    synchronize();
    stage.focus({ preventScroll:true });
  };
  stage.addEventListener("keydown",event => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key === "Escape" && clicks > 0) { event.preventDefault(); reset(); return; }
    if (!scene) return;
    if (event.key.toLowerCase() === "p") {
      event.preventDefault();
      if (event.repeat) return;
      cancelPointerFrame(); paused = !paused; scene.setPaused(paused); synchronize(); return;
    }
    if (!["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(event.key)) return;
    event.preventDefault(); scene.nudge(event.key);
  });
  host.addEventListener("identity:fallback",() => { stopPointerTracking();scene?.dispose();scene=null;synchronize(); });
  reduced.addEventListener("change",() => { cancelPointerFrame();pulse?.cancel();scene?.setReduced(reduced.matches); });
  window.addEventListener("pagehide",() => {
    stopPointerTracking();
    generation += 1; loading = null; scene?.dispose(); scene = null;
    delete root.dataset.renderer;
  });
  window.addEventListener("pageshow",(event) => {
    if (event.persisted && clicks >= 3 && !scene && !loading) loading = loadScene();
  });
  root.dataset.ready = "true";
  stage.disabled = false;
}

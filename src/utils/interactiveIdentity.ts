import type { IdentityScene } from "./identityScene";

type Labels = { original:string; dimensional:string; foil:string; activate:string; unavailable:string; loading:string };

export function mountInteractiveIdentity(root:HTMLElement):void {
  const labels = JSON.parse(root.dataset.labels!) as Labels;
  const stage = root.querySelector<HTMLButtonElement>("[data-identity-stage]")!;
  const image = root.querySelector<HTMLImageElement>("[data-identity-image]")!;
  const host = root.querySelector<HTMLElement>("[data-identity-canvas]")!;
  const status = root.querySelector<HTMLElement>("[data-identity-status]")!;
  const reset = root.querySelector<HTMLButtonElement>("[data-identity-reset]")!;
  const pause = root.querySelector<HTMLButtonElement>("[data-identity-pause]")!;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let clicks = 0;
  let paused = false;
  let scene:IdentityScene | null = null;
  let loading:Promise<void> | null = null;
  let generation = 0;
  let pulse:Animation | null = null;

  const synchronize = () => {
    const mode = clicks >= 6 ? "foil" : clicks >= 3 ? "dimensional" : "original";
    root.dataset.clicks = String(clicks);
    root.dataset.mode = mode;
    const description = loading && !scene ? labels.loading : root.dataset.renderer === "fallback" ? labels.unavailable : labels[mode];
    status.textContent = description;
    stage.setAttribute("aria-label",`${labels.activate}. ${description}. ${Math.min(clicks,6)}/6`);
    root.querySelectorAll<HTMLElement>("[data-identity-dot]").forEach((dot,index) => dot.toggleAttribute("data-active",index < clicks));
    reset.disabled = clicks === 0;
    pause.hidden = !scene || root.dataset.renderer === "fallback";
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
  stage.addEventListener("pointermove",(event) => {
    const rect = stage.getBoundingClientRect();
    scene?.point((event.clientX - rect.left) / rect.width * 2 - 1,(event.clientY - rect.top) / rect.height * 2 - 1);
  });
  stage.addEventListener("pointerleave",() => scene?.point(0,0));
  stage.addEventListener("keydown",(event) => {
    if (!scene || !["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(event.key)) return;
    event.preventDefault();
    scene.nudge(event.key);
  });
  reset.addEventListener("click",() => {
    generation += 1;
    loading = null;
    scene?.dispose(); scene = null;
    pulse?.cancel();
    clicks = 0; paused = false;
    pause.setAttribute("aria-pressed","false");
    delete root.dataset.renderer;
    synchronize();
    stage.focus({ preventScroll:true });
  });
  pause.addEventListener("click",() => {
    paused = !paused;
    pause.setAttribute("aria-pressed",String(paused));
    scene?.setPaused(paused);
  });
  host.addEventListener("identity:fallback",synchronize);
  reduced.addEventListener("change",() => { pulse?.cancel(); scene?.setReduced(reduced.matches); });
  window.addEventListener("pagehide",() => {
    generation += 1; loading = null; scene?.dispose(); scene = null;
    delete root.dataset.renderer;
  });
  window.addEventListener("pageshow",(event) => {
    if (event.persisted && clicks >= 3 && !scene && !loading) loading = loadScene();
  });
  root.dataset.ready = "true";
  stage.disabled = false;
}

import { PerspectiveCamera, Scene, MathUtils } from "three";
import { CSS3DObject, CSS3DRenderer } from "three/addons/renderers/CSS3DRenderer.js";

export interface ProjectDeskScene {
  select(index:number,flipped:boolean):void;
  drag(amount:number):void;
  reset():void;
  dispose():void;
}

// DOM evidence stays crisp and accessible; Three supplies perspective and layout.
export function createProjectDeskScene(host:HTMLElement,sheets:HTMLElement[]):ProjectDeskScene {
  const renderer = new CSS3DRenderer();
  host.append(renderer.domElement);
  const scene = new Scene();
  const camera = new PerspectiveCamera(36,1,1,6000);
  const objects = sheets.map((element) => {
    const object = new CSS3DObject(element); scene.add(object);return object;
  });
  let selected = 0, flipped = false, drag = 0;
  let frame = 0, start = 0, last = 0, serial = 0, visible = true, disposed = false;
  let targets:{x:number;y:number;z:number;angle:number;scale:number}[] = [];
  const calculate = () => {
    targets = objects.map((_,index) => {
      let distance = index-selected;
      if (distance > 1) distance -= objects.length;
      if (distance < -1) distance += objects.length;
      return {x:distance*580+drag*120,y:distance === 0 ? 0 : -18,z:distance === 0 ? 0 : -240,angle:distance === 0 ? (flipped ? Math.PI : 0)+drag*.65 : -distance*.6,scale:distance === 0 ? 1 : .82};
    });
  };
  const render = () => {
    renderer.render(scene,camera);host.dataset.frame=String(++serial);
  };
  const draw = (time:number) => {
    frame=0;if(disposed || !visible || document.hidden)return;
    const amount=1-Math.exp(-Math.min(time-last,40)/95);last=time;
    objects.forEach((object,index) => {
      const target=targets[index]!;
      object.position.x=MathUtils.lerp(object.position.x,target.x,amount);
      object.position.y=MathUtils.lerp(object.position.y,target.y,amount);
      object.position.z=MathUtils.lerp(object.position.z,target.z,amount);
      object.rotation.y=MathUtils.lerp(object.rotation.y,target.angle,amount);
      object.scale.setScalar(MathUtils.lerp(object.scale.x,target.scale,amount));
    });
    render();
    if(time-start<850)frame=requestAnimationFrame(draw);
    else {settle();render();}
  };
  const settle = () => objects.forEach((object,index) => {
    const target=targets[index]!;object.position.set(target.x,target.y,target.z);object.rotation.y=target.angle;object.scale.setScalar(target.scale);
  });
  const request = () => {
    calculate();if(disposed || !visible || document.hidden)return;
    start=performance.now();if(!frame){last=start;frame=requestAnimationFrame(draw);}
  };
  const resize = () => {
    const {width,height}=host.getBoundingClientRect();if(!width || !height || disposed)return;
    renderer.setSize(width,height);camera.aspect=width/height;
    const projectedHeight=Math.min(height*.86,width*.88/1.6);
    camera.position.z=500*height/(2*Math.tan(MathUtils.degToRad(18))*projectedHeight);
    camera.updateProjectionMatrix();calculate();settle();if(visible&&!document.hidden)render();
  };
  const onVisibility = () => {if(document.hidden){cancelAnimationFrame(frame);frame=0;}else if(visible){calculate();settle();render();}};
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
  const observer=new IntersectionObserver(([entry]) => {
    visible=Boolean(entry?.isIntersecting);if(!visible){cancelAnimationFrame(frame);frame=0;}else{calculate();settle();render();}
  });observer.observe(host);
  document.addEventListener("visibilitychange",onVisibility);
  calculate();resize();
  objects.forEach((object,index)=>{object.position.x=(index-1)*45;object.position.z=-220;object.rotation.y=-.6;});request();
  return {
    select(index,nextFlipped){selected=index;flipped=nextFlipped;drag=0;request();},
    drag(amount){drag=MathUtils.clamp(amount,-1,1);request();},
    reset(){flipped=false;drag=0;request();},
    dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(frame);resizeObserver.disconnect();observer.disconnect();document.removeEventListener("visibilitychange",onVisibility);sheets.forEach(sheet=>sheet.removeAttribute("style"));renderer.domElement.remove();}
  };
}

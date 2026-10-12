import * as THREE from "three";

export interface IdentityScene {
  point(x:number,y:number):void;
  nudge(key:string):void;
  impulse(count:number):void;
  setFoil(value:boolean):void;
  setPaused(value:boolean):void;
  setReduced(value:boolean):void;
  dispose():void;
}

// One instanced draw call turns the approved raster into a shallow relief.
// The outside dark background is flood-filled away; interior features remain.
export async function createIdentityScene(host:HTMLElement,source:string,initialReduced:boolean):Promise<IdentityScene> {
  const image = new Image(); image.src = source; await image.decode();
  const sample = document.createElement("canvas"); sample.width = sample.height = 64;
  const context = sample.getContext("2d",{ willReadFrequently:true })!;
  context.drawImage(image,0,0,64,64);
  const pixels = context.getImageData(0,0,64,64).data;
  const outside = new Uint8Array(64 * 64);
  const pending:number[] = [];
  for (let i=0;i<64;i++) pending.push(i,63*64+i,i*64,i*64+63);
  while (pending.length) {
    const cell = pending.pop()!;
    if (outside[cell]) continue;
    const index = cell * 4;
    if (pixels[index]! + pixels[index+1]! + pixels[index+2]! > 70 && pixels[index+3]! > 20) continue;
    outside[cell] = 1;
    const x = cell % 64, y = Math.floor(cell / 64);
    if (x > 0) pending.push(cell-1); if (x < 63) pending.push(cell+1);
    if (y > 0) pending.push(cell-64); if (y < 63) pending.push(cell+64);
  }
  const included = Array.from({length:4096},(_,index) => index).filter((index) => !outside[index]);
  // The render loop stops at rest; retain the small capped buffer for repaint/capture.
  const renderer = new THREE.WebGLRenderer({ alpha:true,antialias:true,powerPreference:"low-power",preserveDrawingBuffer:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x000000,0);
  renderer.domElement.setAttribute("aria-hidden","true");
  host.append(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-2.1,2.1,2.1,-2.1,.1,20); camera.position.set(0,0,8);
  const uniforms = { uFoil:{value:0},uTime:{value:0} };
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader:`
      varying vec3 vColor; varying vec3 vNormal; varying vec3 vPosition;
      void main() {
        vec4 point = instanceMatrix * vec4(position,1.0);
        vec4 view = modelViewMatrix * point;
        vColor = instanceColor;
        vNormal = normalize(normalMatrix * mat3(instanceMatrix) * normal);
        vPosition = view.xyz;
        gl_Position = projectionMatrix * view;
      }`,
    fragmentShader:`
      uniform float uFoil; uniform float uTime;
      varying vec3 vColor; varying vec3 vNormal; varying vec3 vPosition;
      void main() {
        vec3 normal = normalize(vNormal);
        vec3 light = normalize(vec3(-0.6,0.8,1.5));
        vec3 eye = normalize(-vPosition);
        float diffuse = 0.72 + 0.38 * max(dot(normal,light),0.0);
        float phase = dot(vPosition.xy,vec2(3.6,5.1)) + dot(normal,eye)*8.0 + uTime*0.8;
        vec3 rainbow = 0.5 + 0.5*cos(phase + vec3(0.0,2.094,4.188));
        float ribbon = pow(0.5 + 0.5*sin(phase*0.62),10.0);
        float specular = pow(max(dot(reflect(-light,normal),eye),0.0),32.0);
        float fleck = pow(max(sin(vPosition.x*88.0)*sin(vPosition.y*101.0),0.0),20.0);
        vec3 color = vColor*diffuse;
        color = mix(color,color*(0.58+rainbow*0.95),uFoil*0.8);
        color += uFoil*(rainbow*ribbon*0.25 + vec3(specular*0.42+fleck*0.10));
        gl_FragColor = vec4(color,1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`
  });
  const geometry = new THREE.BoxGeometry(1,1,1);
  const mesh = new THREE.InstancedMesh(geometry,material,included.length);
  const dummy = new THREE.Object3D();
  const color = new THREE.Color();
  const unit = 3.6 / 64;
  included.forEach((cell,index) => {
    const offset = cell*4, x = cell%64,y = Math.floor(cell/64);
    const r = pixels[offset]!/255,g = pixels[offset+1]!/255,b = pixels[offset+2]!/255;
    const depth = .12 + Math.max(r,g,b)*.2 + (Math.abs(x-32)<10 && y>20 ? .12 : 0);
    dummy.position.set((x-31.5)*unit,(31.5-y)*unit,depth/2);
    dummy.scale.set(unit*1.005,unit*1.005,depth); dummy.updateMatrix();
    mesh.setMatrixAt(index,dummy.matrix);
    mesh.setColorAt(index,color.setRGB(r,g,b,THREE.SRGBColorSpace));
  });
  mesh.instanceMatrix.needsUpdate = true; mesh.instanceColor!.needsUpdate = true;
  scene.add(mesh);
  let reduced = initialReduced, paused = false, visible = true, disposed = false;
  let frame = 0, deadline = 0, lastTime = 0, serial = 0;
  let surfaceWidth = 0, surfaceHeight = 0;
  let targetX = -.12,targetY = .18,kick = 0;
  mesh.rotation.set(targetX,targetY,0);
  const draw = () => {
    renderer.render(scene,camera);
    host.dataset.frame = String(++serial);
    host.dataset.drawCalls = String(renderer.info.render.calls);
  };
  const tick = (time:number) => {
    frame = 0;
    if (disposed || !visible || document.hidden || paused) return;
    const amount = 1-Math.exp(-Math.min(time-lastTime,50)/85); lastTime = time;
    kick *= .82;
    mesh.rotation.x += (targetX-mesh.rotation.x)*amount;
    mesh.rotation.y += (targetY+kick-mesh.rotation.y)*amount;
    mesh.scale.setScalar(1 + Math.abs(kick)*.025);
    uniforms.uTime.value = time/1000;
    draw();
    if (time < deadline) frame = requestAnimationFrame(tick);
  };
  const requestDraw = (duration=650) => {
    if (disposed || !visible || document.hidden) return;
    if (reduced || paused) { mesh.rotation.set(targetX,targetY,0); mesh.scale.setScalar(1); draw(); return; }
    const now = performance.now(); deadline = now + duration;
    if (!frame) { lastTime = now; frame = requestAnimationFrame(tick); }
  };
  const resize = () => {
    const {width,height} = host.getBoundingClientRect();
    if (!width || !height || disposed || (width === surfaceWidth && height === surfaceHeight)) return;
    surfaceWidth = width; surfaceHeight = height;
    renderer.setSize(width,height,false);
    const aspect = width/height;
    camera.left = -2.15*aspect; camera.right = 2.15*aspect; camera.top=2.15;camera.bottom=-2.15;camera.updateProjectionMatrix();
    if (visible && !document.hidden) draw();
  };
  const onVisibility = () => { if (document.hidden) { cancelAnimationFrame(frame);frame=0; } else requestDraw(0); };
  document.addEventListener("visibilitychange",onVisibility);
  const resizeObserver = new ResizeObserver(resize);resizeObserver.observe(host);
  const intersection = new IntersectionObserver(([entry]) => { visible = Boolean(entry?.isIntersecting); if (!visible) { cancelAnimationFrame(frame);frame=0; } else requestDraw(0); });intersection.observe(host);
  const onContextLost = (event:Event) => {
    event.preventDefault(); cancelAnimationFrame(frame);frame=0;
    host.closest<HTMLElement>("[data-interactive-identity]")!.dataset.renderer = "fallback";
    host.dispatchEvent(new Event("identity:fallback",{ bubbles:true }));
  };
  renderer.domElement.addEventListener("webglcontextlost",onContextLost);
  resize();requestDraw(750);
  return {
    point(x,y) { if (paused) return; targetX = -.12+y*.28;targetY=.18+x*.45;requestDraw(); },
    nudge(key) { if (paused) return; if (key === "ArrowLeft") targetY-=.22; if (key === "ArrowRight") targetY+=.22; if (key === "ArrowUp") targetX-=.15; if (key === "ArrowDown") targetX+=.15;requestDraw(); },
    impulse(count) { if (paused) return; kick = count%2 ? .75 : -.75;requestDraw(950); },
    setFoil(value) { const next=value?1:0;if(uniforms.uFoil.value===next)return;uniforms.uFoil.value=next;requestDraw(900); },
    setPaused(value) { paused=value;cancelAnimationFrame(frame);frame=0;if(!paused)requestDraw(0); },
    setReduced(value) { reduced=value;cancelAnimationFrame(frame);frame=0;requestDraw(0); },
    dispose() { if(disposed)return;disposed=true;cancelAnimationFrame(frame);resizeObserver.disconnect();intersection.disconnect();document.removeEventListener("visibilitychange",onVisibility);renderer.domElement.removeEventListener("webglcontextlost",onContextLost);mesh.dispose();geometry.dispose();material.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove(); }
  };
}

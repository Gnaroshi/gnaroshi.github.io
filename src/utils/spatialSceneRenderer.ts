import * as THREE from "three";

export interface SpatialRenderer {
  point(x:number,y:number):void; drag(x:number,y:number):void; nudge(key:string):void;
  unfold(value:boolean):void; reset():void; topic(index:number):void;
  setPaused(value:boolean):void; setReduced(value:boolean):void; setVisible(value:boolean):void; dispose():void;
}

export function createSpatialRenderer(host:HTMLElement,variant:string,initialReduced:boolean):SpatialRenderer {
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:"low-power"});
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setClearColor(0x000000,0);
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
  renderer.autoClear=false;renderer.info.autoReset=false;
  renderer.domElement.setAttribute("aria-hidden","true");host.append(renderer.domElement);
  const scene=new THREE.Scene();
  const camera=new THREE.OrthographicCamera(-5,5,3,-3,.1,40);camera.position.set(0,2,12);camera.lookAt(0,0,0);
  const group=new THREE.Group();scene.add(group);
  const resources:(THREE.BufferGeometry|THREE.Material)[]=[];
  const palettes=[0xe98639,0x27a997,0xe4e8df];
  const deformation={pointer:{value:new THREE.Vector2()},time:{value:0},topic:{value:0},spread:{value:0}};
  const sheets:THREE.Mesh[]=[];
  const fields:{geometry:THREE.BufferGeometry;source:Float32Array}[]=[];
  const key=new THREE.DirectionalLight(0xffffff,3.2);key.position.set(-4,7,8);scene.add(key);
  const rim=new THREE.DirectionalLight(0x8fffe7,2.2);rim.position.set(5,-1,-4);scene.add(rim);
  scene.add(new THREE.HemisphereLight(0xffffff,0x24382e,2.0));
  scene.add(new THREE.AmbientLight(0xffffff,1.6));
  scene.children.filter(object=>object instanceof THREE.Light).forEach(light=>light.layers.enableAll());
  // Open folded strips, rather than a generic sphere or torus, give the scene a distinct silhouette.
  if(variant!=="identity")for(let layer=0;layer<(variant==="terrain"?1:3);layer++) {
    const geometry=variant==="assembly"?new THREE.BoxGeometry(3.8,.3,2.1):new THREE.PlaneGeometry(4.8,variant==="terrain"?3.6:1.25,48,16);
    const positions=geometry.getAttribute("position") as THREE.BufferAttribute;
    if(variant!=="assembly")for(let i=0;i<positions.count;i++) {
      const x=positions.getX(i),v=positions.getY(i);
      const phase=layer*.75;
      positions.setXYZ(i,x,variant==="terrain"?Math.sin(x*1.4)*Math.cos(v*1.1)*.9:Math.sin(x*1.35+phase)*.72+v*.35,variant==="terrain"?v:Math.cos(x*1.3+phase)*.65+v);
    }
    geometry.computeVertexNormals();
    const material=new THREE.MeshPhysicalMaterial({color:variant==="terrain"?0x32ac98:palettes[layer],metalness:.06,roughness:.28,clearcoat:1,clearcoatRoughness:.12,side:THREE.DoubleSide});
    if(variant!=="assembly")material.onBeforeCompile=shader=>{
      shader.uniforms.uPointer=deformation.pointer;shader.uniforms.uTime=deformation.time;shader.uniforms.uTopic=deformation.topic;
      shader.uniforms.uSpread=deformation.spread;
      shader.vertexShader=`uniform vec2 uPointer; uniform float uTime; uniform float uTopic; uniform float uSpread;\n${shader.vertexShader}`.replace("#include <begin_vertex>",`#include <begin_vertex>\nfloat pull=exp(-pow(position.x-uPointer.x*2.5,2.0)*0.6); transformed.y+=pull*uPointer.y*0.65+sin(position.x*2.0+uTime)*0.08+sin(position.x+uTopic)*uTopic*0.18; ${variant==="terrain"?"transformed.y*=1.0-uSpread*0.85;":""}`);
    };
    const mesh=new THREE.Mesh(geometry,material);mesh.position.set(0,layer*.24-.24,layer*-.3);
    group.add(mesh);sheets.push(mesh);resources.push(geometry,material);
    const edgeGeometry=new THREE.EdgesGeometry(geometry,35);
    const edgeMaterial=new THREE.LineBasicMaterial({color:0x143f38,transparent:true,opacity:layer===2?.16:.07});
    if(variant!=="assembly")edgeMaterial.onBeforeCompile=material.onBeforeCompile;
    const edges=new THREE.LineSegments(edgeGeometry,edgeMaterial);
    mesh.add(edges);resources.push(edgeGeometry,edges.material as THREE.Material);
  }
  const lineMaterial=new THREE.LineBasicMaterial({color:0x58ad9c,transparent:true,opacity:.4});resources.push(lineMaterial);
  // A single line-segment field deforms around the pointer; it is decorative, not a metric plot.
  const points:number[]=[];
  for(let row=0;row<24;row++)for(let column=0;column<64;column++) {
    for(const next of [column,column+1])points.push((next/64-.5)*16,-1.4+Math.sin(next*.11+row*.17)*.08,(row/23-.5)*10);
  }
  const fieldGeometry=new THREE.BufferGeometry();fieldGeometry.setAttribute("position",new THREE.Float32BufferAttribute(points,3));resources.push(fieldGeometry);
  const field=new THREE.LineSegments(fieldGeometry,lineMaterial);field.position.y=-.4;scene.add(field);
  fields.push({geometry:fieldGeometry,source:new Float32Array(points)});
  group.traverse(object=>object.layers.set(1));
  let reduced=initialReduced,paused=false,visible=true,disposed=false,frame=0,serial=0,last=0,deadline=performance.now()+8000;
  let x=0,y=0,targetX=0,targetY=0,spread=0,targetSpread=0,angle=-.25,dragAngle=0,topicIndex=0,time=0;
  let width=0,height=0,mobile=false;
  let protectedRight=0,protectedBottom=0;
  const dark=()=>document.documentElement.dataset.theme==="dark";
  const theme=()=>{lineMaterial.color.setHex(dark()?0x62ccb4:0x398b7c);lineMaterial.opacity=variant==="identity"?.25:dark()?.4:.26;draw();};
  function draw() {
    if(disposed||!width||!height)return;
    renderer.setScissorTest(false);renderer.clear();renderer.info.reset();renderer.setScissorTest(true);
    camera.layers.set(0);renderer.setScissor(0,0,width,Math.max(0,height-protectedBottom));renderer.render(scene,camera);
    camera.layers.set(1);
    renderer.setScissor(mobile?0:protectedRight,0,mobile?width:Math.max(0,width-protectedRight),mobile?Math.max(0,height-protectedBottom):height);
    renderer.render(scene,camera);renderer.setScissorTest(false);
    host.dataset.frame=String(++serial);host.dataset.drawCalls=String(renderer.info.render.calls);
    host.dataset.rotation=String(variant==="identity"?camera.rotation.y:group.rotation.y);host.dataset.expansion=String(spread);host.dataset.topic=String(topicIndex);
  }
  function update(delta:number) {
    const ease=reduced||paused?1:1-Math.exp(-delta/100);
    x+=(targetX-x)*ease;y+=(targetY-y)*ease;spread+=(targetSpread-spread)*ease;
    deformation.pointer.value.set(x,y);deformation.time.value=time;deformation.topic.value=topicIndex;
    deformation.spread.value=spread;
    camera.position.x=x*.7;camera.position.y=2-y*.4;camera.lookAt(0,0,0);
    group.rotation.set(-.32+y*.3,angle+x*.55+dragAngle,Math.sin(time*.35)*.035);
    sheets.forEach((mesh,index)=>{
      mesh.position.y=variant==="terrain"?0:(index-1)*(.24+spread*.8);
      mesh.position.z=-index*.3+spread*(index-1)*.65;
      mesh.rotation.z=(index-1)*spread*.18;
      mesh.rotation.x=spread*(index-1)*.22;
    });
    for(const {geometry,source} of fields) {
      const p=geometry.getAttribute("position") as THREE.BufferAttribute;
      for(let i=0;i<p.count;i++) {
        const px=source[i*3]!,pz=source[i*3+2]!;
        const distance=(px-targetX*4)**2+(pz-targetY*3)**2;
        const wave=Math.exp(-distance*.12)*Math.sin(distance*.5-time*2)*.45;
        p.setY(i,source[i*3+1]!+wave+(variant==="terrain"?Math.sin(px*.6+topicIndex)*.38:0));
      }
      p.needsUpdate=true;
    }
  }
  function tick(now:number) {
    frame=0;if(disposed||!visible||document.hidden||paused||reduced)return;
    const interval=mobile?50:41.6;
    if(now-last>=interval) {const delta=Math.min(now-last,80);last=now;time+=delta/1000;angle=-.25+Math.sin(time*.18)*.12;update(delta);draw();}
    if(now<deadline)frame=requestAnimationFrame(tick);
  }
  const start=()=>{if(disposed||paused||!visible||document.hidden)return;if(reduced){update(0);draw();return;}if(!frame){last=performance.now();frame=requestAnimationFrame(tick);}};
  const stop=()=>{cancelAnimationFrame(frame);frame=0;};
  const resize=()=>{
    const rect=host.getBoundingClientRect();if(!rect.width||!rect.height||(rect.width===width&&rect.height===height))return;
    width=rect.width;height=rect.height;mobile=matchMedia("(max-width:767px)").matches;
    renderer.setPixelRatio(Math.min(devicePixelRatio,mobile?1:1.25));renderer.setSize(width,height,false);
    const aspect=width/height;camera.left=-3*aspect;camera.right=3*aspect;camera.updateProjectionMatrix();
    const copy=host.closest("[data-scene-surface]")?.querySelector<HTMLElement>("[data-scene-copy]");
    const copyRect=copy?.getBoundingClientRect();
    const bottom=copyRect?copyRect.bottom-rect.top:height*.25;
    protectedBottom=Math.min(height,bottom+16);protectedRight=copyRect?Math.min(width,copyRect.right-rect.left+20):width*.5;
    const center=mobile?(protectedBottom+height-44)/2:height*.52;
    const centerX=mobile?width/2:(protectedRight+width)/2;
    group.position.set((centerX/width-.5)*6*aspect,3-center/height*6,0);
    const availableWidth=(mobile?width:width-protectedRight)/height*6;
    group.scale.setScalar(Math.max(.15,Math.min(mobile?.7:1,availableWidth/6,mobile?(height-protectedBottom-44)/height*2:1)));
    update(0);draw();
  };
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(host);
  const themeObserver=new MutationObserver(theme);themeObserver.observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});
  const contextLost=(event:Event)=>{event.preventDefault();stop();host.closest<HTMLElement>("[data-spatial-scene]")!.dataset.renderer="fallback";host.dispatchEvent(new Event("spatial:fallback",{bubbles:true}));};
  renderer.domElement.addEventListener("webglcontextlost",contextLost);
  resize();theme();start();
  const change=()=>{deadline=Math.max(deadline,performance.now()+1600);if(reduced||paused){update(0);draw();}else start();};
  return {
    point(px,py){targetX=Math.max(-1,Math.min(1,px));targetY=Math.max(-1,Math.min(1,py));change();},
    drag(dx,dy){if(variant==="identity")targetX=Math.max(-1,Math.min(1,dx*2));else dragAngle=dx*2.6;targetY=Math.max(-1,Math.min(1,dy*2));change();},
    nudge(key){
      // The contour-only scene needs a camera nudge, not rotation of an empty object group.
      if(key==="ArrowLeft"){if(variant==="identity")targetX-=.2;else dragAngle-=.25;}
      if(key==="ArrowRight"){if(variant==="identity")targetX+=.2;else dragAngle+=.25;}
      if(key==="ArrowUp")targetY-=.2;if(key==="ArrowDown")targetY+=.2;
      targetX=Math.max(-1,Math.min(1,targetX));targetY=Math.max(-1,Math.min(1,targetY));change();
    },
    unfold(value){targetSpread=value?1:0;change();},reset(){targetX=targetY=dragAngle=targetSpread=0;change();},
    topic(index){topicIndex=index;targetSpread=index*.35;targetX=(index-1)*.45;change();},
    setPaused(value){if(paused===value)return;paused=value;stop();if(!value){deadline=performance.now()+8000;start();}},setReduced(value){reduced=value;stop();update(0);draw();if(!value){deadline=performance.now()+8000;start();}},
    setVisible(value){if(visible===value)return;visible=value;stop();if(value){deadline=performance.now()+8000;start();}},
    dispose(){if(disposed)return;disposed=true;stop();resizeObserver.disconnect();themeObserver.disconnect();renderer.domElement.removeEventListener("webglcontextlost",contextLost);resources.forEach(resource=>resource.dispose());renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();}
  };
}

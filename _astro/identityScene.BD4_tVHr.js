import{$t as e,et as t,i as n,j as r,l as i,nn as a,tn as o,tt as s}from"./three.core.CsNFpxzn.js";import{t as c}from"./three.module.Dnv97FkX.js";async function l(l,u,d){let f=new Image;f.src=u,await f.decode();let p=document.createElement(`canvas`);p.width=p.height=64;let m=p.getContext(`2d`,{willReadFrequently:!0});m.drawImage(f,0,0,64,64);let h=m.getImageData(0,0,64,64).data,g=new Uint8Array(4096),_=[];for(let e=0;e<64;e++)_.push(e,4032+e,e*64,e*64+63);for(;_.length;){let e=_.pop();if(g[e])continue;let t=e*4;if(h[t]+h[t+1]+h[t+2]>70&&h[t+3]>20)continue;g[e]=1;let n=e%64,r=Math.floor(e/64);n>0&&_.push(e-1),n<63&&_.push(e+1),r>0&&_.push(e-64),r<63&&_.push(e+64)}let v=Array.from({length:4096},(e,t)=>t).filter(e=>!g[e]),y=new c({alpha:!0,antialias:!0,powerPreference:`low-power`,preserveDrawingBuffer:!0});y.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),y.outputColorSpace=e,y.setClearColor(0,0),y.domElement.setAttribute(`aria-hidden`,`true`),l.append(y.domElement);let b=new o,x=new s(-2.1,2.1,2.1,-2.1,.1,20);x.position.set(0,0,8);let S={uFoil:{value:0},uTime:{value:0}},C=new a({uniforms:S,vertexShader:`
      varying vec3 vColor; varying vec3 vNormal; varying vec3 vPosition;
      void main() {
        vec4 point = instanceMatrix * vec4(position,1.0);
        vec4 view = modelViewMatrix * point;
        vColor = instanceColor;
        vNormal = normalize(normalMatrix * mat3(instanceMatrix) * normal);
        vPosition = view.xyz;
        gl_Position = projectionMatrix * view;
      }`,fragmentShader:`
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
      }`}),w=new n(1,1,1),T=new r(w,C,v.length),E=new t,D=new i,O=3.6/64;v.forEach((t,n)=>{let r=t*4,i=t%64,a=Math.floor(t/64),o=h[r]/255,s=h[r+1]/255,c=h[r+2]/255,l=.12+Math.max(o,s,c)*.2+(Math.abs(i-32)<10&&a>20?.12:0);E.position.set((i-31.5)*O,(31.5-a)*O,l/2),E.scale.set(O*1.005,O*1.005,l),E.updateMatrix(),T.setMatrixAt(n,E.matrix),T.setColorAt(n,D.setRGB(o,s,c,e))}),T.instanceMatrix.needsUpdate=!0,T.instanceColor.needsUpdate=!0,b.add(T);let k=d,A=!1,j=!0,M=!1,N=0,P=0,F=0,I=0,L=0,R=0,z=-.12,B=.18,V=0;T.rotation.set(z,B,0);let H=()=>{let e=l.getBoundingClientRect();return j=e.width>0&&e.height>0&&e.bottom>0&&e.top<innerHeight&&e.right>0&&e.left<innerWidth,l.dataset.visible=String(j),j},U=()=>{y.render(b,x),l.dataset.frame=String(++I),l.dataset.drawCalls=String(y.info.render.calls),l.dataset.rotationX=String(T.rotation.x),l.dataset.rotationY=String(T.rotation.y)},W=e=>{if(N=0,M||!H()||document.hidden||A)return;let t=Math.max(0,Math.min(e-F,50)),n=1-Math.exp(-t/85);F=e,V*=.82,T.rotation.x+=(z-T.rotation.x)*n,T.rotation.y+=(B+V-T.rotation.y)*n,T.scale.setScalar(1+Math.abs(V)*.025),S.uTime.value=e/1e3,U(),e<P&&(N=requestAnimationFrame(W))},G=(e=650)=>{if(M||!H()||document.hidden)return;if(k||A){T.rotation.set(z,B,0),T.scale.setScalar(1),U();return}let t=performance.now();P=t+e,N||=(F=t,requestAnimationFrame(W))},K=()=>{let{width:e,height:t}=l.getBoundingClientRect();if(!e||!t||M||e===L&&t===R)return;L=e,R=t,y.setSize(e,t,!1);let n=e/t;x.left=-2.15*n,x.right=2.15*n,x.top=2.15,x.bottom=-2.15,x.updateProjectionMatrix(),document.hidden||U()},q=()=>{document.hidden?(cancelAnimationFrame(N),N=0):G(0)};document.addEventListener(`visibilitychange`,q);let J=new ResizeObserver(K);J.observe(l);let Y=new IntersectionObserver(()=>{H()?G(0):(cancelAnimationFrame(N),N=0)});Y.observe(l);let X=e=>{e.preventDefault(),cancelAnimationFrame(N),N=0,l.closest(`[data-interactive-identity]`).dataset.renderer=`fallback`,l.dispatchEvent(new Event(`identity:fallback`,{bubbles:!0}))};return y.domElement.addEventListener(`webglcontextlost`,X),K(),G(750),{point(e,t){A||(z=-.12+t*.28,B=.18+e*.45,G())},nudge(e){A||(e===`ArrowLeft`&&(B-=.22),e===`ArrowRight`&&(B+=.22),e===`ArrowUp`&&(z-=.15),e===`ArrowDown`&&(z+=.15),G())},impulse(e){A||(V=e%2?.75:-.75,G(950))},setFoil(e){let t=+!!e;S.uFoil.value!==t&&(S.uFoil.value=t,G(900))},setPaused(e){A=e,cancelAnimationFrame(N),N=0,A||G(0)},setReduced(e){k=e,cancelAnimationFrame(N),N=0,G(0)},dispose(){M||(M=!0,cancelAnimationFrame(N),J.disconnect(),Y.disconnect(),document.removeEventListener(`visibilitychange`,q),y.domElement.removeEventListener(`webglcontextlost`,X),T.dispose(),w.dispose(),C.dispose(),y.dispose(),y.forceContextLoss(),y.domElement.remove())}}}export{l as createIdentityScene};
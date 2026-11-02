import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {buildH175Model} from './h175-model.js';
import {initialH175State} from './h175-state.js';

export async function createH175Viewer(host,{onSelect=()=>{}}={}){
 let renderer,backend='WebGL';
 try{renderer=new T.WebGLRenderer({antialias:true,alpha:false,powerPreference:'default'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;}
 catch{const {SVGRenderer}=await import('three/addons/renderers/SVGRenderer.js');renderer=new SVGRenderer();renderer.setQuality('low');renderer.setPrecision(2);backend='SVG';}
 renderer.setClearColor(0xe3dfd3,1);renderer.domElement.setAttribute('aria-label','Original interactive mechanical study of the LEGO Technic H175. Mechanism buttons and camera controls provide a keyboard alternative.');renderer.domElement.setAttribute('role','img');host.replaceChildren(renderer.domElement);host.dataset.renderer=backend;
 const scene=new T.Scene(),camera=new T.OrthographicCamera(-60,60,35,-35,.1,400),controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=backend==='WebGL';controls.dampingFactor=.12;controls.enablePan=true;controls.minZoom=.45;controls.maxZoom=5;controls.minPolarAngle=.04;controls.maxPolarAngle=Math.PI*.88;
 scene.add(new T.HemisphereLight(0xfffbef,0x8b7e67,backend==='WebGL'?1.9:.55));
 for(const [color,p,intensity]of [[0xfff7e5,[-24,52,35],3.1],[0xe4eeff,[25,30,-30],1.8],[0xffffff,[-35,15,-12],.7]]){const l=new T.DirectionalLight(color,backend==='WebGL'?intensity:intensity*.23);l.position.set(...p);if(backend==='WebGL'&&intensity>3){l.castShadow=true;l.shadow.mapSize.set(2048,2048);Object.assign(l.shadow.camera,{left:-55,right:55,top:55,bottom:-45,near:1,far:140});l.shadow.normalBias=.04;l.shadow.bias=-.0002;}scene.add(l);}
 const floor=new T.Mesh(new T.PlaneGeometry(220,180),new T.MeshStandardMaterial({color:0xe3dfd3,roughness:.88,metalness:0}));floor.rotation.x=-Math.PI/2;floor.position.y=.55;floor.receiveShadow=true;floor.visible=backend==='WebGL';scene.add(floor);
 const shadow=new T.Mesh(new T.CircleGeometry(1,48),new T.MeshBasicMaterial({color:0x9f9b8f,transparent:true,opacity:backend==='WebGL'?.07:.16,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.scale.set(34,9,1);shadow.position.set(7,.6,0);scene.add(shadow);
 const model=buildH175Model({economy:backend==='SVG'});scene.add(model.root);let state=initialH175State(),view='whole',cameraMode='iso',widthSpan=110,dirty=true,lastKey='',lastDraw=0;
 const lightRig=new T.Group();scene.add(lightRig);
 let environment;
 if(backend==='WebGL'){
  const studio=new T.Scene();studio.background=new T.Color(0xb8bec2);for(const [color,p,size]of [[0xfffaf0,[0,30,0],[70,1,45]],[0xffffff,[-40,5,20],[1,45,35]],[0xe2ecff,[30,12,-20],[1,40,38]]]){const m=new T.Mesh(new T.BoxGeometry(...size),new T.MeshBasicMaterial({color}));m.position.fromArray(p);studio.add(m);}const pmrem=new T.PMREMGenerator(renderer);environment=pmrem.fromScene(studio,.03);scene.environment=environment.texture;pmrem.dispose();studio.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
 }
 function resize(){const w=Math.max(1,host.clientWidth),h=Math.max(1,host.clientHeight),aspect=w/h,vertical=widthSpan/aspect;camera.left=-widthSpan/2;camera.right=widthSpan/2;camera.top=vertical/2;camera.bottom=-vertical/2;camera.updateProjectionMatrix();renderer.setSize(w,h);dirty=true;}
 function visible(mesh){let o=mesh;while(o){if(!o.visible)return false;o=o.parent;}return true;}
 function frame(){const p=model.viewBounds[view],center=new T.Vector3(...p.center),offset=cameraMode==='side'?new T.Vector3(0,6,95):cameraMode==='top'?new T.Vector3(0,95,.01):new T.Vector3(...p.offset);controls.target.copy(center);camera.position.copy(center).add(offset);camera.zoom=1;camera.lookAt(center);camera.updateMatrixWorld(true);model.root.updateMatrixWorld(true);
  widthSpan=p.span;
  const min=new T.Vector2(Infinity,Infinity),max=new T.Vector2(-Infinity,-Infinity),point=new T.Vector3(),record=()=>{min.x=Math.min(min.x,point.x);min.y=Math.min(min.y,point.y);max.x=Math.max(max.x,point.x);max.y=Math.max(max.y,point.y);};
  if(view==='whole'){
   for(const m of model.pickMeshes){if(!visible(m))continue;m.geometry.computeBoundingBox();const b=m.geometry.boundingBox;for(const x of [b.min.x,b.max.x])for(const y of [b.min.y,b.max.y])for(const z of [b.min.z,b.max.z]){point.set(x,y,z).applyMatrix4(m.matrixWorld).applyMatrix4(camera.matrixWorldInverse);record();}}
  }else{
   const envelope=({rotor:[[-5.5,16.8,-3.5],[1.5,26.8,3.5]],drive:[[-5,5.7,-9.3],[10.5,20.5,9.3]],gear:[[-24,0,-9.7],[10,11,9.7]],winch:[[-6.5,2.5,4.6],[-.3,18.5,10.5]]})[view];
   for(const x of [envelope[0][0],envelope[1][0]])for(const y of [envelope[0][1],envelope[1][1]])for(const z of [envelope[0][2],envelope[1][2]]){point.set(x,y,z).applyMatrix4(camera.matrixWorldInverse);record();}
  }
  const aspect=host.clientWidth/Math.max(1,host.clientHeight),shift=new T.Vector3((min.x+max.x)/2,(min.y+max.y)/2,0).applyQuaternion(camera.quaternion);controls.target.add(shift);camera.position.add(shift);widthSpan=Math.max(max.x-min.x,(max.y-min.y)*aspect)*(view==='whole'?1.17:1.13);
  resize();controls.update();dirty=true;
 }
 function render(next=state,force=false){state=next;const now=performance.now();if(!force&&now-lastDraw<(backend==='SVG'?160:16))return;controls.update();const key=[view,...Object.entries(state).filter(([key])=>key!=='time').map(([,value])=>value),camera.zoom,...camera.position.toArray(),...controls.target.toArray(),host.clientWidth,host.clientHeight].join(':');if(!dirty&&key===lastKey)return;model.update(state,{view});floor.visible=backend==='WebGL'&&view==='whole';shadow.visible=view==='whole';renderer.render(scene,camera);lastKey=key;lastDraw=now;dirty=false;host.dataset.view=view;host.dataset.powered=String(state.motor&&state.inspection===0);host.dataset.renderedParts=String(model.pickMeshes.length);}
 controls.addEventListener('change',()=>{dirty=true;});
 const pointer=new T.Vector2(),ray=new T.Raycaster();let down;
 renderer.domElement.addEventListener('pointerdown',e=>down=[e.clientX,e.clientY]);
 renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5)return;const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects(model.pickMeshes,false).find(h=>visible(h.object));if(hit)onSelect(hit.object.userData.component);});
 const observer=new ResizeObserver(()=>{resize();render(state,true);});observer.observe(host);model.update(state,{view});frame();render(state,true);
 return {backend,model,render,setView(next){view=model.viewBounds[next]?next:'whole';model.update(state,{view});frame();render(state,true);},setCamera(next){cameraMode=['iso','side','top'].includes(next)?next:'iso';frame();render(state,true);},zoom(factor){camera.zoom=T.MathUtils.clamp(camera.zoom*factor,.45,5);camera.updateProjectionMatrix();dirty=true;render(state,true);},orbit(){const d=camera.position.clone().sub(controls.target).applyAxisAngle(new T.Vector3(0,1,0),Math.PI/12);camera.position.copy(controls.target).add(d);controls.update();dirty=true;render(state,true);},reset(){frame();render(state,true);},dispose(){observer.disconnect();controls.dispose();model.dispose();floor.geometry.dispose();floor.material.dispose();shadow.geometry.dispose();shadow.material.dispose();environment?.dispose();renderer.dispose?.();host.replaceChildren();}};
}

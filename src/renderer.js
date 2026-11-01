import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GEAR} from './plants.js';
import {placeLabels} from './labels.js';
import {buildDetailGeometry} from './detail-geometry.js';
import {descendants,ancestors} from './anatomy.js';
import {inspectionAmount,inspectionOffset,hubBore,SHAFT_CLEARANCE} from './inspection.js';
const TAU=Math.PI*2;
const C={cyan:0x77cde1,amber:0xe7af6c,silver:0xb0c2c6,dark:0x46606d,casing:0x7093a0,liner:0x927d6e,violet:0xb3a9ef,green:0x80b89d,white:0xc9d6d4};
export function createAtlasRenderer(host,manifest,onSelect,rendering={}){
 const scene=new T.Scene(),renderer=rendering.renderer??new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'default'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));renderer.setClearColor(0,0);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;host.append(renderer.domElement);
 const gl=renderer.getContext(),debug=gl.getExtension('WEBGL_debug_renderer_info');host.dataset.gpu=renderer.isSVGRenderer?'SVG projection of original geometry · no WebGL':debug?gl.getParameter(debug.UNMASKED_RENDERER_WEBGL):'WebGL (details unavailable)';
 renderer.domElement.setAttribute('aria-label','Original interactive engine and airframe. Component tree and HTML camera controls provide keyboard access.');
 const camera=new T.OrthographicCamera(-10,10,6,-6,.1,200),controls=rendering.createControls?.(camera,renderer.domElement)??new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.1;controls.minZoom=.45;controls.maxZoom=6;controls.minPolarAngle=.08;controls.maxPolarAngle=Math.PI*.92;
 scene.add(new T.HemisphereLight(0xe3f4ff,0x29252a,1.3));
 const keyLight=new T.DirectionalLight(0xfff2d7,3);keyLight.position.set(-5,10,6);keyLight.castShadow=true;keyLight.shadow.mapSize.set(1024,1024);keyLight.shadow.camera.left=-20;keyLight.shadow.camera.right=20;keyLight.shadow.camera.top=16;keyLight.shadow.camera.bottom=-12;keyLight.shadow.normalBias=.03;keyLight.shadow.bias=-.0001;scene.add(keyLight);
 const ground=new T.Mesh(new T.PlaneGeometry(100,70),new T.ShadowMaterial({opacity:.16}));ground.rotation.x=-Math.PI/2;ground.position.y=-7.4;ground.receiveShadow=true;ground.visible=!!renderer.isWebGLRenderer;scene.add(ground);
 let environment=null;
 if(renderer.isWebGLRenderer){const studio=new T.Scene();studio.background=new T.Color(0x7b8792);for(const [color,p,scale]of [[0xfff3dd,[0,7,0],[12,1,9]],[0xbdd9eb,[-8,1,4],[1,7,9]],[0xffffff,[8,3,-5],[1,9,11]]]){const lightPanel=new T.Mesh(new T.BoxGeometry(...scale),new T.MeshBasicMaterial({color}));lightPanel.position.set(...p);studio.add(lightPanel);}const pmrem=new T.PMREMGenerator(renderer);environment=pmrem.fromScene(studio,.04);scene.environment=environment.texture;pmrem.dispose();studio.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;}
 let quality='auto',lastDraw=-Infinity,lastVectorFrame='';
 for(const [color,intensity,pos]of [[0xe5f4ff,1.5,[0,12,10]],[0xf7ce98,2,[7,6,-8]],[0xa4d9ed,1,[-8,2,5]]]){const l=new T.DirectionalLight(color,intensity);l.position.set(...pos);scene.add(l);}if(renderer.isSVGRenderer)scene.traverse(o=>{if(o.isLight)o.intensity*=.26;});
 const grid=new T.GridHelper(80,40,0x8c8b85,0x8c8b85);grid.position.y=-7.5;grid.material.transparent=true;grid.material.opacity=.055;scene.add(grid);
 const root=new T.Group();scene.add(root);let groups=new Map(),meshes=[],rotations=[],pitchBlades=[],lines=[],flowParticles=[],markers=[],sectionCovers=[],closedCovers=[],inspectionParts=[],detailInspection=[],pitchLinks=[],serviceFlows=[],bladeRoots=[],mechanismUpdates=[];
 let selected=manifest.initial,overlay='anatomy',preset='installed',isolate=false,shaftTrace=null,cutaway=true,span=16,savedFocus=null,currentState=null,currentD=null,currentU=null,eventNode=null,inspection=0,recipe='engine',circuit='fuel';
 const info=document.createElement('button');info.className='scene-pin';info.addEventListener('click',()=>focusSelected());host.append(info);const eventPin=document.createElement('button');eventPin.className='scene-pin event-pin';eventPin.hidden=true;eventPin.addEventListener('click',()=>{if(eventNode)onSelect(eventNode);});host.append(eventPin);
 const leader=document.createElementNS('http://www.w3.org/2000/svg','svg');leader.classList.add('scene-leaders');leader.setAttribute('aria-hidden','true');host.append(leader);
 const tempV=new T.Vector3(),dummy=new T.Object3D();
 const mat=(color,extra={})=>new T.MeshStandardMaterial({color,metalness:color===C.white?.12:color===C.liner?.68:color===C.silver?.82:.55,roughness:color===C.liner?.68:color===C.silver?.28:color===C.dark?.52:.39,envMapIntensity:.7,...extra});
 const part=id=>{if(groups.has(id))return groups.get(id);const g=new T.Group();g.userData.id=id;groups.set(id,g);const parent=manifest.nodes.find(n=>n.id===id)?.parentNodeId;(parent?part(parent):root).add(g);return g;};
 function mesh(id,geo,color,pos=[0,0,0],extra={}){const m=new T.Mesh(geo,mat(color,extra));m.position.set(...pos);m.userData.baseColor=m.material.color.clone();m.userData.baseOpacity=m.material.opacity;m.userData.id=id;m.castShadow=true;m.receiveShadow=true;part(id).add(m);meshes.push(m);return m;}
 function cylinder(id,a,b,r,color,r2=r,extra={}){const start=new T.Vector3(...a),end=new T.Vector3(...b),v=end.clone().sub(start);const m=mesh(id,new T.CylinderGeometry(r2,r,v.length(),renderer.isSVGRenderer?12:32),color,start.clone().add(end).multiplyScalar(.5).toArray(),extra);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());return m;}
 function ring(id,x,r,t,color,pos=[0,0]){const m=mesh(id,new T.TorusGeometry(r,t,renderer.isSVGRenderer?4:7,renderer.isSVGRenderer?20:56),color,[x,pos[0],pos[1]]);m.rotation.y=Math.PI/2;return m;}
 function surface(id,profile,color,{start=Math.PI*.7,length=Math.PI*1.3,perforated=false,...extra}={}){const p=[],idx=[],steps=perforated?(renderer.isSVGRenderer?64:96):(renderer.isSVGRenderer?24:48);
  if(perforated){const samples=[];for(let i=0;i<profile.length-1;i++){const [x,r]=profile[i],[x1,r1]=profile[i+1],count=Math.ceil(Math.abs(x1-x)/(renderer.isSVGRenderer?.04:.025));for(let j=0;j<count;j++)samples.push([x+(x1-x)*j/count,r+(r1-r)*j/count]);}samples.push(profile.at(-1));profile=samples;}
  for(const [x,r]of profile)for(let j=0;j<=steps;j++){const a=start+length*j/steps;p.push(x,Math.cos(a)*r,Math.sin(a)*r);}
  for(let i=0;i<profile.length-1;i++)for(let j=0;j<steps;j++){const a=i*(steps+1)+j,b=a+steps+1;if(perforated){const x=(profile[i][0]+profile[i+1][0])/2,angle=start+length*(j+.5)/steps;let hole=false;for(const [cx,radius]of [[-.48,.065],[.46,.09]])for(let k=0;k<12;k++){const q=Math.PI*.7+(k+.5)/12*Math.PI*1.3;const da=Math.atan2(Math.sin(angle-q),Math.cos(angle-q))*.94;if((x-cx)**2+da**2<radius**2)hole=true;}if(hole)continue;}idx.push(a,b,a+1,b,b+1,a+1);}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(idx);g.computeVertexNormals();return mesh(id,g,color,[0,0,0],{side:T.DoubleSide,...extra});
 }
 // Split instructional shells into sectors smaller than a half-circle. Each
 // sector moves radially away from the shaft, without shearing rotor assemblies.
 function shell(id,profile,color,stage,options={}){const {start=Math.PI*.7,length=Math.PI*1.3,...extra}=options,count=Math.ceil(length/Math.PI),sweep=length/count;
  for(let i=0;i<count;i++){const a=start+i*sweep,key=id+':'+a+':'+sweep;let entry=inspectionParts.find(p=>p.key===key);
   if(!entry){const group=new T.Group();group.userData.inspection={stage,start:a,sweep,angle:a+sweep/2};part(id).add(group);entry={key,id,stage,start:a,sweep,angle:a+sweep/2,anchor:[(profile[0][0]+profile.at(-1)[0])/2,Math.cos(a+sweep/2)*profile[0][1],Math.sin(a+sweep/2)*profile[0][1]],group};const guide=new T.Line(new T.BufferGeometry(),new T.LineDashedMaterial({color:0xb8aaa0,dashSize:.12,gapSize:.08,transparent:true,opacity:.48}));guide.userData.inspectionGuide=id;root.add(guide);entry.guide=guide;inspectionParts.push(entry);}
   entry.group.add(surface(id,profile,color,{start:a,length:sweep,...extra}));
  }
 }
 function linerDetail(object,angle){const entry=inspectionParts.find(p=>p.id==='combustor.liner'&&angle>=p.start-1e-6&&angle<=p.start+p.sweep+1e-6);if(entry)entry.group.add(object);}
 function registerInspection(object,id,target,stage,delta){detailInspection.push({object,id,target,stage,delta:new T.Vector3(...delta),base:object.position.clone()});}
 function updateInspection(){const allowed=manifest.recipes.find(r=>r.id===recipe)?.shells||[];for(const p of inspectionParts){p.group.position.fromArray(inspectionOffset(p.stage,p.angle,allowed.includes(p.id)?inspection:0));const from=new T.Vector3(...p.anchor);p.guide.geometry.setFromPoints([from,from.clone().add(p.group.position)]);p.guide.computeLineDistances();}for(const p of detailInspection){const phase=p.stage===1?Math.min(1,inspection*2):Math.max(0,inspection*2-1),t=phase*phase*(3-2*phase);p.object.position.copy(p.base).addScaledVector(p.delta,p.target===recipe?t:0);}host.dataset.inspection=String(inspection);host.dataset.recipe=recipe;}
 function boundsFor(id){const ids=descendants(manifest,id),bounds=new T.Box3();root.updateMatrixWorld(true);for(const mesh of meshes)if(ids.has(mesh.userData.id)&&!mesh.userData.circuit)bounds.expandByObject(mesh);return bounds;}
 function nodeAnchor(node){const anchor=new T.Vector3(...node.anchor);if(inspection){const bounds=boundsFor(node.id);if(!bounds.isEmpty())bounds.getCenter(anchor);}return anchor;}
 function annularDisk(inner,outer,depth){const points=[[inner,-depth/2],[outer,-depth/2],[outer,depth/2],[inner,depth/2],[inner,-depth/2]].map(([r,y])=>new T.Vector2(r,y));return new T.LatheGeometry(points,32);}
 function bladeGeo(h,w,thickness=.04,handed=1){const verts=[],indices=[],radial=renderer.isSVGRenderer?4:12,chord=renderer.isSVGRenderer?4:12;for(let side=0;side<2;side++)for(let i=0;i<=radial;i++){const t=i/radial,width=w*(1-.42*t),twist=handed*(.45-.7*t),sweep=.09*t*t;for(let j=0;j<=chord;j++){const u=j/chord,xc=(u-.5)*width,camber=handed*.13*width*Math.sin(Math.PI*u),half=thickness*Math.sin(Math.PI*u)**.65*(1-.35*t)/2,z=camber+(side?half:-half);verts.push(xc*Math.cos(twist)-z*Math.sin(twist)+sweep,h*t,xc*Math.sin(twist)+z*Math.cos(twist));}}const layer=(radial+1)*(chord+1);for(let side=0;side<2;side++)for(let i=0;i<radial;i++)for(let j=0;j<chord;j++){const a=side*layer+i*(chord+1)+j,b=a+chord+1;indices.push(...(side?[a,a+1,b,b,a+1,b+1]:[a,b,a+1,b,b+1,a+1]));}for(const i of [0,radial])for(let j=0;j<chord;j++){const v=i*(chord+1)+j;indices.push(v,v+layer,v+1,v+1,v+layer,v+layer+1);}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(verts,3));g.setIndex(indices);g.computeVertexNormals();return g;}
 function row(id,x,r,hub,count,color,shaft,discId=id){const g=part(id),pivot=new T.Group();pivot.position.x=x;g.add(pivot);
  const bore=hubBore(shaft,manifest.kind),disk=new T.Mesh(bore?annularDisk(bore,hub,.14):new T.CylinderGeometry(hub,hub,.14,32),mat(C.dark));disk.rotation.z=-Math.PI/2;disk.userData.id=discId;disk.userData.baseColor=disk.material.color.clone();if(discId!==id){const dg=part(discId);pivot.add(dg);dg.add(disk);}else pivot.add(disk);meshes.push(disk);
  const b=new T.InstancedMesh(bladeGeo(r-hub,.24,.04,shaft?1:-1),mat(color),count);b.userData.id=id;b.userData.baseColor=b.material.color.clone();pivot.add(b);meshes.push(b);
  for(let i=0;i<count;i++){const a=i/count*TAU;dummy.position.set(0,Math.cos(a)*hub,Math.sin(a)*hub);dummy.rotation.set(a,0,0);dummy.scale.set(1,1,1);dummy.updateMatrix();b.setMatrixAt(i,dummy.matrix);}if(shaft)rotations.push({object:pivot,shaft,axis:'x',ratio:1});
 }
 function shaftBody(id,x0,x1,r,color,hollow=false,clearSpan=null,additionalClear=[]){
  if(hollow){
   const tube=(start,length)=>{const group=new T.Group();part(id).add(group);for(const profile of [[[x0,r],[x1,r]],[[x0,SHAFT_CLEARANCE.outerBore],[x1,SHAFT_CLEARANCE.outerBore]],[[x0,SHAFT_CLEARANCE.outerBore],[x0,r]],[[x1,r],[x1,SHAFT_CLEARANCE.outerBore]]])group.add(surface(id,profile,color,{start,length}));return group;};
   const full=tube(0,TAU),section=tube(Math.PI*.7,Math.PI*1.3);section.visible=false;sectionCovers.push({full,section});
  }else cylinder(id,[x0,0,0],[x1,0,0],r,color);
  for(let x=x0+.2;x<x1;x+=1.35){
   // Keys are .24 long and collar tubes .05 wide. Keep their whole swept
   // envelope outside the independent outer shaft, including its end planes.
   if([...(clearSpan?[clearSpan]:[]),...additionalClear].some(span=>x+SHAFT_CLEARANCE.decorationHalfLength>=span[0]&&x-SHAFT_CLEARANCE.decorationHalfLength<=span[1]))continue;
   ring(id,x,r+.025,.025,color);const key=mesh(id,new T.BoxGeometry(.24,.035,.04),0xf5e5c5,[x,r+.045,0]);markers.push({object:key,x,r:r+.045,shaft:id.startsWith('hp')||id.startsWith('gg')?'g':'p',axis:'x'});
  }
 }
 function pipe(id,points,color,r=.035){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));const o=mesh(id,new T.TubeGeometry(curve,renderer.isSVGRenderer?16:36,r,renderer.isSVGRenderer?4:6,false),color);o.userData.curve=curve;return o;}
 function box(id,pos,size,color){return mesh(id,new T.BoxGeometry(...size),color,pos);}
 function gear(id,pos,r,axis,shaft,ratio,count=18){const g=new T.Group();if(id==='tail.stepup')g.userData.stepup={teeth:count,ratio};g.position.set(...pos);part(id).add(g);const disk=new T.Mesh(new T.CylinderGeometry(r-.015,r-.015,.16,28),mat(C.amber));disk.userData.id=id;disk.userData.baseColor=disk.material.color.clone();if(axis==='x')disk.rotation.z=-Math.PI/2;if(axis==='z')disk.rotation.x=Math.PI/2;g.add(disk);meshes.push(disk);
  for(let i=0;i<count;i++){const a=i/count*TAU,pitch=TAU*r/count,teeth=axis==='y'?new T.BoxGeometry(pitch*.4,.16,pitch*.48):axis==='x'?new T.BoxGeometry(.16,pitch*.4,pitch*.48):new T.BoxGeometry(pitch*.4,pitch*.48,.16);const m=new T.Mesh(teeth,mat(C.amber));m.userData.id=id;m.userData.baseColor=m.material.color.clone();if(axis==='x')m.position.set(0,Math.cos(a)*r,Math.sin(a)*r);else if(axis==='y')m.position.set(Math.cos(a)*r,0,Math.sin(a)*r);else m.position.set(Math.cos(a)*r,Math.sin(a)*r,0);m.rotation[axis]=axis==='y'?-a:a;g.add(m);meshes.push(m);}rotations.push({object:g,shaft,axis,ratio});}
 function aerodynamicRotor(id,center,r,count,axis,ratio){const spin=new T.Group();spin.position.set(...center);part(id).add(spin);rotations.push({object:spin,shaft:'p',axis,ratio});
  if(id!=='propeller'){const hub=new T.Mesh(new T.SphereGeometry(.3,20,12),mat(C.amber));hub.userData.id=id;hub.userData.baseColor=hub.material.color.clone();spin.add(hub);meshes.push(hub);}
  for(let i=0;i<count;i++){const radial=new T.Group(),pitch=new T.Group();const a=i/count*TAU;
   if(axis==='y'){radial.rotation.y=a;pitch.position.x=.35;}else if(axis==='x'){radial.rotation.x=a;pitch.position.y=.35;}else{radial.rotation.z=a;pitch.position.y=.25;}
   spin.add(radial);radial.add(pitch);pitch.userData.pitchRoot={kind:id,angle:a};bladeRoots.push({id,spin,radial,pitch,angle:a});
   const geo=bladeGeo(r-.35,axis==='y'?.6:.5,.075);if(axis==='y')geo.rotateZ(-Math.PI/2);
   const blade=new T.Mesh(geo,mat(C.silver));
   blade.userData.id=id;blade.userData.baseColor=blade.material.color.clone();pitch.add(blade);meshes.push(blade);pitchBlades.push({object:pitch,axis:axis==='y'?'x':'y',kind:id});
   const tip=new T.Mesh(axis==='y'?new T.BoxGeometry(.35,.085,.46):new T.BoxGeometry(.33,.35,.085),mat(C.amber));if(axis==='y')tip.position.x=r-.5;else tip.position.y=r-.5;tip.userData.id=id;tip.userData.baseColor=tip.material.color.clone();pitch.add(tip);meshes.push(tip);
  }
 }
 function ellipsoid(id,pos,scale,color){const m=mesh(id,new T.SphereGeometry(1,renderer.isSVGRenderer?16:32,renderer.isSVGRenderer?8:16),color,pos);m.scale.set(...scale);return m;}
 function wing(id,points,thickness,color){const s=new T.Shape();s.moveTo(points[0][0],points[0][1]);for(const p of points.slice(1))s.lineTo(...p);s.closePath();const geo=new T.ExtrudeGeometry(s,{depth:thickness,bevelEnabled:false});const m=mesh(id,geo,color);return m;}
 function forceArrow(id,start,end,color){const curve=[new T.Vector3(...start),new T.Vector3(...end)];const arrow=new T.ArrowHelper(curve[1].clone().sub(curve[0]).normalize(),curve[0],curve[0].distanceTo(curve[1]),color,.5,.25);arrow.traverse(o=>{o.userData.id=id;});part(id).add(arrow);return arrow;}
 function buildAirframe(){const k=manifest.kind;
  if(k==='helicopter'){
   ellipsoid('airframe',[-3,-4.0,0],[11,3,2.6],C.white);ellipsoid('airframe',[-9,-3.6,0],[5,2.5,2.7],C.dark);
   cylinder('airframe',[6,-3.2,0],[29,-1.9,0],.4,C.white,.95);box('airframe',[28,0,0],[1.2,4,.12],C.white);
   for(const z of [-2.2,2.2]){cylinder('airframe',[-8,-7,z],[6,-7,z],.12,C.dark);cylinder('airframe',[-5,-5,z*.7],[-5,-7,z],.1,C.dark);cylinder('airframe',[3,-5,z*.7],[3,-7,z],.1,C.dark);}
   cylinder('reduction',[5.62,0,0],[6.3,0,0],.1,C.amber);cylinder('reduction',[6.3,0,0],[6.3,-2.5,0],.1,C.amber);gear('reduction',[6.3,-2.5,0],.42,'y','p',GEAR.helicopterMain);
   cylinder('mast',[6.3,-2.5,0],[0,-2.5,0],.14,C.amber);gear('mast',[0,-2.5,0],.65,'y','p',GEAR.helicopterMain);cylinder('mast',[0,-2.5,0],[0,6.4,0],.16,C.amber);
   gear('tail.stepup',[.8,-2.5,0],.64,'x','p',GEAR.helicopterMain,48);gear('tail.stepup',[.8,-2.5,-.8],.16,'x','p',-GEAR.helicopterTail,12);cylinder('tail.drive',[.8,-2.5,-.8],[29,-2.5,-.8],.095,C.amber);gear('tail.drive',[29,-2.5,-.8],.3,'x','p',-GEAR.helicopterTail);cylinder('tail.drive',[29,-2.5,-.8],[29,-2.5,1.5],.1,C.amber);
   aerodynamicRotor('rotor',[0,6.4,0],15,4,'y',GEAR.helicopterMain);aerodynamicRotor('tail.rotor',[29,-2.5,1.5],2.4,4,'z',-GEAR.helicopterTail);
   box('pitch.control',[-6,-3.2,1.4],[.2,.8,.15],C.violet);forceArrow('rotor',[0,6.5,0],[0,10,0],C.green);
  }else{
   const prop= k==='turboprop',body=prop?[10,-1,0]:[8,5,-10];ellipsoid('airframe',body,prop?[13,2.1,2.1]:[19,2.4,2.4],C.white);
   const nose=prop?-2:-8;ellipsoid('airframe',[nose,body[1]+.5,body[2]],prop?[2,1.1,1.8]:[3,1.4,2.2],C.dark);
   // Wings are extruded in x/z and rotated into a horizontal plane.
   const wx=prop?7:4,wz=prop?0:-10,spanZ=prop?13:19,wy=prop?-1.8:3.8;
   const w=wing('wing',[[wx-2,wz-1],[wx+2,wz-spanZ],[wx+5,wz-spanZ],[wx+3,wz+spanZ],[wx,wz+spanZ],[wx-2,wz+1]],.15,C.white);w.rotation.x=Math.PI/2;w.position.y=wy;
   const tailX=prop?21:25,tail=wing('airframe',[[tailX-2,-5],[tailX+2,-5],[tailX+3,5],[tailX,5]],.12,C.white);tail.rotation.x=Math.PI/2;tail.position.set(0,body[1]+1,body[2]);
   box('airframe',[tailX,body[1]+2.8,body[2]],[2.2,5,.15],C.white);
   for(let i=0;i<8;i++)ellipsoid('airframe',[body[0]-5+i*1.7,body[1]+.65,body[2]+2.05],[.32,.34,.04],C.dark);
   if(prop){cylinder('reduction',[-7.2,0,0],[-6.12,0,0],.065,C.amber);
    aerodynamicRotor('propeller',[-7.2,0,0],3.7,4,'x',GEAR.propeller);box('prop.governor',[-5.8,-.8,.8],[.45,.35,.4],C.violet);forceArrow('propeller',[-7.8,-.8,0],[-11.5,-.8,0],C.green);
   }else {box('wing',[0,2.3,0],[1.3,3.5,.25],C.dark);forceArrow('exhaust',[-6.6,-1,0],[-10.2,-1,0],C.green);}
   forceArrow('wing',[8,body[1]+2,body[2]],[8,body[1]+7,body[2]],C.cyan);
  }
 }
 function buildEngine(){const fan=manifest.kind==='turbofan',prop=manifest.kind==='turboprop';
  surface('inlet',[[-5.55,fan?2.15:1.15],[-4.5,fan?1.8:1]],C.casing);ring('inlet',-5.55,fan?2.15:1.15,.045,C.silver);
  if(fan){row('fan.rotor',-4.95,2.04,.32,28,C.silver,'p');row('fan.stator',-4.52,1.99,.34,28,C.dark);row('lpc.rotor',-3.85,1.01,.3,22,C.silver,'p');row('lpc.rotor',-3.45,.95,.32,22,C.silver,'p');row('lpc.stator',-3.64,.97,.31,22,C.dark);
   shell('bypass',[[-4.4,2.13],[4.4,1.9]],C.casing,'casing',{transparent:true,opacity:.4});ring('bypass',4.4,1.9,.05,C.cyan);
  }
  for(let i=0;i<(fan?3:5);i++){const x=(fan?-2.8:-4)+i*.48,r=(fan?.95:1.0)-i*.055;const id='compressor.stage.'+(i+1);row(id+'.rotor',x,r,.3+i*.02,22,C.silver,'g',id+'.disc');if(i<(fan?2:4))row(id+'.stator',x+.25,r-.03,.31+i*.02,22,C.dark);}
  shell('compressor.casing',[[fan?-3.1:-4.4,1.05],[-1.35,.78]],C.casing,'casing');surface('diffuser',[[-1.5,.75],[-1,1]],C.dark);
  shell('combustor.casing',[[-1.05,1.1],[1.05,1.1],[1.25,.86]],C.casing,'casing');shell('combustor.liner',[[-.8,.94],[.7,.94],[1,.77]],C.liner,'liner',{perforated:true});shell('combustor.liner',[[-.85,.37],[1,.37]],C.liner,'liner');
  cylinder('igniter',[.25,1.3,.8],[.25,.7,.45],.06,C.white);row('turbine.ngv.hpt',1.4,.83,.3,24,C.dark);row('gg.rotor',1.85,.83,.32,24,C.silver,'g','turbine.hpt.disc');row('turbine.ngv.lpt',2.45,.9,.29,24,C.dark);row('power.rotor',2.85,.91,.3,26,C.amber,'p','turbine.lpt.disc.1');row('power.rotor',3.2,.91,.3,26,C.amber,'p','turbine.lpt.disc.2');
  surface('exhaust',[[3.5,1],[4.8,1.07]],C.casing);surface('exhaust',[[3.45,.31],[4.9,.14]],C.dark,{start:0,length:TAU});ring('exhaust',4.8,1.07,.035,C.silver);
  const gg=fan?'hp.shaft':'gg.shaft',ps=fan?'lp.shaft':'power.shaft',concentric=prop||fan,outerSpan=[fan?-2.95:-4.2,2.06];shaftBody(gg,...outerSpan,SHAFT_CLEARANCE.outerRadius,C.cyan,concentric);shaftBody(ps,fan?-5.1:prop?-5.98:2.7,fan?3.4:prop?3.4:5.48,concentric?SHAFT_CLEARANCE.innerRadius:.14,C.amber,false,concentric?outerSpan:null,prop?[[-6.05,-5.70]]:fan?[]:[[4.32,5.6]]);

  shell('turbine.casing',[[1.1,1.02],[3.5,1.02]],C.casing,'casing');
  for(const [x,r,len,id]of [[-2.8,1.06,2.9,'compressor.casing'],[.05,1.13,2.2,'combustor.casing'],[2.5,1.02,2,'turbine.casing']]){
   const m=surface(id,[[x-len/2,r],[x+len/2,r]],C.casing,{start:0,length:TAU});m.visible=false;m.userData.closedCover=true;closedCovers.push(m);
  }
  box('controller',[1,-1.55,1.15],[.95,.28,.65],C.violet);for(let i=0;i<8;i++)box('controller',[.65+i*.1,-1.37,1.15],[.045,.07,.65],C.dark);
  box('fmu',[-.9,-1.25,1.1],[.5,.35,.4],C.amber);box('fuel.pump',[-2,-1.25,1.1],[.5,.4,.4],C.dark);pipe('fuel.nozzles',[[-.9,-1.25,1.1],[-.8,-.5,1.2],[-.8,.5,1.1]],C.amber);
  box('accessory',[-2.7,-.8,.8],[.85,.38,.65],C.green);cylinder('accessory',[-2.67,-SHAFT_CLEARANCE.outerRadius/Math.SQRT2,SHAFT_CLEARANCE.outerRadius/Math.SQRT2],[-2.67,-.8,.8],.04,C.cyan);
  buildDetailGeometry({T,C,mesh,part,cylinder,ring,pipe,surface,box,rotations,registerInspection,attachLinerDetail:linerDetail,pitchLinks,serviceFlows,bladeRoots,mechanismUpdates,lowDetail:renderer.isSVGRenderer},manifest);
  for(const n of manifest.nodes){
   if(groups.has(n.id))continue;
   const color=n.group==='control'?C.violet:n.group==='service'?C.green:C.dark;
   if(n.id==='speed.g'||n.id==='speed.p'||n.id==='temperature'||n.id==='pressure'||n.id==='inlet.sensor'){
    mesh(n.id,new T.SphereGeometry(.085,12,8),color,n.anchor);const a=[n.anchor[0],n.anchor[1]*.6,n.anchor[2]*.6];cylinder(n.id,n.anchor,a,.035,color);
   }else box(n.id,n.anchor,[.2,.17,.2],color);
  }
  mergeStaticDetails();
 }
 function mergeStaticDetails(){const moving=new Set([...rotations.map(x=>x.object),...detailInspection.map(x=>x.object),...pitchLinks.map(x=>x.object),...markers.map(x=>x.object),...serviceFlows.map(x=>x.marker)]),containers=[];root.traverse(o=>{if(o.isGroup)containers.push(o);});for(const g of containers){const buckets=new Map();for(const o of [...g.children]){if(!o.isMesh||o.isInstancedMesh||moving.has(o)||o.userData.mechanism||o.userData.dynamicMechanism||o.userData.circuit||o.userData.closedCover)continue;const mat=o.material,key=[o.userData.id,mat.color?.getHex(),mat.opacity,mat.metalness,mat.roughness,mat.side,o.visible].join(':');if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(o);}for(const items of buckets.values()){if(items.length<3)continue;const positions=[],normals=[],indices=[],uvs=[];let vertex=0;const v=new T.Vector3(),n=new T.Vector3(),normalMatrix=new T.Matrix3();for(const o of items){o.updateMatrix();normalMatrix.getNormalMatrix(o.matrix);const p=o.geometry.attributes.position,normal=o.geometry.attributes.normal,uv=o.geometry.attributes.uv;for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(o.matrix);positions.push(v.x,v.y,v.z);n.fromBufferAttribute(normal,i).applyMatrix3(normalMatrix).normalize();normals.push(n.x,n.y,n.z);uvs.push(uv?uv.getX(i):0,uv?uv.getY(i):0);}const index=o.geometry.index;if(index)for(let i=0;i<index.count;i++)indices.push(index.getX(i)+vertex);else for(let i=0;i<p.count;i++)indices.push(i+vertex);vertex+=p.count;}const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('normal',new T.Float32BufferAttribute(normals,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));geometry.setIndex(indices);const combined=new T.Mesh(geometry,items[0].material.clone());combined.userData={...items[0].userData};combined.visible=items[0].visible;combined.castShadow=true;combined.receiveShadow=true;g.add(combined);meshes.push(combined);for(const o of items){g.remove(o);meshes.splice(meshes.indexOf(o),1);o.geometry.dispose();o.material.dispose();}}}}
 function buildEdges(){for(const e of manifest.edges){if(e.type==='mechanical'||e.type==='load'||e.type==='gas')continue;
  const from=manifest.nodes.find(n=>n.id===e.from),to=manifest.nodes.find(n=>n.id===e.to);if(!from||!to||e.from===e.to)continue;
  const a=new T.Vector3(...from.anchor),b=new T.Vector3(...to.anchor),m=a.clone().lerp(b,.5);m.z+=e.type==='electrical'?1.6:1.1;
  const curve=new T.CatmullRomCurve3([a,m,b]),color=e.type==='signal'?C.violet:e.type==='electrical'?C.green:e.type==='fuel'?C.amber:0xe9b1db;
  const material=new T.LineDashedMaterial({color,dashSize:e.type==='signal'?.1:.26,gapSize:e.type==='electrical'?.04:.075,transparent:true,opacity:.65});
  const line=new T.Line(new T.BufferGeometry().setFromPoints(curve.getPoints(32)),material);line.computeLineDistances();line.userData.edge=e;root.add(line);lines.push(line);
  const arrow=new T.ArrowHelper(b.clone().sub(curve.getPoint(.88)).normalize(),curve.getPoint(.88),.28,color,.14,.09);arrow.userData.edge=e;root.add(arrow);lines.push(arrow);
 }}
 function buildFlows(){const paths=[{points:[[-5.6,.5,.45],[-3,.5,.45],[-.7,.67,.45],[1.3,.55,.45],[3.5,.55,.45],[5.3,.6,.45]],bypass:false}];
  if(manifest.kind==='turbofan')paths.push({points:[[-5.6,1.65,.6],[-4,1.65,.6],[0,1.7,.6],[4.8,1.65,.6],[6,1.7,.6]],bypass:true});
  for(const path of paths){const curve=new T.CatmullRomCurve3(path.points.map(p=>new T.Vector3(...p))),particles=new T.InstancedMesh(new T.SphereGeometry(.035,6,4),new T.MeshBasicMaterial({color:path.bypass?C.cyan:C.amber}),45);root.add(particles);flowParticles.push({particles,curve,bypass:path.bypass});}
 }
 function clear(){for(const g of root.children){g.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});}root.clear();groups=new Map();meshes=[];rotations=[];pitchBlades=[];lines=[];flowParticles=[];markers=[];sectionCovers=[];closedCovers=[];inspectionParts=[];detailInspection=[];pitchLinks=[];serviceFlows=[];bladeRoots=[];mechanismUpdates=[];}
 function load(next){clear();manifest=next;selected=next.initial;shaftTrace=null;eventNode=null;isolate=false;inspection=0;recipe='engine';lastVectorFrame='';buildAirframe();buildEngine();buildEdges();buildFlows();updateInspection();updateStyles();}
 function resize(){const w=host.clientWidth,h=host.clientHeight,vertical=Math.max(span,span*1.55/(w/h));camera.left=-vertical*w/h/2;camera.right=vertical*w/h/2;camera.top=vertical/2;camera.bottom=-vertical/2;camera.updateProjectionMatrix();renderer.setSize(w,h,false);}
 function cameraState(){return {position:camera.position.toArray(),target:controls.target.toArray(),zoom:camera.zoom,span};}
 function restore(v){camera.position.fromArray(v.position);controls.target.fromArray(v.target);camera.zoom=v.zoom;span=v.span;resize();controls.update();}
 function setPreset(p){preset=p;savedFocus=null;host.dataset.focused='false';camera.zoom=1;
  if(p==='aircraft'){span=manifest.kind==='helicopter'?42:44;controls.target.set(manifest.kind==='helicopter'?7:6,manifest.kind==='turbofan'?2:0,manifest.kind==='turbofan'?-8:0);camera.position.copy(controls.target).add(new T.Vector3(20,17,32));}
  else if(p==='section'){span=manifest.kind==='turboprop'?8.5:7.4;controls.target.set(manifest.kind==='turboprop'?-.9:-.2,0,0);camera.position.set(manifest.kind==='turboprop'?2:.6,2.6,16);}
  else {span=manifest.kind==='helicopter'?15:10;controls.target.set(manifest.kind==='helicopter'?1:0,manifest.kind==='helicopter'?1.8:0,0);camera.position.copy(controls.target).add(new T.Vector3(6,5.3,16));}
  resize();controls.update();updateStyles();
 }
 function updateStyles(){const selectedIds=descendants(manifest,selected),visibleIds=new Set([...selectedIds,...ancestors(manifest,selected)]);const node=manifest.nodes.find(n=>n.id===selected),shaft=shaftTrace==='all'?null:shaftTrace||((overlay==='shafts'&&node?.shaft)?node.shaft:null),members=manifest.shafts.find(s=>s.id===shaft)?.members||[];
  const isolationMembers=overlay==='shafts'?members:node?.id.endsWith('.shaft')?(manifest.shafts.find(s=>s.id===node.shaft)?.members||[]):[];
  const isProp=manifest.kind==='turboprop';const branchIds=['load.speed','prop.governor','pitch.actuator','pitch.feedback'].includes(selected)&&isProp?['load.speed','prop.governor','pitch.actuator','propeller']:(['speed.g','torque','demand','controller','fmu','fuel.nozzles'].includes(selected)||selected==='speed.p'&&!isProp)?['controller','fmu','fuel.nozzles','combustor.liner']:[];const branchEdges=new Set(branchIds.slice(0,-1).map((id,i)=>id+'>'+branchIds[i+1]));
  const neighborEdges=manifest.edges.filter(e=>(e.from===selected||e.to===selected||e.from===eventNode||e.to===eventNode||branchEdges.has(e.id))&&(selected!=='controller'||e.simulated)),neighbors=new Set(neighborEdges.flatMap(e=>[e.from,e.to]));
  for(const [id,g]of groups){const n=manifest.nodes.find(n=>n.id===id);const shaftMember=isolationMembers.includes(id),childMember=[...groups.keys()].some(child=>manifest.nodes.find(n=>n.id===child)?.parentNodeId===id&&visibleIds.has(child));g.visible=Boolean(!isolate||visibleIds.has(id)||shaftMember||childMember);}
  for(const m of meshes){const id=m.userData.id,n=manifest.nodes.find(n=>n.id===id);if(!n)continue;
   const member=members.includes(id),hit=selectedIds.has(id),eventHit=id===eventNode;
   m.visible=(!isolate||selectedIds.has(id)||isolationMembers.includes(id))&&!(overlay==='shafts'&&((n.group==='control'||n.group==='service'&&id!=='accessory')&&!hit||shaft&&!member&&n.group==='air'));
   if(overlay==='shafts'&&n.shaft)m.material.color.setHex(['gg','hp'].includes(n.shaft)?C.cyan:C.amber);else m.material.color.copy(m.userData.baseColor);
   if(id.endsWith('.shaft')){m.material.metalness=.18;m.material.roughness=.6;}
   let opacity=m.userData.baseOpacity??1;
   if(m.userData.circuit){m.visible=m.visible&&overlay==='services'&&(m.userData.circuit===circuit||(circuit==='oil'&&m.userData.circuit==='breather'));opacity=.75;}
   if(preset!=='aircraft'&&['airframe','wing'].includes(id))opacity=preset==='section'?.035:.09;
   if(preset==='section'&&['rotor','tail.drive','tail.rotor','pitch.control'].includes(id))opacity=.12;
   if(overlay==='shafts'&&!member&&!id.endsWith('.shaft')&&n.group!=='drive')opacity=Math.min(opacity,.14);
   if(overlay==='control'&&!neighbors.has(id)&&n.group!=='control')opacity=Math.min(opacity,.22);
   if(overlay==='services'&&n.group!=='service'&&!hit)opacity=Math.min(opacity,.2);
   if(overlay==='gas'&&['control','service'].includes(n.group))opacity=Math.min(opacity,.13);
   if(shaft&&!member)opacity=Math.min(opacity,.13);
   if(hit||member||eventHit)opacity=Math.max(opacity,.9);
   m.material.transparent=opacity<.99;m.material.opacity=opacity;m.material.depthWrite=opacity>.5;
   m.material.emissive?.setHex(eventHit?0x795026:hit||member?(n.shaft==='gg'||n.shaft==='hp'?0x225668:0x634320):0x000000);m.material.emissiveIntensity=eventHit?.55:hit?.5:member?.3:0;
  }
  if(isolate)for(const m of meshes)if(m.visible){let p=m.parent;while(p&&p!==root){p.visible=true;p=p.parent;}}
  for(const l of lines){const e=l.userData.edge;const relevant=(e.from===selected||e.to===selected||e.from===eventNode||e.to===eventNode||branchEdges.has(e.id))&&(selected!=='controller'||e.simulated);
   l.visible=!isolate&&(overlay==='control'?(relevant&&['signal','actuation','fuel'].includes(e.type)):overlay==='services'?(relevant||['electrical','service'].includes(e.type)):false);
   if(l.material)l.material.opacity=relevant?.95:.3;
  }
  for(const {full,section}of sectionCovers){full.visible=overlay!=='shafts';section.visible=overlay==='shafts';}
  for(const p of inspectionParts)p.guide.visible=inspection>0&&!isolate&&p.group.position.lengthSq()>0&&groups.get(p.id).visible&&p.group.children.some(m=>m.visible);
  for(const m of closedCovers)m.visible=!cutaway&&!inspection&&overlay!=='shafts';
  for(const f of flowParticles)f.particles.visible=!isolate&&!inspection&&(overlay==='gas'||overlay==='anatomy');
  info.hidden=preset==='aircraft'||isolate||!!eventNode;info.textContent=(node?.name||'Selected component')+' ↗';
  info.setAttribute('aria-label','Selected component: '+(node?.name||selected));host.dataset.selection=selected;host.dataset.overlay=overlay;
 }
 function focusSelected(){host.dataset.focused='true';if(!savedFocus)savedFocus=cameraState();const n=manifest.nodes.find(n=>n.id===selected);if(!n)return;const target=nodeAnchor(n),offset=camera.position.clone().sub(controls.target).normalize().multiplyScalar(16);span=n.id==='airframe'?30:n.id==='rotor'?16:4;
  {const bounds=boundsFor(selected),size=bounds.getSize(new T.Vector3());bounds.getCenter(target);span=Math.max(1.6,size.length()*1.2/Math.min(1,host.clientWidth/host.clientHeight));}
  controls.target.copy(target);camera.position.copy(target).add(offset);camera.zoom=1;resize();controls.update();}
 const raycaster=new T.Raycaster(),pointer=new T.Vector2();let down=null;
 renderer.domElement.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY];});
 renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5)return;const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);
  for(const h of raycaster.intersectObjects([...groups.values()],true)){let o=h.object,visible=true;while(o&&o!==root){if(!o.visible)visible=false;o=o.parent;}if(visible&&h.object.material?.opacity>.3){let p=h.object;while(p&&!p.userData.id)p=p.parent;if(p){onSelect(p.userData.id);break;}}}});
 const observer=new ResizeObserver(resize);observer.observe(host);load(manifest);setPreset('installed');
 return {load(man){load(man);setPreset('installed');},setPreset,
  select(id){selected=id;shaftTrace=null;updateStyles();},setOverlay(value){overlay=value;shaftTrace=null;updateStyles();},traceShaft(id){overlay='shafts';shaftTrace=id;updateStyles();},
  setIsolated(value){isolate=value;updateStyles();},setCutaway(value){cutaway=value;updateStyles();},setInspection(value){inspection=inspectionAmount(value);updateInspection();updateStyles();},setRecipe(value){if(manifest.recipes.some(r=>r.id===value)){recipe=value;updateInspection();updateStyles();}},setCircuit(value){if(manifest.circuits[value]){circuit=value;updateStyles();}},
  focus:focusSelected,focusRoute(){
   if(!savedFocus)savedFocus=cameraState();host.dataset.focused='true';
   const members=shaftTrace&&shaftTrace!=='all'?manifest.shafts.find(s=>s.id===shaftTrace)?.members:manifest.shafts.flatMap(s=>s.members);
   const box=new T.Box3();for(const id of members||[]){const g=groups.get(id);if(g)box.expandByObject(g);}if(box.isEmpty())return;
   const center=box.getCenter(new T.Vector3()),offset=camera.position.clone().sub(controls.target).normalize().multiplyScalar(35);controls.target.copy(center);camera.position.copy(center).add(offset);camera.lookAt(center);camera.updateMatrixWorld(true);
   const min=new T.Vector2(Infinity,Infinity),max=new T.Vector2(-Infinity,-Infinity);
   for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]){const p=new T.Vector3(x,y,z).applyMatrix4(camera.matrixWorldInverse);min.x=Math.min(min.x,p.x);min.y=Math.min(min.y,p.y);max.x=Math.max(max.x,p.x);max.y=Math.max(max.y,p.y);}
   span=Math.max(5,(max.y-min.y)*1.45,(max.x-min.x)/(host.clientWidth/host.clientHeight)*1.4);camera.zoom=1;resize();controls.update();
  },setQuality(value){quality=['auto','detail','economy'].includes(value)?value:'auto';renderer.setPixelRatio(Math.min(devicePixelRatio,quality==='economy'?1:quality==='detail'?2:1.65));if(renderer.shadowMap)renderer.shadowMap.enabled=quality!=='economy';host.dataset.quality=quality;resize();},setEventHighlight(id){eventNode=id;updateStyles();},
  returnView(){if(savedFocus){restore(savedFocus);savedFocus=null;host.dataset.focused='false';}},resetCamera(){setPreset(preset);},
  orbit(a){const p=camera.position.clone().sub(controls.target).applyAxisAngle(new T.Vector3(0,1,0),a);camera.position.copy(controls.target).add(p);controls.update();},zoom(f){camera.zoom=T.MathUtils.clamp(camera.zoom*f,.45,6);camera.updateProjectionMatrix();},
  render(s,d,u,reduced){const now=globalThis.performance?.now()??Date.now();if((renderer.isWebGLRenderer||renderer.isSVGRenderer)&&now-lastDraw<(renderer.isSVGRenderer?(quality==='economy'?250:125):quality==='economy'?1000/30:0))return;lastDraw=now;currentState=s;currentD=d;currentU=u;
   for(const r of rotations)r.object.rotation[r.axis]=(reduced?0:r.shaft==='g'?s.angleG:s.angleP)/250/r.ratio;
   for(const p of pitchLinks)p.object.position.x=p.base+(d.bladeAngle??12)*.0015;
   for(const f of serviceFlows){f.marker.visible=overlay==='services'&&(f.name===circuit||(circuit==='oil'&&f.name==='breather'))&&!inspection&&!isolate;const phase=reduced?.5:(s.t*.15+f.offset)%1;f.marker.position.copy(f.curve.getPoint(phase));f.marker.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),f.curve.getTangent(phase));}
   for(const b of pitchBlades)b.object.rotation[b.axis]=(b.kind==='tail.rotor'?12:d.bladeAngle??12)*Math.PI/180;root.updateMatrixWorld(true);for(const update of mechanismUpdates)update(d);
   for(const m of markers){const a=(reduced?0:m.shaft==='g'?s.angleG:s.angleP)/250;m.object.position.y=Math.cos(a)*m.r;m.object.position.z=Math.sin(a)*m.r;m.object.rotation.x=a;}
   for(const f of flowParticles){for(let i=0;i<45;i++){const phase=(i/45+(reduced?0:f.bypass?s.bypassPhase:s.flowPhase))%1;const v=f.curve.getPoint(phase);v.z+=(i%3-1)*.1;dummy.position.copy(v);dummy.rotation.set(0,0,0);dummy.scale.set(1,1,1);dummy.updateMatrix();f.particles.setMatrixAt(i,dummy.matrix);}f.particles.instanceMatrix.needsUpdate=true;}
   controls.update();scene.updateMatrixWorld();camera.updateMatrixWorld();const frameKey=[manifest.kind,reduced?0:s.angleG,reduced?0:s.angleP,reduced?0:s.flowPhase,reduced?0:s.t,d.bladeAngle,selected,eventNode,overlay,preset,isolate,shaftTrace,cutaway,inspection,recipe,circuit,quality,host.clientWidth,host.clientHeight,camera.zoom,...camera.position.toArray(),...controls.target.toArray()].join(':');if(renderer.isSVGRenderer&&frameKey===lastVectorFrame)return;lastVectorFrame=frameKey;const candidates=[];
   for(const [id,pin,priority]of [[selected,info,2],[eventNode,eventPin,3]]){const n=manifest.nodes.find(n=>n.id===id);pin.hidden=!n||isolate||preset==='aircraft'||(pin===eventPin&&id===selected);if(pin.hidden)continue;const world=nodeAnchor(n);tempV.copy(world).project(camera);const x=(tempV.x*.5+.5)*host.clientWidth,y=(-tempV.y*.5+.5)*host.clientHeight;raycaster.setFromCamera(new T.Vector2(tempV.x,tempV.y),camera);const targetDistance=world.distanceTo(raycaster.ray.origin);const blocked=raycaster.intersectObjects(meshes,false).some(h=>{if(h.distance>=targetDistance-.05||h.object.material.opacity<.6||descendants(manifest,id).has(h.object.userData.id))return false;let o=h.object;while(o&&o!==root){if(!o.visible)return false;o=o.parent;}return true;});candidates.push({id,pin,priority,x,y,anchorX:x,anchorY:y,width:Math.min(260,n.name.length*7+35),height:30,blocked,name:n.name});}
   const placed=placeLabels(candidates,host.clientWidth,host.clientHeight);for(const item of candidates)if(!placed.some(p=>p.id===item.id))item.pin.hidden=true;let leaders='';for(const item of placed){item.pin.style.left=item.x+'px';item.pin.style.top=item.y+'px';item.pin.style.width=item.width+'px';item.pin.textContent=(item.pin===eventPin?'STEP · ':'')+item.name+(item.offscreen?' · Focus →':item.blocked?' · behind context':'');if(!item.offscreen)leaders+=`<path d="M${item.x} ${item.y+15}L${item.anchorX} ${item.anchorY}" class="${item.blocked?'occluded':''}"/><circle cx="${item.anchorX}" cy="${item.anchorY}" r="2"/>`;}
   leader.setAttribute('viewBox',`0 0 ${host.clientWidth} ${host.clientHeight}`);leader.innerHTML=leaders;
   renderer.render(scene,camera);const st=cameraState();host.dataset.camera=JSON.stringify({position:st.position.map(v=>+v.toFixed(5)),target:st.target.map(v=>+v.toFixed(5)),zoom:+st.zoom.toFixed(5)});host.dataset.parts=String(groups.size);if(renderer.info)host.dataset.performance=JSON.stringify({calls:renderer.info.render?.calls??null,triangles:renderer.info.render?.triangles??renderer.info.render?.faces??null,geometries:renderer.info.memory?.geometries??null,quality});
  },dispose(){observer.disconnect();controls.dispose();clear();environment?.dispose();ground.geometry.dispose();ground.material.dispose();renderer.dispose();host.replaceChildren();}
 };
}


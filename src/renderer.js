import * as T from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GEAR} from './plants.js';
import {inspectionAmount,inspectionOffset,hubBore,SHAFT_CLEARANCE} from './inspection.js';
const TAU=Math.PI*2;
const C={cyan:0x77cde1,amber:0xe7af6c,silver:0xb0c2c6,dark:0x46606d,casing:0x7093a0,liner:0x927d6e,violet:0xb3a9ef,green:0x80b89d,white:0xc9d6d4};
export function createAtlasRenderer(host,manifest,onSelect,rendering={}){
 const scene=new T.Scene(),renderer=rendering.renderer??new T.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.65));renderer.setClearColor(0,0);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.5;host.append(renderer.domElement);
 const gl=renderer.getContext(),debug=gl.getExtension('WEBGL_debug_renderer_info');host.dataset.gpu=debug?gl.getParameter(debug.UNMASKED_RENDERER_WEBGL):'WebGL (details unavailable)';
 renderer.domElement.setAttribute('aria-label','Original interactive engine and airframe. Component tree and HTML camera controls provide keyboard access.');
 const camera=new T.OrthographicCamera(-10,10,6,-6,.1,200),controls=rendering.createControls?.(camera,renderer.domElement)??new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.1;controls.minZoom=.45;controls.maxZoom=6;controls.minPolarAngle=.08;controls.maxPolarAngle=Math.PI*.92;
 scene.add(new T.HemisphereLight(0xe3f4ff,0x25252a,2.5));
 for(const [color,intensity,pos]of [[0xe5f4ff,4,[0,12,10]],[0xf7ce98,3,[7,6,-8]],[0xa4d9ed,2,[-8,2,5]]]){const l=new T.DirectionalLight(color,intensity);l.position.set(...pos);scene.add(l);}
 const grid=new T.GridHelper(80,40,0x8c8b85,0x8c8b85);grid.position.y=-7.5;grid.material.transparent=true;grid.material.opacity=.055;scene.add(grid);
 const root=new T.Group();scene.add(root);let groups=new Map(),meshes=[],rotations=[],pitchBlades=[],lines=[],flowParticles=[],markers=[],sectionCovers=[],closedCovers=[],inspectionParts=[];
 let selected=manifest.initial,overlay='anatomy',preset='installed',isolate=false,shaftTrace=null,cutaway=true,span=16,savedFocus=null,currentState=null,currentD=null,currentU=null,eventNode=null,inspection=0;
 const info=document.createElement('button');info.className='scene-pin';info.addEventListener('click',()=>focusSelected());host.append(info);const eventPin=document.createElement('button');eventPin.className='scene-pin event-pin';eventPin.hidden=true;eventPin.addEventListener('click',()=>{if(eventNode)onSelect(eventNode);});host.append(eventPin);
 const tempV=new T.Vector3(),dummy=new T.Object3D();
 const mat=(color,extra={})=>new T.MeshStandardMaterial({color,metalness:.55,roughness:.4,...extra});
 const part=id=>{if(groups.has(id))return groups.get(id);const g=new T.Group();g.userData.id=id;root.add(g);groups.set(id,g);return g;};
 function mesh(id,geo,color,pos=[0,0,0],extra={}){const m=new T.Mesh(geo,mat(color,extra));m.position.set(...pos);m.userData.baseColor=m.material.color.clone();m.userData.id=id;part(id).add(m);meshes.push(m);return m;}
 function cylinder(id,a,b,r,color,r2=r,extra={}){const start=new T.Vector3(...a),end=new T.Vector3(...b),v=end.clone().sub(start);const m=mesh(id,new T.CylinderGeometry(r2,r,v.length(),32),color,start.clone().add(end).multiplyScalar(.5).toArray(),extra);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());return m;}
 function ring(id,x,r,t,color,pos=[0,0]){const m=mesh(id,new T.TorusGeometry(r,t,7,56),color,[x,pos[0],pos[1]]);m.rotation.y=Math.PI/2;return m;}
 function surface(id,profile,color,{start=Math.PI*.7,length=Math.PI*1.3,...extra}={}){const p=[],idx=[],steps=48;
  for(const [x,r]of profile)for(let j=0;j<=steps;j++){const a=start+length*j/steps;p.push(x,Math.cos(a)*r,Math.sin(a)*r);}
  for(let i=0;i<profile.length-1;i++)for(let j=0;j<steps;j++){const a=i*(steps+1)+j,b=a+steps+1;idx.push(a,b,a+1,b,b+1,a+1);}
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
 function updateInspection(){for(const p of inspectionParts){p.group.position.fromArray(inspectionOffset(p.stage,p.angle,inspection));const from=new T.Vector3(...p.anchor);p.guide.geometry.setFromPoints([from,from.clone().add(p.group.position)]);p.guide.computeLineDistances();}host.dataset.inspection=String(inspection);}
 function nodeAnchor(node){const anchor=new T.Vector3(...node.anchor),part=inspectionParts.find(p=>p.id===node.id);if(part&&inspection)anchor.fromArray(part.anchor).add(part.group.position);return anchor;}
 function annularDisk(inner,outer,depth){const points=[[inner,-depth/2],[outer,-depth/2],[outer,depth/2],[inner,depth/2],[inner,-depth/2]].map(([r,y])=>new T.Vector2(r,y));return new T.LatheGeometry(points,32);}
 function bladeGeo(h,w,thickness=.04){const s=new T.Shape();s.moveTo(0,-w*.45);s.bezierCurveTo(h*.25,-w*.4,h*.7,-w*.05,h,w*.16);s.lineTo(h,w*.58);s.bezierCurveTo(h*.7,w*.2,h*.3,w*.12,0,w*.45);s.closePath();const g=new T.ExtrudeGeometry(s,{depth:thickness,bevelEnabled:true,bevelSize:.015,bevelThickness:.015,bevelSegments:1,steps:1});g.rotateZ(Math.PI/2);return g;}
 function row(id,x,r,hub,count,color,shaft){const g=part(id),pivot=new T.Group();pivot.position.x=x;g.add(pivot);
  const bore=hubBore(shaft,manifest.kind),disk=new T.Mesh(bore?annularDisk(bore,hub,.14):new T.CylinderGeometry(hub,hub,.14,32),mat(C.dark));disk.rotation.z=-Math.PI/2;disk.userData.id=id;disk.userData.baseColor=disk.material.color.clone();pivot.add(disk);meshes.push(disk);
  const b=new T.InstancedMesh(bladeGeo(r-hub,.24),mat(color),count);b.userData.id=id;b.userData.baseColor=b.material.color.clone();pivot.add(b);meshes.push(b);
  for(let i=0;i<count;i++){const a=i/count*TAU;dummy.position.set(0,Math.cos(a)*hub,Math.sin(a)*hub);dummy.rotation.set(a,0,0);dummy.scale.set(1,1,1);dummy.updateMatrix();b.setMatrixAt(i,dummy.matrix);}if(shaft)rotations.push({object:pivot,shaft,axis:'x',ratio:1});
 }
 function shaftBody(id,x0,x1,r,color,hollow=false,clearSpan=null){
  if(hollow){
   const tube=(start,length)=>{const group=new T.Group();part(id).add(group);for(const profile of [[[x0,r],[x1,r]],[[x0,SHAFT_CLEARANCE.outerBore],[x1,SHAFT_CLEARANCE.outerBore]],[[x0,SHAFT_CLEARANCE.outerBore],[x0,r]],[[x1,r],[x1,SHAFT_CLEARANCE.outerBore]]])group.add(surface(id,profile,color,{start,length}));return group;};
   const full=tube(0,TAU),section=tube(Math.PI*.7,Math.PI*1.3);section.visible=false;sectionCovers.push({full,section});
  }else cylinder(id,[x0,0,0],[x1,0,0],r,color);
  for(let x=x0+.2;x<x1;x+=1.35){
   // Keys are .24 long and collar tubes .05 wide. Keep their whole swept
   // envelope outside the independent outer shaft, including its end planes.
   if(clearSpan&&x+SHAFT_CLEARANCE.decorationHalfLength>=clearSpan[0]&&x-SHAFT_CLEARANCE.decorationHalfLength<=clearSpan[1])continue;
   ring(id,x,r+.025,.025,color);const key=mesh(id,new T.BoxGeometry(.24,.035,.04),0xf5e5c5,[x,r+.045,0]);markers.push({object:key,x,r:r+.045,shaft:id.startsWith('hp')||id.startsWith('gg')?'g':'p',axis:'x'});
  }
 }
 function pipe(id,points,color,r=.035){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));return mesh(id,new T.TubeGeometry(curve,24,r,6,false),color);}
 function box(id,pos,size,color){return mesh(id,new T.BoxGeometry(...size),color,pos);}
 function gear(id,pos,r,axis,shaft,ratio){const g=new T.Group();g.position.set(...pos);part(id).add(g);const disk=new T.Mesh(new T.CylinderGeometry(r,r,.16,28),mat(C.amber));disk.userData.id=id;disk.userData.baseColor=disk.material.color.clone();if(axis==='x')disk.rotation.z=-Math.PI/2;if(axis==='z')disk.rotation.x=Math.PI/2;g.add(disk);meshes.push(disk);
  for(let i=0;i<18;i++){const a=i/18*TAU,teeth=axis==='y'?new T.BoxGeometry(.13,.2,.18):new T.BoxGeometry(.2,.13,.18);const m=new T.Mesh(teeth,mat(C.amber));m.userData.id=id;m.userData.baseColor=m.material.color.clone();if(axis==='x')m.position.set(0,Math.cos(a)*r,Math.sin(a)*r);else if(axis==='y')m.position.set(Math.cos(a)*r,0,Math.sin(a)*r);else m.position.set(Math.cos(a)*r,Math.sin(a)*r,0);m.rotation[axis]=a;g.add(m);meshes.push(m);}rotations.push({object:g,shaft,axis,ratio});}
 function aerodynamicRotor(id,center,r,count,axis,ratio){const spin=new T.Group();spin.position.set(...center);part(id).add(spin);rotations.push({object:spin,shaft:'p',axis,ratio});
  const hub=new T.Mesh(new T.SphereGeometry(.3,20,12),mat(C.amber));hub.userData.id=id;hub.userData.baseColor=hub.material.color.clone();spin.add(hub);meshes.push(hub);
  for(let i=0;i<count;i++){const radial=new T.Group(),pitch=new T.Group();const a=i/count*TAU;
   if(axis==='y'){radial.rotation.y=a;pitch.position.x=.35;}else if(axis==='x'){radial.rotation.x=a;pitch.position.y=.35;}else{radial.rotation.z=a;pitch.position.y=.25;}
   spin.add(radial);radial.add(pitch);
   const geo=axis==='y'?new T.BoxGeometry(r-.35,.07,.45):new T.BoxGeometry(.32,r-.35,.075);
   const blade=new T.Mesh(geo,mat(C.silver));if(axis==='y')blade.position.x=(r-.35)/2;else blade.position.y=(r-.35)/2;
   blade.userData.id=id;blade.userData.baseColor=blade.material.color.clone();pitch.add(blade);meshes.push(blade);pitchBlades.push({object:pitch,axis:axis==='y'?'x':'y',kind:id});
   const tip=new T.Mesh(axis==='y'?new T.BoxGeometry(.35,.085,.46):new T.BoxGeometry(.33,.35,.085),mat(C.amber));if(axis==='y')tip.position.x=r-.5;else tip.position.y=r-.5;tip.userData.id=id;tip.userData.baseColor=tip.material.color.clone();pitch.add(tip);meshes.push(tip);
  }
 }
 function ellipsoid(id,pos,scale,color){const m=mesh(id,new T.SphereGeometry(1,32,16),color,pos);m.scale.set(...scale);return m;}
 function wing(id,points,thickness,color){const s=new T.Shape();s.moveTo(points[0][0],points[0][1]);for(const p of points.slice(1))s.lineTo(...p);s.closePath();const geo=new T.ExtrudeGeometry(s,{depth:thickness,bevelEnabled:false});const m=mesh(id,geo,color);return m;}
 function forceArrow(id,start,end,color){const curve=[new T.Vector3(...start),new T.Vector3(...end)];const arrow=new T.ArrowHelper(curve[1].clone().sub(curve[0]).normalize(),curve[0],curve[0].distanceTo(curve[1]),color,.5,.25);arrow.traverse(o=>{o.userData.id=id;});part(id).add(arrow);return arrow;}
 function buildAirframe(){const k=manifest.kind;
  if(k==='helicopter'){
   ellipsoid('airframe',[-3,-4.0,0],[11,3,2.6],C.white);ellipsoid('airframe',[-9,-3.6,0],[5,2.5,2.7],C.dark);
   cylinder('airframe',[6,-3.2,0],[29,-1.9,0],.4,C.white,.95);box('airframe',[28,0,0],[1.2,4,.12],C.white);
   for(const z of [-2.2,2.2]){cylinder('airframe',[-8,-7,z],[6,-7,z],.12,C.dark);cylinder('airframe',[-5,-5,z*.7],[-5,-7,z],.1,C.dark);cylinder('airframe',[3,-5,z*.7],[3,-7,z],.1,C.dark);}
   cylinder('reduction',[3.35,0,0],[5.5,0,0],.15,C.amber);gear('reduction',[5.5,0,0],.42,'x','p',1);cylinder('reduction',[5.5,0,0],[5.5,-1.6,0],.16,C.amber);gear('reduction',[5.5,-1.6,0],.58,'y','p',GEAR.helicopterMain);
   cylinder('mast',[5.5,-1.6,0],[0,-1.6,0],.14,C.amber);gear('mast',[0,-1.6,0],.65,'y','p',GEAR.helicopterMain);cylinder('mast',[0,-1.6,0],[0,6.4,0],.16,C.amber);
   cylinder('tail.drive',[0,-1.6,0],[29,-1.6,0],.095,C.amber);gear('tail.drive',[29,-1.6,0],.3,'x','p',GEAR.helicopterTail);cylinder('tail.drive',[29,-1.6,0],[29,-1.6,1.5],.1,C.amber);
   aerodynamicRotor('rotor',[0,6.4,0],15,4,'y',GEAR.helicopterMain);aerodynamicRotor('tail.rotor',[29,-1.6,1.5],2.4,4,'z',GEAR.helicopterTail);
   box('pitch.control',[-6,-3.2,1.4],[.2,.8,.15],C.violet);cylinder('pitch.control',[0,4.7,0],[0,5.1,0],.5,C.dark);forceArrow('rotor',[0,6.5,0],[0,10,0],C.green);
  }else{
   const prop= k==='turboprop',body=prop?[10,-1,0]:[8,5,-10];ellipsoid('airframe',body,prop?[13,2.1,2.1]:[19,2.4,2.4],C.white);
   const nose=prop?-2:-8;ellipsoid('airframe',[nose,body[1]+.5,body[2]],prop?[2,1.1,1.8]:[3,1.4,2.2],C.dark);
   // Wings are extruded in x/z and rotated into a horizontal plane.
   const wx=prop?7:4,wz=prop?0:-10,spanZ=prop?13:19,wy=prop?-1.8:3.8;
   const w=wing('wing',[[wx-2,wz-1],[wx+2,wz-spanZ],[wx+5,wz-spanZ],[wx+3,wz+spanZ],[wx,wz+spanZ],[wx-2,wz+1]],.15,C.white);w.rotation.x=Math.PI/2;w.position.y=wy;
   const tailX=prop?21:25,tail=wing('airframe',[[tailX-2,-5],[tailX+2,-5],[tailX+3,5],[tailX,5]],.12,C.white);tail.rotation.x=Math.PI/2;tail.position.set(0,body[1]+1,body[2]);
   box('airframe',[tailX,body[1]+2.8,body[2]],[2.2,5,.15],C.white);
   for(let i=0;i<8;i++)ellipsoid('airframe',[body[0]-5+i*1.7,body[1]+.65,body[2]+2.05],[.32,.34,.04],C.dark);
   if(prop){cylinder('reduction',[-6.7,0,0],[-5.2,0,0],.16,C.amber);gear('reduction',[-5.9,0,0],.55,'x','p',GEAR.propeller);box('reduction',[-5.8,-.35,-.15],[.9,.75,.7],C.dark);
    aerodynamicRotor('propeller',[-7.2,0,0],3.7,4,'x',GEAR.propeller);box('prop.governor',[-5.8,-.8,.8],[.45,.35,.4],C.violet);cylinder('pitch.actuator',[-7.5,0,0],[-6.9,0,0],.28,C.amber);forceArrow('propeller',[-7.8,-.8,0],[-11.5,-.8,0],C.green);
   }else {box('wing',[0,2.3,0],[1.3,3.5,.25],C.dark);forceArrow('exhaust',[-6.6,-1,0],[-10.2,-1,0],C.green);}
   forceArrow('wing',[8,body[1]+2,body[2]],[8,body[1]+7,body[2]],C.cyan);
  }
 }
 function buildEngine(){const fan=manifest.kind==='turbofan',prop=manifest.kind==='turboprop';
  surface('inlet',[[-5.55,fan?2.15:1.15],[-4.5,fan?1.8:1]],C.casing);ring('inlet',-5.55,fan?2.15:1.15,.045,C.silver);
  if(fan){row('fan.rotor',-4.95,2.04,.32,28,C.silver,'p');row('fan.stator',-4.52,1.99,.34,28,C.dark);row('lpc.rotor',-3.85,1.01,.3,22,C.silver,'p');row('lpc.rotor',-3.45,.95,.32,22,C.silver,'p');row('lpc.stator',-3.64,.97,.31,22,C.dark);
   shell('bypass',[[-4.4,2.13],[4.4,1.9]],C.casing,'casing',{transparent:true,opacity:.4});ring('bypass',4.4,1.9,.05,C.cyan);
  }
  for(let i=0;i<(fan?3:5);i++){const x=(fan?-2.8:-4)+i*.48,r=(fan?.95:1.0)-i*.055;row('compressor.rotor',x,r,.3+i*.02,22,C.silver,'g');if(i<(fan?2:4))row('compressor.stator',x+.25,r-.03,.31+i*.02,22,C.dark);}
  shell('compressor.casing',[[fan?-3.1:-4.4,1.05],[-1.35,.78]],C.casing,'casing');surface('diffuser',[[-1.5,.75],[-1,1]],C.dark);
  shell('combustor.casing',[[-1.05,1.1],[1.05,1.1],[1.25,.86]],C.casing,'casing');shell('combustor.liner',[[-.8,.94],[.7,.94],[1,.77]],C.liner,'liner');shell('combustor.liner',[[-.85,.37],[1,.37]],C.liner,'liner');
  for(const sector of inspectionParts.filter(p=>p.id==='combustor.liner'))for(let i=0;i<4;i++){const points=Array.from({length:17},(_,j)=>{const a=sector.start+sector.sweep*j/16;return [-.7+i*.4,Math.cos(a)*.95,Math.sin(a)*.95];});sector.group.add(pipe('combustor.liner',points,C.amber,.022));}
  const holeGeo=new T.SphereGeometry(.027,5,4);for(let j=0;j<4;j++)for(let i=0;i<16;i++){const a=Math.PI*.7+i/16*Math.PI*1.3;linerDetail(mesh('combustor.liner',holeGeo,C.dark,[-.6+j*.32,Math.cos(a)*.955,Math.sin(a)*.955]),a);}
  ring('fuel.nozzles',-.8,.97,.035,C.amber);for(let i=0;i<10;i++){const a=i/10*TAU;cylinder('fuel.nozzles',[-.82,Math.cos(a)*1.02,Math.sin(a)*1.02],[-.5,Math.cos(a)*.7,Math.sin(a)*.7],.035,C.amber);}
  cylinder('igniter',[.25,1.3,.8],[.25,.7,.45],.06,C.white);row('turbine.vanes',1.4,.83,.3,24,C.dark);row('gg.rotor',1.85,.83,.32,24,C.silver,'g');row('turbine.vanes',2.45,.9,.29,24,C.dark);row('power.rotor',2.85,.91,.3,26,C.amber,'p');row('power.rotor',3.2,.91,.3,26,C.amber,'p');
  surface('exhaust',[[3.5,1],[4.8,1.07]],C.casing);surface('exhaust',[[3.45,.31],[4.9,.14]],C.dark,{start:0,length:TAU});ring('exhaust',4.8,1.07,.035,C.silver);
  const gg=fan?'hp.shaft':'gg.shaft',ps=fan?'lp.shaft':'power.shaft',concentric=prop||fan,outerSpan=[fan?-2.95:-4.2,2.06];shaftBody(gg,...outerSpan,SHAFT_CLEARANCE.outerRadius,C.cyan,concentric);shaftBody(ps,fan?-5.1:prop?-6.7:2.7,fan?3.4:prop?3.4:5.5,concentric?SHAFT_CLEARANCE.innerRadius:.14,C.amber,false,concentric?outerSpan:null);
  for(const x of [-3.1,1.1,3.45])ring('bearings',x,.23,.07,C.dark);
  shell('turbine.casing',[[1.1,1.02],[3.5,1.02]],C.casing,'casing');
  for(const [x,r,len,id]of [[-2.8,1.06,2.9,'compressor.casing'],[.05,1.13,2.2,'combustor.casing'],[2.5,1.02,2,'turbine.casing']]){
   const m=surface(id,[[x-len/2,r],[x+len/2,r]],C.casing,{start:0,length:TAU});m.visible=false;m.userData.closedCover=true;closedCovers.push(m);
  }
  box('controller',[1,-1.55,1.15],[.95,.28,.65],C.violet);for(let i=0;i<8;i++)box('controller',[.65+i*.1,-1.37,1.15],[.045,.07,.65],C.dark);
  box('fmu',[-.9,-1.25,1.1],[.5,.35,.4],C.amber);box('fuel.pump',[-2,-1.25,1.1],[.5,.4,.4],C.dark);pipe('fuel.nozzles',[[-.9,-1.25,1.1],[-.8,-.5,1.2],[-.8,.5,1.1]],C.amber);
  box('accessory',[-2.7,-.8,.8],[.85,.38,.65],C.green);cylinder('accessory',[-2.67,-SHAFT_CLEARANCE.outerRadius/Math.SQRT2,SHAFT_CLEARANCE.outerRadius/Math.SQRT2],[-2.67,-.8,.8],.04,C.cyan);
  for(const n of manifest.nodes){
   if(groups.has(n.id))continue;
   const color=n.group==='control'?C.violet:n.group==='service'?C.green:C.dark;
   if(n.id==='speed.g'||n.id==='speed.p'||n.id==='temperature'||n.id==='pressure'||n.id==='inlet.sensor'){
    mesh(n.id,new T.SphereGeometry(.085,12,8),color,n.anchor);const a=[n.anchor[0],n.anchor[1]*.6,n.anchor[2]*.6];cylinder(n.id,n.anchor,a,.035,color);
   }else box(n.id,n.anchor,[.2,.17,.2],color);
  }
 }
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
 function clear(){for(const g of root.children){g.traverse(o=>{o.geometry?.dispose();if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});}root.clear();groups=new Map();meshes=[];rotations=[];pitchBlades=[];lines=[];flowParticles=[];markers=[];sectionCovers=[];closedCovers=[];inspectionParts=[];}
 function load(next){clear();manifest=next;selected=next.initial;shaftTrace=null;eventNode=null;isolate=false;inspection=0;buildAirframe();buildEngine();buildEdges();buildFlows();updateInspection();updateStyles();}
 function resize(){const w=host.clientWidth,h=host.clientHeight,vertical=Math.max(span,span*1.55/(w/h));camera.left=-vertical*w/h/2;camera.right=vertical*w/h/2;camera.top=vertical/2;camera.bottom=-vertical/2;camera.updateProjectionMatrix();renderer.setSize(w,h,false);}
 function cameraState(){return {position:camera.position.toArray(),target:controls.target.toArray(),zoom:camera.zoom,span};}
 function restore(v){camera.position.fromArray(v.position);controls.target.fromArray(v.target);camera.zoom=v.zoom;span=v.span;resize();controls.update();}
 function setPreset(p){preset=p;savedFocus=null;host.dataset.focused='false';camera.zoom=1;
  if(p==='aircraft'){span=manifest.kind==='helicopter'?42:44;controls.target.set(manifest.kind==='helicopter'?7:6,manifest.kind==='turbofan'?2:0,manifest.kind==='turbofan'?-8:0);camera.position.copy(controls.target).add(new T.Vector3(20,17,32));}
  else if(p==='section'){span=manifest.kind==='turboprop'?8.5:7.4;controls.target.set(manifest.kind==='turboprop'?-.9:-.2,0,0);camera.position.set(manifest.kind==='turboprop'?2:.6,2.6,16);}
  else {span=manifest.kind==='helicopter'?15:10;controls.target.set(manifest.kind==='helicopter'?1:0,manifest.kind==='helicopter'?1.8:0,0);camera.position.copy(controls.target).add(new T.Vector3(6,5.3,16));}
  resize();controls.update();updateStyles();
 }
 function updateStyles(){const node=manifest.nodes.find(n=>n.id===selected),shaft=shaftTrace==='all'?null:shaftTrace||((overlay==='shafts'&&node?.shaft)?node.shaft:null),members=manifest.shafts.find(s=>s.id===shaft)?.members||[];
  const isProp=manifest.kind==='turboprop';const branchIds=['load.speed','prop.governor','pitch.actuator','pitch.feedback'].includes(selected)&&isProp?['load.speed','prop.governor','pitch.actuator','propeller']:(['speed.g','torque','demand','controller','fmu','fuel.nozzles'].includes(selected)||selected==='speed.p'&&!isProp)?['controller','fmu','fuel.nozzles','combustor.liner']:[];const branchEdges=new Set(branchIds.slice(0,-1).map((id,i)=>id+'>'+branchIds[i+1]));
  const neighborEdges=manifest.edges.filter(e=>(e.from===selected||e.to===selected||e.from===eventNode||e.to===eventNode||branchEdges.has(e.id))&&(selected!=='controller'||e.simulated)),neighbors=new Set(neighborEdges.flatMap(e=>[e.from,e.to]));
  for(const [id,g]of groups){const n=manifest.nodes.find(n=>n.id===id);g.visible=Boolean(!isolate||id===selected||(node?.shaft&&manifest.shafts.find(s=>s.id===node.shaft)?.members.includes(id)));}
  for(const m of meshes){const id=m.userData.id,n=manifest.nodes.find(n=>n.id===id);if(!n)continue;
   const member=members.includes(id),hit=id===selected,eventHit=id===eventNode;
   m.visible=!(overlay==='shafts'&&((n.group==='control'||n.group==='service'&&id!=='accessory')&&!hit||shaft&&!member&&n.group==='air'));
   if(overlay==='shafts'&&n.shaft)m.material.color.setHex(['gg','hp'].includes(n.shaft)?C.cyan:C.amber);else m.material.color.copy(m.userData.baseColor);
   if(id.endsWith('.shaft')){m.material.metalness=.18;m.material.roughness=.6;}
   let opacity=1;
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
  if(inspection&&inspectionParts.some(p=>p.id===selected)){const bounds=new T.Box3().setFromObject(groups.get(selected)),size=bounds.getSize(new T.Vector3());bounds.getCenter(target);span=Math.max(4,size.length()*1.1/Math.min(1,host.clientWidth/host.clientHeight));}
  controls.target.copy(target);camera.position.copy(target).add(offset);camera.zoom=1;resize();controls.update();}
 const raycaster=new T.Raycaster(),pointer=new T.Vector2();let down=null;
 renderer.domElement.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY];});
 renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5)return;const r=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);
  for(const h of raycaster.intersectObjects([...groups.values()],true)){let o=h.object,visible=true;while(o&&o!==root){if(!o.visible)visible=false;o=o.parent;}if(visible&&h.object.material?.opacity>.3){let p=h.object;while(p&&!p.userData.id)p=p.parent;if(p){onSelect(p.userData.id);break;}}}});
 const observer=new ResizeObserver(resize);observer.observe(host);load(manifest);setPreset('installed');
 return {load(man){load(man);setPreset('installed');},setPreset,
  select(id){selected=id;shaftTrace=null;updateStyles();},setOverlay(value){overlay=value;shaftTrace=null;updateStyles();},traceShaft(id){overlay='shafts';shaftTrace=id;updateStyles();},
  setIsolated(value){isolate=value;updateStyles();},setCutaway(value){cutaway=value;updateStyles();},setInspection(value){inspection=inspectionAmount(value);updateInspection();updateStyles();},
  focus:focusSelected,focusRoute(){
   if(!savedFocus)savedFocus=cameraState();host.dataset.focused='true';
   const members=shaftTrace&&shaftTrace!=='all'?manifest.shafts.find(s=>s.id===shaftTrace)?.members:manifest.shafts.flatMap(s=>s.members);
   const box=new T.Box3();for(const id of members||[]){const g=groups.get(id);if(g)box.expandByObject(g);}if(box.isEmpty())return;
   const center=box.getCenter(new T.Vector3()),offset=camera.position.clone().sub(controls.target).normalize().multiplyScalar(35);controls.target.copy(center);camera.position.copy(center).add(offset);camera.lookAt(center);camera.updateMatrixWorld(true);
   const min=new T.Vector2(Infinity,Infinity),max=new T.Vector2(-Infinity,-Infinity);
   for(const x of [box.min.x,box.max.x])for(const y of [box.min.y,box.max.y])for(const z of [box.min.z,box.max.z]){const p=new T.Vector3(x,y,z).applyMatrix4(camera.matrixWorldInverse);min.x=Math.min(min.x,p.x);min.y=Math.min(min.y,p.y);max.x=Math.max(max.x,p.x);max.y=Math.max(max.y,p.y);}
   span=Math.max(5,(max.y-min.y)*1.45,(max.x-min.x)/(host.clientWidth/host.clientHeight)*1.4);camera.zoom=1;resize();controls.update();
  },setEventHighlight(id){eventNode=id;updateStyles();},
  returnView(){if(savedFocus){restore(savedFocus);savedFocus=null;host.dataset.focused='false';}},resetCamera(){setPreset(preset);},
  orbit(a){const p=camera.position.clone().sub(controls.target).applyAxisAngle(new T.Vector3(0,1,0),a);camera.position.copy(controls.target).add(p);controls.update();},zoom(f){camera.zoom=T.MathUtils.clamp(camera.zoom*f,.45,6);camera.updateProjectionMatrix();},
  render(s,d,u,reduced){currentState=s;currentD=d;currentU=u;
   for(const r of rotations)r.object.rotation[r.axis]=(reduced?0:r.shaft==='g'?s.angleG:s.angleP)/250/r.ratio;
   for(const b of pitchBlades)b.object.rotation[b.axis]=(b.kind==='tail.rotor'?12:d.bladeAngle??12)*Math.PI/180;
   for(const m of markers){const a=(reduced?0:m.shaft==='g'?s.angleG:s.angleP)/250;m.object.position.y=Math.cos(a)*m.r;m.object.position.z=Math.sin(a)*m.r;m.object.rotation.x=a;}
   for(const f of flowParticles){for(let i=0;i<45;i++){const phase=(i/45+(reduced?0:f.bypass?s.bypassPhase:s.flowPhase))%1;const v=f.curve.getPoint(phase);v.z+=(i%3-1)*.1;dummy.position.copy(v);dummy.rotation.set(0,0,0);dummy.scale.set(1,1,1);dummy.updateMatrix();f.particles.setMatrixAt(i,dummy.matrix);}f.particles.instanceMatrix.needsUpdate=true;}
   controls.update();scene.updateMatrixWorld();camera.updateMatrixWorld();const n=manifest.nodes.find(n=>n.id===selected);if(n){tempV.copy(nodeAnchor(n)).project(camera);const x=(tempV.x*.5+.5)*host.clientWidth,y=(-tempV.y*.5+.5)*host.clientHeight;info.style.left=Math.max(90,Math.min(host.clientWidth-90,x))+'px';info.style.top=Math.max(88,Math.min(host.clientHeight-120,y-25))+'px';info.textContent=n.name+((x<0||x>host.clientWidth||y<0||y>host.clientHeight)?' · Focus →':' ↗');}const ev=manifest.nodes.find(n=>n.id===eventNode);eventPin.hidden=!ev||eventNode===selected||isolate;if(ev){tempV.copy(nodeAnchor(ev)).project(camera);eventPin.style.left=Math.max(100,Math.min(host.clientWidth-100,(tempV.x*.5+.5)*host.clientWidth))+'px';eventPin.style.top=Math.max(94,Math.min(host.clientHeight-120,(-tempV.y*.5+.5)*host.clientHeight-12))+'px';eventPin.textContent='EVENT · '+ev.name;}
   renderer.render(scene,camera);const st=cameraState();host.dataset.camera=JSON.stringify({position:st.position.map(v=>+v.toFixed(5)),target:st.target.map(v=>+v.toFixed(5)),zoom:+st.zoom.toFixed(5)});host.dataset.parts=String(groups.size);
  },dispose(){observer.disconnect();controls.dispose();clear();renderer.dispose();host.replaceChildren();}
 };
}


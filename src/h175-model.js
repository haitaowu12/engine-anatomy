import * as T from 'three';
import {H175_LAYOUT,TAU,bladeLinkage} from './h175-state.js';

// Original procedural construction informed by the documented 42145 functions.
// It intentionally is not a reproduction of the set's part inventory or routing.
export function buildH175Model({economy=false}={}){
 const root=new T.Group();root.name='Original H175 mechanical study';
 const palette={red:0xc92f2d,white:0xe9e5da,black:0x20252a,grey:0x859096,dark:0x434c52,blue:0x247cad,yellow:0xf4dc24,orange:0xf1a72b,tan:0xc7b18b,metal:0xb9c2c5};
 const materials=new Map(),components=new Map(),pickMeshes=[],geometries=new Set(),animations={},meshMetrics={beams:0,pins:0,panels:0,holes:0};
 const material=color=>{const key=typeof color==='string'?color:String(color);if(!materials.has(key))materials.set(key,new T.MeshStandardMaterial({color:palette[color]??color,roughness:key==='black'?.38:.32,metalness:key==='metal'?.65:.025}));return materials.get(key);};
 const group=(id,parent=root)=>{const g=new T.Group();g.userData.component=id;g.name=id;parent.add(g);if(!components.has(id))components.set(id,[]);components.get(id).push(g);return g;};
 const componentGroups={whole:group('whole'),rotor:group('rotor'),drive:group('drive'),gear:group('gear'),winch:group('winch'),covers:group('covers')};
 const geoCache=new Map();
 const cache=(key,fn)=>{if(!geoCache.has(key)){const g=fn();geoCache.set(key,g);geometries.add(g);}return geoCache.get(key);};
 function add(parent,geometry,color,pos=[0,0,0],id){const m=new T.Mesh(geometry,material(color));m.position.fromArray(pos);m.castShadow=true;m.receiveShadow=true;m.userData.component=id??parent.userData.component??'whole';m.userData.originalMaterial=m.material;parent.add(m);pickMeshes.push(m);geometries.add(geometry);return m;}
 const box=(parent,w,h,d,color,p)=>add(parent,cache(`b:${w}:${h}:${d}`,()=>new T.BoxGeometry(w,h,d)),color,p);
 function cylinder(parent,a,b,r,color,r2=r,n=economy?10:20){const v=new T.Vector3(...b).sub(new T.Vector3(...a));const m=add(parent,cache(`c:${r}:${r2}:${v.length()}:${n}`,()=>new T.CylinderGeometry(r2,r,v.length(),n)),color,new T.Vector3(...a).add(new T.Vector3(...b)).multiplyScalar(.5).toArray());m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());return m;}
 function capsuleShape(length,width){const s=new T.Shape(),r=width/2,h=length/2-r;s.moveTo(-h,-r);s.lineTo(h,-r);s.absarc(h,0,r,-Math.PI/2,Math.PI/2,false);s.lineTo(-h,r);s.absarc(-h,0,r,Math.PI/2,Math.PI*1.5,false);return s;}
 function beam(parent,a,b,color,{holes=true,width=.95,depth=.78}={}){const length=new T.Vector3(...a).distanceTo(new T.Vector3(...b))+.95,count=Math.max(2,Math.round(length)),shape=capsuleShape(length,width);
  if(holes)for(let i=0;i<count;i++){const p=new T.Path();p.absarc(-length/2+.5+i*(length-1)/(count-1),0,.245,0,TAU,true);shape.holes.push(p);}
  const key=`beam:${length.toFixed(4)}:${width}:${depth}:${holes}:${economy}`;const g=cache(key,()=>{const g=new T.ExtrudeGeometry(shape,{depth,bevelEnabled:!economy,bevelSegments:1,steps:1,bevelSize:.035,bevelThickness:.035,curveSegments:economy?3:5});g.translate(0,0,-depth/2);return g;});
  const center=new T.Vector3(...a).add(new T.Vector3(...b)).multiplyScalar(.5),m=add(parent,g,color,center.toArray());m.quaternion.setFromUnitVectors(new T.Vector3(1,0,0),new T.Vector3(...b).sub(new T.Vector3(...a)).normalize());m.userData.perforatedBeam=holes;meshMetrics.beams++;if(holes)meshMetrics.holes+=count;return m;
 }
 function pin(parent,p,axis='z',color='blue',length=1.15){const m=add(parent,cache(`pin:${length}:${economy}`,()=>new T.CylinderGeometry(.24,.24,length,economy?8:14)),color,p);if(axis==='z')m.rotation.x=Math.PI/2;else if(axis==='x')m.rotation.z=Math.PI/2;meshMetrics.pins++;return m;}
 function panel(parent,points,color,depth=.22){const s=new T.Shape();points.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath();const g=new T.ExtrudeGeometry(s,{depth,bevelEnabled:!economy,bevelSegments:1,steps:1,bevelSize:.07,bevelThickness:.045,curveSegments:3});g.translate(0,0,-depth/2);meshMetrics.panels++;return add(parent,g,color);}
 function sphere(parent,p,r,color){return add(parent,cache(`s:${r}`,()=>new T.SphereGeometry(r,economy?6:10,economy?4:7)),color,p);}
 function torus(parent,p,r,t,color,axis='y'){const m=add(parent,cache(`t:${r}:${t}:${economy}`,()=>new T.TorusGeometry(r,t,economy?5:8,economy?18:28)),color,p);if(axis==='y')m.rotation.x=Math.PI/2;else if(axis==='x')m.rotation.y=Math.PI/2;return m;}
 function wheel(parent,p,r){torus(parent,p,r*.73,r*.27,'black','z');const hub=cylinder(parent,[p[0],p[1],p[2]-.43],[p[0],p[1],p[2]+.43],r*.54,'white');hub.userData.wheel=true;for(let i=0;i<6;i++){const a=i*TAU/6;const m=cylinder(parent,[p[0]+r*.32*Math.cos(a),p[1]+r*.32*Math.sin(a),p[2]+.44],[p[0]+r*.32*Math.cos(a),p[1]+r*.32*Math.sin(a),p[2]+.46],r*.09,'dark');m.userData.wheelDetail=true;}pin(parent,p,'z','grey',1.05);}
 function gear(parent,p,teeth,r,color){const s=new T.Shape(),module=2*r/teeth;for(let i=0;i<teeth*4;i++){const a=i*TAU/(teeth*4),radius=i%4===1||i%4===2?r+module:r-1.25*module;const x=radius*Math.cos(a),y=radius*Math.sin(a);i?s.lineTo(x,y):s.moveTo(x,y);}s.closePath();const hole=new T.Path();hole.absarc(0,0,.25,0,TAU,true);s.holes.push(hole);const g=new T.ExtrudeGeometry(s,{depth:.48,bevelEnabled:false,steps:1,curveSegments:5});g.rotateX(-Math.PI/2);g.translate(0,-.24,0);const m=add(parent,g,color,p);m.userData.gearTeeth=teeth;m.userData.pitchRadius=r;return m;}
 function link(parent,color){const m=add(parent,new T.CylinderGeometry(.095,.095,1,economy?6:10),color);m.userData.movingLink=true;return m;}
 function positionLink(m,a,b){const start=new T.Vector3(...a),end=new T.Vector3(...b),v=end.clone().sub(start);m.position.copy(start.add(end).multiplyScalar(.5));m.scale.y=v.length();m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());}
 const frame=componentGroups.whole;
 // The construction is visible: pierced liftarms, panel seams, pins and braces.
 for(const side of [-1,1]){
  for(const [a,b]of [[-22,-7],[-7,8]])beam(frame,[a,5.6,side*6],[b,5.6,side*6],'white');
  for(const [a,b]of [[-18,-5],[-5,8]])beam(frame,[a,14.4,side*6],[b,14.4,side*6],'red');
  for(const x of [-18,-11,3,8]){beam(frame,[x,6.4,side*6],[x,14.1,side*6],'black',{width:.75,depth:.65});for(const y of [6.4,14.1])pin(frame,[x,y,side*6.5],'z','blue');}
  for(const [x,len]of [[-15.2,5.8],[3.9,6.7]]){const p=box(frame,len,2.6,.55,'red',[x,8.15,side*6.15]);p.userData.bodyPanel=true;}
  for(const [x0,x1]of [[-21.8,-14.3],[-13.9,-2.1],[-1.7,8.2]]){const p=panel(frame,[[x0,6.12],[x1,6.12],[x1,7.25],[x0,7.25]],'white',.4);p.position.z=side*6.18;}
  beam(frame,[-22,5.6,side*6],[-26,8.5,side*3.5],'white');beam(frame,[-26,8.5,side*3.5],[-19.4,15.2,side*5.8],'black',{holes:false,width:.6,depth:.65});
  beam(frame,[-19.4,15.2,side*5.8],[-14.5,15.2,side*6],'red');
  const nose=panel(frame,[[-26,8.6],[-22.7,11.2],[-19.5,11.8],[-20.6,8.8]],'red',.5);nose.position.z=side*3.15;nose.rotation.x=side*.14;
  beam(frame,[-25.5,7.8,side*3.4],[-22.5,5.6,side*5.9],'white');
  for(let i=0;i<7;i++)pin(frame,[-21+i*4.1,5.6,side*6.45],'z',i%3?'grey':'blue');
  beam(frame,[6.5,14.5,side*5],[39,17,side*1.25],'yellow',{holes:false,width:.6,depth:.6});
 }
 // Cross frames and open cabin floor are physical interior context.
 for(const x of [-20,-13,-6,1,8]){beam(frame,[x,5.55,-6],[x,5.55,6],'dark');beam(frame,[x,14.25,-5.9],[x,14.25,5.9],'black',{holes:false,width:.6,depth:.55});}
 box(frame,26, .35,10.9,'dark',[-6.5,5.6,0]);
 for(const z of [-2.6,2.6]){box(frame,3.3,.7,3.1,'grey',[-18.5,7.4,z]);const back=box(frame,.65,4,3.1,'grey',[-16.8,9,z]);back.rotation.z=-.12;beam(frame,[-21.8,8.2,z-1.3],[-21.8,8.2,z+1.3],'black',{holes:false,width:.5});}
 const controlSticks=[];for(const z of [-2.6,2.6]){const pivot=group('rotor',frame);pivot.position.set(-20.7,7.7,z);cylinder(pivot,[0,0,0],[0,3.4,0],.13,'dark');sphere(pivot,[0,3.5,0],.28,'black');controlSticks.push(pivot);}
 const collectiveLevers=[];for(const z of [-4.1,1.1]){const pivot=group('rotor',frame);pivot.position.set(-17.8,7.6,z);cylinder(pivot,[0,0,0],[-2.5,0,0],.15,'black');sphere(pivot,[-2.55,0,0],.25,'black');collectiveLevers.push(pivot);}
 // A black instrument crossbar and physical controls, without invented displays.
 beam(frame,[-23,9.2,-4.3],[-23,9.2,4.3],'black',{holes:false,width:.8,depth:1.4});
 for(const z of [-2.4,-1,1,2.4])box(frame,.15,.8,.9,'grey',[-23.45,9.6,z]);
 // Nose fairing with an open beam-built windshield above it.
 beam(frame,[-26.6,8.1,-3.4],[-26.6,8.1,3.4],'white',{holes:false,width:.85,depth:.8});
 const noseTop=panel(frame,[[-27,8.3],[-24,10.4],[-21.6,11.1],[-23.4,8.4]],'red',5.6);noseTop.position.z=0;
 cylinder(frame,[-26.4,5.5,0],[-26.4,7.1,0],.55,'black');sphere(frame,[-26.4,5.65,0],.7,'black');
 // Openable cockpit and sliding passenger doors have their own transforms.
 const cockpitDoors=[],slidingDoors=[];
 for(const side of [-1,1]){
  const door=group('covers');door.position.set(-14.1,8.2,side*6.4);cockpitDoors.push({door,side});
  beam(door,[-6.4,-2.1,0],[0,-2.1,0],'white');beam(door,[0,-2.1,0],[0,6,0],'black');beam(door,[-6.4,-2.1,0],[-7.2,2.2,0],'black',{holes:false,width:.6});beam(door,[-7.2,2.2,0],[-4.9,6.1,0],'black',{holes:false,width:.6});beam(door,[-4.9,6.1,0],[0,6.1,0],'black',{holes:false,width:.55});
  const lower=panel(door,[[-6.3,-1.7],[0,-1.7],[0,.3],[-6.6,.3]],'white',.35);lower.userData.door=true;box(door,1,.22,.3,'grey',[-.9,1,side*.28]);
  const slider=group('covers');slider.position.set(-6,7.2,side*6.7);slidingDoors.push({slider,side});
  beam(slider,[-3.6,0,0],[3.6,0,0],'red');beam(slider,[-3.6,6.8,0],[3.6,6.8,0],'black',{width:.7,depth:.6});for(const x of [-3.6,3.6])beam(slider,[x,0,0],[x,6.8,0],'black',{width:.7,depth:.6});box(slider,7.1,2.5,.4,'red',[0,1.2,0]);box(slider,.3,1,.3,'grey',[2.8,3.2,side*.35]);
  beam(frame,[-10.4,14.85,side*6.9],[5.4,14.85,side*6.9],'grey',{holes:false,width:.35,depth:.35});
 }
 // Tapered tail: exposed longitudinal liftarms and separate panel segments.
 const tail=group('whole');
 for(const side of [-1,1]){
  for(const [a,b]of [[8,19],[19,30],[30,40]]){const r=x=>5-(x-8)*.115,y=x=>9.8+(x-8)*.17;beam(tail,[a,y(a),side*r(a)],[b,y(b),side*r(b)],'red');beam(tail,[a,14.7+(a-8)*.075,side*r(a)],[b,14.7+(b-8)*.075,side*r(b)],'red');}
  for(const x of [11,18,25,32,38]){const z=side*(5-(x-8)*.115),y=9.8+(x-8)*.17;beam(tail,[x,y,z],[x,14.7+(x-8)*.075,z],'red');pin(tail,[x,y+.3,z+side*.45],'z','blue');}
  for(const [x,w]of [[13,8],[22,8],[31,8]]){const z=side*(5-(x-8)*.115);const p=panel(tail,[[x-w/2,10.4+(x-w/2-8)*.17],[x+w/2,10.4+(x+w/2-8)*.17],[x+w/2,14.35+(x+w/2-8)*.075],[x-w/2,14.35+(x-w/2-8)*.075]],'red',.35);p.position.z=z;p.rotation.y=-side*.1;}
 }
 beam(tail,[8,14.5,0],[40.5,17,0],'yellow',{holes:false,width:.6,depth:.7});
 const fin=panel(tail,[[35.7,16.3],[39.6,27],[42.5,26.3],[44.6,16.9]],'yellow',1.05);fin.userData.tailFin=true;
 beam(tail,[36.3,16.7,0],[40,26.2,0],'yellow');beam(tail,[40,26.2,0],[44.3,17.3,0],'yellow');
 for(const y of [18,20.3,22.6,24.9])pin(tail,[39.9+(25-y)*.12,y,.75],'z','black',1.4);
 beam(tail,[38.8,16.3,-8],[38.8,16.3,8],'red');for(const side of [-1,1]){beam(tail,[36.7,16.1,side*1],[39.9,16.4,side*7.7],'red');sphere(tail,[38.8,16.55,side*8.1],.33,side===1?'green':'red');}
 // Upper cowling panels slide apart as shown in the official set functions.
 const frontCowl=group('covers'),rearCowl=group('covers');
 function cowl(g,x0,x1,front){
  const profile=front?[[x0,1.2,15,.7],[x0+2.3,3.7,15,2.6],[x1-5,4.5,15.2,3.35],[x1,4.4,15.2,3.1]]:[[x0,4.4,15.2,3.1],[x0+3,4.4,15.2,3.35],[x1-3,3.7,14.9,2.8],[x1,2.7,14.5,1.5]];
  // Curved opaque covers, split at actual panel boundaries. The shell remains
  // rounded in silhouette while the liftarm rims and attachment pins stay visible.
  for(let section=0;section<profile.length-1;section++){
   const a=profile[section],b=profile[section+1],positions=[],indices=[],along=4,around=economy?12:20;
   for(let i=0;i<=along;i++){const t=i/along,x=a[0]+(b[0]-a[0])*t+(i===0?.035:i===along?-.035:0),w=a[1]+(b[1]-a[1])*t,base=a[2]+(b[2]-a[2])*t,h=a[3]+(b[3]-a[3])*t;for(let j=0;j<=around;j++){const angle=j/around*Math.PI;positions.push(x,base+Math.sin(angle)*h,Math.cos(angle)*w);}}
   for(let i=0;i<along;i++)for(let j=0;j<around;j++){const n=i*(around+1)+j,k=n+around+1;indices.push(n,k,n+1,n+1,k,k+1);}
   const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();const shell=add(g,geometry,'white');shell.userData.curvedCowling=true;meshMetrics.panels++;
  }
  for(const side of [-1,1]){
   beam(g,[x0+2,15.1,side*4.15],[x1-.8,15.1,side*4.35],'white');
   for(const x of [x0+2.8,x1-1.5])pin(g,[x,15.1,side*4.8],'z','blue');
  }
 }
 cowl(frontCowl,-16.9,-3.8,true);cowl(rearCowl,.1,10.5,false);
 // Electric motor, battery and three selectable drives are a distinct toy system.
 const drive=componentGroups.drive;
 box(drive,6.8,4.1,8.5,'grey',[6.1,8.2,0]);box(drive,6.85,.25,8.55,'dark',[6.1,10.3,0]);for(let i=0;i<6;i++)box(drive,.16,2.8,8.65,'dark',[3.4+i*1.05,8.25,0]);
 box(drive,3.7,2.9,3.8,'white',[4.5,12.1,0]);cylinder(drive,[2.25,12.1,0],[3.1,12.1,0],1.1,'grey');cylinder(drive,[1.4,12.1,0],[2.8,12.1,0],.22,'dark');box(drive,.22,.8,1.4,'orange',[6.45,12.35,0]);
 const cablePoints=[new T.Vector3(6.5,12.6,-1),new T.Vector3(8.3,11.5,-2),new T.Vector3(8.5,10.4,-2.7)];add(drive,new T.TubeGeometry(new T.CatmullRomCurve3(cablePoints),economy?8:16,.1,5,false),'black');
 const frameCheeks=[];for(const side of [-1,1]){const cheek=group('drive');frameCheeks.push({cheek,side});for(const y of [11.1,16.1])beam(cheek,[-4,y,side*3.4],[8.5,y,side*3.4],'grey');for(const x of [-4,8.5])beam(cheek,[x,11.1,side*3.4],[x,16.1,side*3.4],'grey');for(const x of [-2,.24,2.48,4.72])pin(cheek,[x,16.1,side*3.8],'z','blue');}
 const gears=[];for(const [i,x,n,r]of [[0,-2,20,1.4],[1,.24,12,.84],[2,2.48,20,1.4],[3,4.72,12,.84]]){const g=gear(drive,[x,14.25,0],n,r,i%2?'tan':'grey');gears.push({mesh:g,ratio:i%2?1:-.6,phase:i%2?Math.PI/12:0});cylinder(drive,[x,11.5,0],[x,15.9,0],.2,'dark');}
 const selectors=[];for(const [x,z]of [[-1.9,5.5],[3.4,5.5],[5.7,-5.5]]){const p=group('drive');p.position.set(x,12.3,z);cylinder(p,[0,0,0],[0,1.8,0],.16,'grey');sphere(p,[0,1.9,0],.37,'red');selectors.push(p);}
 const motorShaft=cylinder(drive,[-2,14.6,0],[-2,19.9,0],.32,'dark');motorShaft.userData.mast=true;
 const replica=group('drive');const replicaFans=[];for(const z of [-2.15,2.15]){const body=cylinder(replica,[2.8,17,z],[7.2,17,z],1.1,'dark');body.userData.replicaEngine=true;for(const x of [3,6.9])torus(replica,[x,17,z],1.12,.14,'grey','x');const fan=group('drive',replica);fan.position.set(2.75,17,z);for(let i=0;i<10;i++){const a=i*TAU/10,blade=box(fan,.14,.18,.8,'grey',[0,Math.cos(a)*.58,Math.sin(a)*.58]);blade.rotation.x=a+.35;}cylinder(fan,[-.2,0,0],[.2,0,0],.3,'grey');replicaFans.push(fan);}
 // Rotor mast, two swashplate rings, blade pitch hinges and fixed-length links.
 const rotor=componentGroups.rotor,mastX=H175_LAYOUT.mastX;
 cylinder(rotor,[mastX,17.4,0],[mastX,22.9,0],.27,'dark');
 const fixedRing=group('rotor'),rotatingRing=group('rotor');
 torus(fixedRing,[0,0,0],1.55,.23,'grey');torus(rotatingRing,[0,0,0],1.38,.2,'dark');
 for(let i=0;i<3;i++){const a=i*TAU/3;beam(fixedRing,[0,0,0],[Math.cos(a)*1.8,0,Math.sin(a)*1.8],'grey',{holes:false,width:.35,depth:.35});}
 const head=group('rotor');head.position.set(mastX,22,0);cylinder(head,[0,-.55,0],[0,.55,0],.85,'grey');
 const cap=group('rotor');cap.position.set(mastX,23.5,0);const capMesh=cylinder(cap,[0,-.18,0],[0,.18,0],1.65,'red',1.4);capMesh.userData.rotorCap=true;
 const bladeGroups=[],pitchRods=[],pitchJoints=[];
 for(let i=0;i<5;i++){
  const arm=group('rotor');arm.position.set(mastX,22,0);const hinge=group('rotor',arm);hinge.position.x=1.7;bladeGroups.push({arm,hinge,phase:i*TAU/5});
  cylinder(hinge,[-.4,0,0],[1.5,0,0],.25,'dark');beam(hinge,[.2,0,0],[2.5,0,0],'grey',{holes:false,width:.65,depth:.55});
  const shape=new T.Shape();shape.moveTo(1.2,-.45);shape.lineTo(3,-.75);shape.lineTo(31.8,-1.05);shape.quadraticCurveTo(33.4,-.9,33.4,-.15);shape.lineTo(32.9,.6);shape.lineTo(2,.45);shape.closePath();const bladeGeometry=new T.ExtrudeGeometry(shape,{depth:.16,bevelEnabled:!economy,bevelSegments:1,bevelSize:.04,bevelThickness:.025,steps:1,curveSegments:4});bladeGeometry.rotateX(Math.PI/2);bladeGeometry.translate(0,.08,0);const m=add(hinge,bladeGeometry,'dark');m.userData.mainBlade=i;
  const tip=box(hinge,1.5,.2,1.45,'yellow',[32.5,.02,.15]);tip.rotation.y=.08;
  const horn=cylinder(hinge,[0,0,0],[0,0,H175_LAYOUT.horn],.17,'grey');horn.userData.pitchHorn=true;
  const rod=link(rotor,'grey');pitchRods.push(rod);const ball1=sphere(rotor,[0,0,0],.18,'black'),ball2=sphere(rotor,[0,0,0],.18,'black');pitchJoints.push([ball1,ball2]);
 }
 const supportRods=[];for(let i=0;i<3;i++){const a=i*TAU/3;const rod=link(rotor,'grey');supportRods.push({rod,phase:a});cylinder(rotor,[mastX+1.8*Math.cos(a),17.7,1.8*Math.sin(a)],[mastX+1.8*Math.cos(a),19.1,1.8*Math.sin(a)],.23,'black');}
 // A driven tail shaft remains inside the boom. Its bearings are part of the frame.
 const tailDrive=cylinder(drive,[0,15.2,0],[40,17.7,0],.19,'grey');tailDrive.userData.tailDrive=true;
 for(const x of [14,25,35])torus(drive,[x,15.2+x*.0625,0],.4,.13,'dark','x');
 const tailRotor=group('rotor');tailRotor.position.set(41.8,24.15,1.25);tailRotor.rotation.x=-.13;const tailSpinner=group('rotor',tailRotor);cylinder(tailSpinner,[0,0,-.35],[0,0,.55],.55,'grey');
 for(let i=0;i<3;i++){const arm=group('rotor',tailSpinner);arm.rotation.z=i*TAU/3;const blade=box(arm,.8,5.8,.16,'dark',[0,3.6,0]);blade.rotation.y=.16;box(arm,.85,.85,.2,'yellow',[0,6.1,.05]);pin(arm,[0,.9,0],'z','blue',.65);}
 // Three landing-gear legs; the nose leg has a paired wheel axle.
 const legs=[];for(const [id,p,side]of [['nose',[-21.6,6.3,0],0],['left',[4.6,6.6,-6.9],-1],['right',[4.6,6.6,6.9],1]]){const g=group('gear');g.position.fromArray(p);legs.push({id,g,side});beam(g,[0,0,0],[0,-4.1,0],'grey');cylinder(g,[.7,-.4,0],[.2,-3.5,0],.18,'metal');if(id==='nose'){for(const z of [-.63,.63])wheel(g,[0,-4.65,z],.8);}else wheel(g,[0,-4.65,side*.52],1.22);pin(g,[0,0,0],'z','blue',1.3);}
 for(const side of [-1,1]){beam(componentGroups.gear,[1.7,5.9,side*6.9],[8.2,5.9,side*6.9],'white');beam(componentGroups.gear,[3.5,6.7,side*6.9],[5.1,9.1,side*6.1],'white');}
 // The winch drum pays out from its tangent; one connected cable reaches a hook.
 const winch=componentGroups.winch,drum=group('winch');drum.position.set(-3.5,16.2,7.8);
 beam(winch,[-5.4,14.6,5.2],[-5.4,17.2,8.8],'grey');beam(winch,[-1.6,14.6,5.2],[-1.6,17.2,8.8],'grey');beam(winch,[-5.4,17.2,8.8],[-1.6,17.2,8.8],'grey');
 cylinder(drum,[0,0,-.95],[0,0,.95],.7,'black');for(const z of [-1.02,1.02])cylinder(drum,[0,0,z-.08],[0,0,z+.08],1.08,'grey');
 const winding=[];for(let i=0;i<=80;i++){const a=i/80*TAU*6;winding.push(new T.Vector3(Math.cos(a)*.75,Math.sin(a)*.75,-.9+i/80*1.8));}add(drum,new T.TubeGeometry(new T.CatmullRomCurve3(winding),economy?60:100,.055,5,false),'dark');
 const rope=link(winch,'black');rope.geometry.dispose();rope.geometry=new T.CylinderGeometry(.055,.055,1,6);geometries.add(rope.geometry);
 const hook=group('winch');const hookCurve=new T.CatmullRomCurve3([new T.Vector3(0,.6,0),new T.Vector3(0,0,0),new T.Vector3(.1,-.55,0),new T.Vector3(.65,-.7,0),new T.Vector3(.98,-.4,0),new T.Vector3(.9,-.05,0)]);add(hook,new T.TubeGeometry(hookCurve,18,.14,7,false),'dark');torus(hook,[0,.7,0],.25,.1,'grey','z');
 // Movable links are deliberately excluded from static batching.
 const dynamic=new Set([frontCowl,rearCowl,fixedRing,rotatingRing,head,cap,tailSpinner,drum,hook,rope,...bladeGroups.flatMap(b=>[b.arm,b.hinge]),...pitchRods,...pitchJoints.flat(),...controlSticks,...collectiveLevers,...selectors,...replicaFans,...legs.map(x=>x.g),...cockpitDoors.map(x=>x.door),...slidingDoors.map(x=>x.slider),...frameCheeks.map(x=>x.cheek),...gears.map(x=>x.mesh),...supportRods.map(x=>x.rod)]);
 function mergeStatic(parent){for(const child of [...parent.children])if(child.isGroup)mergeStatic(child);const buckets=new Map();for(const m of [...parent.children])if(m.isMesh&&!dynamic.has(m)){const key=m.userData.component+':'+m.material.uuid;if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(m);}for(const list of buckets.values()){if(list.length<2)continue;const pos=[],norm=[],idx=[];let offset=0;for(const m of list){m.updateMatrix();const p=m.geometry.attributes.position,n=m.geometry.attributes.normal,normal=new T.Matrix3().getNormalMatrix(m.matrix),v=new T.Vector3();for(let i=0;i<p.count;i++){v.fromBufferAttribute(p,i).applyMatrix4(m.matrix);pos.push(v.x,v.y,v.z);v.fromBufferAttribute(n,i).applyMatrix3(normal).normalize();norm.push(v.x,v.y,v.z);}if(m.geometry.index)for(const i of m.geometry.index.array)idx.push(i+offset);else for(let i=0;i<p.count;i++)idx.push(i+offset);offset+=p.count;parent.remove(m);pickMeshes.splice(pickMeshes.indexOf(m),1);}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setAttribute('normal',new T.Float32BufferAttribute(norm,3));g.setIndex(idx);const m=add(parent,g,list[0].material.color.getHex());m.material=list[0].material;m.userData.originalMaterial=m.material;m.userData.component=list[0].userData.component;}}
 mergeStatic(root);
 let lastView='whole';
 function update(s,{view='whole',selected='whole'}={}){
  const explode=s.inspection,open=Math.max(s.cowl,Math.min(1,explode*2));frontCowl.position.set(-open*6,open*.45,0);rearCowl.position.set(open*6,open*.45,0);cap.position.y=23.5+explode*3;
  for(const {cheek,side}of frameCheeks)cheek.position.z=side*Math.max(0,explode-.35)*7;
  for(const {door,side}of cockpitDoors)door.rotation.y=side*s.doors*1.05;for(const {slider,side}of slidingDoors){slider.position.x=-6+s.doors*7.8;slider.position.z=side*(6.7+s.doors*.4);}
  fixedRing.position.set(mastX,H175_LAYOUT.swashY+(s.collective-.35)*.4,0);fixedRing.rotation.set(s.cyclicSide*.08,0,s.cyclicFore*.08,'ZXY');rotatingRing.position.copy(fixedRing.position);rotatingRing.quaternion.copy(fixedRing.quaternion).multiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),-s.angle));
  for(let i=0;i<5;i++){const b=bladeGroups[i],phase=s.angle+b.phase,k=bladeLinkage(phase,s);b.arm.rotation.y=-phase;b.hinge.rotation.x=-k.pitch;positionLink(pitchRods[i],k.lower,k.upper);pitchJoints[i][0].position.fromArray(k.lower);pitchJoints[i][1].position.fromArray(k.upper);}
  for(const {rod,phase}of supportRods){const p=new T.Vector3(Math.cos(phase)*1.8,0,Math.sin(phase)*1.8).applyQuaternion(fixedRing.quaternion).add(fixedRing.position),x=mastX+Math.cos(phase)*1.8,z=Math.sin(phase)*1.8,dy=Math.sqrt(Math.max(0,2.1**2-(p.x-x)**2-(p.z-z)**2));positionLink(rod,[x,p.y-dy,z],p.toArray());}
  head.rotation.y=-s.angle;cap.rotation.y=-s.angle;tailSpinner.rotation.z=s.angle*3;for(const fan of replicaFans)fan.rotation.x=s.angle*4;
  for(const {mesh,ratio,phase}of gears)mesh.rotation.y=s.motorAngle*ratio+phase;
  selectors[0].rotation.z=s.rotor==='off'?0:s.rotor==='slow'?-.4:.4;selectors[1].rotation.z=s.gearDrive==='neutral'?0:s.gearDrive==='raise'?-.4:.4;selectors[2].rotation.z=s.winchDrive==='neutral'?0:s.winchDrive==='raise'?-.4:.4;
  for(const g of controlSticks){g.rotation.z=-s.cyclicFore*.22;g.rotation.x=s.cyclicSide*.22;}for(const g of collectiveLevers)g.rotation.z=-.1-s.collective*.5;
  for(const {id,g,side}of legs){g.rotation.z=id==='nose'?s.gear*1.28:0;g.rotation.x=id==='nose'?0:side*s.gear*1.33;}
  drum.rotation.z=s.drumAngle;const length=1.3+s.winch*10,top=[-2.75,16.2,8.25],bottom=[-2.75,16.2-length,8.25];positionLink(rope,top,bottom);hook.position.set(...bottom);hook.position.y-=.8;
  const showingAll=view==='whole';componentGroups.whole.visible=showingAll;componentGroups.covers.visible=showingAll;frontCowl.visible=showingAll;rearCowl.visible=showingAll;tail.visible=showingAll;
  for(const {door}of cockpitDoors)door.visible=showingAll;for(const {slider}of slidingDoors)slider.visible=showingAll;
  componentGroups.rotor.visible=showingAll||view==='rotor';for(const g of [fixedRing,rotatingRing,head,cap,...bladeGroups.map(b=>b.arm)])g.visible=showingAll||view==='rotor';tailRotor.visible=showingAll;
  componentGroups.drive.visible=showingAll||view==='drive';replica.visible=showingAll||view==='drive';for(const {cheek}of frameCheeks)cheek.visible=showingAll||view==='drive';for(const p of selectors)p.visible=showingAll||view==='drive';
  componentGroups.gear.visible=showingAll||view==='gear';for(const {g}of legs)g.visible=showingAll||view==='gear';componentGroups.winch.visible=showingAll||view==='winch';drum.visible=showingAll||view==='winch';hook.visible=showingAll||view==='winch';
  // Rotor close-up keeps the head and links at working scale; long blade panels
  // are cropped by the camera, never rescaled or detached from their pitch hinge.
  lastView=view;root.updateMatrixWorld(true);
 }
 const viewBounds={whole:{center:[7.5,13,0],span:88,offset:[-48,30,68]},rotor:{center:[-2,21,0],span:11.5,offset:[-7,4.7,12]},drive:{center:[2.7,13.8,0],span:20,offset:[-12,11,21]},gear:{center:[-7,4.7,0],span:38,offset:[-20,13,36]},winch:{center:[-3.5,11,7.8],span:18,offset:[-9,6,17]}};
 return {root,components,pickMeshes,metrics:meshMetrics,viewBounds,update,mechanisms:{bladeGroups,pitchRods,pitchJoints,fixedRing,rotatingRing,legs,drum,rope,hook,gears,frontCowl,rearCowl,tailSpinner},dispose(){for(const g of geometries)g.dispose();for(const m of materials.values())m.dispose();root.clear();}};
}

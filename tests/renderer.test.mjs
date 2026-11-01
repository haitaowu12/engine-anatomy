// Real Three.js scene geometry, stubbed display/controls. This is not a pixel test.
import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {createAtlasRenderer} from '../src/renderer.js';
import {buildManifest} from '../src/manifest.js';
import {createPlantRunner,plantDefaults,observePlant} from '../src/plants.js';

class Element{constructor(){this.dataset={};this.style={};this.classList={add(){}};this.children=[];this.clientWidth=1200;this.clientHeight=700;}append(child){this.children.push(child);}replaceChildren(...children){this.children=children;}addEventListener(){}setAttribute(){}getBoundingClientRect(){return {left:0,top:0,width:this.clientWidth,height:this.clientHeight};}}
class Display{constructor(){this.domElement=new Element();}setPixelRatio(){}setClearColor(){}setSize(){}getContext(){return {getExtension:()=>null};}render(scene,camera){this.scene=scene;this.camera=camera;}dispose(){}}
globalThis.document={createElement:()=>new Element(),createElementNS:()=>new Element()};
globalThis.devicePixelRatio=1;
globalThis.ResizeObserver=class{observe(){}disconnect(){}};
const controls=camera=>({target:new T.Vector3(),update(){camera.lookAt(this.target);},dispose(){}});
const vector=object=>object.getWorldPosition(new T.Vector3()).toArray();
// Conservative radial bounds from the actual triangles, including all instance
// transforms and hidden section alternatives. Faces count, not just bore labels.
function radialBounds(root,ids,span){let min=Infinity,max=0,triangles=0;const point=new T.Vector3(),instance=new T.Matrix4(),matrix=new T.Matrix4();
  const distance=(a,b)=>{const dy=b.y-a.y,dz=b.z-a.z,t=Math.max(0,Math.min(1,-(a.y*dy+a.z*dz)/(dy*dy+dz*dz||1)));return Math.hypot(a.y+t*dy,a.z+t*dz);};
  const cross=(a,b,c)=>(b.y-a.y)*(c.z-a.z)-(b.z-a.z)*(c.y-a.y),origin={y:0,z:0};
  root.traverse(mesh=>{if(!mesh.isMesh||!ids.has(mesh.userData.id))return;const position=mesh.geometry.attributes.position,index=mesh.geometry.index;
    for(let inst=0;inst<(mesh.isInstancedMesh?mesh.count:1);inst++){
      matrix.copy(mesh.matrixWorld);if(mesh.isInstancedMesh){mesh.getMatrixAt(inst,instance);matrix.multiply(instance);}
      const vertices=Array.from({length:position.count},(_,i)=>point.fromBufferAttribute(position,i).applyMatrix4(matrix).clone());
      for(let i=0;i<(index?index.count:position.count);i+=3){const v=[0,1,2].map(j=>vertices[index?index.getX(i+j):i+j]);if(Math.max(...v.map(p=>p.x))<span[0]||Math.min(...v.map(p=>p.x))>span[1])continue;triangles++;
        max=Math.max(max,...v.map(p=>Math.hypot(p.y,p.z)));const signs=[cross(v[0],v[1],origin),cross(v[1],v[2],origin),cross(v[2],v[0],origin)],inside=Math.abs(cross(...v))>1e-12&&(signs.every(s=>s>=0)||signs.every(s=>s<=0));
        min=Math.min(min,inside?0:Math.min(distance(v[0],v[1]),distance(v[1],v[2]),distance(v[2],v[0])));
      }
    }
  });return {min,max,triangles};
}

for(const kind of ['helicopter','turboprop','turbofan'])test(`${kind}: staged inspection preserves real scene geometry and component identity`,()=>{
  const host=new Element(),display=new Display(),manifest=buildManifest(kind),runner=createPlantRunner(kind),u=plantDefaults(kind);
  const view=createAtlasRenderer(host,manifest,()=>{},{renderer:display,createControls:controls});
  const draw=()=>view.render(runner.state,observePlant(kind,runner.state,u),u,false);
  draw();const root=display.scene.children.find(o=>o.isGroup),parts=new Map();root.traverse(o=>{if(o.isGroup&&o.userData.id)parts.set(o.userData.id,o);});
  assert.deepEqual([...parts.keys()].sort(),manifest.nodes.map(n=>n.id).sort(),'every semantic component has geometry');
  const shafts=new Set(manifest.shafts.flatMap(s=>s.members)),fixed=new Map();
  root.traverse(o=>{if(o.isMesh&&(shafts.has(o.userData.id)||['bearings','compressor.stator','turbine.vanes'].includes(o.userData.id)))fixed.set(o,vector(o));});
  const sectors=[];root.traverse(o=>{if(o.userData.inspection)sectors.push(o);});assert.ok(sectors.length>=8);
  const cameraBefore=host.dataset.camera;
  for(const value of [.5,1]){view.setInspection(value);draw();assert.equal(host.dataset.camera,cameraBefore,'inspection does not move the camera');
    for(const [object,position]of fixed)assert.deepEqual(vector(object),position,'spool, bearing and fixed vane positions do not move');
    for(const sector of sectors){assert.ok(sector.userData.inspection.sweep<=Math.PI);assert.equal(sector.position.x,0);if(sector.userData.inspection.stage==='casing')assert.ok(sector.position.length()>2.7);else assert.equal(sector.position.length()>0,value>.5);}
    root.traverse(o=>{if(o.userData.closedCover)assert.equal(o.visible,false);});
  }
  view.select('combustor.casing');view.setIsolated(true);assert.equal(parts.get('combustor.casing').visible,true);assert.equal(parts.get('compressor.rotor').visible,false);view.setIsolated(false);
  view.traceShaft(manifest.shafts[0].id);draw();root.traverse(o=>{if(o.userData.inspectionGuide)assert.equal(o.visible,false,'a hidden air shell cannot leave a floating inspection guide');});view.setOverlay('anatomy');
  if(kind==='turbofan'){view.setEventHighlight('bypass');view.setInspection(0);draw();const pin=host.children.find(el=>el.className==='scene-pin event-pin'),original=[pin.style.left,pin.style.top];view.setInspection(1);draw();assert.notDeepEqual([pin.style.left,pin.style.top],original,'event label follows the displaced shell');view.setEventHighlight(null);}
  view.focus();draw();assert.equal(host.dataset.focused,'true');view.returnView();draw();assert.equal(host.dataset.camera,cameraBefore,'Return view restores the camera after shell focus');
  view.setInspection(0);draw();for(const sector of sectors)assert.deepEqual(sector.position.toArray(),[0,0,0]);
  view.setCutaway(false);view.setInspection(1);draw();root.traverse(o=>{if(o.userData.closedCover)assert.equal(o.visible,false);});view.setInspection(0);draw();root.traverse(o=>{if(o.userData.closedCover)assert.equal(o.visible,true);});
  view.setInspection(1);view.load(manifest);draw();assert.equal(host.dataset.inspection,'0','architecture load resets inspection');
  view.dispose();
});

for(const kind of ['turboprop','turbofan'])test(`${kind}: complete independent-spool swept envelopes clear throughout the overlap`,()=>{
  const host=new Element(),display=new Display(),manifest=buildManifest(kind),runner=createPlantRunner(kind),u=plantDefaults(kind),view=createAtlasRenderer(host,manifest,()=>{},{renderer:display,createControls:controls});
  const fan=kind==='turbofan',outerIds=new Set(manifest.shafts.find(s=>s.id===(fan?'hp':'gg')).members),innerIds=new Set(manifest.shafts.find(s=>s.id===(fan?'lp':'power')).members),span=[fan?-2.95:-4.2,2.06];
  for(const angle of [0,Math.PI/4,Math.PI/2]){
    runner.state.angleP=angle*250;runner.state.angleG=-angle*250;view.render(runner.state,observePlant(kind,runner.state,u),u,false);
    const root=display.scene.children.find(o=>o.isGroup),inner=radialBounds(root,innerIds,span),outer=radialBounds(root,outerIds,span);
    assert.ok(inner.triangles>0&&outer.triangles>0);assert.ok(inner.max<.079,`inner swept radius ${inner.max}; no collar/key may enter the outer shaft`);
    assert.ok(outer.min>.104,`outer bore face radius ${outer.min}; accessories and hubs must also clear the passage`);
    assert.ok(outer.min-inner.max>.025,'at least .025 schematic radial clearance across the full overlap');
  }
  view.dispose();
});

for(const kind of ['helicopter','turboprop','turbofan'])test(`${kind}: all details have real geometry and every target inspection returns exactly`,()=>{
 const host=new Element(),display=new Display(),m=buildManifest(kind),runner=createPlantRunner(kind),u=plantDefaults(kind),view=createAtlasRenderer(host,m,()=>{},{renderer:display,createControls:controls});const draw=()=>view.render(runner.state,observePlant(kind,runner.state,u),u,false);draw();const root=display.scene.children.find(o=>o.isGroup),meshes=[];root.traverse(o=>{if(o.isMesh)meshes.push(o);});
 for(const n of m.nodes.filter(n=>!m.nodes.some(c=>c.parentNodeId===n.id))){const physicalMeshes=meshes.filter(o=>o.userData.id===n.id&&!o.userData.circuit);if(n.representation==='interface')assert.equal(physicalMeshes.length,0,`${n.id} is an aircraft/system boundary, not a physical box beside the engine`);else assert.ok(physicalMeshes.reduce((sum,o)=>sum+o.geometry.attributes.position.count,0)>8,`${n.id} must have actual selectable construction`);}
 assert.ok(meshes.length<500,`batched scene has ${meshes.length} meshes; keep bounded draw overhead`);
 const positions=new Map();root.traverse(o=>positions.set(o,o.position.toArray()));const camera=host.dataset.camera;
 for(const recipe of m.recipes){view.setRecipe(recipe.id);view.setInspection(.5);draw();view.setInspection(1);draw();assert.equal(host.dataset.camera,camera);view.setInspection(0);draw();for(const [o,p]of positions)assert.deepEqual(o.position.toArray(),p,recipe.id+' exact reassembly');}
 view.select('compressor.stage.1.disc');view.setIsolated(true);draw();let visible=0;root.traverseVisible(o=>{if(o.isMesh){assert.equal(o.userData.id,'compressor.stage.1.disc');visible++;}});assert.ok(visible>0);view.setIsolated(false);
 view.setOverlay('services');view.setCircuit('oil');draw();root.traverse(o=>{if(o.userData.directionMarker)assert.equal(o.visible,['oil','breather'].includes(o.userData.circuit));});view.dispose();
});

test('combustor liner has through openings rather than ports painted over a solid wall',()=>{
 const host=new Element(),display=new Display(),m=buildManifest('turbofan'),runner=createPlantRunner('turbofan'),u=plantDefaults('turbofan'),view=createAtlasRenderer(host,m,()=>{},{renderer:display,createControls:controls});view.render(runner.state,observePlant('turbofan',runner.state,u),u,false);const root=display.scene.children.find(o=>o.isGroup),liner=[];root.traverse(o=>{if(o.isMesh&&o.userData.id==='combustor.liner')liner.push(o);});
 const ray=new T.Raycaster();ray.far=.3;for(const x of [-.48,.46])for(const i of [2,5,8]){const a=Math.PI*.7+(i+.5)/12*Math.PI*1.3,normal=new T.Vector3(0,Math.cos(a),Math.sin(a));ray.set(new T.Vector3(x,normal.y*1.1,normal.z*1.1),normal.clone().negate());const hits=ray.intersectObjects(liner);assert.ok(!hits.some(h=>Math.hypot(h.point.y,h.point.z)>.85),`air passes through liner at x ${x}`);}
 view.dispose();
});

for(const kind of ['helicopter','turboprop'])test(`${kind}: fixed-ring planetary reduction follows declared tooth kinematics`,()=>{
 const host=new Element(),display=new Display(),m=buildManifest(kind),runner=createPlantRunner(kind),u=plantDefaults(kind),view=createAtlasRenderer(host,m,()=>{},{renderer:display,createControls:controls});runner.state.angleP=250;view.render(runner.state,observePlant(kind,runner.state,u),u,false);const root=display.scene.children.find(o=>o.isGroup),gears=[];let carrier;root.traverse(o=>{if(o.userData.teeth)gears.push(o);if(o.userData.reduction)carrier=o;});const sun=gears.find(g=>g.userData.teeth===12),ring=gears.find(g=>g.userData.teeth===(kind==='helicopter'?132:108)),ratio=1+ring.userData.teeth/sun.userData.teeth;assert.equal(ratio,kind==='helicopter'?12:10);assert.equal(sun.rotation.x,1);assert.equal(ring.rotation.x,0);assert.equal(carrier.rotation.x,1/ratio);for(const p of gears.filter(g=>![sun,ring].includes(g)))assert.ok(Math.abs(p.rotation.x+12/p.userData.teeth*(1-1/ratio))<1e-12);view.dispose();
});

// SVGRenderer exposes render.faces but does not expose WebGL info.memory.
test('SVG diagnostics and paused-frame cache support the actual backend API shape',()=>{const host=new Element(),display=new Display();display.isSVGRenderer=true;display.info={render:{faces:100,vertices:300}};let frames=0;display.render=function(scene,camera){this.scene=scene;this.camera=camera;frames++};const original=globalThis.performance;let time=1000;globalThis.performance={now:()=>time};try{const m=buildManifest('turbofan'),runner=createPlantRunner('turbofan'),u=plantDefaults('turbofan'),view=createAtlasRenderer(host,m,()=>{},{renderer:display,createControls:controls}),draw=()=>view.render(runner.state,observePlant('turbofan',runner.state,u),u,false);draw();assert.equal(JSON.parse(host.dataset.performance).triangles,100);assert.equal(JSON.parse(host.dataset.performance).geometries,null);time+=500;draw();assert.equal(frames,1,'unchanged paused geometry needs no projection');view.select('combustor.liner');time+=500;draw();assert.equal(frames,2,'selection invalidates the projection');view.dispose();}finally{globalThis.performance=original;}});

for(const kind of ['helicopter','turboprop'])test(`${kind}: input sun passage and independently rotating carrier/output have real geometric clearance`,()=>{
 const host=new Element(),display=new Display(),m=buildManifest(kind),runner=createPlantRunner(kind),u=plantDefaults(kind),view=createAtlasRenderer(host,m,()=>{},{renderer:display,createControls:controls}),heli=kind==='helicopter',x=heli?5.4:-5.9,inputSpan=heli?[x-.25,x+.08]:[x-.08,x+.25];
 for(const angle of [0,.7,1.6]){runner.state.angleP=angle*250;view.render(runner.state,observePlant(kind,runner.state,u),u,false);const root=display.scene.children.find(o=>o.isGroup),input=radialBounds(root,new Set(['power.shaft']),[x-.08,x+.08]),sun=radialBounds(root,new Set(['reduction.sun']),[x-.08,x+.08]),carrier=radialBounds(root,new Set(['reduction.carrier','reduction']),inputSpan);assert.ok(input.triangles&&sun.triangles&&carrier.triangles);assert.ok(sun.min>input.max+.001,`sun bore ${sun.min} clears input envelope ${input.max}`);assert.ok(carrier.min>input.max+.1,`carrier/output ${carrier.min} cannot engulf independent input ${input.max}`);}
 view.dispose();
});

for(const kind of ['helicopter','turboprop'])test(`${kind}: pitch links stay attached to real blade roots at multiple pitch and azimuth states`,()=>{
 const host=new Element(),display=new Display(),m=buildManifest(kind),runner=createPlantRunner(kind),u=plantDefaults(kind),view=createAtlasRenderer(host,m,()=>{},{renderer:display,createControls:controls}),heli=kind==='helicopter';let previous;
 for(const [pitch,phase]of [[8,0],[20,.8],[32,1.7]]){runner.state.angleP=phase*250*(heli?12:10);const d=observePlant(kind,runner.state,u);d.bladeAngle=pitch;view.render(runner.state,d,u,false);const root=display.scene.children.find(o=>o.isGroup),links=[],roots=[];root.traverse(o=>{if(o.userData.mechanism===(heli?'collective-link':'prop-pitch-link'))links.push(o);if(o.userData.pitchRoot?.kind===(heli?'rotor':'propeller'))roots.push(o);});assert.equal(links.length,4);assert.equal(roots.length,4);
  for(const rod of links){const blade=roots.find(p=>p.userData.pitchRoot.angle===rod.userData.rootAngle),top=new T.Vector3(...(heli?[.15,0,.22]:[0,.15,.18])).applyMatrix4(blade.matrixWorld),rodTop=new T.Vector3(0,.5,0).applyMatrix4(rod.matrixWorld),rodBottom=new T.Vector3(0,-.5,0).applyMatrix4(rod.matrixWorld);assert.ok(top.distanceTo(rodTop)<1e-7,'actual rod end remains on moving pitch horn');assert.ok(Math.abs(rodTop.distanceTo(rodBottom)-(heli?1.25:.4))<1e-7,'rigid rod does not stretch');assert.ok(rodBottom.distanceTo(new T.Vector3(...rod.userData.linkFrom))<1e-7);}
  const endpoints=links.map(o=>o.userData.linkTo);if(previous)assert.notDeepEqual(endpoints,previous,'endpoints follow azimuth and pitch');previous=endpoints;
 }
 view.dispose();
});

test('helicopter downstream main and tail shafts clear the complete planetary sweep and each other',()=>{
 const host=new Element(),display=new Display(),m=buildManifest('helicopter'),runner=createPlantRunner('helicopter'),u=plantDefaults('helicopter'),view=createAtlasRenderer(host,m,()=>{},{renderer:display,createControls:controls});
 for(const phase of [0,Math.PI/2,Math.PI,Math.PI*1.5]){runner.state.angleP=phase*12*250;view.render(runner.state,observePlant('helicopter',runner.state,u),u,false);const root=display.scene.children.find(o=>o.isGroup),transmission=radialBounds(root,new Set(['reduction.sun','reduction.ring','reduction.planets','reduction.carrier','reduction.case']),[5.05,5.75]),downstream=radialBounds(root,new Set(['mast','tail.drive','tail.stepup']),[5.05,5.75]);assert.ok(transmission.triangles&&downstream.triangles);assert.ok(downstream.min-transmission.max>.2,`downstream ${downstream.min} must clear complete reduction envelope ${transmission.max}`);
  const zBounds=id=>{const boxes=[];root.traverse(o=>{if(o.isMesh&&o.userData.id===id){const b=new T.Box3().setFromObject(o);if(b.min.x<5&&b.max.x>1.3)boxes.push(b);}});return [Math.min(...boxes.map(b=>b.min.z)),Math.max(...boxes.map(b=>b.max.z))];};const main=zBounds('mast'),tail=zBounds('tail.drive');assert.ok(main[0]-tail[1]>.5,'different-speed longitudinal shafts must not occupy the same tube');const pair=[];root.traverse(o=>{if(o.userData.stepup)pair.push(o);});assert.equal(pair.length,2);assert.equal(pair[0].userData.stepup.teeth/pair[1].userData.stepup.teeth,4);assert.ok(Math.abs(pair[0].rotation.x*4+pair[1].rotation.x)<1e-8);
 }
 view.dispose();
});

for(const kind of ['helicopter','turboprop','turbofan'])test(`${kind}: installed view excludes aircraft interface proxies and distant aircraft context`,()=>{
 const host=new Element(),display=new Display(),m=buildManifest(kind),runner=createPlantRunner(kind),u=plantDefaults(kind),view=createAtlasRenderer(host,m,()=>{},{renderer:display,createControls:controls});view.select('compressor.stage.1.rotor');view.setPreset('installed');view.render(runner.state,observePlant(kind,runner.state,u),u,true);const root=display.scene.children.find(o=>o.isGroup),interfaces=new Set(m.nodes.filter(n=>n.representation==='interface').map(n=>n.id)),visible=[];
 root.traverse(o=>{if(o.isMesh)assert.ok(!interfaces.has(o.userData.id),'aircraft information/supplies are diagram boundaries, not physical proxies');});root.traverseVisible(o=>{if(o.isMesh)visible.push(o);});assert.ok(visible.some(o=>o.userData.id==='compressor.stage.1.rotor'));assert.ok(!visible.some(o=>o.userData.airframeContext),'context fuselage and far pod cannot obscure installed engine');
 for(const id of ['fuel.filter','oil.filter','oil.pressure','oil.scavenge','starter']){const n=m.nodes.find(n=>n.id===id);assert.ok(Math.hypot(n.anchor[1],n.anchor[2])<(kind==='turbofan'?3.5:2.3),id+' stays in the case/accessory mounting zone');assert.ok(n.anchor[0]>=-4&&n.anchor[0]<=3.5);}
 view.dispose();
});

for(const kind of ['turboprop','turbofan'])test(`${kind}: airframe has mirrored airfoil wings, tapered fuselage, paired tailplanes and both structural pylons`,()=>{
 const host=new Element(),display=new Display(),m=buildManifest(kind),runner=createPlantRunner(kind),u=plantDefaults(kind),view=createAtlasRenderer(host,m,()=>{},{renderer:display,createControls:controls});view.setPreset('aircraft');view.render(runner.state,observePlant(kind,runner.state,u),u,true);const features=new Map();display.scene.traverse(o=>{if(o.userData.airframeFeature)features.set(o.userData.airframeFeature,o);});const z=kind==='turboprop'?-8.8:-10;
 const wings=[features.get('wing--1'),features.get('wing-1')];assert.ok(wings.every(Boolean));const a=wings[0].geometry.attributes.position,b=wings[1].geometry.attributes.position;assert.equal(a.count,b.count);for(let i=0;i<a.count;i++){assert.ok(Math.abs(a.getX(i)-b.getX(i))<1e-5);assert.ok(Math.abs(a.getY(i)-b.getY(i))<1e-5);assert.ok(Math.abs(a.getZ(i)+b.getZ(i)-2*z)<1e-5,'true bilateral wing symmetry');}assert.ok(a.count>200);const wb=new T.Box3().setFromObject(wings[0]);assert.ok(wb.max.y-wb.min.y>.5,'airfoil has actual thickness and dihedral');
 for(const feature of ['fuselage','tailplane--1','tailplane-1','vertical-fin','pylon-0','pylon-'+(2*z),'context-engine-nacelle','retracted-gear-door'])assert.ok(features.has(feature),feature+' must have physical construction');
 const hull=features.get('fuselage').geometry.attributes.position;let widest=0,front=Infinity,rear=-Infinity;for(let i=0;i<hull.count;i++){widest=Math.max(widest,Math.abs(hull.getZ(i)-z));front=Math.min(front,hull.getX(i));rear=Math.max(rear,hull.getX(i));}assert.ok(rear-front>35);for(let i=0;i<hull.count;i++)if(Math.abs(hull.getX(i)-front)<1e-5||Math.abs(hull.getX(i)-rear)<1e-5)assert.ok(Math.abs(hull.getZ(i)-z)<widest*.1,'nose and tail taper rather than ending as an ellipsoid proxy');
 view.dispose();
});

test('helicopter mast and collective mechanism stand clear of the compressor and combustor',()=>{
 const host=new Element(),display=new Display(),m=buildManifest('helicopter'),runner=createPlantRunner('helicopter'),u=plantDefaults('helicopter'),view=createAtlasRenderer(host,m,()=>{},{renderer:display,createControls:controls});view.setPreset('aircraft');view.render(runner.state,observePlant('helicopter',runner.state,u),u,true);let vertical=0;display.scene.traverse(o=>{if(o.isMesh&&o.userData.id==='mast'){const b=new T.Box3().setFromObject(o);if(b.max.y>.5){vertical++;assert.ok(b.max.x<-5.8,'mast must not pierce the engine gas-path envelope');}}});assert.ok(vertical>0);for(const id of ['rotor','mast','swashplate','load.speed'])assert.equal(m.nodes.find(n=>n.id===id).anchor[0],-6.3);view.dispose();
});

test('external filter focus approaches the mounted side and gives an unobstructed component ray',()=>{
 for(const kind of ['helicopter','turboprop','turbofan']){const host=new Element(),display=new Display(),m=buildManifest(kind),runner=createPlantRunner(kind),u=plantDefaults(kind),view=createAtlasRenderer(host,m,()=>{},{renderer:display,createControls:controls});for(const id of ['oil.filter','fuel.filter']){view.select(id);view.focus();view.render(runner.state,observePlant(kind,runner.state,u),u,true);const n=m.nodes.find(n=>n.id===id),p=new T.Vector3(...n.anchor).project(display.camera),ray=new T.Raycaster();ray.setFromCamera(new T.Vector2(p.x,p.y),display.camera);const meshes=[];display.scene.traverseVisible(o=>{if(o.isMesh&&o.material.opacity>.2)meshes.push(o);});const hits=ray.intersectObjects(meshes,false);assert.ok(hits.length>0,id+' must be visible at its own anchor');assert.ok(hits[0].object.userData.id.startsWith(id),kind+' '+id+' should not be occluded by the engine casing');}view.dispose();}
});

for(const kind of ['turboprop','turbofan'])test(`${kind}: both wing surfaces face outward and each pylon physically meets its wing`,()=>{
 const host=new Element(),display=new Display(),m=buildManifest(kind),runner=createPlantRunner(kind),u=plantDefaults(kind),view=createAtlasRenderer(host,m,()=>{},{renderer:display,createControls:controls});view.setPreset('aircraft');view.setCutaway(false);view.render(runner.state,observePlant(kind,runner.state,u),u,true);const features=new Map();display.scene.traverse(o=>{if(o.userData.airframeFeature)features.set(o.userData.airframeFeature,o);});const wings=[features.get('wing--1'),features.get('wing-1')];
 for(const wing of wings){const normal=wing.geometry.attributes.normal,half=normal.count/2,mid=5*29+14;assert.ok(normal.getY(mid)>.6,'upper surface normal must face upward on either mirrored wing');assert.ok(normal.getY(half+mid)<-.6,'lower surface normal must face downward');}
 const z=kind==='turboprop'?-8.8:-10;for(const ez of [0,2*z]){const pylon=features.get('pylon-'+ez),a=pylon.userData.airfoil,top=a.root[1]+a.span,x=a.root[0]+a.sweep+a.tipChord*.45,ray=new T.Raycaster(new T.Vector3(x,top+3,ez),new T.Vector3(0,-1,0));const reverse=new T.Raycaster(new T.Vector3(x,top-3,ez),new T.Vector3(0,1,0)),hits=[...ray.intersectObjects(wings,false),...reverse.intersectObjects(wings,false)].map(h=>h.point.y);assert.ok(hits.length>=2,'pylon upper attachment lies within a real wing section');assert.ok(Math.max(...hits)>=top&&Math.min(...hits)<=top,'pylon must enter the wing volume, not stop below it');assert.ok(a.span<=1.3,'no oversized vertical slab between engine and wing');}
 const cowl=features.get('installed-nacelle'),other=features.get('context-engine-nacelle');assert.equal(cowl.visible,true);const a=cowl.geometry.attributes.position,b=other.geometry.attributes.position;assert.equal(a.count,b.count);for(let i=0;i<a.count;i++){assert.ok(Math.abs(a.getX(i)-b.getX(i))<1e-5);assert.ok(Math.abs(a.getY(i)-b.getY(i))<1e-5);assert.ok(Math.abs(a.getZ(i)-b.getZ(i)+2*z)<1e-5,'both engine pods have the same declared external envelope');}
 view.setCutaway(true);assert.equal(cowl.visible,false,'cutaway opens the studied aircraft cowling');view.setPreset('installed');assert.equal(cowl.visible,false,'engine assembly exposes the hardware inside');view.dispose();
});

test('helicopter closed cowling clears the mast and its open lateral exhaust ducts clear the reduction',()=>{
 const host=new Element(),display=new Display(),m=buildManifest('helicopter'),runner=createPlantRunner('helicopter'),u=plantDefaults('helicopter'),view=createAtlasRenderer(host,m,()=>{},{renderer:display,createControls:controls});view.setPreset('aircraft');view.setCutaway(false);view.render(runner.state,observePlant('helicopter',runner.state,u),u,true);const all=[];display.scene.traverse(o=>{if(o.isMesh)all.push(o);});const cowl=all.find(o=>o.userData.installationCover),cowlBounds=new T.Box3().setFromObject(cowl);assert.ok(cowl.visible,'closed whole-aircraft has an actual engine deck cowling');assert.ok(cowlBounds.min.x>m.nodes.find(n=>n.id==='mast').anchor[0]+.16+.4,'cowling leaves the real mast passage clear');
 const reduction=new T.Box3();for(const o of all.filter(o=>['reduction.case','reduction.sun','reduction.ring','reduction.planets','reduction.carrier'].includes(o.userData.id)))reduction.expandByObject(o);const branches=all.filter(o=>o.userData.exhaustBranch);assert.equal(branches.length,4,'two hollow ducts have separate outward and inward walls');for(const side of [-1,1]){const wall=branches.find(o=>o.userData.exhaustBranch.side===side&&o.userData.exhaustBranch.radius===.4),bounds=new T.Box3().setFromObject(wall),points=wall.userData.exhaustBranch.points,end=new T.Vector3(...points.at(-1)),direction=new T.Vector3(...points.at(-2)).sub(end).normalize();assert.ok(bounds.max.x<reduction.min.x-.05,'lateral discharge ducts stay axially ahead of every reduction part');assert.ok(Math.abs(end.z)>2.9,'outlet discharges outboard of the aft reduction');const ray=new T.Raycaster(end.clone().addScaledVector(direction,-.05),direction,.001,.45);assert.equal(ray.intersectObjects(all.filter(o=>o.userData.id==='exhaust')).length,0,'outlet is a hollow opening, not a closed-ended tube');}
 view.setCutaway(true);assert.equal(cowl.visible,false,'Cutaway removes the deck cowling');view.setCutaway(false);view.setPreset('installed');assert.equal(cowl.visible,false,'Engine assembly exposes actual engine hardware');view.dispose();
});

test('helicopter offset tail drive joins a centered long shaft inside the real tapering boom',()=>{
 const host=new Element(),display=new Display(),m=buildManifest('helicopter'),runner=createPlantRunner('helicopter'),u=plantDefaults('helicopter'),view=createAtlasRenderer(host,m,()=>{},{renderer:display,createControls:controls});view.setPreset('aircraft');view.render(runner.state,observePlant('helicopter',runner.state,u),u,true);const route=[],all=[];display.scene.traverse(o=>{if(o.isMesh)all.push(o);if(o.userData.tailDriveSegment&&!o.userData.tailDriveSegment.joint)route.push(o);});assert.equal(route.length,4);for(let i=0;i<route.length-1;i++)assert.deepEqual(route[i].userData.tailDriveSegment.to,route[i+1].userData.tailDriveSegment.from,'successive physical shafts meet at the declared joint');const centered=route.find(o=>o.userData.tailDriveSegment.from[0]===7.5),bounds=new T.Box3().setFromObject(centered),boom=all.find(o=>o.userData.airframeFeature==='tail-boom');assert.ok(Math.abs((bounds.min.z+bounds.max.z)/2)<1e-8,'long shaft lies on the boom centre line');
 for(const x of [12,20,28])for(const side of [-1,1]){const hits=new T.Raycaster(new T.Vector3(x,-2.5,side*5),new T.Vector3(0,0,-side)).intersectObject(boom);assert.ok(hits.length>0,'shaft location has real enclosing boom skin');assert.ok(Math.abs(hits[0].point.z)>Math.max(Math.abs(bounds.min.z),Math.abs(bounds.max.z))+.1,'full shaft radius clears the tapering boom skin');}assert.deepEqual(m.nodes.find(n=>n.id==='tail.drive').anchor,[17,-2.5,0]);view.dispose();
});

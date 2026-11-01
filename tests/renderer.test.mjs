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
 for(const n of m.nodes.filter(n=>!m.nodes.some(c=>c.parentNodeId===n.id)))assert.ok(meshes.some(o=>o.userData.id===n.id&&o.geometry.attributes.position.count>8&&!o.userData.circuit),`${n.id} must have actual selectable construction`);
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

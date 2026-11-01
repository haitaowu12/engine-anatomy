// Real Three.js scene geometry, stubbed display/controls. This is not a pixel test.
import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {createAtlasRenderer} from '../src/renderer.js';
import {buildManifest} from '../src/manifest.js';
import {createPlantRunner,plantDefaults,observePlant} from '../src/plants.js';

class Element{constructor(){this.dataset={};this.style={};this.children=[];this.clientWidth=1200;this.clientHeight=700;}append(child){this.children.push(child);}replaceChildren(...children){this.children=children;}addEventListener(){}setAttribute(){}getBoundingClientRect(){return {left:0,top:0,width:this.clientWidth,height:this.clientHeight};}}
class Display{constructor(){this.domElement=new Element();}setPixelRatio(){}setClearColor(){}setSize(){}getContext(){return {getExtension:()=>null};}render(scene,camera){this.scene=scene;this.camera=camera;}dispose(){}}
globalThis.document={createElement:()=>new Element()};
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
  draw();const root=display.scene.children.find(o=>o.isGroup),parts=new Map(root.children.filter(o=>o.userData.id).map(o=>[o.userData.id,o]));
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

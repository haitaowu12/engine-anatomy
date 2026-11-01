// Exercise the pinned SVG projection code with the actual authored skins.
// These tests check hidden-face and opening geometry, not browser pixels.
import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {Projector} from 'three/addons/renderers/Projector.js';
import {buildAirframeGeometry,AIRFRAME_LAYOUT} from '../src/airframe-geometry.js';
import {createAtlasRenderer} from '../src/renderer.js';
import {buildManifest} from '../src/manifest.js';
import {createPlantRunner,plantDefaults,observePlant} from '../src/plants.js';

function build(kind,lowDetail){
 const scene=new T.Scene(),meshes=[];
 const mesh=(id,geometry,color,position=[0,0,0],extra={})=>{
  const object=new T.Mesh(geometry,new T.MeshStandardMaterial({color,...extra}));
  object.position.set(...position);object.userData.id=id;scene.add(object);meshes.push(object);return object;
 };
 const cylinder=(id,a,b,r,color,r2=r)=>{
  const from=new T.Vector3(...a),to=new T.Vector3(...b),direction=to.clone().sub(from);
  const object=mesh(id,new T.CylinderGeometry(r2,r,direction.length(),lowDetail?12:32),color,from.add(to).multiplyScalar(.5).toArray());
  object.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),direction.normalize());return object;
 };
 const pipe=(id,points,color,r)=>mesh(id,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),lowDetail?16:36,r,lowDetail?4:6,false),color);
 const box=(id,position,size,color)=>mesh(id,new T.BoxGeometry(...size),color,position);
 buildAirframeGeometry({T,C:{silver:0xb0c2c6},mesh,cylinder,pipe,box,lowDetail},{kind});
 const layout=AIRFRAME_LAYOUT[kind],camera=new T.OrthographicCamera(-45,45,30,-30,.1,300);
 camera.position.set(...layout.center).add(new T.Vector3(...layout.camera));camera.lookAt(new T.Vector3(...layout.center));
 scene.updateMatrixWorld(true);camera.updateMatrixWorld(true);
 return {scene,meshes,camera,dispose(){for(const object of meshes){object.geometry.dispose();object.material.dispose();}}};
}

const loftFeatures=new Set(['fuselage','tail-boom','transmission-fairing','installed-nacelle','context-engine-nacelle','context-prop-spinner']);
for(const lowDetail of [true,false])for(const kind of ['helicopter','turboprop','turbofan'])test(`${kind} ${lowDetail?'SVG':'full'} geometry: SVG projection culls reverse faces of closed aircraft skins`,()=>{
 const {scene,meshes,camera,dispose}=build(kind,lowDetail);
 try{
  const skins=meshes.filter(o=>o.userData.airfoil||loftFeatures.has(o.userData.airframeFeature)),ids=new Set(skins.map(o=>o.id));
  assert.ok(skins.length>=7,'exercise the fuselage, cowl and multiple actual tail/wing surfaces');
  const projector=new Projector(),towardCamera=camera.getWorldDirection(new T.Vector3()).negate();
  const faces=()=>projector.projectScene(scene,camera,true,true).elements.filter(face=>ids.has(face.id)&&face.normalModel);
  const actual=faces();assert.ok(actual.length>1000,'real tessellated surfaces must be projected');
  for(const face of actual)assert.ok(face.normalModel.dot(towardCamera)>=-1e-8,'a reverse skin face must not paint over the camera-facing shell');
  // A sensitivity check proves that this assertion detects the reported
  // failure: identical geometry rendered two-sided emits reverse-lit faces.
  for(const object of skins)object.material.side=T.DoubleSide;
  const counterfactual=faces(),reverse=counterfactual.filter(face=>face.normalModel.dot(towardCamera)<-1e-8);
  assert.ok(reverse.length>1000,'the same two-sided skins reproduce the unwanted back-face projection');
 }finally{dispose();}
});

for(const lowDetail of [true,false])test(`helicopter ${lowDetail?'SVG':'full'} geometry: both lateral exhaust openings pass through the closed deck cowling`,()=>{
 const {meshes,dispose}=build('helicopter',lowDetail);
 try{
  const cover=meshes.find(o=>o.userData.installationCover);assert.ok(cover);
  for(const side of [-1,1]){
   for(const x of [3.43,3.59,3.75,3.91,4.07])for(const y of [.1,.26,.42,.58,.74,.9]){
    const ray=new T.Raycaster(new T.Vector3(x,y,side*4),new T.Vector3(0,0,-side),0,3);
    assert.equal(ray.intersectObject(cover).length,0,`the outlet aperture must be open at (${x}, ${y}), side ${side}`);
   }
   // Adjacent rays hit the shell, so passing the aperture cannot be explained
   // by a missing cover, reversed normals or an overlarge removed side wall.
   for(const x of [2.5,5]){
    const ray=new T.Raycaster(new T.Vector3(x,.45,side*4),new T.Vector3(0,0,-side),0,3);
    assert.ok(ray.intersectObject(cover).length>0,'intact side skin remains beside each port');
   }
  }
 }finally{dispose();}
});

class Element{
 constructor(){this.dataset={};this.style={};this.classList={add(){}};this.children=[];this.clientWidth=1200;this.clientHeight=700;}
 append(child){this.children.push(child);}replaceChildren(...children){this.children=children;}
 addEventListener(){}setAttribute(){}getBoundingClientRect(){return {left:0,top:0,width:1200,height:700};}
}
class Display{
 constructor(){this.domElement=new Element();this.isSVGRenderer=true;this.info={render:{faces:0}};}
 setPixelRatio(){}setClearColor(){}setSize(){}getContext(){return {getExtension:()=>null};}
 render(scene,camera){this.scene=scene;this.camera=camera;}dispose(){}
}
function productionScene(kind){
 const previous={document:globalThis.document,devicePixelRatio:globalThis.devicePixelRatio,ResizeObserver:globalThis.ResizeObserver};
 globalThis.document={createElement:()=>new Element(),createElementNS:()=>new Element()};globalThis.devicePixelRatio=1;
 globalThis.ResizeObserver=class{observe(){}disconnect(){}};
 const display=new Display(),m=buildManifest(kind),state=createPlantRunner(kind).state,u=plantDefaults(kind);
 const view=createAtlasRenderer(new Element(),m,()=>{},{renderer:display,createControls:camera=>({target:new T.Vector3(),update(){camera.lookAt(this.target);},dispose(){}})});
 view.setPreset('aircraft');view.setCutaway(false);view.render(state,observePlant(kind,state,u),u,true);
 return {view,scene:display.scene,camera:display.camera,dispose(){view.dispose();Object.assign(globalThis,previous);}};
}
function containsPoint(x,y,a,b,c){
 const area=(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);if(Math.abs(area)<1e-12)return false;
 const u=((b.x-x)*(c.y-y)-(b.y-y)*(c.x-x))/area,v=((c.x-x)*(a.y-y)-(c.y-y)*(a.x-x))/area;
 return u>1e-6&&v>1e-6&&u+v<1-1e-6;
}
for(const kind of ['helicopter','turboprop','turbofan'])test(`${kind}: closed aircraft cowl wins actual SVG painter ordering and internal surfaces return for inspection`,()=>{
 const {view,scene,camera,dispose}=productionScene(kind);
 try{
  const visible=[],all=[];scene.traverse(o=>{if(o.isMesh)all.push(o);});scene.traverseVisible(o=>{if(o.isMesh)visible.push(o);});
  const cowl=visible.find(o=>o.userData.installationCover),enclosed=all.filter(o=>o.userData.enclosedByCowling);assert.ok(cowl);assert.ok(enclosed.length>5);
  assert.ok(enclosed.every(o=>!o.visible),'closed aircraft omits the enclosed shell alternatives');
  const objects=new Map(visible.map(o=>[o.id,o])),faces=new Projector().projectScene(scene,camera,true,true).elements.filter(f=>f.normalModel),cowlFaces=faces.filter(f=>f.id===cowl.id);
  let samples=0;const overpainted=[];
  for(let i=2;i<cowlFaces.length;i+=17){
   const face=cowlFaces[i],x=(face.v1.positionScreen.x+face.v2.positionScreen.x+face.v3.positionScreen.x)/3,y=(face.v1.positionScreen.y+face.v2.positionScreen.y+face.v3.positionScreen.y)/3;
   const ray=new T.Raycaster();ray.setFromCamera(new T.Vector2(x,y),camera);
   // Only test points where real geometry says the nacelle is in front.
   // Other aircraft surfaces can legitimately cover parts of the nacelle.
   if(ray.intersectObjects(visible,false)[0]?.object!==cowl)continue;
   samples++;
   const last=faces.findLast(f=>containsPoint(x,y,f.v1.positionScreen,f.v2.positionScreen,f.v3.positionScreen));
   if(last?.id!==cowl.id){const object=objects.get(last?.id);overpainted.push(object?.userData.airframeFeature||object?.userData.id||'missing face');}
  }
  assert.ok(samples>=25,'sample a distributed set of visible cowl points');
  assert.deepEqual(overpainted,[],'SVG painter output must agree with nearest-surface geometry at the sampled cowl points');
  const shells=enclosed.filter(o=>!o.userData.closedCover);
  view.setCutaway(true);assert.equal(cowl.visible,false);assert.ok(shells.every(o=>o.visible),'Cutaway restores internal instructional shells');
  view.setCutaway(false);view.setPreset('installed');assert.ok(enclosed.filter(o=>!o.userData.airframeContext).every(o=>o.visible),'Engine assembly restores both closed cases and internal engine surfaces');
  view.setPreset('aircraft');view.setInspection(.5);assert.equal(cowl.visible,false);assert.ok(shells.every(o=>o.visible),'staged inspection restores the internal surfaces');
  view.setInspection(0);view.select('inlet');view.setIsolated(true);assert.ok(shells.some(o=>o.userData.id==='inlet'&&o.visible),'component isolation restores the selected inlet geometry');
  view.setIsolated(false);view.setOverlay('shafts');assert.ok(shells.some(o=>o.visible),'shaft explanation can show its surrounding section surfaces');
 }finally{dispose();}
});

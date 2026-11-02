import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {ColorfiguresRenderer,prepareColorfiguresGeometry} from '../src/colorfigures-renderer.js';

class Element{
 constructor(){this.dataset={};this.style={};this.width=300;this.height=150;this.context={setTransform(){},fillRect(){},setLineDash(){},fill(){this.fills=(this.fills||0)+1;},stroke(){}};}
 setAttribute(){}replaceChildren(){}getContext(){return this.context;}
}
globalThis.document={createElement:()=>new Element(),createElementNS:()=>new Element()};
globalThis.Path2D=class{constructor(path){assert(!/NaN|Infinity/.test(path));this.path=path;}};
const camera=()=>{const c=new T.OrthographicCamera(-4,4,3,-3,.1,30);c.position.set(0,0,10);c.lookAt(0,0,0);return c;};

test('coplanar triangles form six box faces without internal triangle ink',()=>{
 const g=prepareColorfiguresGeometry(new T.BoxGeometry(2,4,6));assert.equal(g.faces.length,6);assert(g.faces.every(f=>f.loops.length===1&&f.loops[0].length===4));
});
test('perforated caps retain their real inner boundary',()=>{
 const shape=new T.Shape();shape.moveTo(-2,-2);shape.lineTo(2,-2);shape.lineTo(2,2);shape.lineTo(-2,2);shape.closePath();const hole=new T.Path();hole.absarc(0,0,.7,0,Math.PI*2,true);shape.holes.push(hole);
 const g=prepareColorfiguresGeometry(new T.ExtrudeGeometry(shape,{depth:.2,bevelEnabled:false,curveSegments:6}));assert.equal(g.faces.filter(f=>f.loops.length===2).length,2);
});
test('face depth, translucent material and always-visible dashed paths survive the adapter',()=>{
 const scene=new T.Scene(),far=new T.Mesh(new T.PlaneGeometry(2,2),new T.MeshBasicMaterial({color:0x0000ff})),near=new T.Mesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({color:0xff0000,transparent:true,opacity:.4}));near.position.z=1;scene.add(near,far);
 const line=new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(-1,0,-1),new T.Vector3(1,0,-1)]),new T.LineDashedMaterial({color:0x00ff00,depthTest:false}));scene.add(line);
 const r=new ColorfiguresRenderer({raster:false});r.setSize(800,600);r.render(scene,camera());const svg=r.domElement.innerHTML;
 assert(svg.indexOf('#0000ff')<svg.indexOf('#ff0000'));assert(svg.includes('opacity="0.4"'));assert(svg.lastIndexOf('#00ff00')>svg.indexOf('#ff0000'));assert(svg.includes('stroke-dasharray="5 4"'));assert(!/NaN|Infinity/.test(svg));
});
test('instance transforms reach both drawing surfaces, and unchanged sizing preserves the canvas',()=>{
 const scene=new T.Scene(),mesh=new T.InstancedMesh(new T.BoxGeometry(1,1,1),new T.MeshBasicMaterial({color:0xffb829}),2);mesh.setMatrixAt(0,new T.Matrix4().makeTranslation(-2,0,0));mesh.setMatrixAt(1,new T.Matrix4().makeTranslation(2,0,0));scene.add(mesh);
 for(const raster of [false,true]){const r=new ColorfiguresRenderer({raster});r.setSize(800,600);r.render(scene,camera());assert.equal(r.info.memory.geometries,2);assert.equal(r.info.render.faces,2);if(raster){assert.equal(r.context.fills,2);const widths=[];let width=r.domElement.width;Object.defineProperty(r.domElement,'width',{get:()=>width,set:v=>{widths.push(v);width=v;}});r.setSize(800,600);assert.deepEqual(widths,[]);}else{assert(r.domElement.innerHTML.includes('150.0'));assert(r.domElement.innerHTML.includes('650.0'));}}
});

test('retained drawing paths update with camera, selection material, geometry and motion',()=>{
 const scene=new T.Scene(),mesh=new T.Mesh(new T.BoxGeometry(1,1,1),new T.MeshBasicMaterial({color:0x113355}));scene.add(mesh);
 const r=new ColorfiguresRenderer({raster:false}),c=camera();r.render(scene,c);const original=r.domElement.innerHTML;
 r.render(scene,c);assert.equal(JSON.parse(r.domElement.dataset.renderStats).reused,1);assert.equal(r.domElement.innerHTML,original);
 for(const change of [()=>{mesh.position.x=1;},()=>{mesh.material.color.setHex(0xff0000);},()=>{mesh.geometry=new T.BoxGeometry(2,2,2);},()=>{c.position.x=2;c.lookAt(0,0,0);},()=>{mesh.material.opacity=.4;}]){
  const before=r.domElement.innerHTML;change();r.render(scene,c);assert.equal(JSON.parse(r.domElement.dataset.renderStats).reused,0);assert.notEqual(r.domElement.innerHTML,before);
 }
 mesh.visible=false;r.render(scene,c);assert.equal(r.info.render.faces,0);assert.equal(r.domElement.innerHTML,'');
});

function fillAt(svg,x,y){
 let result;
 for(const match of svg.matchAll(/<path d="([^"]+)" fill="(#[a-f0-9]+)"/g)){
  let inside=false;
  for(const subpath of match[1].split('M').filter(Boolean)){
   const values=subpath.match(/-?\d+(?:\.\d+)?/g).map(Number),points=[];
   for(let i=0;i<values.length;i+=2)points.push([values[i],values[i+1]]);
   for(let i=0,j=points.length-1;i<points.length;j=i++){
    const [a,b]=points[i],[c,d]=points[j];
    if((b>y)!==(d>y)&&x<(c-a)*(y-b)/(d-b)+a)inside=!inside;
   }
  }
  if(inside)result=match[2];
 }
 return result;
}

test('broad surfaces preserve physical occlusion from both sides after camera and part motion',()=>{
 const scene=new T.Scene(),group=new T.Group();scene.add(group);
 const floor=new T.Mesh(new T.BoxGeometry(12,.2,8),new T.MeshBasicMaterial({color:0x0000ff}));
 const part=new T.Mesh(new T.BoxGeometry(.8,.8,.8),new T.MeshBasicMaterial({color:0xff0000}));
 group.add(floor,part);const r=new ColorfiguresRenderer({raster:false});r.setQuality('detail');r.setSize(800,600);
 for(const rotation of [0,Math.PI/2])for(const perspective of [false,true])for(const y of [7,-7]){
  group.rotation.x=rotation;
  const c=perspective?new T.PerspectiveCamera(38,4/3,.1,100):new T.OrthographicCamera(-8,8,6,-6,.1,100);
  c.position.set(8,y,9).applyAxisAngle(new T.Vector3(1,0,0),rotation);c.lookAt(0,0,0);c.updateMatrixWorld(true);
  for(const height of [.7,-.7,.7]){
   part.position.set(-3,height,-2);group.updateMatrixWorld(true);
   r.render(scene,c);const point=part.getWorldPosition(new T.Vector3()).project(c),ray=new T.Raycaster();
   ray.setFromCamera(new T.Vector2(point.x,point.y),c);const hit=ray.intersectObjects([floor,part],false)[0];
   const color=fillAt(r.domElement.innerHTML,(point.x+1)*400,(1-point.y)*300);
   assert(color,'the projected target must be painted');
   const red=parseInt(color.slice(1,3),16)>parseInt(color.slice(5,7),16);
   assert.equal(red,hit.object===part,`physical foreground disagrees at rotation ${rotation}, height ${height}, camera ${y}, perspective ${perspective}`);
  }
 }
 r.dispose();
});

test('approaching a face clips its near corner without dropping the visible surface or ink',()=>{
 const scene=new T.Scene(),mesh=new T.Mesh(new T.PlaneGeometry(8,5),new T.MeshBasicMaterial({color:0xff0000,side:T.DoubleSide}));
 mesh.rotation.y=Math.PI/3;scene.add(mesh);
 const c=new T.PerspectiveCamera(45,4/3,.25,30);c.position.set(0,0,2);c.lookAt(0,0,0);
 for(const raster of [false,true]){
  const r=new ColorfiguresRenderer({raster});r.setQuality('detail');r.setSize(800,600);r.render(scene,c);
  if(raster)assert(r.context.fills>0,'visible geometry must reach the canvas');
  else{
   assert(!/NaN|Infinity/.test(r.domElement.innerHTML));
   const color=fillAt(r.domElement.innerHTML,400,300);
   assert(color&&parseInt(color.slice(1,3),16)>0,'the surface intersected by the central ray must remain painted');
  }
  r.dispose();
 }
});

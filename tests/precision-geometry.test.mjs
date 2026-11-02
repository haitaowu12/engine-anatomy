import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {bevelledBox,flangeGeometry} from '../src/precision-geometry.js';

test('Manufactured edge bevels preserve the specified outer envelope',()=>{
 for(const size of [[.95,.28,.65],[.6,.4,.35],[1.1,.12,.17]]){
  const geometry=bevelledBox(T,size);geometry.computeBoundingBox();const actual=geometry.boundingBox.getSize(new T.Vector3()).toArray();
  for(let i=0;i<3;i++)assert(Math.abs(actual[i]-size[i])<1e-6,`Bevel enlarged axis ${i}: ${actual[i]} / ${size[i]}`);
  assert(geometry.attributes.position.count>24,'A sharp-edged box cannot satisfy this feature');
  for(const value of geometry.attributes.normal.array)assert(Number.isFinite(value));geometry.dispose();
 }
});

test('Chamfered shaft flanges retain a real through bore and bearing surfaces',()=>{
 const g=flangeGeometry(T,.16,.5,.14),mesh=new T.Mesh(g,new T.MeshBasicMaterial({side:T.DoubleSide}));mesh.updateMatrixWorld();
 const ray=new T.Raycaster(new T.Vector3(0,1,0),new T.Vector3(0,-1,0));assert.equal(ray.intersectObject(mesh).length,0,'Flange obstructed the independent shaft passage');
 ray.set(new T.Vector3(.3,1,0),new T.Vector3(0,-1,0));assert(ray.intersectObject(mesh).length>=2,'Annulus lost its front/back surfaces');
 g.computeBoundingBox();assert(Math.abs(g.boundingBox.max.y-.07)<1e-7);assert(Math.abs(g.boundingBox.min.y+.07)<1e-7);g.dispose();mesh.material.dispose();
});

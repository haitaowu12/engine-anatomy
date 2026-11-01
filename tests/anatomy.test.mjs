import test from 'node:test';
import assert from 'node:assert/strict';
import {buildManifest,SOURCES} from '../src/manifest.js';
import {descendants,ancestors} from '../src/anatomy.js';
import {learningPaths,relationHTML,powerBalance,ALTERNATIVES,alternativeDiagram} from '../src/learning.js';
import {createPlantRunner,plantDefaults,observePlant} from '../src/plants.js';
for(const kind of ['helicopter','turboprop','turbofan']){
 test(`${kind}: detail concepts, instances, containment and every educational route resolve`,()=>{
  const m=buildManifest(kind),ids=new Set(m.nodes.map(n=>n.id));assert.equal(ids.size,m.nodes.length);
  for(const n of m.nodes){assert.ok(SOURCES[n.source],`${n.id} source`);assert.ok(n.concept);assert.equal(n.instance,kind+':'+n.id);assert.ok(m.assemblies.some(a=>a.id===n.parent&&a.group===n.group),`${n.id} navigation assembly`);const chain=new Set([n.id]);let p=n;while(p.parentNodeId){assert.ok(ids.has(p.parentNodeId),`${n.id} parent`);assert.ok(!chain.has(p.parentNodeId),`${n.id} acyclic`);chain.add(p.parentNodeId);p=m.nodes.find(x=>x.id===p.parentNodeId);}assert.ok(descendants(m,p.id).has(n.id));assert.equal(ancestors(m,n.id).length,chain.size-1);}
  for(const e of m.edges){assert.ok(ids.has(e.from)&&ids.has(e.to),e.id);assert.ok(['mechanical','load','gas','signal','actuation','fuel','service','electrical'].includes(e.type));}
  for(const recipe of m.recipes){assert.ok(ids.has(recipe.target));assert.equal(recipe.stages.length,2);for(const id of recipe.shells)assert.ok(ids.has(id));}
  for(const lesson of learningPaths(m)){assert.ok(SOURCES[lesson.source]);for(const step of lesson.steps){assert.ok(ids.has(step[0]),lesson.id+':'+step[0]);assert.ok(step[1]&&step[2]);}}
  for(const [name,route]of Object.entries(m.circuits))for(const r of [route,...m.circuitBranches[name]])for(let i=0;i<r.length-1;i++)assert.ok(m.edges.some(e=>e.from===r[i]&&e.to===r[i+1]),name+':'+r[i]);
  assert.ok(m.circuits.breather.includes('oil.vent'));assert.ok(m.circuitBranches.breather.some(r=>r.at(-1)==='oil.tank'));
  assert.equal(m.nodes.find(n=>n.id==='starter').mechanism,kind==='turbofan'?'air-starter':'motor');
  for(const view of ['anatomy','gas','control','services'])for(const n of m.nodes){const html=relationHTML(m,view,'fuel',n.id);assert.ok(!html.includes('undefined'),view+':'+n.id);}
 });
 test(`${kind}: displayed work balances reproduce the actual running plant without additional dynamics`,()=>{
  const runner=createPlantRunner(kind),u=plantDefaults(kind);u.demand=.7;runner.advance(.4,u);const d=observePlant(kind,runner.state,u),balances=powerBalance(d,runner.state);for(const b of balances){assert.ok(Number.isFinite(b.drive)&&b.drive>0);assert.ok(Math.abs(b.drive-b.resist-b.kinetic)<1e-7);}
 });
}
test('architecture alternatives are explicit source-backed diagrams',()=>{for(const item of ALTERNATIVES){assert.ok(SOURCES[item.source]);assert.match(alternativeDiagram(item.id),/role="img"/);}});

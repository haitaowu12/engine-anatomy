import test from 'node:test';
import assert from 'node:assert/strict';
import {buildManifest,SOURCES} from '../src/manifest.js';
import {interfaceRoute} from '../src/installation.js';
import {systemDiagramHTML} from '../src/system-diagram.js';
import {learningPaths} from '../src/learning.js';
for(const kind of ['helicopter','turboprop','turbofan'])test(`${kind}: every component has a declared representation and remote boundaries remain connected in the 2D learning views`,()=>{
 const m=buildManifest(kind);for(const n of m.nodes){assert.ok(['physical','assembly','interface'].includes(n.representation),n.id);assert.ok(n.location&&n.locationNote,n.id);assert.ok(SOURCES[n.source],n.id+' source');}
 for(const n of m.nodes.filter(n=>n.representation==='interface')){const route=interfaceRoute(m,n.id);assert.ok(['control','services'].includes(route.lens));const html=systemDiagramHTML(m,route.lens,route.circuit||'fuel',n.id);assert.ok(html.includes(n.name.replaceAll('&','&amp;')),n.id+' remains readable/selectable as a boundary');assert.ok(html.includes('diagram only'));assert.ok(!html.includes('id="diagram-inspect"'),'remote interfaces cannot request fake physical inspection');}
 for(const [circuit,route]of Object.entries(m.circuits)){const html=systemDiagramHTML(m,'services',circuit,route[0]);for(const id of route)assert.ok(html.includes('data-node="'+id+'"'),id+' appears in '+circuit);for(const branch of m.circuitBranches[circuit]||[])for(const id of branch)assert.ok(html.includes('data-node="'+id+'"'),id+' appears in branch');}
 for(const lesson of learningPaths(m))for(const [id]of lesson.steps)assert.ok(m.nodes.some(n=>n.id===id),lesson.id+' step remains navigable');
 const far=m.nodes.find(n=>n.id==='airframe.companion');if(kind!=='helicopter')assert.ok(far.explanation.includes('not separately simulated'));
});

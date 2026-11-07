import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fanThermodynamics} from '../src/plants.js';
import {P} from '../src/simulation.js';

// The published studies are self-contained bundles. Exercise their embedded
// plant so a source correction cannot leave the independently shipped pages stale.
function bundledFanThermodynamics(html){
 const marker=html.indexOf('coreThrust:');
 assert.ok(marker>=0,'the bundle contains the turbofan plant');
 const start=html.lastIndexOf('function ',marker);
 const bodyStart=html.indexOf('{',start);
 let depth=1,end=bodyStart+1;
 while(depth&&end<html.length){if(html[end]==='{')depth++;if(html[end]==='}')depth--;end++;}
 assert.equal(depth,0,'the embedded thermodynamic function is complete');
 const source=html.slice(start,end);
 const constants=source.match(/([A-Za-z_$][\w$]*)\.LHV/);
 assert.ok(constants,'the embedded function uses the shared thermodynamic constants');
 return new Function(constants[1],`return (${source});`)(P);
}

for(const kind of ['turboshaft','turboprop','turbofan']){
 test(`${kind} study: embedded thrust calculation matches the current plant`,()=>{
  const html=readFileSync(new URL(`../design/realistic-engine/${kind}-study.html`,import.meta.url),'utf8');
  const compiled=bundledFanThermodynamics(html);
  for(const wg of [850,1200])for(const wp of [350,525])for(const fuel of [.014,.065])for(const airspeed of [0,60,160]){
   const state={wg,wp,fuel},inputs={ambientT:288,airspeed};
   const actual=compiled(state,inputs),expected=fanThermodynamics(state,inputs);
   assert.deepEqual(actual,expected,`${kind}: wg=${wg}, wp=${wp}, fuel=${fuel}, airspeed=${airspeed}`);
  }
 });
}

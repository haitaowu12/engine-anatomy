import test from 'node:test';
import assert from 'node:assert/strict';
import {DT,GEAR,plantDefaults,initialPlant,observePlant,stepPlant,createPlantRunner,fanThermodynamics} from '../src/plants.js';
import {buildManifest,SOURCES} from '../src/manifest.js';
import {trialInputs,nearGovernedEquilibrium} from '../src/lessons.js';
const kinds=['helicopter','turboprop','turbofan'];
const near=(a,b,tol)=>assert.ok(Math.abs(a-b)<=tol,`${a} versus ${b}; tolerance ${tol}`);
const run=(kind,s,u,seconds,dt=DT)=>{for(let i=0;i<Math.round(seconds/dt);i++)s=stepPlant(kind,s,u,dt);return s;};
test('turbofan: incoming momentum uses air mass only, while outgoing momentum includes fuel',()=>{
 const initial=initialPlant('turbofan');
 for(const fuel of [.014,.04,.065]){
  const s={...initial,fuel},u=plantDefaults('turbofan');
  const still=fanThermodynamics(s,{...u,airspeed:0});
  const slow=fanThermodynamics(s,{...u,airspeed:60});
  const fast=fanThermodynamics(s,{...u,airspeed:160});
  near(still.coreThrust,still.gas*still.coreV,1e-9);
  // With inlet total conditions held fixed, only incoming air momentum changes.
  // Fuel arrives from the aircraft tank, so it adds no freestream ram-drag term.
  near(fast.coreThrust-slow.coreThrust,-100*still.air,1e-9);
  near((fast.coreThrust+fast.bypassThrust)-(slow.coreThrust+slow.bypassThrust),-100*still.total,1e-9);
 }
});
for(const kind of kinds){
 test(`${kind}: mass/heat/work and both shaft balances close across input corners`,()=>{
  const init=initialPlant(kind);for(const demand of [.25,1])for(const fuelLimit of [.65,1])for(const ambientT of [278,318]){
   const u={...plantDefaults(kind),demand,fuelLimit,ambientT,accessoryW:30000};if(kind==='turboprop')u.airspeed=ambientT===318?100:45;if(kind==='turbofan')u.airspeed=ambientT===318?160:60;let s=run(kind,{...init},u,80),d=observePlant(kind,s,u);
   assert.ok(Object.values(s).every(Number.isFinite));assert.ok(s.wg>0&&s.wp>0);assert.ok(d.air>0&&d.gas>0);
   near(d.gas,d.air+s.fuel,1e-10);near(d.heat,d.gas*1005*(d.t4-d.t3),1e-6);
   near(d.gTurbineW+d.pTurbineW,d.gas*1005*(d.t4-d.t6),1e-6);
   near(d.netG*s.wg,d.gTurbineW-d.compressorW-d.qGLoad*s.wg,1e-6);
   near(d.netP*s.wp,d.pTurbineW-(d.qLoad+d.lossQ)*s.wp,1e-6);
   assert.ok(d.t4>d.t3&&d.t5<d.t4&&d.t6<d.t5);assert.ok(d.command<=d.cap+1e-10);
   if(kind==='turbofan'){near(d.total,d.air+d.bypass,1e-10);near(d.qLoad*s.wp,d.fanW+d.lpcW,1e-6);near(d.thrust,d.coreThrust+d.bypassThrust,1e-10);}
  }
 });
 test(`${kind}: guided normal trial has the correct response and recovers its controlled target`,()=>{
  let s=initialPlant(kind),u=plantDefaults(kind),before=observePlant(kind,s,u);Object.assign(u,trialInputs(kind,'increase'));
  let low=2,high=0,maxFuel=0,maxPitch=s.beta;
  for(let i=0;i<120*60;i++){s=stepPlant(kind,s,u);const d=observePlant(kind,s,u);low=Math.min(low,d.np);high=Math.max(high,d.np);maxFuel=Math.max(maxFuel,s.fuel);maxPitch=Math.max(maxPitch,s.beta);}
  const d=observePlant(kind,s,u);assert.ok(maxFuel>before.fuelActual*1.15);
  if(kind==='helicopter'){assert.ok(low<.96);near(d.np,1,.002);assert.ok(d.thrust>before.thrust);}
  if(kind==='turboprop'){assert.ok(high>1.02);assert.ok(maxPitch>.5);near(d.np,1,.002);near(d.controlError,0,1);assert.ok(d.thrust>before.thrust*1.3);}
  if(kind==='turbofan'){assert.ok(d.ng>before.ng);assert.ok(d.np>before.np);near(d.np,d.speedReference,.001);assert.ok(d.bypassThrust>before.bypassThrust&&d.thrust>before.thrust);}
 });
 test(`${kind}: equilibrium status requires recovered demand and balanced shafts`,()=>{
  const u={...plantDefaults(kind),...trialInputs(kind,'increase')};
  const start=observePlant(kind,initialPlant(kind),u);
  assert.equal(nearGovernedEquilibrium(kind,start),false,'a new input is transient before speed has time to move');
  const settled=observePlant(kind,run(kind,initialPlant(kind),u,120),u);
  assert.equal(nearGovernedEquilibrium(kind,settled),true,'a recovered, balanced running response is settled');
  const limitedInputs={...plantDefaults(kind),...trialInputs(kind,'limit')};
  assert.equal(nearGovernedEquilibrium(kind,observePlant(kind,run(kind,initialPlant(kind),limitedInputs,120),limitedInputs)),false);
 });
 test(`${kind}: active limit does not falsely imply demand is met`,()=>{
  const u={...plantDefaults(kind),...trialInputs(kind,'limit')},s=run(kind,initialPlant(kind),u,60),d=observePlant(kind,s,u);
  assert.notEqual(d.limit,'None');
  if(kind==='turboprop'){near(d.np,1,.003);assert.ok(d.controlError>100,'prop governor can hold speed while engine torque demand fails');}
  else assert.ok(d.speedReference-d.np>.08);
 });
 test(`${kind}: fixed-step state is reproducible across render cadences, reset and timestep refinement`,()=>{
  const u={...plantDefaults(kind),...trialInputs(kind,'increase')},a=createPlantRunner(kind),b=createPlantRunner(kind);
  for(let i=0;i<1200;i++)a.advance(1/60,u);for(let i=0;i<600;i++)b.advance(i%2?1/20:1/60,u);assert.deepEqual(a.state,b.state);
  const refined=run(kind,initialPlant(kind),u,20,DT/2);near(a.state.wp,refined.wp,.03);near(a.state.wg,refined.wg,.08);near(a.state.fuel,refined.fuel,.000005);
  a.reset();assert.deepEqual(a.state,initialPlant(kind));assert.throws(()=>a.advance(Infinity,u),RangeError);
 });
 test(`${kind}: graph endpoints, sources, governing branches and geared quantities are coherent`,()=>{
  const m=buildManifest(kind),ids=new Set(m.nodes.map(n=>n.id));assert.equal(ids.size,m.nodes.length);assert.ok(ids.has(m.initial));
  for(const e of m.edges){assert.ok(ids.has(e.from)&&ids.has(e.to),e.id);assert.equal(typeof e.simulated,'boolean');}
  for(const n of m.nodes){assert.ok(m.assemblies.some(a=>a.id===n.parent));assert.ok(SOURCES[n.source]);assert.ok(n.anchor.length===3&&n.anchor.every(Number.isFinite));}
  const s=initialPlant(kind),d=observePlant(kind,s,plantDefaults(kind));
  if(kind==='helicopter'){near(d.rotorOmega,s.wp/GEAR.helicopterMain,1e-10);assert.ok(!m.edges.some(e=>e.from==='controller'&&e.to==='rotor'));}
  if(kind==='turboprop'){near(d.rotorOmega,s.wp/GEAR.propeller,1e-10);assert.ok(m.edges.some(e=>e.from==='prop.governor'&&e.to==='pitch.actuator'));assert.ok(!m.edges.some(e=>e.from==='controller'&&e.to==='pitch.actuator'));}
  if(kind==='turbofan'){assert.ok(m.shafts.find(x=>x.id==='hp').members.includes('compressor.rotor'));assert.ok(m.shafts.find(x=>x.id==='lp').members.includes('fan.rotor'));}
  assert.ok(m.edges.some(e=>e.from==='vibration'&&e.to==='cockpit'&&!e.simulated));assert.ok(!m.edges.some(e=>e.from==='vibration'&&e.to==='controller'));
 });
}

import test from 'node:test';
import assert from 'node:assert/strict';
import {P,initialState,defaultInputs,thermodynamics,observe,step,createRunner} from '../src/simulation.js';
const run=(state,u,seconds,dt=P.step)=>{let s={...state};for(let i=0;i<Math.round(seconds/dt);i++)s=step(s,u,dt);return s;};
const near=(a,b,tol=1e-7)=>assert.ok(Math.abs(a-b)<=tol,`${a} ≠ ${b} (tol ${tol})`);
test('mass, heat and component work balances close throughout the running envelope',()=>{
 for(const load of [.25,.35,.55,.7,1])for(const fuelLimit of [.65,.72,1]){
  const u={load,fuelLimit},s=run(initialState(),u,70),d=observe(s,u),th=thermodynamics(s);
  assert.ok(Object.values(s).every(Number.isFinite));assert.ok(s.wg>0&&s.wp>0);
  near(th.gas,th.air+s.fuel);near(th.heat,th.gas*P.cp*(th.t4-th.t3),1e-7);
  near(th.gTurbineW+th.pTurbineW,th.gas*P.cp*(th.t4-th.t6),1e-7);
  near(d.netP,d.qPower-d.qLoad-d.lossQ);near(d.netG,d.qGas-d.qCompressor-d.qGLoad);
  assert.ok(th.t3>P.ambientT&&th.t4>th.t3&&th.t5<th.t4&&th.t6<th.t5);
  assert.ok(s.fuel<=P.maxFuel*fuelLimit+1e-8);assert.ok(th.t4<P.tempLimit+2);
 }
});
test('a load step initially decelerates Np, increases fuel and torque, and recovers',()=>{
 let s=initialState();const u={load:.55,fuelLimit:1},before=observe(s,defaultInputs()),initial=observe(s,u);
 assert.ok(initial.netP<0);near(initial.qPower,before.qPower);
 let min=1,peakFuel=0,peakTorque=0;
 for(let i=0;i<120*45;i++){s=step(s,u);const d=observe(s,u);min=Math.min(min,d.np);peakFuel=Math.max(peakFuel,s.fuel);peakTorque=Math.max(peakTorque,d.qPower);}
 assert.ok(min<.96&&min>.9);assert.ok(peakFuel>before.command*1.2);assert.ok(peakTorque>before.qPower*1.3);
 near(s.wp/P.referenceP,1,.003);
});
test('fuel ceiling causes persistent droop and anti-windup permits recovery after release',()=>{
 let s=run(initialState(),{load:.7,fuelLimit:.72},60),d=observe(s,{load:.7,fuelLimit:.72});
 assert.equal(d.limit,'Fuel ceiling');assert.ok(d.np<.9);near(s.fuel,P.maxFuel*.72,1e-10);
 assert.ok(Math.abs(s.integral)<.022);s=run(s,{load:.35,fuelLimit:1},70);near(s.wp/P.referenceP,1,.002);
});
test('thermal and Ng command caps become active independently of the fuel ceiling',()=>{
 const s=initialState();let d=observe({...s,wg:600,wp:400,integral:.02},{load:.7,fuelLimit:1});
 assert.equal(d.limit,'Temperature target');near(d.command,d.cap);
 d=observe({...s,wg:1250,wp:430,integral:.02},{load:.7,fuelLimit:1});assert.equal(d.limit,'Ng target');
});
test('model reset and deterministic fixed-step runner ignore rendering cadence',()=>{
 const u={load:.55,fuelLimit:1},a=createRunner(),b=createRunner();
 for(let i=0;i<1800;i++)a.advance(1/60,u);
 for(let i=0;i<900;i++)b.advance(i%2?1/20:1/60,u);
 assert.deepEqual(a.state,b.state);a.reset();assert.deepEqual(a.state,initialState());
 assert.throws(()=>a.advance(NaN,u),RangeError);assert.throws(()=>step(a.state,u,.2),RangeError);
});
test('halving integration step converges for the load transient',()=>{
 const s=initialState(),u={load:.55,fuelLimit:1};const a=run(s,u,20),b=run(s,u,20,P.step/2);
 near(a.wp,b.wp,.015);near(a.wg,b.wg,.04);near(a.fuel,b.fuel,.000003);
});

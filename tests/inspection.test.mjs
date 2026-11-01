import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectionStages,inspectionOffset,transitionInspection,hubBore} from '../src/inspection.js';
import {buildManifest} from '../src/manifest.js';

test('casing opens before the liner and repeated reassembly has no transform drift',()=>{
  assert.deepEqual(inspectionStages(0),{amount:0,casing:0,liner:0});
  assert.deepEqual(inspectionStages(.5),{amount:.5,casing:1,liner:0});
  assert.deepEqual(inspectionStages(1),{amount:1,casing:1,liner:1});
  for(let cycle=0;cycle<100;cycle++)for(const stage of ['casing','liner','shaft']){
    inspectionOffset(stage,1.2,1);
    assert.deepEqual(inspectionOffset(stage,1.2,0),[0,0,0]);
  }
  assert.deepEqual(inspectionOffset('shaft',1.2,1),[0,0,0]);
});

test('every shell sector travels outward, clears the shaft and stays axially located',()=>{
  const start=Math.PI*.7,sweep=Math.PI*1.3/2;
  for(const stage of ['casing','liner'])for(const sector of [0,1]){
    const middle=start+(sector+.5)*sweep;
    for(let sample=0;sample<=32;sample++){
      const angle=start+sector*sweep+sweep*sample/32,original=[Math.cos(angle)*.37,Math.sin(angle)*.37];
      let previous=.37;
      for(let step=0;step<=100;step++){
        const [x,y,z]=inspectionOffset(stage,middle,step/100),radius=Math.hypot(original[0]+y,original[1]+z);
        assert.equal(x,0);assert.ok(radius>=previous-1e-12);previous=radius;
      }
    }
  }
});

test('inspection pauses the model and restores its previous pause state',()=>{
  for(const paused of [false,true]){
    let s={amount:0,paused,pausedBeforeInspection:false};
    for(const amount of [.1,.5,1,.7]){s=transitionInspection(s,amount);assert.equal(s.paused,true);}
    s=transitionInspection(s,0);assert.equal(s.paused,paused);
  }
  const s=transitionInspection({amount:0,paused:false,pausedBeforeInspection:false},1);
  assert.equal(transitionInspection(s,0,false).paused,true,'reset caller owns subsequent playback');
});

test('annular hubs clear independent shafts without detaching their own spool',()=>{
  for(const kind of ['turboprop','turbofan']){
    assert.ok(hubBore('g',kind)>.078,'HP/Ng rotor clears inner power shaft');
    assert.ok(hubBore('g',kind)<.16,'HP/Ng rotor still meets its outer shaft');
    assert.ok(hubBore(null,kind)>.16,'fixed vane hub clears both shafts');
  }
  assert.equal(hubBore('g','helicopter'),0);
  assert.equal(hubBore('p','turbofan'),0);
});

test('casing selection is separate from stator/vane and rotating-spool identity',()=>{
  for(const kind of ['helicopter','turboprop','turbofan']){
    const m=buildManifest(kind);
    for(const id of ['compressor.casing','turbine.casing']){
      assert.ok(m.nodes.some(n=>n.id===id));
      assert.ok(!m.shafts.some(s=>s.members.includes(id)));
    }
  }
});

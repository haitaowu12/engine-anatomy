import {createRunner,observe,defaultInputs,P} from './simulation.js';
import {components,sources} from './components.js';
const $=id=>document.getElementById(id);
const runner=createRunner(),inputs=defaultInputs();let selected='compressor',scene,paused=false,lastFrame=null,history=[],sample=0,uiTick=0;
const motionQuery=matchMedia('(prefers-reduced-motion: reduce)');$('motion').checked=motionQuery.matches;
motionQuery.addEventListener('change',e=>{$('motion').checked=e.matches;});
const strip=$('component-strip');
for(const c of components){const b=document.createElement('button');b.innerHTML=`<span>${c.index}</span>${c.name}`;b.dataset.component=c.id;b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>select(c.id));strip.append(b);}
function select(id){
 selected=id;const c=components.find(c=>c.id===id);if(!c)return;
 $('part-index').textContent=c.index+' / COMPONENT';$('part-name').textContent=c.name;$('part-tag').textContent=c.tag;$('part-summary').textContent=c.summary;$('part-explanation').textContent=c.explanation;
 $('part-details').innerHTML=[['Inputs',c.input],['Outputs',c.output],['Energy transfer',c.energy],['Motion',c.motion],['Connections & assumptions',c.dependencies]].map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
 const source=sources[c.source];$('part-source').href=source.url;$('part-source').textContent=`${source.title} · ${source.location} ↗`;
 strip.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.component===id)));scene?.select(id);
 $('workspace').dataset.selected=id;
}
select(selected);
function fallback(message){scene?.dispose();scene=null;$('canvas-host').replaceChildren();$('fallback').hidden=false;$('render-status').textContent='2D schematic';$('scene-help').textContent=message;for(const id of ['cutaway','explode','isolate','orbit-left','zoom-in','zoom-out','reset-camera'])$(id).disabled=true;}
try{
 if(new URLSearchParams(location.search).get('render')==='schematic')fallback('2D mode selected');
 else {const {createEngineRenderer}=await import('./renderer.js');scene=createEngineRenderer($('canvas-host'),select);$('render-status').textContent='Interactive 3D';$('canvas-host').addEventListener('webglcontextlost',e=>{e.preventDefault();fallback('Graphics context lost; model remains available.');},{capture:true});}
}catch(error){console.warn('3D unavailable; using the 2D educational schematic.',error.message);fallback('3D unavailable; use the component selector.');}
for(const [id,method]of [['cutaway','setCutaway'],['explode','setExploded'],['isolate','setIsolated']])$(id).addEventListener('click',()=>{const value=$(id).getAttribute('aria-pressed')!=='true';$(id).setAttribute('aria-pressed',String(value));scene?.[method](value);if(id==='explode')$('scene-help').textContent=value?'Exploded schematic · shaft and gas connections shown conceptually':'Drag to orbit · scroll to zoom · select a part';});
$('reset-camera').addEventListener('click',()=>scene?.resetCamera());$('orbit-left').addEventListener('click',()=>scene?.orbit(-Math.PI/9));$('zoom-in').addEventListener('click',()=>scene?.zoom(1.2));$('zoom-out').addEventListener('click',()=>scene?.zoom(1/1.2));
for(const b of document.querySelectorAll('[data-select]'))b.addEventListener('click',()=>{select(b.dataset.select);$('workspace').scrollIntoView({behavior:$('motion').checked?'instant':'smooth',block:'start'});});
for(const b of document.querySelectorAll('[data-view]'))b.addEventListener('click',()=>{
 const v=b.dataset.view;document.querySelectorAll('[data-view]').forEach(n=>n.setAttribute('aria-pressed',String(n===b)));
 $('interface-panel').hidden=v!=='airframe';scene?.setView(v);$('workspace').dataset.view=v;
 $('scene-title').textContent=v==='engine'?'Two shafts. One gas path.':v==='control'?'Fuel responds. Shaft speed recovers.':'An engine, connected to its aircraft.';
 if(v==='control'){select('fadec');$('experiment').scrollIntoView({behavior:$('motion').checked?'instant':'smooth',block:'start'});}
 if(v==='airframe'){select('gearbox');$('interface-panel').scrollIntoView({behavior:$('motion').checked?'instant':'smooth',block:'start'});}
 if(v==='engine')select('compressor');
});
function syncControls(){$('load').value=inputs.load*100;$('fuel-limit').value=inputs.fuelLimit*100;$('load-value').textContent=Math.round(inputs.load*100)+'%';$('fuel-limit-value').textContent=Math.round(inputs.fuelLimit*100)+'%';}
$('load').addEventListener('input',e=>{inputs.load=Number(e.target.value)/100;syncControls();});$('fuel-limit').addEventListener('input',e=>{inputs.fuelLimit=Number(e.target.value)/100;syncControls();});
function setPaused(value){paused=value;$('pause').setAttribute('aria-pressed',String(value));$('pause').textContent=value?'Resume model':'Pause model';lastFrame=null;updateUI();}
$('pause').addEventListener('click',()=>setPaused(!paused));
function reset(){runner.reset();Object.assign(inputs,defaultInputs());history=[];sample=0;syncControls();addSample(runner.state,observe(runner.state,inputs));updateUI();}
$('reset-model').addEventListener('click',()=>{reset();$('experiment-note').textContent='At equilibrium, turbine torque supplies load torque plus shaft losses.';});
$('load-step').addEventListener('click',()=>{reset();inputs.load=.55;syncControls();$('experiment-note').textContent='Load applied at t = 0. Watch the speed dip, fuel increase, and recovery toward 100% Np.';setPaused(false);});
$('limit-step').addEventListener('click',()=>{reset();inputs.load=.7;inputs.fuelLimit=.72;syncControls();$('experiment-note').textContent='A 72% fuel ceiling cannot sustain 70% reference load at full speed. The model settles below the speed target.';setPaused(false);});
const chartGrid=$('chart-grid'),chartLabels=$('chart-labels');
for(let i=0;i<5;i++){const y=20+i*32;chartGrid.innerHTML+=`<line x1="38" x2="718" y1="${y}" y2="${y}"/>`;chartLabels.innerHTML+=`<text x="28" y="${y+3}" text-anchor="end">${110-i*10}</text><text x="731" y="${y+3}">${800-i*200}</text>`;}
for(let i=0;i<5;i++)chartLabels.innerHTML+=`<text x="${38+i*170}" y="180" text-anchor="middle">−${40-i*10}s</text>`;
function addSample(s,d){history.push({t:s.t,np:d.np,q:d.qPower,load:d.qLoad});history=history.filter(p=>p.t>=s.t-40);}
function updateChart(){const t=runner.state.t;const path=key=>history.map((p,i)=>{const x=38+(p.t-t+40)/40*680;const y=key==='np'?20+(1.1-p.np)/.4*128:148-p[key]/800*128;return`${i?'L':'M'}${x.toFixed(2)},${y.toFixed(2)}`;}).join('');$('speed-path').setAttribute('d',path('np'));$('torque-path').setAttribute('d',path('q'));$('load-path').setAttribute('d',path('load'));}
function updateUI(){
 const s=runner.state,d=observe(s,inputs);
 $('np-value').innerHTML=(d.np*100).toFixed(1)+'<small>%</small>';$('ng-value').innerHTML=(d.ng*100).toFixed(1)+'<small>%</small>';$('power-value').innerHTML=(d.outputW/1000).toFixed(0)+'<small>kW</small>';$('temp-value').innerHTML=d.t4.toFixed(0)+'<small>K</small>';
 $('sim-time').textContent=`t + ${s.t.toFixed(1)} s`;$('loop-status').textContent=paused?'Model paused':d.limit!=='None'?d.limit+' active':Math.abs(d.np-1)>.01?'Recovering shaft speed':'Governing Np';$('loop-status').classList.toggle('limited',d.limit!=='None');
 $('loop-readout').innerHTML=`<span>Fuel ${(s.fuel*1000).toFixed(1)} g/s</span><span>Air ${d.air.toFixed(2)} kg/s</span><span>Δ torque ${d.netP>=0?'+':''}${d.netP.toFixed(1)} N·m</span>`;
 $('error-value').textContent=`Error ${((1-d.np)*100).toFixed(1)}%`;$('fuel-value').textContent=s.fuel.toFixed(4)+' kg/s';$('command-value').textContent=`Request ${d.command.toFixed(4)} kg/s · ${d.limit==='None'?'not limited':d.limit}`;$('torque-value').textContent=d.qPower.toFixed(0)+' N·m';
 $('experiment').dataset.state=JSON.stringify({time:s.t,ng:d.ng,np:d.np,fuel:s.fuel,limit:d.limit,load:inputs.load,ceiling:inputs.fuelLimit,qPower:d.qPower,qLoad:d.qLoad});
 updateChart();
}
for(const source of Object.values(sources)){$('source-list').innerHTML+=`<div class="source-item"><a href="${source.url}" target="_blank" rel="noreferrer">${source.title} ↗</a><small>${source.location}</small></div>`;}
$('open-sources').addEventListener('click',()=>$('sources-dialog').showModal());$('close-sources').addEventListener('click',()=>$('sources-dialog').close());$('sources-dialog').addEventListener('click',e=>{if(e.target===$('sources-dialog')){const r=$('sources-dialog').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('sources-dialog').close();}});
document.addEventListener('visibilitychange',()=>{lastFrame=null;});
addSample(runner.state,observe(runner.state,inputs));updateUI();
let failed=false;
function frame(now){
 const dt=lastFrame===null?0:Math.max(0,(now-lastFrame)/1000);lastFrame=now;
 if(!paused&&!document.hidden&&!failed){try{runner.advance(dt,inputs,(s,d)=>{sample++;if(sample%12===0)addSample(s,d);});}catch(error){failed=true;setPaused(true);$('loop-status').textContent=error.message;}}
 const d=observe(runner.state,inputs);scene?.render(runner.state,d,$('motion').checked);
 if(now-uiTick>90){updateUI();uiTick=now;}
 requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

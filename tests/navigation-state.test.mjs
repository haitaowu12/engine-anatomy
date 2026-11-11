import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildManifest,SOURCES} from '../src/manifest.js';
import {ancestors} from '../src/anatomy.js';
import {learningPaths} from '../src/learning.js';
import {resolveLesson,inspectionPresentation} from '../src/learning-state.js';
import {transitionInspection} from '../src/inspection.js';
import {interfaceRoute} from '../src/installation.js';
import {diagramNodeIds} from '../src/system-diagram.js';

// Execute the shipping state transitions and event handlers. The fixture only
// replaces DOM painting, renderer calls and browser history; it does not copy
// the application's routing, pause or panel-selection rules.
const source=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const markup=readFileSync(new URL('../public/index.html',import.meta.url),'utf8');
function block(begin,end){
 const first=source.indexOf(begin),last=source.indexOf(end,first+begin.length);
 assert.ok(first>=0&&last>first,`Application harness boundary changed: ${begin}`);
 return source.slice(first,last);
}

function createBrowser(){
 const nodes=new Map(),window=new EventTarget(),motionQuery=Object.assign(new EventTarget(),{matches:false});
 let location=new URL('https://example.test/engine-anatomy/'),index=0;
 const entries=[location.href];
 class Element extends EventTarget{
  constructor(id='',dataset={}){super();this.id=id;this.dataset=dataset;this.hidden=false;this.disabled=false;this.checked=false;this.open=false;this.value='';this.children=[];this.attributes=new Map();this.style={};this.classList={contains:()=>false};this.textContent='';this.innerHTML='';}
  set innerHTML(value){this._html=value;this.children=[];for(const match of value.matchAll(/<button\b[^>]*data-lesson-step="(\d+)"[^>]*>([\s\S]*?)<\/button>/g)){const child=new Element('',{lessonStep:match[1]});child.textContent=match[2].replace(/<[^>]*>/g,'');child.parentElement=this;this.children.push(child);}}
  get innerHTML(){return this._html;}
  querySelectorAll(selector){assert.equal(selector,'[data-lesson-step]');return this.children.filter(child=>child.dataset.lessonStep!==undefined);}
  closest(selector){return selector==='[data-lesson-step]'&&this.dataset.lessonStep!==undefined?this:null;}
  setAttribute(name,value){this.attributes.set(name,String(value));}
  getAttribute(name){return this.attributes.get(name)??null;}
  append(child){child.parentElement?.removeChild(child);this.children.push(child);child.parentElement=this;}
  prepend(child){child.parentElement?.removeChild(child);this.children.unshift(child);child.parentElement=this;}
  insertBefore(child,before){child.parentElement?.removeChild(child);const at=this.children.indexOf(before);assert.ok(at>=0,'The insertion anchor belongs to its parent');this.children.splice(at,0,child);child.parentElement=this;}
  removeChild(child){const at=this.children.indexOf(child);assert.ok(at>=0);this.children.splice(at,1);child.parentElement=null;}
  click(){if(!this.disabled)this.dispatchEvent(new Event('click'));}
  focus(){document.activeElement=this;}
  scrollIntoView(){this.scrolled=true;}
  close(){this.open=false;}
 }
 for(const [,id]of markup.matchAll(/\bid="([^"]+)"/g))nodes.set(id,new Element(id));
 const byId=id=>{assert.ok(nodes.has(id),`Missing product element: ${id}`);return nodes.get(id);};
 byId('canvas-host').dataset.geometry='true';
 const tabs=['component','walkthrough','experiment'].map(study=>new Element('',{study}));
 const overlays=['anatomy','shafts','gas','control','services'].map(overlay=>new Element('',{overlay}));
 const presets=['installed','section','aircraft'].map(preset=>new Element('',{preset}));
 const classes=Object.fromEntries(['.part-actions','.camera-tools','.trial-jump'].map(name=>[name,new Element()]));
 byId('guided-trial').append(byId('trial-controls'));
 byId('guided-trial').append(byId('causal-chain'));
 byId('scene-stage').append(classes['.part-actions']);
 byId('scene-stage').append(byId('canvas-host'));
 const document=Object.assign(new EventTarget(),{
  hidden:false,
  activeElement:null,
  querySelector(selector){assert.ok(classes[selector],`Unexpected DOM query: ${selector}`);return classes[selector];},
  querySelectorAll(selector){
   const lists={'[data-study]':tabs,'button[data-overlay]':overlays,'[data-preset]':presets,'.tree-node':[]};
   assert.ok(Object.hasOwn(lists,selector),`Unexpected DOM list: ${selector}`);return lists[selector];
  }
 });
 window.history={
  replaceState(_state,_title,url){location=new URL(url,location);entries[index]=location.href;},
  pushState(_state,_title,url){location=new URL(url,location);entries.splice(index+1);entries.push(location.href);index++;},
  back(){assert.ok(index>0,'A previous route is available');location=new URL(entries[--index]);window.dispatchEvent(new Event('popstate'));}
 };
 return {window,document,byId,tabs,motionQuery,narrowQuery:{matches:true},get location(){return location;},entries};
}

const implementation=[
 block('const motionQuery=','const typeColor='),
 block('const typeColor=','function treeHTML('),
 block('function select(','const physicalLensHelp='),
 block('const physicalLensHelp=','const aircraftReferences='),
 block('function setPaused(','function resetTrial('),
 block("$('motion').addEventListener(",'for(const [id,direction]'),
 block('function inspectComponent(','function revealModel('),
 block('function positionTrialControls()','narrowQuery.addEventListener('),
 block("$('start-learning').addEventListener(",'function buildLearning('),
 block('function showLesson(','function updateRelations('),
 block("$('learning-path').addEventListener(","$('inspection-recipe').addEventListener("),
 block("document.addEventListener('visibilitychange'","$('canvas-host').addEventListener('webglcontextlost'")
].join('\n');

function harness(kind='helicopter'){
 const dependencies={createBrowser,buildManifest,SOURCES,ancestors,learningPaths,resolveLesson,inspectionPresentation,transitionInspection,interfaceRoute,diagramNodeIds};
 return new Function(...Object.keys(dependencies),'kind',`
  const browser=createBrowser(),{window,document,narrowQuery}=browser,$=browser.byId,matchMedia=()=>browser.motionQuery;
  let clock=0;const performance={now:()=>clock};
  const location={get href(){return browser.location.href;},get search(){return browser.location.search;},get hash(){return browser.location.hash;}};
  const manifest=buildManifest(kind),paths=learningPaths(manifest);
  const groupNames={air:'Gas path',drive:'Shafts & loads',control:'Control & sensors',airframe:'Aircraft',service:'Services'};
  let selected=manifest.initial,overlay='anatomy',preset='installed',activity='component',learningPath='gas-path',lessonStep=0;
  let lessonPlaying=false,lastLesson=0,lessonPause=null,inspection=0,paused=false,pausedBeforeInspection=false,lastFrame=1,active=false;
  let circuit='fuel',shaftChoice='all',aircraftStyle='drawn',relationKey='',recipe='engine',userMotionPreference=false;
  const presetCutaways={installed:true,section:true,aircraft:false};
  const scene={select(id){this.selected=id;},setOverlay(){},setPreset(){},setCutaway(){},setCircuit(){},setEventHighlight(){},setInspection(value){this.inspection=value;}};
  // Pure presentation boundaries: the production transitions still update the
  // selected component, panel elements, controls, URL and renderer selection.
  function renderBrowser(){}function syncRepresentation(){}function updateUI(){}
  function buildArchitecture(){throw new Error('Cross-architecture rebuild is outside this focused fixture');}
  ${implementation}
  positionTrialControls();showStudyPanel('component');
  return {
   element:$,browser,
   panel(name){browser.tabs.find(tab=>tab.dataset.study===name).click();},
   lesson(id,step=0){navigate(()=>{learningPath=id;lessonStep=step;$('learning-path').value=id;showStudyPanel('walkthrough');});},
   component:inspectComponent,inspection:setInspection,pause:setPaused,
   start(){ $('start-learning').click(); },
   play(){ $('lesson-play').click(); },
   next(){ $('lesson-next').click(); },
   tick(now){clock=now;advanceWalkthrough(now);},
   hide(){document.hidden=true;document.dispatchEvent(new Event('visibilitychange'));},
   reduce(reduced=true){motionQuery.matches=reduced;const event=new Event('change');Object.defineProperty(event,'matches',{value:reduced});motionQuery.dispatchEvent(event);},
   motion(reduced){$('motion').checked=reduced;$('motion').dispatchEvent(new Event('change'));},
   chooseStep(index){const button=$('lesson-step-list').children[index],event=new Event('click');button.focus();Object.defineProperty(event,'target',{value:button});$('lesson-step-list').dispatchEvent(event);return button;},
   back(){window.history.back();},
   state(){return {kind,selected,activity,learningPath,lessonStep,lessonPlaying,lessonPause,inspection,paused,pausedBeforeInspection,preset,overlay,url:location.href};}
  };
 `)(...Object.values(dependencies),kind);
}

test('selecting a component leaves the walkthrough and Back restores its lesson and stage',()=>{
 const h=harness();h.lesson('gas-path',2);
 const previous=h.state(),historyCount=h.browser.entries.length;
 h.component('compressor.rotor');
 const current=h.state(),route=new URL(current.url).searchParams;
 assert.equal(current.activity,'component');assert.equal(current.selected,'compressor.rotor');
 assert.equal(h.element('selected-component').hidden,false);assert.equal(h.element('mechanism-panel').hidden,true);
 assert.equal(route.get('activity'),'component');assert.equal(route.get('component'),'compressor.rotor');
 assert.equal(route.has('lesson'),false);assert.equal(route.has('step'),false);
 assert.equal(h.browser.entries.length,historyCount+1,'Component selection creates one history entry');
 h.back();
 const restored=h.state();
 for(const key of ['activity','selected','learningPath','lessonStep'])assert.equal(restored[key],previous[key],`Back restores ${key}`);
 assert.equal(h.element('mechanism-panel').hidden,false);
});

test('named walkthrough stages retain the focused button and Back restores a manual step',()=>{
 const h=harness();h.start();
 const buttons=h.element('lesson-step-list').children;
 assert.equal(buttons.length,6);
 assert.match(buttons[0].textContent,/Bring air into the engine/);
 assert.match(buttons[2].textContent,/Add fuel and heat/);
 const selected=h.chooseStep(2);
 assert.equal(h.state().lessonStep,2);
 assert.equal(h.element('lesson-step-list').children[2],selected,'The selected step is not replaced');
 assert.equal(h.browser.document.activeElement,selected,'Keyboard focus stays on the named step');
 assert.equal(selected.getAttribute('aria-current'),'step');
 assert.equal(h.element('lesson-progress').textContent,'Step 3 of 6');
 h.back();assert.equal(h.state().lessonStep,0);
});

test('manual steps and leaving the page pause a timed walkthrough at its current stage',()=>{
 const h=harness();h.start();h.play();
 h.tick(3500);assert.equal(h.state().lessonStep,0,'The opening explanation is not replaced after 3.5 seconds');
 h.tick(20000);assert.equal(h.state().lessonStep,1);
 h.next();assert.equal(h.state().lessonStep,2);assert.equal(h.state().lessonPlaying,false);
 h.tick(90000);assert.equal(h.state().lessonStep,2,'Manual inspection holds its selected state');
 h.play();h.hide();assert.equal(h.state().lessonPlaying,false);
 h.tick(190000);assert.equal(h.state().lessonStep,2,'Returning cannot skip an unseen step');
});

test('reduced motion keeps named steps usable and a completed walkthrough can replay',()=>{
 const h=harness();h.start();h.chooseStep(5);
 assert.equal(h.element('lesson-play').textContent,'Replay walkthrough');
 h.play();assert.equal(h.state().lessonStep,0);assert.equal(h.state().lessonPlaying,true);
 h.reduce();assert.equal(h.element('lesson-play').disabled,true);assert.equal(h.state().lessonPlaying,false);
 h.chooseStep(3);assert.equal(h.state().lessonStep,3);h.next();assert.equal(h.state().lessonStep,4);
});

test('the in-app reduced-motion choice stops playback and requires explicit restart after re-enabling motion',()=>{
 const h=harness();h.start();h.play();h.tick(20000);
 assert.equal(h.state().lessonStep,1);assert.equal(h.state().lessonPlaying,true);
 h.motion(true);
 assert.equal(h.state().lessonPlaying,false,'Checking Reduce motion stops the active walkthrough');
 assert.equal(h.element('lesson-play').disabled,true);
 assert.equal(h.element('lesson-play').getAttribute('aria-pressed'),'false');
 assert.equal(h.element('lesson-playback-note').hidden,false);
 h.play();h.tick(90000);assert.equal(h.state().lessonStep,1,'The stopped stage stays available for reading');
 h.chooseStep(3);h.next();assert.equal(h.state().lessonStep,4,'Manual stages remain available');
 h.motion(false);
 assert.equal(h.element('lesson-play').disabled,false);assert.equal(h.element('lesson-playback-note').hidden,true);
 assert.equal(h.state().lessonPlaying,false,'Re-enabling motion does not restart playback');
 h.tick(190000);assert.equal(h.state().lessonStep,4);
 h.play();assert.equal(h.state().lessonPlaying,true);
 h.reduce();assert.equal(h.element('motion').checked,true);assert.equal(h.state().lessonPlaying,false,'A system preference change also stops playback');
 h.motion(false);h.play();assert.equal(h.state().lessonPlaying,true,'The explicit checkbox choice governs both renderer and walkthrough');
});

test('relocated mobile trial controls are visible only in Experiment',()=>{
 const h=harness();
 assert.equal(h.element('trial-controls').parentElement,h.element('mobile-trial-slot'));
 for(const panel of ['component','experiment','walkthrough','experiment','component']){
  h.panel(panel);
  assert.equal(h.element('mobile-trial-slot').hidden,panel!=='experiment',panel);
  assert.equal(h.element('guided-trial').hidden,panel!=='experiment',panel);
  assert.equal(h.element('model-input-panel').hidden,panel!=='experiment',panel);
  assert.equal(h.element('model-plot-panel').hidden,panel!=='experiment',panel);
 }
});

test('start and shutdown pause the model, then restore the previous running or paused state',()=>{
 for(const lesson of ['start','shutdown'])for(const pausedBefore of [false,true])for(const exit of ['component','experiment','gas-path']){
  const h=harness();h.pause(pausedBefore);h.lesson(lesson);
  assert.equal(h.state().paused,true,`${lesson} holds the model`);
  assert.equal(h.element('pause').disabled,true,`${lesson} cannot be resumed through the model control`);
  if(exit==='gas-path')h.lesson(exit);else h.panel(exit);
  assert.equal(h.state().paused,pausedBefore,`${lesson} → ${exit} restores the previous state`);
  assert.equal(h.state().lessonPause,null);assert.equal(h.element('pause').disabled,false);
 }
 const h=harness();h.lesson('start');h.lesson('shutdown');h.panel('component');
 assert.equal(h.state().paused,false,'Switching between the two conceptual sequences retains the original running state');
});

test('Start with the gas path reassembles inspection and locates the inlet',()=>{
 for(const kind of ['helicopter','turboprop','turbofan'])for(const pausedBefore of [false,true]){
  const h=harness(kind);h.pause(pausedBefore);h.inspection(.75);
  assert.equal(h.state().paused,true);
  h.start();
  const state=h.state(),route=new URL(state.url).searchParams;
  assert.equal(state.inspection,0);assert.equal(h.element('inspection').value,'0');
  assert.equal(state.paused,pausedBefore);assert.equal(h.element('pause').disabled,false);
  assert.equal(state.activity,'walkthrough');assert.equal(state.learningPath,'gas-path');assert.equal(state.lessonStep,0);
  assert.equal(state.selected,'inlet');assert.equal(state.preset,'installed');
  assert.equal(route.get('lesson'),'gas-path');assert.equal(route.get('step'),'0');
  assert.equal(h.browser.document.activeElement,h.element('learning-path'));
 }
});

test('leaving a conceptual sequence cannot resume a model while inspection is open',()=>{
 for(const pausedBefore of [false,true])for(const inspectionFirst of [false,true]){
  const h=harness();h.pause(pausedBefore);
  if(inspectionFirst)h.inspection(.5);
  h.lesson('shutdown');
  if(!inspectionFirst)h.inspection(.5);
  h.panel('component');
  assert.equal(h.state().inspection,.5);
  assert.equal(h.state().paused,true,'Inspection must retain its pause after the lesson releases its pause');
  assert.equal(h.element('pause').disabled,true);
  h.inspection(0);
  assert.equal(h.state().paused,pausedBefore,'Reassembling restores the state from before either pause');
 }
});

test('reassembling during a conceptual sequence keeps that sequence paused',()=>{
 for(const pausedBefore of [false,true])for(const inspectionFirst of [false,true]){
  const h=harness();h.pause(pausedBefore);
  if(inspectionFirst)h.inspection(.5);
  h.lesson('shutdown');
  if(!inspectionFirst)h.inspection(.5);
  h.inspection(0);
  assert.equal(h.state().paused,true,'The conceptual sequence still owns a pause after reassembly');
  assert.equal(h.element('pause').disabled,true);
  h.panel('component');
  assert.equal(h.state().paused,pausedBefore);
  assert.equal(h.element('pause').disabled,false);
 }
});

test('switching lessons releases only the conceptual pause while inspection remains open',()=>{
 for(const pausedBefore of [false,true])for(const inspectionFirst of [false,true]){
  const h=harness();h.pause(pausedBefore);
  if(inspectionFirst)h.inspection(.5);
  h.lesson('shutdown');
  if(!inspectionFirst)h.inspection(.5);
  h.lesson('start');
  assert.equal(h.state().lessonPause,pausedBefore,'A second conceptual lesson retains the original pause state');
  h.lesson('gas-path');
  assert.equal(h.state().lessonPause,null);assert.equal(h.state().inspection,.5);
  assert.equal(h.state().paused,true);assert.equal(h.element('pause').disabled,true);
  h.inspection(0);
  assert.equal(h.state().paused,pausedBefore);assert.equal(h.element('pause').disabled,false);
 }
});

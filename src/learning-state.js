import {inspectionAmount,inspectionLabel} from './inspection.js';
// Shared state derivation prevents displayed lesson/recipe copy from lagging
// behind architecture changes or the component that a walkthrough locates.
export function resolveLesson(paths,path,step=0){
 const lesson=paths.find(p=>p.id===path)||paths.find(p=>p.id==='gas-path')||paths.find(p=>p.id==='spools')||paths[0];
 const index=Math.max(0,Math.min(lesson.steps.length-1,Number.isFinite(step)?Math.trunc(step):0));
 return {lesson,path:lesson.id,step:index,selected:lesson.steps[index][0]};
}
export function resetLearning(manifest,paths,path){const state=resolveLesson(paths,path,0);return {...state,recipe:manifest.recipes.some(r=>r.id==='engine')?'engine':manifest.recipes[0].id};}
export function inspectionPresentation(manifest,recipe,value){const amount=inspectionAmount(value),definition=manifest.recipes.find(r=>r.id===recipe)||manifest.recipes[0];return {recipe:definition.id,label:amount?(amount<=.5?'1 · ':'2 · ')+definition.stages[amount<=.5?0:1]:'Assembled',note:(amount?'Model paused. ':'')+definition.note+' Reassemble to restore the previous running state.',aria:inspectionLabel(amount)};}

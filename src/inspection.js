// Presentation-only inspection transforms. Never alter shaft, sensor or plant state.
export const SHAFT_CLEARANCE={innerRadius:.078,outerBore:.105,outerRadius:.16,stationaryBore:.23,decorationHalfLength:.12};
export const INSPECTION={casingTravel:2.8,casingClearance:.8,linerTravel:1.8};
export const inspectionAmount=value=>Number.isFinite(Number(value))?Math.max(0,Math.min(1,Number(value))):0;
const ease=value=>{const t=inspectionAmount(value);return t*t*(3-2*t);};
export function inspectionStages(value){const amount=inspectionAmount(value);return {amount,casing:ease(amount/.5),liner:ease((amount-.5)/.5)};}
export function inspectionOffset(stage,angle,value){const s=inspectionStages(value),distance=stage==='casing'?s.casing*INSPECTION.casingTravel+s.liner*INSPECTION.casingClearance:stage==='liner'?s.liner*INSPECTION.linerTravel:0;return distance?[0,Math.cos(angle)*distance,Math.sin(angle)*distance]:[0,0,0];}
export function inspectionLabel(value){const s=inspectionStages(value);return !s.amount?'Assembled':s.amount<=.5?'1 · Separate casing sectors':'2 · Reveal combustor liner';}
export function transitionInspection(state,value,resume=true){const amount=inspectionAmount(value),previous=inspectionAmount(state.amount),pausedBeforeInspection=amount>0&&!previous?state.paused:state.pausedBeforeInspection;return {amount,pausedBeforeInspection,paused:amount>0?true:previous&&resume?pausedBeforeInspection:state.paused};}
// A stationary annular hub must clear both shafts; the hollow HP/Ng rotor hub
// attaches to its own outer shaft while clearing the independent inner shaft.
export function hubBore(shaft,kind){if(!shaft)return SHAFT_CLEARANCE.stationaryBore;return shaft==='g'&&(kind==='turboprop'||kind==='turbofan')?SHAFT_CLEARANCE.outerBore:0;}

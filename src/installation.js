import {AIRFRAME_LAYOUT} from './airframe-geometry.js';

// Spatial meaning is explicit. An information boundary is not a little box
// installed next to the engine, and an aggregate is not an extra enclosure.
const INTERFACES={
 'fuel.tank':['Aircraft fuel supply','Aircraft tanks and feed system; position depends on the aircraft.','fuel'],
 'fuel.boost':['Aircraft fuel feed','Aircraft-side boost/feed pump in this example.','fuel'],
 'electric.battery':['Aircraft electrical source','Battery or ground supply is outside the installed engine assembly.','start'],
 'electric.bus':['Aircraft electrical distribution','Aircraft bus supplies selected engine services and controls.','start'],
 'start.command':['Command information','An operator/control command enables starting energy; it is not that energy itself.','start'],
 'starter.supply':['Starting-energy interface','Aircraft-side contactor or APU/ground air supply in the chosen example.','start'],
 'demand':['Pilot / aircraft command','Prescribed demand enters the selected engine or propeller control loop.','control'],
 'airdata':['Aircraft information','Air-data information is an aircraft interface, not a standalone engine accessory.','control'],
 'cockpit':['Aircraft indication','Indications go to the aircraft display/crew. Display installation is not modeled.','control'],
 'channels':['Optional control architecture','Channel separation and redundancy are explanatory alternatives, not extra boxes asserted on every engine.','control']
};
export function applyInstallation(m){
 const fan=m.kind==='turbofan',heli=m.kind==='helicopter';
 const installed={
  'fuel.filter':[-3.65,-.9,1.28],'fuel.shutoff':[-4.5,-.85,1.1],'fuel.bypass':[-1.8,-1.65,1.05],
  'oil.tank':[.1,-.55,-1.5],'oil.pressure':[-2.5,-1.15,-.95],'oil.filter':[-1.45,-.7,-1.35],
  'oil.scavenge':[-3.3,-1.1,-.9],'oil.cooler':[1.15,-.45,-1.45],'oil.breather':[2.15,-.7,-1.2],
  'oil.relief':[-2.15,-1.65,-.95],'oil.vent':[2.9,-.45,-1.25],'starter':[-2.7,-1.2,1.65],
  'ignition.exciter':[.7,-.7,1.45],'starter.valve':[-3.6,-1.2,1.65]
 };
 for(const n of m.nodes){
  if(installed[n.id])n.anchor=[...installed[n.id]];
  if(fan&&(['controller','fuel.pump','fmu','accessory','electrical','fmu.position'].includes(n.id)||installed[n.id]))n.anchor=[n.anchor[0],n.anchor[1]*1.55,n.anchor[2]*1.55];
 }
 for(const n of m.nodes){if((installed[n.id]||['controller','fuel.pump','fmu','accessory','electrical','fmu.position'].includes(n.id))){const r=Math.hypot(n.anchor[1],n.anchor[2]),target=fan?2.35:Math.min(r,1.4);n.anchor=[n.anchor[0],n.anchor[1]*target/r,n.anchor[2]*target/r];}}
 for(const n of m.nodes){
  const boundary=INTERFACES[n.id];
  n.representation=boundary?'interface':m.nodes.some(p=>p.parentNodeId===n.id)&&!['compressor.casing','combustor.casing','combustor.liner','turbine.casing','fuel.nozzles','accessory','electrical','pitch.control','propeller','airframe','reduction'].includes(n.id)?'assembly':'physical';
  n.location=boundary?boundary[0]:n.group==='airframe'?'Aircraft / driven load':'Engine assembly';
  n.locationNote=boundary?boundary[1]:n.group==='airframe'?'Original generic installation geometry; only the highlighted engine is simulated.':'Representative position on or within the engine. Dimensions, exact brackets and service routing vary by installation.';
  n.preferredCircuit=boundary?.[2];
  if(n.id==='load.speed'){
   n.location='Aircraft / driven load';n.locationNote=heli?'Mounted beside the main-rotor mast after the main reduction; shown with the driven rotor context.':'Mounted at the propeller drive after the reduction; distinct from the engine power-shaft pickup.';n.preferredPreset='aircraft';
  }
  if(n.id.startsWith('oil.')||n.id==='chip')n.inspectionDirection=[-.4,.5,-1];
  else if(['fuel.filter','fuel.filter.cap','fuel.filter.element','fuel.shutoff','fuel.bypass','controller','fmu','fuel.pump','starter','starter.valve','ignition.exciter'].includes(n.id))n.inspectionDirection=[-.35,-.3,1];
  if(n.parentNodeId&&/\.cap$|\.element$/.test(n.id))n.anchor=[...m.nodes.find(p=>p.id===n.parentNodeId).anchor];
 }
 if(heli){
  for(const id of ['mast','rotor','swashplate','load.speed']){const n=m.nodes.find(n=>n.id===id);if(n)n.anchor[0]=AIRFRAME_LAYOUT.helicopter.mastX;}
  const {mastX,rotorY}=AIRFRAME_LAYOUT.helicopter;
  m.nodes.find(n=>n.id==='rotor').anchor=[mastX,rotorY,0];
  for(const id of ['pitch.control','swashplate'])m.nodes.find(n=>n.id===id).anchor=[mastX,rotorY-1.2,0];
  for(const id of ['tail.rotor','tail.gearbox']){
   const n=m.nodes.find(n=>n.id===id);
   if(n)n.anchor=[AIRFRAME_LAYOUT.helicopter.tailX,AIRFRAME_LAYOUT.helicopter.tailRotorY,id==='tail.rotor'?.75:0];
  }
  const tailDrive=m.nodes.find(n=>n.id==='tail.drive');tailDrive.anchor=[14,-2.5,0];tailDrive.explanation='The faster tail drive starts beside the slower main-drive shaft, then a short two-joint offset section centers the long shaft inside the tapering tail boom. The tail gearbox turns drive to the anti-torque rotor. Couplings are schematic and the plant uses the declared ideal constant gear ratio; joint-angle ripple, shaft flex and torsional vibration are not solved.';
  m.nodes.find(n=>n.id==='airframe').anchor=[-3,-3.5,0];const exhaust=m.nodes.find(n=>n.id==='exhaust');exhaust.name='Side exhaust ducts & collector';exhaust.motion='Stationary ducts; flow markers are explanatory.';exhaust.anchor=[3.75,.65,3.15];exhaust.explanation='Residual gas leaves through representative lateral outlets ahead of the aft reduction. The turned discharge avoids sending exhaust into the gearbox or tail drive. Duct shapes and flow division are original explanatory choices, not a specific engine installation; residual exhaust thrust and branch flow are not calculated.';
 }else{
  const prop=m.kind==='turboprop',airframe=m.nodes.find(n=>n.id==='airframe');airframe.anchor=[8,prop?.6:3.4,AIRFRAME_LAYOUT[m.kind].bodyZ];
  airframe.explanation='A generic twin-engine wing-mounted aircraft provides installation context. The near engine is the one selectable, numerically simulated engine; the far pod is an exterior context model. Propulsion supplies thrust while the wing supplies lift. No second-engine, flight-control or aircraft-motion plant is implied.';
  m.nodes.find(n=>n.id==='wing').anchor=[6,prop?2.05:2.65,AIRFRAME_LAYOUT[m.kind].bodyZ];
 }
 const base=m.nodes.find(n=>n.id==='airframe'),add=(id,name,explanation,anchor,source=heli?'helicopter':'airframe')=>m.nodes.push({...base,id,name,parentNodeId:'airframe',anchor,explanation,source,concept:id,instance:m.kind+':'+id,representation:'physical',recipe:null,fidelity:'Original generic airframe geometry; explanatory',motion:'Stationary installation context. Aircraft flight is not simulated.'});
 add('airframe.fuselage',heli?'Cabin & tail boom':'Fuselage','The fuselage carries occupants and joins the structural installation. A helicopter tail boom also supports the tail assembly. Shape and proportions here are original teaching geometry.',base.anchor,heli?'helicopter':'airframe');
 add('airframe.cockpit','Cockpit & cabin glazing','Windows identify the cabin and pilot viewpoint. They are surface context, not a cockpit instrument or visibility simulation.',heli?[-10,-2.5,0]:[-7,5,AIRFRAME_LAYOUT[m.kind].bodyZ]);
 add('airframe.tail','Tail surfaces',heli?'A representative fin and horizontal stabilizer provide tail context. Tail-rotor anti-torque is a separate mechanism.':'Horizontal and vertical stabilizers are distinct from the main wing. Elevator/rudder and flight dynamics are not simulated.',heli?[18,-.5,0]:[26,7,AIRFRAME_LAYOUT[m.kind].bodyZ]);
 add('airframe.landing',heli?'Landing skids':'Retracted gear doors','Landing supports and their attachment identify the airframe. Gear extension, suspension and ground dynamics are outside this engine study.',heli?[-3,-6,0]:[6,1,AIRFRAME_LAYOUT[m.kind].bodyZ]);
 add('airframe.mounts',heli?'Engine deck & mounts':'Engine pylons & mounts','Structural mounts carry engine loads into the airframe. They do not transmit a rotating shaft connection into the wing. Exact load paths and mount design depend on the installation.',heli?[.5,-1.7,0]:[1,2.7,0]);
 add('airframe.nacelle','Studied engine nacelle / cowling','The closed aircraft cowling encloses the engine and its installed accessories. '+(heli?'Separate lateral exhaust openings sit ahead of the reduction. ':'')+'Whole-aircraft view can open it with Cutaway; Engine assembly studies the hardware inside. This original envelope is not a manufacturer nacelle or an engine pressure casing.',[0,0,0]);
 if(!heli)add('airframe.companion','Far engine · exterior context only','These closed pods show the other engines in the illustrated airframe. Their internals, output, condition and controls are not separately simulated. The near engine remains the single engine under study.',[0,0,AIRFRAME_LAYOUT[m.kind].oppositeEngineZ]);
 return m;
}
export function isPhysicalNode(n){return !!n&&n.representation!=='interface';}
export function interfaceRoute(m,id){
 const node=m.nodes.find(n=>n.id===id),preferred=node?.preferredCircuit;
 if(preferred==='control')return {lens:'control'};
 if(preferred)return {lens:'services',circuit:preferred};
 for(const [name,route]of Object.entries(m.circuits))if(route.includes(id)||(m.circuitBranches[name]||[]).some(r=>r.includes(id)))return {lens:'services',circuit:name};
 return {lens:'anatomy'};
}

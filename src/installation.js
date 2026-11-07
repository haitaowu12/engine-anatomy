import {AIRFRAME_LAYOUT} from './airframe-geometry.js';

// Spatial meaning is explicit. An information boundary is not a little box
// installed next to the engine, and an aggregate is not an extra enclosure.
const INTERFACES={
 'fuel.tank':['Aircraft fuel supply','Aircraft tanks and feed system; position depends on the aircraft.','fuel'],
 'fuel.boost':['Aircraft fuel feed','Aircraft-side boost/feed pump in this example.','fuel'],
 'electric.battery':['Aircraft electrical source','Battery or ground supply is outside the installed engine assembly.','start'],
 'electric.bus':['Aircraft electrical distribution','Aircraft bus supplies selected engine services and controls.','start'],
 'start.command':['Command information','A starting request operates the contactor or valve that admits starting energy.','start'],
 'starter.supply':['Starting-energy interface','An aircraft contactor or compressed-air supply connects starting energy to the engine.','start'],
 'demand':['Pilot / aircraft command','Prescribed demand enters the selected engine or propeller control loop.','control'],
 'airdata':['Aircraft information','Aircraft instruments supply information about the surrounding air.','control'],
 'cockpit':['Aircraft indication','Engine measurements and status are presented to the crew on aircraft displays.','control'],
 'channels':['Control channels','Control channels, their electrical supplies and fault detection determine how the engine handles control faults.','control']
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
  n.locationNote=boundary?boundary[1]:n.group==='airframe'?'The highlighted engine is the one used by the numerical experiment.':'Shown at an example position on or within the engine; mounting and routing depend on the installation.';
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
  const tailDrive=m.nodes.find(n=>n.id==='tail.drive');tailDrive.anchor=[14,-2.5,0];tailDrive.explanation='The tail-drive branch runs faster than the main-rotor mast. Couplings carry it into the tail boom, and the tail gearbox turns the drive toward the anti-torque rotor. Follow this continuous route from the main transmission to the tail.';
  m.nodes.find(n=>n.id==='airframe').anchor=[-3,-3.5,0];const exhaust=m.nodes.find(n=>n.id==='exhaust');exhaust.name='Side exhaust ducts & collector';exhaust.motion='Stationary ducts; flow markers are explanatory.';exhaust.anchor=[3.75,.65,3.15];exhaust.explanation='Gas leaving the power turbine collects in ducts that turn it toward the side outlets. This example keeps the hot discharge clear of the aft gearbox and tail drive. The experiment reports shaft power; the outlets show where the remaining gas leaves.';
 }else{
  const prop=m.kind==='turboprop',airframe=m.nodes.find(n=>n.id==='airframe');airframe.anchor=[8,prop?.6:3.4,AIRFRAME_LAYOUT[m.kind].bodyZ];
  airframe.explanation='This example places two engines on the wings. The near engine is the one you can inspect and operate. Its thrust is carried through the mounts into the airframe, while airflow around the wing produces lift.';
  m.nodes.find(n=>n.id==='wing').anchor=[6,prop?2.05:2.65,AIRFRAME_LAYOUT[m.kind].bodyZ];
 }
 const base=m.nodes.find(n=>n.id==='airframe'),add=(id,name,explanation,anchor,source=heli?'helicopter':'airframe')=>m.nodes.push({...base,id,name,parentNodeId:'airframe',anchor,explanation,source,concept:id,instance:m.kind+':'+id,representation:'physical',recipe:null,fidelity:'Aircraft installation',motion:'Stationary airframe; the engine experiment changes its internal response.'});
 add('airframe.fuselage',heli?'Cabin & tail boom':'Fuselage','The fuselage houses occupants and equipment and connects the main structural assemblies. In a helicopter, the tail boom also supports the tail drive and tail surfaces.',base.anchor,heli?'helicopter':'airframe');
 add('airframe.cockpit','Cockpit & cabin glazing','The flight deck gives the crew a forward view and a place to monitor and control the aircraft. Cabin windows show the occupied section of the fuselage.',heli?[-10,-2.5,0]:[-7,5,AIRFRAME_LAYOUT[m.kind].bodyZ]);
 add('airframe.tail','Tail surfaces',heli?'The vertical fin and horizontal stabilizer contribute to stability during forward flight. The tail rotor provides the separate anti-torque and heading-control function.':'The horizontal stabilizer helps balance and stabilize pitch; the vertical fin helps stabilize yaw. Elevators and the rudder provide control about those axes.',heli?[18,-.5,0]:[26,7,AIRFRAME_LAYOUT[m.kind].bodyZ]);
 add('airframe.landing',heli?'Landing skids':'Retracted gear doors','The landing gear supports the aircraft on the ground and transfers landing loads into the structure. The helicopter view uses skids; the fixed-wing view shows the gear stowed.',heli?[-3,-6,0]:[6,1,AIRFRAME_LAYOUT[m.kind].bodyZ]);
 add('airframe.mounts',heli?'Engine deck & mounts':'Engine pylons & mounts','Engine mounts transfer weight, thrust, torque reactions and other loads into the airframe. A wing-mounted engine uses a pylon to connect its mount structure to the wing.',heli?[.5,-1.7,0]:[1,2.7,0]);
 add('airframe.nacelle','Studied engine nacelle / cowling','The cowling encloses the engine and its accessories and shapes the outside airflow. '+(heli?'Separate lateral exhaust openings sit ahead of the reduction. ':'')+'Use Cutaway in Whole aircraft to open the cowling, or Engine assembly to inspect the machinery inside. The cowling is separate from the internal pressure casings.',[0,0,0]);
 if(!heli)add('airframe.companion','Far engine · exterior context only','The far engine completes the installation view. Its internals and controls are not separately simulated; select the near engine to explore the running model.',[0,0,AIRFRAME_LAYOUT[m.kind].oppositeEngineZ]);
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

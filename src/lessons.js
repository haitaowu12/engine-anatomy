export const scenarios={helicopter:[['increase','Increase rotor collective'],['limit','Demand more at an engine limit'],['accessory','Add an accessory load']],turboprop:[['increase','More power at governed prop speed'],['limit','A torque request the engine cannot meet'],['accessory','Add an accessory load']],turbofan:[['increase','Increase the thrust request'],['limit','Demand more at an engine limit'],['accessory','Add an accessory load']]};
export function trialInputs(kind,scenario){if(scenario==='accessory')return {accessoryW:30000};if(scenario==='limit')return {demand:kind==='turbofan'?1:.7,fuelLimit:kind==='turbofan'?.65:.72};return {demand:kind==='turbofan'?.7:.55};}
export function lessonSteps(kind,scenario,d){
 const fan=kind==='turbofan',prop=kind==='turboprop',shaft=fan?'hp.shaft':'gg.shaft',load=fan?'fan.rotor':prop?'propeller':'rotor';
 if(scenario==='accessory')return [
  {short:'Extraction',node:'accessory',title:'The accessory drive asks for 30 kW more.',body:'The added mechanical draw acts on the gas-generator / HP shaft. It is separate from fuel energy and from electrical information signals.'},
  {short:'Imbalance',node:shaft,title:'Extra resisting torque changes shaft acceleration.',body:'Turbine work must now cover compressor work plus the added extraction. The independent driven shaft responds through the changing gas path.'},
  {short:'Feedback',node:prop?'torque':'speed.p',title:'The governed quantity starts to move.',body:prop?'Calculated output torque falls relative to the pilot target. The engine torque loop requests fuel; the separate prop governor continues to manage speed.':'The ideal speed pickup reports a deviation from the reference. More accessory load does not directly become a rotor-pitch or thrust command.'},
  {short:'Fuel',node:'fmu',title:'The controller request becomes metered fuel.',body:'Actual fuel follows the limited command with actuator lag. Heat and turbine work rise; there is no instantaneous power correction.'},
  {short:'Balance',node:load,title:'The engine finds a new work balance.',body:'With sufficient margin, the controller recovers the governed quantity while the gas-generator / HP turbine also supplies the extra accessory work. No generator voltage or electrical bus dynamics are solved.'}
 ];
 if(prop)return [
  {short:'Request',node:'demand',title:'Ask for more shaft torque.',body:'The pilot power request raises a synthetic turbine-side torque target. This chosen electronic engine loop controls fuel; it does not directly set propeller blade pitch.'},
  {short:'Fuel → torque',node:'fmu',title:'Fuel and turbine torque increase first.',body:'The limited fuel request reaches the metering unit, then the combustor. More gas work reaches the free turbine. Prop speed can rise while the aerodynamic load catches up.'},
  {short:'Governor',node:'prop.governor',title:'A separate governor detects prop overspeed.',body:'The speed governor requests coarser pitch. Its command goes to the propeller control unit, not back through the engine fuel command.'},
  {short:'Pitch → load',node:'pitch.actuator',title:'The pitch actuator adds absorbed torque.',body:'Actual geometric pitch approaches the governor request. The synthetic pitch-to-load relation increases resisting torque, bringing speed back toward its reference. Geometric pitch is not aerodynamic angle of attack.'},
  {short:'Outcome',node:'propeller',title:scenario==='limit'?'Speed can recover while torque demand remains unmet.':'More propeller power at nearly the same speed.',body:scenario==='limit'?'The engine fuel loop is constrained. The prop governor can reduce pitch to hold speed, so normal Np alone does not prove the requested torque is available. Watch torque error and the active engine limit.':'Fuel supplies the requested torque; pitch settles coarser to absorb it. Estimated propeller thrust rises at the prescribed forward airspeed. The wing supplies lift separately.'}
 ];
 if(fan)return [
  {short:'Request',node:'demand',title:'A thrust request becomes an N1 reference.',body:'This original teaching schedule raises fan/LP speed reference from 81% toward 93% (or 105% in the limit trial). It is not a calibrated thrust-lever schedule or measured thrust feedback.'},
  {short:'Metering',node:'fmu',title:'Fuel is requested before either spool catches up.',body:'The limited command and actual fuel differ because the metering actuator has lag. Added combustion energy reaches the high-pressure turbine and then the low-pressure turbine.'},
  {short:'Two spools',node:'lp.shaft',title:'Each spool responds to its own net torque.',body:'HPT drives HPC on the HP shaft. LPT drives fan and LPC on the LP shaft. Their speeds are independent, even though the shafts are concentric and the gas path couples their work.'},
  {short:'Two streams',node:'bypass',title:'Fan and core streams gain momentum.',body:'As fan speed rises, the bypass stream changes. Core-gas conditions also change. Separate idealized nozzle estimates contribute to total thrust; no engine thrust is turned directly into wing lift.'},
  {short:'Outcome',node:'exhaust',title:scenario==='limit'?'The reference may exceed the available engine envelope.':'A new fan speed and thrust balance.',body:scenario==='limit'?'The active fuel, temperature or N2 target limits metering. The fan cannot reach a higher reference simply because the pilot requested it. Read the actual active limit and N1 error.':'At the new speed, LP-turbine torque balances fan/LPC resistance and losses. The thrust estimate is higher; aircraft speed and altitude remain prescribed, not simulated.'}
 ];
 return [
  {short:'Collective',node:'pitch.control',title:'Collective changes rotor pitch and load.',body:'The visible blades take a higher geometric pitch. A declared equivalent-load law increases rotor resistance. This input belongs to rotor flight controls, not a direct FADEC collective actuator.'},
  {short:'Speed dip',node:'speed.p',title:'Load torque briefly exceeds turbine torque.',body:'The power shaft and reflected rotor inertia slow. The Np pickup senses this shaft before the reduction; the main-rotor speed is a distinct, geared quantity.'},
  {short:'Fuel request',node:'controller',title:'The governor asks the metering unit for more fuel.',body:'A speed error changes the PI request. The request passes through illustrative fuel, temperature and Ng targets; actual metering responds with lag.'},
  {short:'Gas → torque',node:'power.rotor',title:'Heat becomes work on two independent shafts.',body:'The gas-generator turbine covers compressor and accessory work. Remaining gas work increases free-turbine torque. There is no mechanical coupling between the two turbine shafts.'},
  {short:'Outcome',node:'rotor',title:scenario==='limit'?'A limit prevents full rotor-speed recovery.':'Speed recovers with more useful rotor power.',body:scenario==='limit'?'The engine cannot supply the requested load at reference speed under the active limit. The synthetic aerodynamic load falls as speed falls, so the model settles with persistent speed droop.':'As turbine torque catches up with resistance, power-shaft speed recovers. The idealized hover-force estimate rises. No aircraft altitude or full rotor aerodynamics are solved.'}
 ];
}
export function phaseFor(kind,scenario,s,d,active){if(!active)return 0;const t=s.t;if(t<.7)return 0;if(t<2.8)return 1;if(t<6)return 2;if(t<14)return 3;return 4;}

export function nearGovernedEquilibrium(kind,d){
 const targetMet=kind==='turboprop'?Math.abs(d.controlError)<2&&Math.abs(d.np-1)<.01:Math.abs(d.controlError)<.01;
 return d.limit==='None'&&targetMet&&Math.abs(d.netP)<.01*Math.max(1,Math.abs(d.qPower))&&Math.abs(d.netG)<.01*Math.max(1,Math.abs(d.qGas));
}

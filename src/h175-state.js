// Original teaching mechanism. These display rates and link dimensions are not
// measured LEGO gear ratios, set dimensions, rotor speeds or aircraft dynamics.
export const H175_SOURCES = Object.freeze({
  product:{title:'LEGO · Airbus H175 Rescue Helicopter 42145',url:'https://www.lego.com/en-us/product/airbus-h175-rescue-helicopter-42145'},
  instructions:{title:'LEGO · official 42145 building instructions',url:'https://www.lego.com/en-us/service/building-instructions/42145'},
  pdf:{title:'LEGO · operating features (392–393) and completed model (394)',url:'https://www.lego.com/cdn/product-assets/product.bi.core.pdf/6430765.pdf#page=392'},
  observation:{title:'New Elementary · first-hand 42145 build and function observations',url:'https://www.newelementary.com/2022/07/lego-technic-review-42145-airbus-h175.html'}
});
export const TAU=Math.PI*2;
export const WINCH_EFFECTIVE_RADIUS=.75,WINCH_CABLE_RANGE=10;
export const H175_LAYOUT=Object.freeze({mastX:-2,mastZ:0,rotorY:22,swashY:20.25,ringRadius:1.4,hingeRadius:1.7,horn:.85,bladeCount:5,tailBladeCount:3});
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function initialH175State(){return {motor:false,rotor:'slow',gearDrive:'neutral',winchDrive:'neutral',gear:0,winch:.25,collective:.35,cyclicFore:0,cyclicSide:0,cowl:0,doors:0,inspection:0,angle:0,motorAngle:0,drumAngle:0,time:0};}
export function normalizeH175State(s){return {...initialH175State(),...s,gear:clamp(Number(s.gear)||0,0,1),winch:clamp(Number(s.winch)||0,0,1),collective:clamp(Number(s.collective)||0,0,1),cyclicFore:clamp(Number(s.cyclicFore)||0,-1,1),cyclicSide:clamp(Number(s.cyclicSide)||0,-1,1),cowl:clamp(Number(s.cowl)||0,0,1),doors:clamp(Number(s.doors)||0,0,1),inspection:clamp(Number(s.inspection)||0,0,1)};}
export function advanceH175(s,dt){
  const n={...s};dt=clamp(dt,0,.1);n.time+=dt;
  if(!s.motor||s.inspection>0)return n;
  n.motorAngle=(n.motorAngle+dt*2.4)%TAU;
  if(s.rotor!=='off')n.angle=(n.angle+dt*(s.rotor==='fast'?1.05:.525))%TAU;
  if(s.gearDrive!=='neutral')n.gear=clamp(n.gear+dt*(s.gearDrive==='raise'?.18:-.18),0,1);
  if(s.winchDrive!=='neutral')n.winch=clamp(n.winch+dt*(s.winchDrive==='lower'?.14:-.14),0,1);
  // Cable leaves the drum's +X tangent; paying out is clockwise about +Z.
  n.drumAngle=s.drumAngle-(n.winch-s.winch)*WINCH_CABLE_RANGE/WINCH_EFFECTIVE_RADIUS;
  return n;
}
export function driveStatus(s,branch){
  if(s.inspection>0)return 'Inspection holds every powered output still';
  if(!s.motor)return 'Motor off';
  if(branch==='rotor')return s.rotor==='off'?'Rotor branch disengaged':s.rotor==='fast'?'Fast display speed':'Slow display speed';
  const command=branch==='gear'?s.gearDrive:s.winchDrive,value=branch==='gear'?s.gear:s.winch;
  if(command==='neutral')return 'Selector in neutral';
  if((command==='raise'&&value<=0&&branch==='winch')||(command==='raise'&&value>=1&&branch==='gear'))return 'Upper travel limit · output stopped';
  if((command==='lower'&&value>=1&&branch==='winch')||(command==='lower'&&value<=0&&branch==='gear'))return 'Lower travel limit · output stopped';
  return command==='raise'?'Raising':'Lowering';
}
export function swashPoint(phase,s,r=H175_LAYOUT.ringRadius){
  // The stationary ring tilts; the rotating ring follows the same plane. The
  // vertical mast does not tilt with the cyclic control.
  const a=s.cyclicSide*.08,b=s.cyclicFore*.08,x=r*Math.cos(phase),z=r*Math.sin(phase);
  const y1=-z*Math.sin(a),z1=z*Math.cos(a),x2=x*Math.cos(b)-y1*Math.sin(b),y2=x*Math.sin(b)+y1*Math.cos(b);
  return [H175_LAYOUT.mastX+x2,H175_LAYOUT.swashY+(s.collective-.35)*.4+y2,z1];
}
const baselinePitch=10*Math.PI/180;
export const PITCH_LINK_LENGTH=Math.hypot(H175_LAYOUT.hingeRadius-H175_LAYOUT.ringRadius,H175_LAYOUT.horn*Math.cos(baselinePitch),H175_LAYOUT.rotorY-H175_LAYOUT.swashY+H175_LAYOUT.horn*Math.sin(baselinePitch));
export function bladeLinkage(phase,s){
  const {mastX,rotorY,hingeRadius,horn}=H175_LAYOUT,lower=swashPoint(phase,s),u=[Math.cos(phase),0,Math.sin(phase)],v=[-Math.sin(phase),0,Math.cos(phase)],pivot=[mastX+hingeRadius*u[0],rotorY,hingeRadius*u[2]],d=pivot.map((x,i)=>x-lower[i]);
  const A=d[0]*v[0]+d[2]*v[2],B=d[1],C=(PITCH_LINK_LENGTH**2-d.reduce((t,x)=>t+x*x,0)-horn*horn)/(2*horn),R=Math.hypot(A,B);
  const alpha=Math.atan2(B,A),q=Math.acos(clamp(C/R,-1,1)),options=[alpha-q,alpha+q].map(a=>Math.atan2(Math.sin(a),Math.cos(a)));
  const pitch=options.sort((a,b)=>Math.abs(a-baselinePitch)-Math.abs(b-baselinePitch))[0];
  const upper=[pivot[0]+horn*v[0]*Math.cos(pitch),pivot[1]+horn*Math.sin(pitch),pivot[2]+horn*v[2]*Math.cos(pitch)];
  return {phase,pitch,lower,upper,pivot,feasible:Math.abs(C)<=R+1e-9,length:Math.hypot(...upper.map((x,i)=>x-lower[i]))};
}
export function bladePitchDegrees(s){return Array.from({length:5},(_,i)=>bladeLinkage(s.angle+i*TAU/5,s).pitch*180/Math.PI);}
export const H175_COMPONENTS=Object.freeze([
 {id:'whole',name:'Assembled model',short:'Whole model',view:'whole',eyebrow:'THE ASSEMBLED MODEL',description:'Explore the mechanisms of LEGO Technic set 42145. The red and white rescue helicopter has a yellow tail, a five-blade main rotor and retractable wheeled landing gear.',try:'Start the electric motor, then choose a powered function. Open the cowlings to see the mechanism inside the body.',boundary:'The study uses simplified original geometry to show the set’s main functions. The official instructions provide the complete building sequence.',source:'instructions'},
 {id:'rotor',name:'Five-blade rotor & pitch links',short:'Rotor head',view:'rotor',eyebrow:'MANUAL CONTROL → BLADE PITCH',description:'Collective moves the swashplate up or down, changing all five blades’ pitch together. Cyclic tilts the swashplate, so each blade’s pitch changes as it travels around the mast. Pitch links connect the rotating ring to the blades.',try:'Pause the rotor. Move collective, then either cyclic control. Step the rotor through a revolution and watch the pitch of each blade.',boundary:'Each blade follows a fixed-length pitch link. The model illustrates linkage motion with teaching dimensions; it does not calculate lift or flight.',source:'pdf'},
 {id:'drive',name:'One motor, selected mechanical branches',short:'Drive module',view:'drive',eyebrow:'BATTERY → MOTOR → GEARS',description:'One electric motor supplies the set’s powered functions. Mechanical selectors connect it to the rotors and replica engine, landing gear, or rescue winch. A branch in neutral stays still while another can run.',try:'Start the motor with the rotor selector off. Choose Lower under Rescue winch, then select slow or fast rotor drive. Compare which outputs move.',boundary:'The exposed transmission shows how one motor can drive selected outputs. Its tooth counts, ratios and display speeds are illustrative.',source:'observation'},
 {id:'gear',name:'Retractable wheeled landing gear',short:'Landing gear',view:'gear',eyebrow:'POWERED BRANCH → LINKAGE',description:'The landing-gear selector sends motor power to a folding linkage. Watch the nose leg and the two main legs pivot as the wheels move between extended and retracted positions.',try:'Start the motor and choose Raise under Landing gear. Return the selector to Neutral midway, then choose Lower.',boundary:'The study uses a representative retraction path and stops at each end of travel. Loads and clutch action are outside this linkage model.',source:'pdf'},
 {id:'winch',name:'Rescue winch, drum & hook',short:'Rescue winch',view:'winch',eyebrow:'ROTATION → CABLE TRAVEL',description:'The motor turns a drum to lower or raise the rescue hook. Paying out cable lowers the hook; winding it back onto the drum raises it.',try:'Start the motor and choose Lower under Rescue winch. Stop with Neutral, then choose Raise. Compare the drum’s rotation with the hook’s travel.',boundary:'The model couples drum angle to cable length using a fixed drum radius, so each turn moves a fixed length of cable.',source:'product'},
 {id:'covers',name:'Opening cowlings & cabin doors',short:'Open the body',view:'whole',eyebrow:'OPEN PANELS → SEE THE MECHANISM',description:'The front and rear upper covers, called cowlings, slide apart to reveal the rotor controls and replica engine. The cockpit doors hinge open, and the passenger doors slide along the cabin.',try:'Open the cowlings and start the rotor drive. Locate the electric motor, gearbox and rotating replica engine. Use Inspection to pause the mechanism and separate the panels.',boundary:'These panels use simplified original shapes. The electric motor also turns the replica engine visible inside the body.',source:'pdf'}
]);
export function h175Route(params){const part=H175_COMPONENTS.some(x=>x.id===params.get('part'))?params.get('part'):'whole';return{part};}

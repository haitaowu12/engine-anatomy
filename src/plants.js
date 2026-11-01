import * as shaft from './simulation.js';
export const DT=shaft.P.step;
export const GEAR=Object.freeze({helicopterMain:12,helicopterTail:3,propeller:10});
const {clamp,P}=shaft;
export const plantDefaults=kind=>({kind,demand:kind==='turbofan'?.4:.35,fuelLimit:1,ambientT:288,airspeed:kind==='turbofan'?100:kind==='helicopter'?0:70,accessoryW:0});
export const architectureNames={helicopter:'Turboshaft / helicopter',turboprop:'Turboprop / propeller aircraft',turbofan:'Turbofan / jet aircraft'};
export function fanThermodynamics(s,u){
 const k=2/7,core=2.4*s.wg/1000,bypass=12*s.wp/500,total=core+bypass;
 const fanPR=1+.45*(s.wp/500)**2,lpcPR=1+.8*(s.wp/500)**2,hpcPR=1+4*(s.wg/1000)**2;
 const tFan=u.ambientT*(1+(fanPR**k-1)/.85),t25=tFan*(1+(lpcPR**k-1)/.82),t3=t25*(1+(hpcPR**k-1)/.82);
 const gas=core+s.fuel,heat=s.fuel*P.LHV*.98,t4=t3+heat/(gas*P.cp),pr=fanPR*lpcPR*hpcPR;
 const expand=pr*.95/1.35,hpr=expand**.55,lpr=expand/hpr;
 const t5=t4*(1-.87*(1-hpr**(-k))),t6=t5*(1-.87*(1-lpr**(-k)));
 const fanW=total*P.cp*(tFan-u.ambientT),lpcW=core*P.cp*(t25-tFan),compressorW=core*P.cp*(t3-t25);
 const bypassV=Math.sqrt(Math.max(0,2*.95*P.cp*tFan*(1-fanPR**(-k))));
 const coreV=Math.sqrt(Math.max(0,2*.95*P.cp*t6*(1-1.35**(-k))));
 return {air:core,gas,bypass,total,heat,pr,fanPR,lpcPR,hpcPR,tFan,t25,t3,t4,t5,t6,p3:101325*pr,p4:101325*pr*.95,
  fanW,lpcW,compressorW,gTurbineW:gas*P.cp*(t4-t5),pTurbineW:gas*P.cp*(t5-t6),
  bypassV,coreV,bypassThrust:bypass*(bypassV-u.airspeed),coreThrust:gas*(coreV-u.airspeed)};
}
export function observePlant(kind,s,u){
 if(kind==='helicopter'){
  const d=shaft.observe(s,{load:u.demand,fuelLimit:u.fuelLimit,ambientT:u.ambientT,accessoryW:u.accessoryW});
  const rho=101325/(287*u.ambientT),rotorPower=d.outputW*.94;
  return {...d,kind,speedReference:1,controlled:d.np,controlError:1-d.np,
   torqueReference:null,bladeAngle:8+18*u.demand,loadCommand:u.demand,pitchCommand:null,
   rotorOmega:s.wp/GEAR.helicopterMain,thrust:(Math.max(0,rotorPower)*Math.sqrt(2*rho*45))**(2/3),
   alphaG:d.netG/P.Jg,alphaP:d.netP/P.Jp,probeT:d.t5,probeLabel:'Post gas-generator gas temperature',fuelActual:s.fuel,
   controlRole:'Np speed governor',fanW:0,bypass:0};
 }
 if(kind==='turboprop'){
  const base=shaft.observe(s,{load:s.beta,fuelLimit:u.fuelLimit,ambientT:u.ambientT,accessoryW:u.accessoryW});
  const qLoad=800*s.beta*base.np**2*(.85+.15*u.airspeed/70),qRef=800*u.demand+8;
  const raw=.02112+.000055*(qRef-base.qPower)+s.integral;
  const command=clamp(raw,P.minFuel,base.cap);
  const pitchRaw=.35+1.25*(base.np-1)+s.pitchIntegral,pitchCommand=clamp(pitchRaw,.18,1.1);
  const outputW=qLoad*s.wp,netP=base.qPower-qLoad-base.lossQ;
  return {...base,kind,qLoad,raw,command,limit:raw>base.cap+.0001?base.capKind:'None',
   outputW,netP,alphaG:base.netG/P.Jg,alphaP:netP/P.Jp,
   torqueReference:qRef,controlled:base.qPower,controlError:qRef-base.qPower,speedReference:1,
   pitchCommand,pitchRaw,bladeAngle:8+32*s.beta,loadCommand:s.beta,rotorOmega:s.wp/GEAR.propeller,
   thrust:.78*outputW/u.airspeed,probeT:base.t5,probeLabel:'Post gas-generator gas temperature',fuelActual:s.fuel,
   controlRole:'Shaft-torque fuel loop + separate prop speed governor',fanW:0,bypass:0};
 }
 const th=fanThermodynamics(s,u),ng=s.wg/1000,np=s.wp/500,reference=.65+.4*u.demand;
 const qGas=th.gTurbineW/s.wg,qCompressor=th.compressorW/s.wg,qGLoad=(20000+u.accessoryW+8000*ng*ng)/s.wg;
 const qPower=th.pTurbineW/s.wp,qLoad=(th.fanW+th.lpcW)/s.wp,lossQ=10*np;
 const maxFuel=.065*u.fuelLimit,tempFuel=(1400-th.t3)*th.air*P.cp/(P.LHV*.98-(1400-th.t3)*P.cp);
 const cap=Math.min(maxFuel,tempFuel,.038+.1*(1.3-ng));
 const raw=.036+.085*(reference-np)+s.integral,command=clamp(raw,.014,cap);
 const limit=raw>cap+.0001?(cap===maxFuel?'Fuel ceiling':cap===tempFuel?'Temperature target':'N2 target'):'None';
 return {...th,kind,ng,np,qGas,qCompressor,qGLoad,qPower,qLoad,lossQ,raw,command,cap,limit,
  netG:qGas-qCompressor-qGLoad,netP:qPower-qLoad-lossQ,
  alphaG:(qGas-qCompressor-qGLoad)/1.0,alphaP:(qPower-qLoad-lossQ)/5,
  outputW:th.fanW+th.lpcW,thrust:th.bypassThrust+th.coreThrust,speedReference:reference,controlled:np,controlError:reference-np,
  torqueReference:null,bladeAngle:null,pitchCommand:null,loadCommand:null,rotorOmega:s.wp,
  probeT:th.t6,probeLabel:'Turbine-exit gas temperature',fuelActual:s.fuel,controlRole:'N1 fan-speed fuel loop'};
}
export function stepPlant(kind,s,u,dt=DT){
 if(!Number.isFinite(dt)||dt<=0||dt>.02)throw new RangeError('Use a positive step of at most 20 ms.');
 const d=observePlant(kind,s,u),error=d.controlError;
 const gain=kind==='turboprop'?.000018:kind==='turbofan'?.025:P.ki;
 const minFuel=kind==='turbofan'?.014:P.minFuel;
 const integrate=(d.raw<=d.cap&&d.raw>=minFuel)||(d.raw>d.cap&&error<0)||(d.raw<minFuel&&error>0);
 const next={...s,t:s.t+dt,wg:s.wg+dt*d.alphaG,wp:s.wp+dt*d.alphaP,
  fuel:s.fuel+dt*(d.command-s.fuel)/(kind==='turbofan'?.4:P.actuatorTau),
  integral:clamp(s.integral+(integrate?dt*gain*error:0),-.025,.04),
  angleG:(s.angleG+s.wg*dt)%(Math.PI*2*15000),angleP:(s.angleP+s.wp*dt)%(Math.PI*2*15000),
  flowPhase:(s.flowPhase+d.air*dt*.035)%1,bypassPhase:(s.bypassPhase+(d.bypass??0)*dt*.008)%1,probe:s.probe+dt*(d.probeT-s.probe)/.5};
 if(kind==='turboprop'){
  const pe=d.np-1,pi=(d.pitchRaw>=.18&&d.pitchRaw<=1.1)||(d.pitchRaw>1.1&&pe<0)||(d.pitchRaw<.18&&pe>0);
  next.beta=s.beta+dt*(d.pitchCommand-s.beta)/.45;
  next.pitchIntegral=clamp(s.pitchIntegral+(pi?dt*.45*pe:0),-.25,.7);
 }
 if(!Object.values(next).every(Number.isFinite)||next.wg<=0||next.wp<=0)throw new RangeError('Outside the supported running envelope. Reset the trial.');
 return next;
}
export function initialPlant(kind){
 const u=plantDefaults(kind);let s=kind==='turbofan'?{t:0,wg:1000,wp:450,fuel:.04,integral:0,angleG:0,angleP:0,flowPhase:0,bypassPhase:0,probe:750,beta:.35,pitchIntegral:0}:{...shaft.initialState(),bypassPhase:0,probe:725,beta:.35,pitchIntegral:0};
 for(let i=0;i<120*120;i++)s=stepPlant(kind,s,u);
 return {...s,t:0,angleG:0,angleP:0,flowPhase:0,bypassPhase:0};
}
export function createPlantRunner(kind){
 let s=initialPlant(kind),acc=0;
 return {kind,get state(){return s;},reset(){s=initialPlant(kind);acc=0;},
 advance(elapsed,u,onStep){if(!Number.isFinite(elapsed)||elapsed<0)throw new RangeError('Elapsed time must be finite and nonnegative.');acc+=elapsed;
  while(acc+1e-10>=DT){s=stepPlant(kind,s,u);acc-=DT;onStep?.(s,observePlant(kind,s,u));}return s;}};
}

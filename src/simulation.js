/** Original, synthetic running-envelope model. SI units throughout. See docs/MODEL.md. */
export const P = Object.freeze({cp:1005,gamma:1.4,LHV:43e6,etaBurn:.98,etaC:.8,etaT:.86,
  ambientT:288,ambientP:101325,referenceG:1000,referenceP:500,Jg:.5,Jp:8,
  accessoryW:12000,gasLossW:10000,powerLossQ:8,baseFuel:.02344,maxFuel:.033,
  minFuel:.012,tempLimit:1100,maxNg:1.23,actuatorTau:.28,kp:.06,ki:.012,step:1/120});
export const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function thermodynamics(s){
  const n=s.wg/P.referenceG, air=2.4*n, pr=1+5*n*n, k=(P.gamma-1)/P.gamma;
  const t3=P.ambientT*(1+(pr**k-1)/P.etaC), p3=P.ambientP*pr;
  const gas=air+s.fuel, heat=s.fuel*P.LHV*P.etaBurn;
  // Equal, constant cp for air and gas; injected fuel enters at T3 in this idealization.
  const t4=t3+heat/(gas*P.cp), totalPR=pr*.95, gPR=totalPR**.7;
  const t5=t4*(1-P.etaT*(1-gPR**(-k)));
  const t6=t5*(1-P.etaT*(1-(totalPR/gPR)**(-k)));
  return {air,gas,heat,pr,t3,t4,t5,t6,p3,p4:p3*.95,
    compressorW:air*P.cp*(t3-P.ambientT),gTurbineW:gas*P.cp*(t4-t5),
    pTurbineW:gas*P.cp*(t5-t6)};
}
export function observe(s,u){
  const th=thermodynamics(s), ng=s.wg/P.referenceG,np=s.wp/P.referenceP;
  const qGas=th.gTurbineW/s.wg,qCompressor=th.compressorW/s.wg;
  const qGLoad=(P.accessoryW+P.gasLossW*ng*ng)/s.wg;
  const qPower=th.pTurbineW/s.wp,qLoad=u.load*800*np*np,lossQ=P.powerLossQ*np;
  const fuelCeiling=P.maxFuel*u.fuelLimit;
  // Algebraic fuel cap targets T4; actuator lag permits a short transient around that target.
  const tempFuel=(P.tempLimit-th.t3)*th.air*P.cp/(P.LHV*P.etaBurn-(P.tempLimit-th.t3)*P.cp);
  const ngCap=clamp(P.baseFuel+.08*(P.maxNg-ng),P.minFuel,P.maxFuel);
  const cap=Math.min(fuelCeiling,tempFuel,ngCap);
  const raw=P.baseFuel+P.kp*(1-np)+s.integral;
  const command=clamp(raw,P.minFuel,cap);
  let limit='None';
  if(raw>cap+.0001) limit=cap===fuelCeiling?'Fuel ceiling':cap===tempFuel?'Temperature target':'Ng target';
  return {...th,ng,np,qGas,qCompressor,qGLoad,qPower,qLoad,lossQ,raw,cap,command,limit,
    outputW:qLoad*s.wp,netG:qGas-qCompressor-qGLoad,netP:qPower-qLoad-lossQ};
}
export function step(s,u,dt=P.step){
  if(!Number.isFinite(dt)||dt<=0||dt>.02) throw new RangeError('Use a positive step no larger than 20 ms.');
  const d=observe(s,u),error=1-d.np;
  // Conditional integration: unwind freely, but do not wind up against saturation.
  const integrate=(d.raw<=d.cap&&d.raw>=P.minFuel)||(d.raw>d.cap&&error<0)||(d.raw<P.minFuel&&error>0);
  const next={t:s.t+dt,wg:s.wg+dt*d.netG/P.Jg,wp:s.wp+dt*d.netP/P.Jp,
    fuel:s.fuel+dt*(d.command-s.fuel)/P.actuatorTau,
    integral:clamp(s.integral+(integrate?dt*P.ki*error:0),-.012,.022),
    angleG:(s.angleG+s.wg*dt)%(Math.PI*2*250),angleP:(s.angleP+s.wp*dt)%(Math.PI*2*2500),flowPhase:(s.flowPhase+d.air*dt*.035)%1};
  if(!Object.values(next).every(Number.isFinite)||next.wg<=0||next.wp<=0) throw new RangeError('Outside the supported running envelope. Reset the model.');
  return next;
}
export const defaultInputs=()=>({load:.35,fuelLimit:1});
export function initialState(){
  // Settle a running engine; startup and shutdown are deliberately out of scope.
  let s={t:0,wg:850,wp:500,fuel:.022,integral:-.0014,angleG:0,angleP:0,flowPhase:0};
  const u=defaultInputs();for(let i=0;i<120*90;i++)s=step(s,u);
  return {...s,t:0,angleG:0,angleP:0,flowPhase:0};
}
export function createRunner(state=initialState()){
  let s={...state},accumulator=0;
  return {get state(){return s;},reset(){s=initialState();accumulator=0;},
    advance(seconds,u,onStep){
      if(!Number.isFinite(seconds)||seconds<0)throw new RangeError('Elapsed time must be finite and nonnegative.');
      accumulator+=seconds;
      while(accumulator+1e-10>=P.step){s=step(s,u);accumulator-=P.step;onStep?.(s,observe(s,u));}
      return s;
    }};
}

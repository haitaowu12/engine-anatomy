import {THREE, GEO} from 'machine-kit';
import {h175Exterior} from './h175-exterior.mjs';
import {group, mesh, revolved} from './hardware.mjs';

const skin = new THREE.MeshStandardMaterial({color:0xc8d0d5, metalness:.18, roughness:.42, side:THREE.DoubleSide});
const trim = new THREE.MeshPhysicalMaterial({color:0x264f67,metalness:.06,roughness:.40,clearcoat:.48,side:THREE.DoubleSide});
const dashTrim = new THREE.MeshPhysicalMaterial({color:0x8c2833,roughness:.37,clearcoat:.48,side:THREE.DoubleSide});
const chrome = new THREE.MeshStandardMaterial({color:0xa3aab0,metalness:.75,roughness:.24});
const rubber = new THREE.MeshStandardMaterial({color:0x242729,roughness:.76});
const dark = new THREE.MeshStandardMaterial({color:0x263743,metalness:.16,roughness:.30,side:THREE.DoubleSide});
const panelInk = new THREE.MeshStandardMaterial({color:0x879198,roughness:.62});

// Spanwise loft of closed airfoil sections. Stations are [leading x, y, z,
// chord, thickness]. Coordinates describe the representative airframe only.
function liftingSurface(parent, stations, material = skin, leadingEdge) {
  const points = [], indices = [], leading = [], count = 32;
  for (const [x,y,z,chord,thickness] of stations) {
    for (let i=0;i<count;i++) {
      const angle = 2*Math.PI*i/count;
      const t = (1-Math.cos(angle))/2;
      points.push(x+chord*t,y+thickness*Math.sin(angle)*(1-.65*t),z);
    }
  }
  for (let row=1;row<stations.length;row++) {
    for (let i=0;i<count;i++) {
      const a=(row-1)*count+i, b=(row-1)*count+(i+1)%count;
      const bucket=leadingEdge&&(i<4||i>=count-4)?leading:indices;
      bucket.push(a,b,b+count,a,b+count,a+count);
    }
  }
  const end = (stations.length-1)*count;
  for (let i=1;i<count-1;i++) indices.push(0,i+1,i,end,end+i,end+i+1);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(points,3));
  geometry.setIndex([...indices,...leading]);
  if(leadingEdge){
    geometry.addGroup(0,indices.length,0);
    geometry.addGroup(indices.length,leading.length,1);
  }
  geometry.computeVertexNormals();
  return mesh(parent,geometry,leadingEdge?[material,leadingEdge]:material);
}

// Resample the measured contour stations with a monotone cubic. The same
// radii locate the fuselage skin, glazing and door outlines.
function sampleProfile(stations,step) {
  const slope=(a,b)=>(b[0]-a[0])/(b[1]-a[1]);
  const tangent=(a,b)=>a*b>0?2*a*b/(a+b):0;
  return stations.flatMap(([r,x],i)=>{
    if(i===stations.length-1)return [[r,x]];
    const next=stations[i+1],dx=next[1]-x,d=slope(stations[i],next);
    const a=i?tangent(slope(stations[i-1],stations[i]),d):d;
    const b=i+2<stations.length?tangent(d,slope(next,stations[i+2])):d;
    const steps=Math.ceil(dx/step);
    return Array.from({length:steps},(_,j)=>{
      const t=j/steps;
      const smooth=(2*t**3-3*t*t+1)*r+(-2*t**3+3*t*t)*next[0]+dx*((t**3-2*t*t+t)*a+(t**3-t*t)*b);
      return [smooth,x+dx*t];
    });
  });
}

function skinSurface(profile,y) {
  return (x,angle,side,offset)=>{
    const k=profile.findIndex(([,station])=>station>x);
    const [r0,x0]=profile[k-1],[r1,x1]=profile[k];
    const radius=THREE.MathUtils.lerp(r0,r1,(x-x0)/(x1-x0))+offset;
    return [x,y+radius*Math.sin(angle),side*radius*Math.cos(angle)];
  };
}

function glazing(parent,surface,side,corners,steps) {
  const pos=[],idx=[],mix=THREE.MathUtils.lerp;
  for(let i=0;i<=steps;i++)for(let j=0;j<=steps;j++){
    const u=i/steps,v=j/steps;
    const x=mix(mix(corners[0][0],corners[1][0],u),mix(corners[3][0],corners[2][0],u),v);
    const a=mix(mix(corners[0][1],corners[1][1],u),mix(corners[3][1],corners[2][1],u),v);
    pos.push(...surface(x,a,side,.022));
    if(i&&j){
      const d=i*(steps+1)+j,k=d-steps-2;
      idx.push(k,k+1,d,k,d,d-1);
    }
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  geo.setIndex(idx);geo.computeVertexNormals();
  return mesh(parent,geo,dark);
}

function panelLine(parent,surface,side,outline,radius) {
  const points=[];
  for(let i=0;i<outline.length;i++){
    const [x,a]=outline[i], [endX,endA]=outline[(i+1)%outline.length];
    for(let j=0;j<6;j++)points.push(surface(THREE.MathUtils.lerp(x,endX,j/6),THREE.MathUtils.lerp(a,endA,j/6),side,.014));
  }
  points.push(points[0]);
  return mesh(parent,GEO.pipe(points,radius,6),panelInk);
}

function pylonMesh(parent, lead, height, width, material) {
  const shape=new THREE.Shape();
  shape.moveTo(-.31,.85);
  shape.lineTo(lead+.37,height);
  shape.lineTo(lead+1.76,height);
  shape.lineTo(1.98,.76);
  shape.closePath();
  mesh(parent,new THREE.ExtrudeGeometry(shape,{depth:width,bevelEnabled:false}),material,[0,0,-width/2]);
}

function propeller(parent,x,radius) {
  const rotor=group(parent,x);
  mesh(rotor,GEO.rotor({count:4,axis:'x',r0:.26,r1:radius,chord:[.31,.17],
    thick:[.14,.085],camber:.038,pitch:1.04,twist:.48,sweep:.07}),dark);
  return rotor;
}

// DHC-8-300 and A340-300 reference exteriors, in metres.
function fixedWing(parent,jet) {
  const length=jet?63.69:25.68, halfSpan=jet?30.15:13.715;
  const r=jet?2.82:1.36, y=jet?5.55:2.67, nose=-length*.42, tail=length*.58;
  const profile=sampleProfile([
    [0,nose],[r*.17,nose+r*.09],[r*.39,nose+r*.32],[r*.72,nose+r*.87],
    [r*.91,nose+r*1.43],[r,nose+r*2.17],[r,tail-r*5.05],
    [r*.96,tail-r*3.8],[r*.79,tail-r*2.55],[r*.54,tail-r*1.52],
    [r*.25,tail-r*.61],[r*.055,tail-r*.08],[0,tail]
  ],jet?.24:.13);
  revolved(parent,profile,skin,y);
  const surface=skinSurface(profile,y);
  const rotors=[];
  const axle=(x,cy,z,radius,width)=>{
    mesh(parent,GEO.disc(radius,width,.045,32),rubber,[x,cy,z],[Math.PI/2,0,0]);
    mesh(parent,GEO.disc(radius*.49,width+.04,.018,24),chrome,[x,cy,z],[Math.PI/2,0,0]);
  };
  const strut=(x,lo,hi,z)=>mesh(parent,GEO.pipe([[x,lo,z],[x-.13,hi,z]],jet?.17:.083,12),chrome);
  const wingX=jet?-3.75:-2.0, wingY=jet?4.32:3.48;
  const wing=(span)=>{
    const t=span/halfSpan;
    return [wingX+(jet?17.8:1.8)*t,wingY+(jet?2.9:.48)*t,jet?11.0*(1-t)+2.05*t:3.86*(1-t)+1.34*t];
  };
  for(const side of [-1,1]) {
    const pane=coords=>glazing(parent,surface,side,coords.map(([x,a])=>[nose+r*x,a]),12);
    pane([[.99,1.532],[1.77,1.526],[1.84,.77],[1.36,.71]]);
    pane([[1.82,1.09],[2.25,.91],[2.29,.62],[1.89,.69]]);
    if(jet)pane([[2.30,.90],[2.57,.78],[2.63,.62],[2.35,.62]]);
    const count=jet?44:23;
    for(let i=0;i<count;i++) {
      const x=nose+length*(.143+i*(jet?.0152:.0288));
      if(i===0||i===(jet?13:11))continue;
      const w=r*.085,h=jet?.061:.084;
      glazing(parent,surface,side,[[x-w,.23+h],[x+w,.23+h],[x+w*.88,.23-h],[x-w*.88,.23-h]],4);
    }
    for(const x of jet?[nose+7.9,nose+19.6,nose+42.0,tail-8.8]:[nose+3.9,tail-4.6]){
      const w=jet?.44:.30;
      panelLine(parent,surface,side,[[x-w,.43],[x+w,.43],[x+w,-.28],[x-w,-.28]],jet?.019:.013);
      glazing(parent,surface,side,[[x-w*.25,.30],[x+w*.25,.30],[x+w*.25,.16],[x-w*.25,.16]],4);
    }
    liftingSurface(parent,[0,.29,.72,1].map(t=>{
      const [x,h,chord]=wing(t*halfSpan);
      return [x,h,side*t*halfSpan,chord,(jet?.79:.30)*(1-t)+(jet?.095:.06)*t];
    }),skin,jet?chrome:dark);
    const tip=wing(halfSpan);
    if(jet){
      const fence=liftingSurface(parent,[[0,0,-.32,tip[2]*.64,.046],[-.26,0,0,tip[2],.088],[.58,0,1.23,.71,.035]],trim);
      fence.position.set(tip[0]+.21,tip[1],side*(halfSpan-.035));
      fence.rotation.x=-Math.PI/2;
    }
    const hx=tail-(jet?14.2:4.15), hy=jet?5.55:7.21, hs=jet?9.8:4.35;
    liftingSurface(parent,[[hx,hy,0,jet?8.4:2.73,jet?.54:.21],
      [hx+(jet?5.6:1.28),hy+(jet?.60:.03),side*hs,jet?2.4:.88,jet?.13:.068]],skin,jet?chrome:dark);
    for(const zAbs of (jet?[10.52,20.2]:[4.08])) {
      const z=side*zAbs, [lead,wingCenter]=wing(zAbs);
      const x=lead-(jet?1.67:1.38), cy=jet?wingCenter-2.04:wingCenter-.52;
      const pod=group(parent,x,cy,z);
      if(jet) {
        pylonMesh(pod,lead-x,wingCenter-cy,.46,skin);
        revolved(pod,[[.96,-2.45],[1.21,-2.31],[1.30,-1.79],[1.29,-.75],[1.15,.87],
          [.91,2.09],[.76,2.86],[.63,2.86],[.76,1.93],[1.04,.80],[1.13,-.78],[1.05,-2.18],[.96,-2.45]],skin);
        revolved(pod,[[.97,-2.45],[1.18,-2.37],[1.12,-2.23],[.97,-2.45]],chrome);
        mesh(pod,GEO.rotor({count:28,axis:'x',r0:.24,r1:.94,chord:[.20,.14],thick:.1,pitch:.68,twist:-.33}),dark,[-1.87,0,0]);
        revolved(pod,[[0,-2.16],[.16,-2.09],[.29,-1.81],[0,-1.81]],chrome);
        revolved(pod,[[0,3.05],[.23,3.03],[.43,2.35],[.02,2.35],[0,3.05]],chrome);
      } else {
        revolved(pod,[[.36,-1.55],[.57,-1.42],[.73,-1.08],[.76,-.33],[.72,.65],
          [.65,1.44],[.48,2.71],[.19,3.52],[.018,3.77],[0,3.78]],dashTrim);
        revolved(pod,[[0,-2.12],[.14,-2.07],[.34,-1.78],[.37,-1.52],[0,-1.52]],chrome);
        mesh(pod,GEO.tube(.19,.145,.48,32),chrome,[.58,-.36,side*.52],[0,0,-Math.PI/2]);
        rotors.push(propeller(pod,-1.73,1.98));
      }
    }
    const gearX=jet?2.95:-.10, gearZ=side*(jet?5.62:4.08);
    strut(gearX,jet?.68:.43,jet?wing(Math.abs(gearZ))[1]-.14:2.86,gearZ);
    for(const dx of (jet?[-.68,.68]:[0]))for(const dz of (jet?[-.34,.34]:[-.19,.19]))
      axle(gearX+dx,jet?.65:.43,gearZ+dz,jet?.65:.43,jet?.39:.24);
    if(jet){
      mesh(parent,GEO.rbox(1.53,.20,.37,.085),panelInk,[gearX,.65,gearZ]);
      mesh(parent,GEO.pipe([[gearX,.94,gearZ],[gearX+1.66,wing(Math.abs(gearZ))[1]-.19,gearZ]],.10,12),chrome);
    }
  }
  // The fin root extends through the narrowing tailcone. Keeping the top
  // station fixed preserves the Dash's T-tail height.
  const fin=liftingSurface(parent,[[0,0,jet?-.54:-.47,jet?10.4:5.05,jet?.62:.26],
    [0,0,0,jet?10.4:5.05,jet?.62:.26],
    [jet?1.10:.38,0,jet?1.42:.84,jet?9.25:4.51,jet?.57:.22],
    [jet?4.8:1.44,0,jet?6.32:3.12,jet?5.5:2.72,jet?.34:.13],
    [jet?7.3:2.25,0,jet?10.92:4.27,jet?3.1:1.84,jet?.15:.086]],jet?trim:dashTrim);
  fin.position.set(tail-(jet?14.5:5.6),y+(jet?.80:.55),0);
  fin.rotation.x=-Math.PI/2;
  if(jet){
    strut(5.16,.60,3.10,0);
    for(const z of [-.32,.32])axle(5.16,.53,z,.53,.36);
  }
  const frontX=nose+(jet?7.75:3.35), noseR=jet?.43:.30;
  strut(frontX,noseR,y-r+.17,0);
  for(const z of (jet?[-.29,.29]:[-.16,.16]))axle(frontX,noseR,z,noseR,jet?.29:.18);
  return {length, center:[jet?3.5:1.0,y,0], animate:phase=>rotors.forEach(rotor=>rotor.rotation.x=phase)};
}
// The wide view uses a scale model with the inspected engine station marked.
// It lives beside the engine scene so its bounds cannot change the cut planes,
// contact shadow or camera presets used for inspecting individual parts.
export function aircraftOverview(lab,kind) {
  const airframe=group(lab.root);
  const frame=kind==='helicopter' ? h175Exterior(airframe) : fixedWing(airframe,kind==='turbofan');
  const scale=lab.size/frame.length;
  airframe.scale.setScalar(scale);
  airframe.position.set(-frame.center[0]*scale,0,0);
  airframe.visible=false;
  const query=new URLSearchParams(location.search);
  const embed=query.get('embed')==='aircraft';
  const controls = document.createElement('div');
  controls.className='machine-subsystems on';
  const button=document.createElement('button');
  button.type='button';
  button.textContent='Whole aircraft';
  button.setAttribute('aria-pressed','false');
  const caption=document.createElement('p');
  caption.textContent=kind==='helicopter'
    ? 'H175 exterior study · twin PT6C-67E powerplants. Engine bench: XT700.'
    : kind==='turboprop' ? 'Dash 8-300 exterior · PW123 family. Engine bench: PT6A-100.' : 'A340-300 exterior · four CFM56-5C engines.';
  caption.hidden=true;
  controls.append(button,caption);
  lab.ui.querySelector('.lab-ctls').append(controls);
  let previous, inspection, selection;
  const fixedWingExterior=kind!=='helicopter';
  function close(restoreView=true) {
    airframe.visible=false;
    lab.machine.visible=true;
    if(fixedWingExterior)lab.ao.enabled=lab.quality==='full';
    lab.stage.querySelector('.lab-scale').style.visibility='';
    button.setAttribute('aria-pressed','false');
    caption.hidden=true;
    lab.ui.classList.remove('aircraft-overview');
    if (restoreView) lab.setView(previous);
  }
  let aircraftView;
  function open() {
    previous=lab.view;
    selection=lab._selection;
    lab.toggle('labels',false);
    inspection = ['cut','xray','explode','labels'].map(key=>[key,lab.target[key]]);
    lab.stage.querySelector('.lab-scale').style.visibility='hidden';
    airframe.visible=true;
    lab.machine.visible=false;
    if(fixedWingExterior)lab.ao.enabled=false;
    button.setAttribute('aria-pressed','true');
    caption.hidden=false;
    lab.ui.classList.add('aircraft-overview');
    const stageAspect=lab.stage.clientWidth/Math.max(1,lab.stage.clientHeight);
    const framing=Math.max(embed?.56:1,1.42/stageAspect);
    aircraftView={az:kind==='helicopter' ? -30 : kind==='turbofan' ? -76 : -39,el:kind==='helicopter' ? 12 : 13,
      dist:(kind==='helicopter' ? 1.53 : 1.66)*framing,
      target:[0,(frame.center[1]-(embed?.02*frame.length:0))*scale,0],fov:35};
    lab.setView(aircraftView);
  }
  button.addEventListener('click',()=>airframe.visible ? close() : open());
  if(embed) {
    lab.ui.classList.add('embedded-aircraft');
    const style=document.createElement('style');
    style.textContent='.embedded-aircraft .lab-side{display:none}.embedded-aircraft .lab-stage{height:100dvh!important;width:100%!important;max-width:none!important}.embedded-aircraft .lab-labels{display:none}';
    document.head.append(style);
    lab.stage.setAttribute('aria-label','Realistic aircraft. Drag to orbit and scroll to zoom.');
    lab.onTick(()=>{
      if(!airframe.visible)open();
      lab.paused=true;
    });
    window.addEventListener('message',event=>{
      if(event.source!==parent||event.origin!==location.origin||event.data?.type!=='engine-anatomy-aircraft-camera'||!aircraftView)return;
      const {action}=event.data;
      if(action==='reset'){lab.setView(aircraftView);lab._dirty=true;return;}
      const offset=lab.camera.position.clone().sub(lab.controlsOrbit.target);
      if(action==='orbit')offset.applyAxisAngle(new THREE.Vector3(0,1,0),-Math.PI/8);
      else if(action==='in'||action==='out')offset.setLength(THREE.MathUtils.clamp(offset.length()*(action==='in'?.8:1.25),.8,15));
      else return;
      lab.camera.position.copy(lab.controlsOrbit.target).add(offset);
      lab.controlsOrbit.update();lab._dirty=true;
    });
    return ()=>{};
  }
  lab.ui.addEventListener('click',event=>{
    if (airframe.visible && event.target.closest('.lab-modes button:not([data-k="run"]):not([data-k="slow"]), .machine-views button, .machine-subsystems button')
        && event.target!==button) close(!event.target.closest('.machine-views button'));
  },true);
  lab.onTick(()=>{
    if(airframe.visible&&fixedWingExterior)lab.ao.enabled=false;
    if (airframe.visible && (lab._selection!==selection ||
        inspection.some(([key,value])=>lab.target[key]!==value))) close();
  });
  return frame.animate;
}

import {THREE, GEO} from 'machine-kit';
import {h175Exterior} from './h175-exterior.mjs';
import {group, mesh, revolved} from './hardware.mjs';

const skin = new THREE.MeshStandardMaterial({color:0xc8d0d5, metalness:.18, roughness:.42, side:THREE.DoubleSide});
const trim = new THREE.MeshPhysicalMaterial({color:0x264f67,metalness:.06,roughness:.40,clearcoat:.48,side:THREE.DoubleSide});
const dashTrim = new THREE.MeshPhysicalMaterial({color:0x8c2833,roughness:.37,clearcoat:.48,side:THREE.DoubleSide});
const chrome = new THREE.MeshStandardMaterial({color:0xa3aab0,metalness:.75,roughness:.24});
const rubber = new THREE.MeshStandardMaterial({color:0x242729,roughness:.76});
const dark = new THREE.MeshStandardMaterial({color:0x273743, metalness:.25, roughness:.43});

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

function glazing(parent, profile, y, x, width, side, elevation, aperture) {
  function radius(at) {
    const i = profile.findIndex(([,station])=>station>at);
    const [r0,x0]=profile[i-1], [r1,x1]=profile[i];
    return r0+(r1-r0)*(at-x0)/(x1-x0);
  }
  const left=x-width/2, right=x+width/2;
  const stations=[left,...profile.map(([,station])=>station).filter(station=>station>left&&station<right),right];
  const points=stations.map(station=>new THREE.Vector2(radius(station)+.012,station));
  const angle=side===1 ? -elevation : Math.PI+elevation;
  mesh(parent,new THREE.LatheGeometry(points,10,angle-aperture/2,aperture),dark,
    [0,y,0],[0,0,-Math.PI/2]);
}

function flightDeckPane(parent,profile,y,side,corners) {
  const pos=[],idx=[],steps=12;
  const mix=THREE.MathUtils.lerp;
  for(let i=0;i<=steps;i++)for(let j=0;j<=steps;j++){
    const u=i/steps,v=j/steps;
    const x=mix(mix(corners[0][0],corners[1][0],u),mix(corners[3][0],corners[2][0],u),v);
    const a=mix(mix(corners[0][1],corners[1][1],u),mix(corners[3][1],corners[2][1],u),v);
    const k=profile.findIndex(([,station])=>station>x);
    const [r0,x0]=profile[k-1],[r1,x1]=profile[k];
    const r=mix(r0,r1,(x-x0)/(x1-x0))+.019;
    pos.push(x,y+r*Math.sin(a),side*r*Math.cos(a));
    if(i&&j){
      const d=i*(steps+1)+j,a=d-steps-2;
      idx.push(a,a+1,d,a,d,d-1);
    }
  }
  const geo=new THREE.BufferGeometry();
  geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  geo.setIndex(idx);geo.computeVertexNormals();
  return mesh(parent,geo,dark);
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

function propeller(parent,x,y,z,radius,count) {
  const rotor = group(parent,x,y,z);
  for (let i=0;i<count;i++) {
    const root = group(rotor);
    root.rotation.x = 2*Math.PI*i/count;
    const blade = liftingSurface(root,[[0,0,.1*radius,.08*radius,.012*radius],
      [-.02*radius,0,.72*radius,.12*radius,.011*radius],
      [.02*radius,0,radius,.045*radius,.006*radius]],dark);
    blade.rotation.x = -Math.PI/2;
  }
  return rotor;
}

// DHC-8-300 and A340-300 reference exteriors, in metres.
function fixedWing(parent,jet) {
  const length=jet?63.69:25.68, halfSpan=jet?30.15:13.715;
  const r=jet?2.82:1.36, y=jet?5.55:2.67, nose=-length*.42, tail=length*.58;
  const profile=[
    [.01,nose],[r*.20,nose+r*.18],[r*.47,nose+r*.48],[r*.73,nose+r*.94],
    [r*.91,nose+r*1.43],[r,nose+r*2.17],[r,tail-r*5.05],
    [r*.96,tail-r*3.8],[r*.79,tail-r*2.55],[r*.54,tail-r*1.52],
    [r*.28,tail-r*.61],[r*.07,tail]
  ];
  revolved(parent,[[0,nose],...profile,[0,tail]],skin,y);
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
    const pane=coords=>flightDeckPane(parent,profile,y,side,coords.map(([x,a])=>[nose+r*x,a]));
    pane([[1.04,1.539],[1.77,1.539],[1.89,.69],[1.37,.74]]);
    pane([[1.94,1.13],[2.47,.94],[2.57,.60],[2.01,.65]]);
    const count=jet?44:23;
    for(let i=0;i<count;i++) {
      const x=nose+(tail-nose)*(.143+i*(jet?.0152:.0288));
      if (i!==0 && i!==(jet?13:11))glazing(parent,profile,y,x,r*.18,side,.235,jet?.129:.185);
    }
    for(const x of [nose+r*2.75,tail-r*3.10])glazing(parent,profile,y,x,r*.24,side,.12,.47);
    liftingSurface(parent,[0,.29,.72,1].map(t=>{
      const [x,h,chord]=wing(t*halfSpan);
      return [x,h,side*t*halfSpan,chord,(jet?.79:.30)*(1-t)+(jet?.095:.06)*t];
    }),skin,jet?chrome:dark);
    const tip=wing(halfSpan);
    if(jet) liftingSurface(parent,[[tip[0]-.12,0,0,tip[2],.16],[tip[0]+.82,0,1.57,.64,.065]],trim).position.set(0,tip[1],side*halfSpan);
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
        rotors.push(propeller(pod,-1.73,0,0,1.98,4));
      }
    }
    const gearX=jet?2.95:-.10, gearZ=side*(jet?5.62:4.08);
    strut(gearX,jet?.68:.43,jet?wing(Math.abs(gearZ))[1]-.14:2.86,gearZ);
    for(const dx of (jet?[-.68,.68]:[0]))for(const dz of (jet?[-.34,.34]:[-.19,.19]))
      axle(gearX+dx,jet?.65:.43,gearZ+dz,jet?.65:.43,jet?.39:.24);
  }
  const fin=liftingSurface(parent,[[0,0,0,jet?10.4:5.2,jet?.62:.26],
    [jet?4.8:1.44,0,jet?5.9:2.54,jet?5.5:2.72,jet?.34:.13],
    [jet?7.3:2.25,0,jet?10.5:3.69,jet?3.1:1.84,jet?.15:.086]],jet?trim:dashTrim);
  fin.position.set(tail-(jet?14.5:5.6),y+(jet?1.22:1.13),0);
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
  function close(restoreView=true) {
    airframe.visible=false;
    lab.machine.visible=true;
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
    button.setAttribute('aria-pressed','true');
    caption.hidden=false;
    lab.ui.classList.add('aircraft-overview');
    const stageAspect=lab.stage.clientWidth/Math.max(1,lab.stage.clientHeight);
    const framing=Math.max(embed?.56:1,1.42/stageAspect);
    aircraftView={az:kind==='helicopter' ? -30 : kind==='turbofan' ? -57 : -39,el:kind==='helicopter' ? 12 : 13,
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
    if (airframe.visible && (lab._selection!==selection ||
        inspection.some(([key,value])=>lab.target[key]!==value))) close();
  });
  return frame.animate;
}

import {aircraftOverview} from './aircraft-overview.mjs';
// Representative free-turbine study. Stage arrangement follows the Smithsonian
// XT700 record; proportions and hidden construction are illustrative.
import {THREE, Lab, MAT, GEO, setCaps} from 'machine-kit';
import {GEAR} from '../../../src/plants.js';
import {operatingControls, inspectionControls, moduleInspector, studyNavigation} from './operating-trial.mjs';
import {group, mesh, modulePart, ghostShell, metals, shaft, installationControl, impeller} from './hardware.mjs';
const framing = distance => matchMedia('(max-width: 700px)').matches ? distance*1.37 : distance;
setCaps('red', [0.38,0.38,0.37]);
const lab = new Lab({title:'Turboshaft',sub:'Free power turbine and rotor drive',prompt:'Explore an aircraft turboshaft',size:1.55,theme:'paper',paused:true,
  pills:['XT700 architecture','Educational simulation'],view:{az:27,el:23,dist:framing(1.65),target:[0,0.46,0],fov:34},
  cut:{a:[0,0,1],b:[0,1,0],center:[0,0.38,0],reach:0.8}});
const alloy=MAT.aluminium({color:[.47,.46,.42],roughness:.43}), bright=MAT.stainless({roughness:.30}), hot=MAT.inconel({color:[.37,.34,.30],roughness:.51}), dark=MAT.steelDark(), olive=MAT.paint({color:[.24,.24,.17],roughness:.65}), accent=MAT.paint({color:[.045,.19,.47],roughness:.5});
const standMat=new THREE.MeshStandardMaterial({color:0x303232,metalness:.65,roughness:.65});
const center=.38;
const induction=modulePart(lab,'Inlet assembly',center,[-.23,0,0],[.38,1]);
const mainCase=modulePart(lab,'Gas generator cases and stators',center,[0,0,0]);
const tail=modulePart(lab,'Free turbine module',center,[.33,0,0],[.29,1]);
const services=modulePart(lab,'Removable accessory assembly',0,[0,.09,.39],[0,.66]);

function service(geo,mat,pos) {return mesh(services.object,geo,mat,pos);}
function flange(owner,x,r,mat,bore=r-.018) {
  const ring=group(owner,x);
  ring.rotation.z=Math.PI/2;
  mesh(ring,GEO.disc(r,.014,.002,80,bore),mat);
  mesh(ring,GEO.bolts(28,r-.009,.0028,.008),bright);
  return ring;
}
function row(group,x,r0,r1,count,mat,pitch=.45,bore=.038) {const disk=new THREE.Mesh(GEO.disc(r0,.018,.002,64,bore),mat);disk.rotation.z=Math.PI/2;disk.position.x=x;group.add(disk);const blades=new THREE.Mesh(GEO.rotor({axis:'x',count,r0:r0*.96,r1,chord:.035,thick:.11,camber:.05,pitch,twist:.32,nS:8,nC:10}),mat);blades.position.x=x;group.add(blades);}
function stationaryRow(x,r0,r1,count) {
  mesh(mainCase.object,GEO.rotor({axis:'x',count,r0,r1,chord:.025,thick:.1,camber:.04,pitch:-.35,twist:.16,nS:6,nC:8}),alloy,[x,0,0]);
}
ghostShell(lab,induction.object,'Inlet housing',
  [[.197,-.62],[.204,-.607],[.198,-.583],[.187,-.543],[.176,-.481],[.170,-.419]],.010,alloy);
ghostShell(lab,mainCase.object,'Compressor casing',
  [[.172,-.419],[.171,-.363],[.165,-.278],[.164,-.192],[.191,-.114]],.009,alloy);
ghostShell(lab,mainCase.object,'Combustor casing',
  [[.190,-.113],[.218,-.067],[.223,.018],[.219,.111],[.208,.184],[.186,.231]],.010,hot);
ghostShell(lab,mainCase.object,'Gas-generator turbine casing',
  [[.186,.224],[.181,.271],[.184,.329],[.194,.358]],.010,hot);
ghostShell(lab,tail.object,'Power turbine casing',
  [[.194,.36],[.186,.404],[.192,.476],[.207,.522]],.010,hot);
ghostShell(lab,tail.object,'Exhaust bell',
  [[.207,.508],[.217,.547],[.231,.606],[.241,.648],[.246,.659]],.010,alloy);
for (const [owner,x,r] of [
  [induction.object,-.61,.207],[induction.object,-.423,.179],[mainCase.object,-.41,.179],
  [mainCase.object,-.112,.196],[mainCase.object,.209,.202],[mainCase.object,.354,.203],
  [tail.object,.367,.203],[tail.object,.519,.216],[tail.object,.653,.251]
]) flange(owner,x,r,alloy);

// The hollow gas-generator shaft surrounds a mechanically independent output shaft.
const gas=new THREE.Group();
gas.position.y=center;
lab.add(gas,{name:'Gas generator rotor'});
shaft(gas,-.526,.331,.037,.025);
for(let i=0;i<5;i++){
  const x=-.43+i*.060,r0=.063+i*.005,r1=.154-i*.006;
  row(gas,x,r0,r1,32+i*3,bright,.45,.036);
  stationaryRow(x+.028,r0+.004,r1+.006,36+i*3);
}
impeller(gas,-.116,.148,.036,1);
for(let i=0;i<2;i++){
  row(gas,.25+i*.052,.062,.152,36,hot,.50,.036);
  stationaryRow(.229+i*.052,.064,.170,39);
}
const power=group(tail.object);
shaft(power,-.639,.48,.022);
shaft(power,-.657,-.59,.024,0,dark);
for(let i=0;i<2;i++){
  row(power,.397+i*.051,.064,.160,40,hot,.48,.021);
  mesh(tail.object,GEO.rotor({axis:'x',count:43,r0:.066,r1:.175,chord:.022,thick:.12,
    camber:.06,pitch:-.63,twist:.23,nS:6,nC:8}),hot,[.376+i*.051,0,0]);
}
ghostShell(lab,mainCase.object,'Annular combustor liner',
  [[.161,-.058],[.183,-.028],[.191,.035],[.185,.124],[.172,.180],[.162,.212]],.007,hot);
ghostShell(lab,mainCase.object,'Inner combustion liner',
  [[.101,-.051],[.092,.009],[.092,.135],[.113,.178],[.137,.217]],.007,hot);
for (const x of [-.021,.043,.110]) {
  const ring=mesh(mainCase.object,new THREE.TorusGeometry(.188,.0029,8,64),bright,[x,0,0],[0,Math.PI/2,0]);
  if (x === .110) ring.scale.setScalar(.98);
}
for (let i=0;i<12;i++) {
  const theta=i*Math.PI/6;
  const a=Math.cos(theta), b=Math.sin(theta);
  mesh(mainCase.object,GEO.pipe([[.016,.212*a,.212*b],[.041,.231*a,.231*b],[.092,.215*a,.215*b]],.0034,10),bright);
}
// The exhaust collector and its hub are fixed structure around the power turbine.
flange(tail.object,.609,.104,alloy,.049);
for (let i=0;i<6;i++) {
  const vane=group(tail.object,.588);
  vane.rotation.x=i*Math.PI/3;
  mesh(vane,GEO.rbox(.07,.135,.014,.004),dark,[0,.156,0]);
}
shaft(tail.object,.538,.629,.071,0,dark);
// The photographed XT700 has prominent front-facing housings and tightly routed
// lines. These are visual approximations; the service connections are not known.
function housing(x,y,z,r,depth,material,name) {
  const g=new THREE.Group();g.position.set(x,y,z);
  const body=new THREE.Mesh(GEO.disc(r,depth,.003,48),material);body.rotation.x=Math.PI/2;g.add(body);
  const face=new THREE.Mesh(GEO.disc(r*.91,.008,.002,48),alloy);face.rotation.x=Math.PI/2;face.position.z=depth/2+.004;g.add(face);
  const lip=new THREE.Mesh(GEO.disc(r*.97,.009,.002,48,r*.85),bright);lip.rotation.x=Math.PI/2;lip.position.z=depth/2+.01;g.add(lip);
  const bolts=new THREE.Mesh(GEO.bolts(12,r*.78,.003,.009),bright);bolts.rotation.x=Math.PI/2;bolts.position.z=depth/2+.012;g.add(bolts);
  g.name=name;
  services.object.add(g);
  return g;
}
// Accessory gearbox and intake/filtration housings create the stepped silhouette.
service(GEO.rbox(.34,.22,.18,.028),olive,[-.36,.52,.13]);
service(GEO.rbox(.22,.17,.20,.022),alloy,[-.47,.58,.12]);
const frontHousing = group(services.object,-.365,.613,.253);
frontHousing.rotation.x = Math.PI/2;
mesh(frontHousing,GEO.shell([[.098,-.074],[.108,-.057],[.110,.018],[.101,.071],[.098,.082]],.008,80),alloy);
mesh(frontHousing,GEO.disc(.103,.018,.002,64,.091),bright,[0,.081,0]);
mesh(frontHousing,GEO.disc(.101,.011,.002,64,.085),bright,[0,-.046,0]);
mesh(frontHousing,GEO.tube(.041,.028,.119,52),dark,[0,-.012,0]);
mesh(frontHousing,GEO.disc(.035,.013,.002,52,.025),bright,[0,.059,0]);
for(let i=0;i<7;i++){
  const spoke=group(frontHousing);
  spoke.rotation.y=i*2*Math.PI/7;
  const blade=mesh(spoke,GEO.rbox(.061,.018,.011,.003),dark,[.065,.010,0]);
  blade.rotation.x=.55;
}
for (const x of [-.46,-.268]) {
  const strap=service(GEO.rbox(.05,.116,.026,.005),alloy,[x,.565,.164]);
  strap.rotation.z=(x<-.4?1:-1)*.38;
}

housing(-.55,.64,.21,.055,.09,dark,'Accessory drive');
housing(-.06,.58,.20,.067,.075,alloy,'Accessory cover');
housing(.23,.39,.13,.069,.15,dark,'External accessory housing');
housing(.23,.39,.218,.051,.025,alloy,'Accessory end cover');
// Visible external pipes: restrained, port-to-port paths over the near side.
const routes=[
 [[-.53,.53,.245],[-.47,.49,.26],[-.34,.48,.255],[-.18,.49,.21],[-.10,.50,.205]],
 [[-.46,.45,.245],[-.40,.42,.26],[-.25,.42,.225],[-.10,.43,.205],[.05,.43,.225],[.16,.46,.225]],
 [[-.50,.37,.22],[-.42,.34,.24],[-.30,.32,.22],[-.12,.33,.20],[.08,.33,.22],[.28,.34,.20]],
 [[-.38,.69,.18],[-.26,.71,.16],[-.16,.69,.17],[-.04,.65,.17],[.10,.58,.18],[.24,.55,.16]],
 [[-.27,.57,.22],[-.20,.55,.23],[-.12,.56,.23],[.02,.58,.19],[.15,.57,.18],[.30,.54,.15]],
 [[-.31,.31,.20],[-.24,.28,.19],[-.08,.28,.18],[.04,.27,.18],[.22,.29,.16],[.35,.32,.15]],
 [[-.49,.50,.19],[-.44,.47,.20],[-.42,.36,.20],[-.36,.31,.19]],
 [[-.18,.60,.17],[-.11,.63,.16],[.02,.63,.12],[.12,.60,.14],[.28,.57,.12]]
];
for(let i=0;i<routes.length;i++){
  service(GEO.pipe(routes[i],i===3?.0048:.0036,10),i===3?dark:bright,[0,0,0]);
  for(const point of [routes[i][0],routes[i][routes[i].length-1]]){
    service(GEO.disc(.008,.012,.001,8),i===3?dark:bright,point);
  }
}
// Small covers, fittings and wiring provide scale without claiming exact routing.
for(const [x,y,z,w] of [[-.23,.60,.20,.07],[-.08,.55,.21,.07],[.08,.52,.24,.09],[.24,.47,.21,.08],[-.23,.31,.19,.075]]) {
  service(GEO.rbox(w,.045,.045,.007),alloy,[x,y,z]);
}
service(GEO.pipe([[-.472,.669,.194],[-.442,.722,.194],[-.376,.741,.174],[-.308,.736,.141],[-.268,.697,.130],[-.268,.624,.133]],.0045,10),accent,[0,0,0]);
service(GEO.disc(.012,.018,.002,10),bright,[-.268,.626,.133]);
for(const [x,y,z] of [[-.425,.570,.171],[-.284,.540,.185],[-.19,.484,.183],[.12,.462,.207],[.204,.377,.204]]) {
  const clip=service(GEO.rbox(.030,.012,.036,.002),dark,[x,y,z]);
  clip.rotation.z=.24;
  service(GEO.disc(.005,.009,.001,8),bright,[x-.007,y+.008,z]);
}
for(const [x,r] of [[-.104,.198],[.011,.224],[.171,.216],[.34,.198]]) {
  for(let i=0;i<10;i++) {
    const a=i*Math.PI/5;
    const lug=group(mainCase.object,x);
    lug.rotation.x=a;
    mesh(lug,GEO.rbox(.035,.014,.023,.004),alloy,[0,r,0]);
    mesh(lug,GEO.disc(.0055,.009,.001,10),bright,[.006,r+.009,0]);
  }
}
const stand=group(lab.machine);
for(const x of [-.44,.38]){
  mesh(stand,GEO.rbox(.12,.05,.13,.004),standMat,[x,.07,0]);
  mesh(stand,GEO.rbox(.07,.24,.08,.004),standMat,[x,.215,0]);
}
mesh(stand,GEO.rbox(1.55,.035,.36,.006),standMat,[0,.035,0]);

const context=group(lab.machine);
mesh(context,GEO.rbox(1.74,.061,.53,.013),metals.airframe,[-.08,.106,0]);
for(const x of [-.39,.32]) {
  for(const z of [-.104,.104]) {
    const mount=mesh(context,GEO.rbox(.079,.18,.054,.009),metals.grey,[x,.212,z]);
    mount.rotation.x=Math.sign(z)*-.45;
  }
}
mesh(context,GEO.rbox(.208,.31,.248,.034),metals.grey,[-.824,.371,0]);
const input=group(context,0,center);
shaft(input,-.752,-.657,.027);
mesh(input,GEO.disc(.055,.025,.004,48),metals.aluminium,[-.713,0,0],[0,0,Math.PI/2]);
mesh(context,GEO.disc(.092,.044,.006,48),metals.grey,[-.831,.546,0]);
const mast=group(context,-.831,.595);
mesh(mast,GEO.disc(.029,.22,.003,48),metals.polished);
mesh(mast,GEO.rbox(.36,.035,.071,.007),metals.grey,[0,.112,0]);
installationControl(lab,context);
lab.onTick(()=>{stand.visible=!context.visible;});
lab.label(induction.object,'Inlet',{at:[-.585,.14,-.035]});
lab.label(mainCase.object,'Annular combustor',{at:[.047,.17,-.043]});
lab.label(gas,'Gas generator',{at:[-.26,.12,-.043]});
lab.label(tail.object,'Free power turbine',{at:[.414,.15,-.036]});
lab.label(tail.object,'Exhaust',{at:[.609,.17,-.035]});
lab.cameraViews({Overview:{az:27,el:23,dist:framing(1.65),target:[0,.46,0]},Side:{az:0,el:5,dist:framing(1.74),target:[0,.44,0]},Front:{az:-76,el:12,dist:framing(1.52),target:[-.07,.40,0]},Rear:{az:105,el:12,dist:framing(1.52),target:[.07,.40,0]}});
moduleInspector(lab);
const animateAirframe=aircraftOverview(lab,'helicopter');
operatingControls(lab,'helicopter',({angleG,angleP}) => {
  animateAirframe(angleP/(280*GEAR.helicopterMain),angleP/(280*GEAR.helicopterTail));
  gas.rotation.x=angleG/280;
  power.rotation.x=angleP/280;
  input.rotation.x=angleP/280;
  mast.rotation.y=angleP/(280*GEAR.helicopterMain);
});
inspectionControls(lab,amount => [induction,tail,services].forEach(part => part.pose(amount)));
lab.how('The XT700 arrangement has five axial compressor stages and a centrifugal impeller. Two gas-generator turbine stages drive that compressor. Two free-turbine stages drive a separate shaft that passes through the gas-generator shaft to a forward output. The local helicopter deck shows the drive into a gearbox and mast. Hardware profiles, lines and mounts are representative. The trial applies equivalent rotor load and fuel limits to an educational speed governor with slowed visual rotation. Moving a control restarts the trial from the same settled baseline. Use Trial time to revisit any point. <a href="https://ntrs.nasa.gov/citations/19860020347">NASA T700 section and control study</a>.');
studyNavigation(lab,'turboshaft');
await lab.start();

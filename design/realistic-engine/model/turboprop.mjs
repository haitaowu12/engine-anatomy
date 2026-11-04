import {aircraftOverview} from './aircraft-overview.mjs';
import {Lab, GEO, setCaps} from 'machine-kit';
import {GEAR} from '../../../src/plants.js';
import {operatingControls, inspectionControls, moduleInspector, studyNavigation} from './operating-trial.mjs';
import {
  metals, mesh, group, revolved, shaft, flange, stage, pipe, modulePart,
  ghostShell, wingSection, installationControl, impeller, portedCollector
} from './hardware.mjs';

const framing = distance => matchMedia('(max-width: 700px)').matches ? distance*1.37 : distance;
setCaps('red',[.48,.30,.24]);
const y = 1.08;
const overview = {az:-28,el:20,dist:framing(1.98),target:[-.13,1.10,0],fov:36};
const lab = new Lab({
  title:'Turboprop',sub:'Reverse-flow gas generator and propeller drive',size:2.2,
  theme:'paper',paused:true,view:overview,pills:['PT6A-100 architecture','Educational simulation'],
  cut:{a:[0,0,1],b:[0,0,1],center:[0,y,0],reach:1.25}
});
const prop = modulePart(lab,'Propeller',y,[-.58,0,0],[0,.54]);
const reduction = modulePart(lab,'Reduction and free turbine',y,[-.27,0,0],[.27,.88]);
const core = modulePart(lab,'Gas generator',y,[.28,0,0],[.42,1]);
const gearbox = modulePart(lab,'Accessory gearbox',y,[.46,0,0],[.18,.92]);

const spinner = group(prop.object);
revolved(spinner,[[0,-.94],[.026,-.926],[.075,-.875],[.105,-.823],[.115,-.763],[0,-.763]],metals.polished);
shaft(spinner,-.80,-.70,.054,0,metals.dark);
const blades = [];
for (let i=0;i<4;i++) {
  const arm = group(spinner,-.795);
  arm.rotation.x = i*Math.PI/2;
  mesh(arm,GEO.disc(.028,.08,.004,28),metals.polished,[0,.111,0]);
  const blade = mesh(arm,GEO.blade({
    r0:.13,r1:.98,chord:[.153,.076],thick:[.17,.08],pitch:0,twist:.55,camber:.04,
    sweep:.105,lean:-.065,nS:16,nC:15
  }),metals.dark);
  const positions = blade.geometry.attributes.position;
  const tipSections = new Map();
  for (let j=0;j<positions.count;j++) {
    const r = positions.getY(j);
    if (r <= .91) continue;
    if (!tipSections.has(r)) tipSections.set(r,[]);
    tipSections.get(r).push(j);
  }
  for (const [r,indices] of tipSections) {
    const meanX = indices.reduce((sum,j) => sum+positions.getX(j),0)/indices.length;
    const meanZ = indices.reduce((sum,j) => sum+positions.getZ(j),0)/indices.length;
    const taper = Math.max(.12,Math.sqrt(Math.max(0,1-((r-.91)/.07)**2)));
    for (const j of indices) {
      positions.setXYZ(j,meanX+(positions.getX(j)-meanX)*taper,r,meanZ+(positions.getZ(j)-meanZ)*taper);
    }
  }
  positions.needsUpdate = true;
  blade.geometry.computeVertexNormals();
  blades.push(blade);
}

ghostShell(lab,reduction.object,'Reduction housing',[[.15,-.70],[.187,-.664],[.194,-.59],[.17,-.53],[.169,-.438]],.012,metals.grey);
for (const x of [-.697,-.58,-.44]) flange(reduction.object,x,x === -.58 ? .202 : .178,.152,.016,24);
shaft(reduction.object,-.68,-.264,.028);
shaft(reduction.object,-.689,-.62,.060,0,metals.dark);
const planetary = [
  {x:-.548,sunTeeth:30,planetTeeth:18,ringTeeth:66},
  {x:-.646,sunTeeth:32,planetTeeth:18,ringTeeth:68}
].map(({x,sunTeeth,planetTeeth,ringTeeth}) => {
  const mod = .00372;
  const radius = (sunTeeth+planetTeeth)*mod/2;
  const frame = group(reduction.object,x);
  const sun = group(frame);
  mesh(sun,GEO.gear({teeth:sunTeeth,module:mod,width:.030,bore:.027}),metals.polished,[0,0,0],[0,Math.PI/2,0]);
  const carrier = group(frame);
  const planets = [];
  shaft(frame,-.019,.019,.137,ringTeeth*mod/2+.003,metals.casing);
  shaft(carrier,-.039,-.019,.119,.028,metals.casing);
  for (let i=0;i<4;i++) {
    const a=i*Math.PI/2;
    const pos=[0,radius*Math.cos(a),radius*Math.sin(a)];
    const planet = group(carrier,...pos);
    mesh(planet,GEO.gear({teeth:planetTeeth,module:mod,width:.028,bore:.013}),metals.casing,[0,0,0],[0,Math.PI/2,0]);
    mesh(carrier,GEO.disc(.013,.042,.002,28),metals.polished,pos,[0,0,Math.PI/2]);
    planets.push(planet);
  }
  return {sun,carrier,planets,ratio:1+ringTeeth/sunTeeth,teethRatio:sunTeeth/planetTeeth};
});
const powerRotor = group(reduction.object);
stage(powerRotor,-.261,.075,.174,47,.041,metals.hot,{bore:.027,pitch:-.72,twist:.32});
shaft(powerRotor,-.548,-.255,.029);
const collector = portedCollector(reduction.object,
  [[.177,-.447],[.207,-.422],[.220,-.363],[.223,-.310],[.213,-.292],[.198,-.274],[.195,-.220]],
  .012,metals.hot);
lab.add(collector,{parent:reduction.object,name:'Power turbine and exhaust collector',xray:'shell'});
flange(reduction.object,-.219,.208,.175,.014,30);
for (const z of [-1,1]) {
  mesh(reduction.object,GEO.shell([[.075,-.081],[.095,-.025],[.096,.054]],.006,56),metals.hot,
    [-.357,0,z*.255],[z*Math.PI/2,0,0]);
}

const generator = group(core.object);
shaft(generator,-.207,.636,.031);
for (let i=0;i<3;i++) {
  const x = .481-i*.072;
  stage(generator,x,.059+i*.010,.137-i*.008,35+i*4,.040,metals.polished,{bore:.03,pitch:-.57});
  stage(core.object,x-.030,.063+i*.010,.142-i*.008,39+i*4,.026,metals.casing,{stator:true,pitch:.53});
}
impeller(generator,.237,.174,.03,-1);
stage(generator,-.174,.067,.144,46,.032,metals.hot,{bore:.03,pitch:-.71});
stage(core.object,-.123,.071,.148,40,.032,metals.hot,{stator:true,pitch:.64});
ghostShell(lab,core.object,'Compressor and radial inlet',
  [[.198,.227],[.177,.292],[.153,.366],[.157,.462],[.186,.505],[.218,.531],[.226,.548]],.010,metals.casing);
ghostShell(lab,core.object,'Inlet backplate',[[.113,.563],[.145,.603],[.216,.626],[.226,.629]],.008,metals.aluminium);
for (let i=0;i<20;i++) {
  const support=group(core.object,.59);
  support.rotation.x=i*2*Math.PI/20;
  mesh(support,GEO.rbox(.090,.017,.012,.004),metals.aluminium,[0,.215,0]);
}
for (const x of [.568,.591,.613]) {
  mesh(core.object,GEO.tube(.221,.217,.005,96),metals.dark,[x,0,0],[0,0,Math.PI/2]);
}
ghostShell(lab,core.object,'Combustor case',
  [[.207,-.212],[.226,-.158],[.238,-.09],[.232,.085],[.211,.172],[.196,.233]],.013,metals.hot);
ghostShell(lab,core.object,'Reverse-flow annular liner',
  [[.137,-.137],[.164,-.117],[.192,-.100],[.208,-.035],[.204,.122],[.176,.166],[.133,.163],[.119,.107],[.124,.041]],
  .006,metals.hot);
for (const [x,r,bore] of [[-.196,.208,.177],[.228,.210,.179],[.545,.235,.210],[.628,.232,.179]]) flange(core.object,x,r,bore,.012,32);
for (let i=0;i<14;i++) {
  const theta=i*2*Math.PI/14;
  const a=Math.cos(theta),b=Math.sin(theta);
  pipe(core.object,[[.036,.223*a,.223*b],[.064,.242*a,.242*b],[.114,.226*a,.226*b]],.004);
  const fitting = mesh(core.object,GEO.disc(.009,.023,.002,12),metals.polished,[.035,.228*a,.228*b]);
  fitting.rotation.x = theta;
}

ghostShell(lab,gearbox.object,'Accessory case',
  [[.192,.628],[.194,.657],[.167,.691],[.138,.724],[.122,.760]],.009,metals.grey);
flange(gearbox.object,.638,.205,.176,.016,24);
shaft(gearbox.object,.688,.78,.071,0,metals.aluminium);
shaft(gearbox.object,.739,.821,.065,0,metals.dark);
const starter = group(gearbox.object,.704,-.069,-.148);
shaft(starter,0,.157,.058,0,metals.aluminium);
shaft(starter,.013,.035,.066,0,metals.casing);
shaft(starter,.147,.161,.053,0,metals.grey);
mesh(starter,GEO.rbox(.065,.059,.045,.008),metals.grey,[.034,-.034,-.046]);
pipe(gearbox.object,[[.842,-.077,-.118],[.844,-.158,-.140],[.739,-.179,-.158],[.667,-.132,-.134]],.008,metals.dark);
pipe(core.object,[[-.11,-.164,.161],[-.04,-.190,.182],[.159,-.197,.113],[.393,-.122,.087],[.486,-.146,.109]],.0055);
pipe(core.object,[[-.10,-.190,-.105],[.02,-.209,-.115],[.19,-.204,-.082],[.40,-.134,-.073],[.53,-.15,-.104]],.005);

mesh(gearbox.object,GEO.rbox(.16,.105,.08,.013),metals.aluminium,[.683,-.125,.152]);
pipe(gearbox.object,[[.674,-.125,.194],[.706,-.086,.204],[.722,.038,.160],[.733,.056,.137]],.006);
for (const x of [-.57,.56]) {
  const owner = x < 0 ? reduction.object : core.object;
  mesh(owner,GEO.rbox(.076,.066,.066,.005),metals.aluminium,[x,-.145,-.11]);
}

const context = group(lab.machine);
wingSection(context,{x:.19,y:y-.17,z:-1.20,chord:1.28,span:1.89,thickness:.16});
const cradle = group(context,0,y);
mesh(cradle,GEO.rbox(.074,.445,.44,.028),metals.grey,[.91,0,0]);
for (const z of [-.11,.11]) {
  pipe(cradle,[[.91,-.16,z],[.58,-.202,z],[-.57,-.202,z],[-.57,-.145,z]],.018,metals.grey);
}
installationControl(lab,context);
lab.label(prop.object,'Propeller',{at:[-.84,.13,-.04]});
lab.label(reduction.object,'Gearbox',{at:[-.6,.11,-.04]});
lab.label(core.object,'Rear air inlet',{at:[.55,.123,-.03]});
lab.label(core.object,'Reverse-flow combustor',{at:[.018,.21,-.03]});
lab.label(reduction.object,'Free power turbine',{at:[-.261,.15,-.03]});
lab.label(gearbox.object,'Accessory gearbox',{at:[.705,.12,-.03]});
lab.cameraViews({Overview:overview,Side:{az:0,el:5,dist:framing(1.80),target:[0,y,0]},Rear:{az:102,el:12,dist:framing(1.80),target:[.06,y,0]}});
moduleInspector(lab);
const animateAirframe=aircraftOverview(lab,'turboprop');
operatingControls(lab,'turboprop',({data,angleG,angleP}) => {
  animateAirframe(angleP/(280*GEAR.propeller));
  generator.rotation.x = angleG/280;
  powerRotor.rotation.x = angleP/280;
  spinner.rotation.x = angleP/(280*GEAR.propeller);
  let angle = angleP/280;
  for (const {sun,carrier,planets,ratio,teethRatio} of planetary) {
    sun.rotation.x = angle;
    const carrierAngle = angle/ratio;
    carrier.rotation.x = carrierAngle;
    for (const planet of planets) planet.rotation.x = -(angle-carrierAngle)*teethRatio;
    angle = carrierAngle;
  }
  for (const blade of blades) blade.rotation.y = data.bladeAngle*Math.PI/180;
});
inspectionControls(lab,amount => [prop,reduction,core,gearbox].forEach(part => part.pose(amount)));
lab.how('Air enters the radial inlet at the rear and travels forward through three axial compressor stages and a centrifugal impeller. It turns into the reverse-flow annular combustor, then drives the compressor turbine and free power turbine. The free turbine drives the propeller through a reduction gearbox. Geometry and the local wing installation are representative. The reduction view illustrates the drive relationship. The controls run a synthetic torque and propeller-speed trial with slowed visual rotation. Moving a control restarts the trial from the same settled baseline. Use Trial time to revisit any point. <a href="https://www.easa.europa.eu/sites/default/files/dfu/EASA_IM.E.094_TCDS_Issue_3_20230327.pdf">EASA PT6A-100 type certificate data sheet</a>.');
studyNavigation(lab,'turboprop');
await lab.start();

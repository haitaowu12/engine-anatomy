import {aircraftOverview} from './aircraft-overview.mjs';
import {THREE, Lab, GEO, MAT, setCaps} from 'machine-kit';
import {operatingControls, inspectionControls, moduleInspector, studyNavigation} from './operating-trial.mjs';
import {
  metals, mesh, group, revolved, shell, shaft, flange, stage, pipe, modulePart,
  ghostShell, wingSection, installationControl
} from './hardware.mjs';

const framing = distance => matchMedia('(max-width: 700px)').matches ? distance*1.37 : distance;
setCaps('red',[.52,.27,.22]);
const y = 1.31;
const overview = {az:-36,el:22,dist:framing(2.12),target:[-.12,1.42,0],fov:35};
const lab = new Lab({
  title:'Turbofan',sub:'Fan bypass and two concentric spools',size:3.15,view:overview,
  theme:'paper',paused:true,pills:['CFM56-5C architecture','Educational simulation'],
  cut:{a:[0,0,1],b:[0,1,0],center:[0,y,0],reach:1.85}
});
const fanCase = modulePart(lab,'Fan and booster module',y,[-.73,0,0],[.13,.92]);
const high = modulePart(lab,'High-pressure spool',y,[0,0,0]);
const coreCase = modulePart(lab,'Core cases and stators',y,[0,0,0]);
const lowCase = modulePart(lab,'Low-pressure turbine module',y,[.65,0,0],[.18,1]);

const fanDuct = [[.945,-1.299],[.983,-1.260],[.992,-1.170],[.989,-.868],[.969,-.617],[.940,-.430],[.897,-.314]];
ghostShell(lab,fanCase.object,'Fan case',fanDuct,.026,metals.casing);
for (const [x,r,bore] of [[-1.259,1.008,.923],[-1.058,1.011,.961],[-.72,1.001,.954],[-.398,.955,.888]]) {
  flange(fanCase.object,x,r,bore,.026,64);
}
stage(fanCase.object,-.785,.402,.967,35,.187,metals.casing,{pitch:-.38,twist:.37,stator:true});
shell(fanCase.object,[[.389,-.869],[.414,-.782],[.389,-.606],[.354,-.504]],.015,metals.aluminium);
for (let i=0;i<16;i++) {
  const angle=i*2*Math.PI/16;
  const rib = group(fanCase.object);
  rib.rotation.x = angle;
  mesh(rib,GEO.rbox(.34,.029,.023,.006),metals.aluminium,[-.629,.977,0]);
}
const fanService = group(fanCase.object,-.80,-.756,.64);
mesh(fanService,GEO.rbox(.29,.22,.14,.027),metals.grey);
mesh(fanService,GEO.rbox(.26,.19,.026,.01),metals.aluminium,[0,0,.076]);
for (const x of [-.106,.106]) {
  mesh(fanService,GEO.rbox(.027,.206,.035,.006),metals.polished,[x,0,.069]);
}
pipe(fanCase.object,[[-.87,-.65,.73],[-.66,-.56,.82],[-.55,-.43,.86],[-.49,-.36,.87]],.016);
pipe(fanCase.object,[[-.91,-.65,.70],[-.72,-.62,.75],[-.61,-.55,.80],[-.57,-.47,.82]],.010,metals.aluminium);

// Visible accessory hardware on the photographed display. The case, fittings
// and hoses share the fan module's transform through the separation.
const castAccessory = MAT.paint({color:[.37,.46,.49],roughness:.51});
const hose = MAT.rubber({color:[.19,.048,.036]});
const accessory = group(fanCase.object,-.83,-.93,.44);
accessory.rotation.x = -.30;
mesh(accessory,GEO.rbox(.43,.25,.21,.037),castAccessory);
mesh(accessory,GEO.rbox(.37,.031,.19,.009),metals.aluminium,[0,.132,.012]);
for (const x of [-.164,-.082,0,.082,.164]) {
  for (const z of [-.066,.088]) {
    mesh(accessory,GEO.disc(.010,.012,.002,8),metals.polished,[x,.155,z]);
  }
}
for (const x of [-.14,0,.14]) {
  mesh(accessory,GEO.rbox(.023,.13,.025,.004),castAccessory,[x,-.015,.114]);
}
for (const [x,z] of [[-.105,.06],[.085,.06]]) {
  mesh(accessory,GEO.disc(.027,.035,.003,8),metals.aluminium,[x,.160,z]);
  pipe(accessory,[[x,.176,z],[x+.008,.22,z+.021],[x+.125,.256,z+.04],
    [x+.163,.28,z+.023]],.012,x<0 ? hose : metals.polished);
}
const valve = group(fanCase.object,-.62,-.59,.805);
shaft(valve,-.116,.116,.072,0,castAccessory);
shaft(valve,-.125,-.086,.089,0,metals.aluminium);
shaft(valve,.091,.119,.080,0,metals.aluminium);
pipe(fanCase.object,[[-.72,-.60,.84],[-.78,-.68,.817],[-.96,-.80,.688],
  [-1.02,-.90,.58],[-1.01,-.914,.521]],.017);
pipe(fanCase.object,[[-.51,-.61,.825],[-.44,-.72,.748],[-.48,-.82,.645],
  [-.65,-.92,.54]],.011,hose);

const fanRotor = group(fanCase.object);
shaft(fanRotor,-1.20,-.403,.065);
const spinnerMat = MAT.steel({color:[.12,.13,.14],roughness:.29});
revolved(fanRotor,[[0,-1.346],[.057,-1.326],[.128,-1.264],[.209,-1.172],[.235,-1.106],[.233,-1.044],[.068,-1.044],[.068,-1.235],[0,-1.235]],spinnerMat);
const markingPoints = [[.057,-1.326],[.128,-1.264],[.209,-1.172],[.235,-1.106]];
const markingVertices=[], markingIndices=[];
for(let i=0;i<=36;i++) {
  const t=i/36;
  const x=-1.322+.197*t;
  const j=markingPoints.findIndex(([,station])=>station>x);
  const [r0,x0]=markingPoints[j-1], [r1,x1]=markingPoints[j];
  const r=r0+(r1-r0)*(x-x0)/(x1-x0)+.0016;
  const theta=2.9*t+.4;
  for (const a of [theta-.12,theta+.12]) markingVertices.push(x,r*Math.cos(a),r*Math.sin(a));
  if(i>0) markingIndices.push(2*i-2,2*i,2*i-1,2*i-1,2*i,2*i+1);
}
const marking=new THREE.BufferGeometry();
marking.setAttribute('position',new THREE.Float32BufferAttribute(markingVertices,3));
marking.setIndex(markingIndices);
marking.computeVertexNormals();
mesh(fanRotor,marking,new THREE.MeshStandardMaterial({color:0xe4e5e3,roughness:.62,side:THREE.DoubleSide}));
stage(fanRotor,-1.090,.237,.919,36,[.242,.154],metals.polished,{bore:.065,pitch:.62,twist:.68,sweep:.102});
shaft(fanRotor,-1.132,-1.030,.208,.065,metals.aluminium);
shaft(fanRotor,-1.051,-.795,.201,.064,metals.casing);
for (let i=0;i<4;i++) {
  const x=-.742+.113*i;
  stage(fanRotor,x,.202+i*.009,.360-i*.013,35+i*5,.075,metals.polished,{bore:.065,pitch:.51,twist:.29});
}
const lpRotor = group(lowCase.object);
shaft(lpRotor,-.402,1.23,.066);
for (let i=0;i<5;i++) {
  const x=.679+i*.112;
  stage(lpRotor,x,.168+i*.016,.274+i*.033,42+i*3,.060,metals.hot,{bore:.065,pitch:-.76,twist:.29});
  shaft(lpRotor,x-.044,x+.053,.160+i*.016,.065,metals.hot);
}

const hpRotor = group(high.object);
shaft(hpRotor,-.364,.600,.112,.068);
for (let i=0;i<9;i++) {
  const x=-.328+i*.078;
  stage(hpRotor,x,.150+i*.007,.312-i*.009,44+i*3,.049,metals.polished,{bore:.109,pitch:.61,twist:.35});
  stage(coreCase.object,x+.033,.153+i*.007,.323-i*.008,50+i*3,.033,metals.casing,{stator:true,pitch:-.58});
}
stage(hpRotor,.554,.171,.237,56,.050,metals.hot,{bore:.111,pitch:-.78});
stage(coreCase.object,.501,.167,.244,40,.035,metals.hot,{stator:true,pitch:.69});
ghostShell(lab,coreCase.object,'Core compressor case',
  [[.373,-.415],[.339,-.319],[.317,-.08],[.304,.11],[.279,.344]],.017,metals.casing);
ghostShell(lab,coreCase.object,'Combustor case',
  [[.279,.343],[.291,.370],[.319,.411],[.324,.460],[.290,.547],[.264,.609]],.018,metals.hot);
ghostShell(lab,coreCase.object,'Annular combustor liner',
  [[.208,.366],[.256,.379],[.279,.413],[.271,.464],[.242,.501],[.233,.532]],.009,metals.hot);
shell(coreCase.object,[[.166,.359],[.161,.400],[.163,.475],[.175,.512]],.008,metals.hot);
for (const [x,r] of [[-.396,.367],[-.19,.348],[.05,.327],[.340,.291],[.432,.341],[.612,.277]]) {
  flange(coreCase.object,x,r,r-.030,.015,44);
}
for (let i=0;i<18;i++) {
  const a=i*Math.PI/9;
  const c=Math.cos(a), s=Math.sin(a);
  pipe(coreCase.object,[[.323,.291*c,.291*s],[.355,.319*c,.319*s],[.404,.331*c,.331*s]],.006);
  const tip = mesh(coreCase.object,GEO.disc(.013,.027,.003,14),metals.polished,[.404,.326*c,.326*s]);
  tip.rotation.x = a;
}
pipe(coreCase.object,[[-.32,-.18,.29],[-.15,-.20,.277],[.11,-.193,.244],[.33,-.18,.241],[.42,-.17,.28]],.010);
pipe(coreCase.object,[[-.36,-.28,.219],[-.29,-.26,.260],[.06,-.25,.22],[.29,-.23,.188]],.006);

const turbineDuct = [[.286,.615],[.307,.704],[.342,.825],[.373,.942],[.405,1.044],[.440,1.158],[.442,1.221]];
ghostShell(lab,lowCase.object,'Low-pressure turbine shell',turbineDuct,.017,metals.hot);
for (let i=0;i<5;i++) {
  const x=.638+i*.112;
  stage(lowCase.object,x,.172+i*.016,.295+i*.032,37+i*3,.039,metals.hot,{stator:true,pitch:.7});
  flange(lowCase.object,x,.295+i*.036,.272+i*.034,.014,52);
}
for (let i=0;i<44;i++) {
  const a=i*2*Math.PI/44;
  const c=Math.cos(a),s=Math.sin(a);
  pipe(lowCase.object,[[.722,.312*c,.312*s],[.855,.358*c,.358*s],[1.047,.415*c,.415*s],[1.171,.442*c,.442*s]],.0054,metals.aluminium);
}
const mixerProfile = [[.443,1.205],[.444,1.249],[.440,1.300],[.432,1.353],[.425,1.410],[.418,1.465]];
const mixer = shell(lowCase.object,mixerProfile,.014,metals.hot);
const vertices = mixer.geometry.attributes.position;
for (let i=0;i<vertices.count;i++) {
  const ax = vertices.getY(i), rx = vertices.getX(i), rz = vertices.getZ(i);
  const progress = Math.max(0,Math.min(1,(ax-1.220)/.245));
  const angle = Math.atan2(rz,rx);
  const radius = Math.hypot(rx,rz);
  const factor = (radius+.066*Math.cos(12*angle)*progress**1.5)/radius;
  vertices.setXYZ(i,rx*factor,ax,rz*factor);
}
vertices.needsUpdate = true;
mixer.geometry.computeVertexNormals();
revolved(lowCase.object,[[.095,1.188],[.183,1.199],[.182,1.284],[.128,1.399],[.053,1.481],[0,1.507],[0,1.188]],metals.dark);

const context = group(lab.machine);
// Envelope follows the approximate station spacing in the A340 aircraft
// characteristics drawings. Mount hardware and local wing surface are schematic.
const nacelle = group(context,0,y);
const cowl = [
  [1.067,-2.29],[1.16,-2.24],[1.198,-2.11],[1.211,-1.99],[1.207,-1.60],
  [1.188,-1.35],[1.169,-.88],[1.157,-.56],[1.12,.052],[1.077,.65],
  [.998,1.21],[.93,1.65],[.82,2.04],[.748,2.46],[.705,3.09],[.673,3.40]
];
shell(nacelle,cowl,.025,metals.airframe);
shell(nacelle,[[1.067,-2.29],[.968,-2.19],[.929,-1.94],[.933,-1.55],[.945,-1.299]],.022,metals.casing);
for(const [x,r] of [[-1.35,1.188],[-.56,1.157],[.65,1.077],[2.46,.748]]) {
  mesh(nacelle,GEO.tube(r+.001,r-.003,.004,96),metals.grey,[x,0,0],[0,0,Math.PI/2]);
}
wingSection(context,{x:-.28,y:2.62,z:-1.98,chord:3.39,span:2.75,thickness:.173});
const pylon = group(context,.26,2.52);
mesh(pylon,GEO.rbox(1.48,.30,.285,.076),metals.airframe);
pipe(pylon,[[-.59,.09,0],[-.99,-.061,0],[-.99,-.214,0]],.053,metals.grey);
pipe(pylon,[[.48,.10,0],[.52,-.48,0],[.49,-.82,0]],.052,metals.grey);
installationControl(lab,context,{
  view:{az:-18,el:20,dist:framing(2.61),target:[.39,1.49,0]},
  returnView:overview
});
lab.label(fanCase.object,'Fan',{at:[-1.09,.51,-.06]});
lab.label(fanCase.object,'Bypass duct',{at:[-.80,.81,-.05]});
lab.label(high.object,'High-pressure compressor',{at:[-.017,.22,-.04]});
lab.label(coreCase.object,'Annular combustor',{at:[.433,.29,-.034]});
lab.label(lowCase.object,'Low-pressure turbine',{at:[.891,.31,-.035]});
lab.cameraViews({Overview:overview,Side:{az:0,el:7,dist:framing(2.11),target:[.01,y,0]},Inlet:{az:-75,el:10,dist:framing(1.72),target:[-.25,y,0]},Exhaust:{az:114,el:13,dist:framing(1.70),target:[.14,y,0]}});
moduleInspector(lab);
const animateAirframe=aircraftOverview(lab,'turbofan');
operatingControls(lab,'turbofan',({angleG,angleP}) => {
  animateAirframe(angleP/280);
  hpRotor.rotation.x = angleG/280;
  fanRotor.rotation.x = angleP/280;
  lpRotor.rotation.x = angleP/280;
});
inspectionControls(lab,amount => [fanCase,high,coreCase,lowCase].forEach(part => part.pose(amount)));
lab.how('The fan sends some air through the core and the rest through the bypass duct. In this CFM56-5C arrangement, a five-stage low-pressure turbine drives the fan and four booster stages on one shaft. A single-stage high-pressure turbine drives nine compressor stages on the other shaft. These independent rotating assemblies are called spools. The installed view adds an A340-style nacelle and a mixer that combines the core and bypass flows before the common exhaust. The experiment uses a generic two-spool speed-governor model with separate ideal core and bypass thrust estimates. Shapes and installation details are representative, and rotation is slowed for viewing. Moving a control restarts the trial from the same settled operating point; use Trial time to revisit a moment. <a href="https://www.easa.europa.eu/en/document-library/type-certificates/engine-cs-e/easae003-cfm-international-sa-cfm56-5band5c-series">EASA CFM56-5C type certificate data sheet</a>.');
studyNavigation(lab,'turbofan');
await lab.start();

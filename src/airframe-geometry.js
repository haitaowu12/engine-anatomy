// Illustrated H175, Dash 8 and A340 airframe cues around the teaching installations.
export const AIRFRAME_LAYOUT={
 helicopter:{mastX:-6.3,tailX:20.5,tailRotorY:1.78,rotorRadius:18,center:[0,-1,0],span:36,camera:[-23,13,34]},
 turboprop:{center:[7,.3,-8.8],span:64,camera:[-25,19,34],bodyZ:-8.8,oppositeEngineZ:-17.6},
 turbofan:{center:[8,1.5,-10],span:55,camera:[-52,15,19],bodyZ:-10,oppositeEngineZ:-20}
};

export function buildAirframeGeometry(a,m){
 const {T,C,mesh,cylinder,pipe,box,lowDetail=false}=a,layout=AIRFRAME_LAYOUT[m.kind],heli=m.kind==='helicopter',prop=m.kind==='turboprop';
 const skin=heli?0xdeb95e:0xe0ddd0,trim=heli?0x815133:0x426575,glass=0x213f50,tyre=0x26343a;
 const loftSamplers=new WeakMap(),windowBodies=[];
 const mark=(o,feature)=>{o.userData.airframeFeature=feature;o.userData.airframeContext=true;return o;};
 // Closed skins have outward winding and cull their back faces. SVGRenderer
 // uses a painter's sort rather than a depth buffer: drawing the dark reverse
 // faces of a thin airfoil makes them incorrectly overpaint its front skin.
 // Only the explicitly zero-thickness glazing patches need two-sided faces.
 const make=(id,geometry,color,feature,twoSided=false)=>mark(mesh(id,geometry,color,[0,0,0],{side:twoSided?T.DoubleSide:T.FrontSide,metalness:color===skin?.035:color===glass?.08:.3,roughness:color===glass?.2:color===skin?.35:.48,envMapIntensity:color===glass?1.15:.85}),feature);
 // A sequence of cross-sections gives a shaped nose, cabin and taper. Smooth
 // interpolation is applied to the centre and elliptical radii independently.
 function loft(id,sections,color,feature,openings=[]){
  const centers=new T.CatmullRomCurve3(sections.map(s=>new T.Vector3(s[0],s[1],s[2])),false,'centripetal'),radii=new T.CatmullRomCurve3(sections.map(s=>new T.Vector3(s[0],s[3],s[4])),false,'centripetal');
  const longitudinal=lowDetail?48:64,radial=lowDetail?28:40,p=[],idx=[],skinUV=[];
  for(let i=0;i<=longitudinal;i++){const q=centers.getPoint(i/longitudinal),r=radii.getPoint(i/longitudinal);for(let j=0;j<=radial;j++){const t=j/radial*Math.PI*2;p.push(q.x,q.y+Math.max(.008,r.y)*Math.cos(t),q.z+Math.max(.008,r.z)*Math.sin(t));skinUV.push([q.x,t]);}}
  for(let i=0;i<longitudinal;i++)for(let j=0;j<radial;j++){const k=i*(radial+1)+j,n=k+radial+1,c=[0,1,2].map(axis=>(p[k*3+axis]+p[(k+1)*3+axis]+p[n*3+axis]+p[(n+1)*3+axis])/4);if(openings.some(open=>open(c)))continue;idx.push(k,k+1,n,n,k+1,n+1);}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(idx);g.computeVertexNormals();const o=make(id,g,color,feature);loftSamplers.set(o,{centers,radii,skinUV,windows:[]});windowBodies.push(o);return o;
 }
 // Closed thickness around a symmetric airfoil; two mirrored wings use the
 // same section data. Sweep and dihedral are genuine 3D coordinates.
 function foil(id,{root,span,rootChord,tipChord,sweep=0,dihedral=0,side=1,vertical=false,thickness=.12},color,feature){
  const p=[],idx=[],ns=lowDetail?5:9,nc=lowDetail?16:28;
  for(let face=0;face<2;face++)for(let i=0;i<=ns;i++){const t=i/ns,chord=rootChord+(tipChord-rootChord)*t;for(let j=0;j<=nc;j++){const u=(1-Math.cos(Math.PI*j/nc))/2,h=5*thickness*chord*(.2969*Math.sqrt(u)-.126*u-.3516*u*u+.2843*u**3-.1036*u**4)*(face?-1:1),x=root[0]+sweep*t+u*chord,y=vertical?root[1]+span*t:root[1]+span*t*dihedral+h,z=vertical?root[2]+h:root[2]+side*span*t;p.push(x,y,z);}}
  const layer=(ns+1)*(nc+1);
  for(let face=0;face<2;face++)for(let i=0;i<ns;i++)for(let j=0;j<nc;j++){const k=face*layer+i*(nc+1)+j,n=k+nc+1;const outward=vertical?face===1:(side===1)===(face===0);idx.push(...(outward?[k,n,k+1,k+1,n,n+1]:[k,k+1,n,k+1,n+1,n]));}
  for(const i of [0,ns])for(let j=0;j<nc;j++){const k=i*(nc+1)+j,outward=vertical?i===0:(i===ns)===(side===1);idx.push(...(outward?[k,k+layer,k+1,k+1,k+layer,k+layer+1]:[k,k+1,k+layer,k+1,k+layer+1,k+layer]));}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(idx);g.computeVertexNormals();const o=make(id,g,color,feature);o.userData.airfoil={...arguments[1]};return o;
 }
 // Glazing and seams follow the exact fuselage surface. A flat four-corner
 // patch cut through the curved skin and became ragged black shards in SVG.
 function loftSection(body,x){
  const {centers,radii}=loftSamplers.get(body);let lo=0,hi=1;
  for(let i=0;i<24;i++){const t=(lo+hi)/2;if(centers.getPoint(t).x<x)lo=t;else hi=t;}
  const t=(lo+hi)/2;return [centers.getPoint(t),radii.getPoint(t)];
 }
 function skinPoint(body,x,angle,offset=.045){
  const [c,r]=loftSection(body,x);
  return [c.x,c.y+(Math.max(.008,r.y)+offset)*Math.cos(angle),c.z+(Math.max(.008,r.z)+offset)*Math.sin(angle)];
 }
 function skinWindow(id,body,corners,feature){
  loftSamplers.get(body).windows.push(corners.map(([x,angle])=>[x,(angle+Math.PI*2)%(Math.PI*2)]));
  const positions=[],indices=[],nx=lowDetail?8:12,ny=lowDetail?6:10;
  const uv=(u,v)=>[0,1].map(k=>(1-v)*((1-u)*corners[0][k]+u*corners[1][k])+v*((1-u)*corners[3][k]+u*corners[2][k]));
  for(let i=0;i<=nx;i++)for(let j=0;j<=ny;j++)positions.push(...skinPoint(body,...uv(i/nx,j/ny)));
  for(let i=0;i<nx;i++)for(let j=0;j<ny;j++){const a=i*(ny+1)+j,b=a+ny+1;indices.push(a,b,a+1,b,b+1,a+1);}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();const o=make(id,g,glass,feature,true);o.userData.conformsToSkin=true;
  const outline=[];for(let edge=0;edge<4;edge++)for(let i=0;i<8;i++){const t=i/8,p=corners[edge],q=corners[(edge+1)%4];outline.push(skinPoint(body,p[0]*(1-t)+q[0]*t,p[1]*(1-t)+q[1]*t,.065));}outline.push(outline[0]);line(id,outline,trim,.027,feature+'-gasket');return o;
 }
 function skinSeam(id,body,corners,feature){
  const points=[];for(let edge=0;edge<corners.length-1;edge++)for(let i=0;i<10;i++){const t=i/10,p=corners[edge],q=corners[edge+1];points.push(skinPoint(body,p[0]*(1-t)+q[0]*t,p[1]*(1-t)+q[1]*t,.03));}points.push(skinPoint(body,...corners.at(-1),.03));return line(id,points,trim,.018,feature);
 }
 // Clip actual window apertures out of the skin in its longitudinal/angular
 // parameter plane. A painted patch over an unbroken hull is insufficient for
 // a painter renderer: distant triangle centres can overpaint nearby glazing.
 // Convex subtraction preserves outside skin and the original smooth normals.
 function carveWindowApertures(){
  const area=poly=>poly.reduce((sum,v,i)=>{const q=poly[(i+1)%poly.length].uv;return sum+v.uv[0]*q[1]-q[0]*v.uv[1];},0)/2;
  const split=(poly,a,b,orientation)=>{
   const signed=v=>orientation*((b[0]-a[0])*(v.uv[1]-a[1])-(b[1]-a[1])*(v.uv[0]-a[0])),inside=[],outside=[];
   for(let i=0;i<poly.length;i++){
    const v=poly[i],w=poly[(i+1)%poly.length],dv=signed(v),dw=signed(w),vi=dv>=-1e-10,wi=dw>=-1e-10;(vi?inside:outside).push(v);
    if(vi!==wi){const t=dv/(dv-dw),q={uv:[v.uv[0]+(w.uv[0]-v.uv[0])*t,v.uv[1]+(w.uv[1]-v.uv[1])*t],p:v.p.clone().lerp(w.p,t),n:v.n.clone().lerp(w.n,t).normalize()};inside.push(q);outside.push(q);}
   }
   return [inside,outside];
  };
  for(const body of windowBodies){
   const {skinUV,windows}=loftSamplers.get(body);if(!windows.length)continue;
   const geometry=body.geometry,position=geometry.attributes.position,normal=geometry.attributes.normal,index=geometry.index,positions=[],normals=[];
   const holes=windows.map(corners=>({corners,orientation:Math.sign(area(corners.map(uv=>({uv})))),minX:Math.min(...corners.map(p=>p[0])),maxX:Math.max(...corners.map(p=>p[0])),minA:Math.min(...corners.map(p=>p[1])),maxA:Math.max(...corners.map(p=>p[1]))}));
   for(let i=0;i<index.count;i+=3){
    let pieces=[[0,1,2].map(j=>{const k=index.getX(i+j);return {uv:skinUV[k],p:new T.Vector3().fromBufferAttribute(position,k),n:new T.Vector3().fromBufferAttribute(normal,k)};})];
    for(const hole of holes){
     const next=[];
     for(const polygon of pieces){
      if(Math.max(...polygon.map(v=>v.uv[0]))<=hole.minX||Math.min(...polygon.map(v=>v.uv[0]))>=hole.maxX||Math.max(...polygon.map(v=>v.uv[1]))<=hole.minA||Math.min(...polygon.map(v=>v.uv[1]))>=hole.maxA){next.push(polygon);continue;}
      let remaining=polygon;
      for(let edge=0;edge<hole.corners.length&&remaining.length>=3;edge++){
       const [inside,outside]=split(remaining,hole.corners[edge],hole.corners[(edge+1)%hole.corners.length],hole.orientation);if(outside.length>=3&&Math.abs(area(outside))>1e-10)next.push(outside);remaining=inside;
      }
     }
     pieces=next;if(!pieces.length)break;
    }
    for(const polygon of pieces)for(let j=1;j<polygon.length-1;j++)for(const vertex of [polygon[0],polygon[j],polygon[j+1]]){positions.push(...vertex.p.toArray());normals.push(...vertex.n.toArray());}
   }
   const cut=new T.BufferGeometry();cut.setAttribute('position',new T.Float32BufferAttribute(positions,3));cut.setAttribute('normal',new T.Float32BufferAttribute(normals,3));cut.userData.windowApertures=windows.length;body.geometry=cut;geometry.dispose();body.userData.windowApertures=windows.length;
  }
 }
 function wheel(id,pos,r,width,feature){const o=mesh(id,new T.CylinderGeometry(r,r,width,lowDetail?12:24),tyre,pos);o.rotation.x=Math.PI/2;mark(o,feature);const hub=mesh(id,new T.CylinderGeometry(r*.46,r*.46,width+.035,16),C.silver,pos);hub.rotation.x=Math.PI/2;mark(hub,feature);}
 function line(id,points,color,r,feature){return mark(pipe(id,points,color,r),feature);}
 if(heli){
  const fuselage=loft('airframe.fuselage',[[-16.9,-4.65,0,.045,.045],[-16.4,-4.62,0,.68,1.05],[-15.0,-4.36,0,1.28,1.96],[-13.8,-3.98,0,1.92,2.42],[-12.4,-3.55,0,2.6,2.80],[-10.3,-3.25,0,2.97,3.03],[-7,-3.19,0,3.02,3.13],[-1,-3.20,0,2.99,3.13],[1.8,-3.05,0,2.62,2.88],[4,-2.78,0,1.74,2.00],[6,-2.60,0,.89,.90]],skin,'fuselage');
  loft('airframe.fuselage',[[3,-2.65,0,1.35,1.3],[8,-2.5,0,.88,.8],[15,-2.5,0,.48,.43],[20.5,-2.5,0,.24,.25]],skin,'tail-boom');
  for(const side of [-1,1]){
   const pane=(points,feature)=>skinWindow('airframe.cockpit',fuselage,points.map(([x,t])=>[x,side*t]),feature+'-'+side);
   pane([[-14.8,.10],[-12.5,.095],[-12.65,1.39],[-14.22,1.28]],'windscreen');
   pane([[-12.25,.88],[-10.75,.83],[-10.81,1.63],[-12.57,1.64]],'pilot-window');
   pane([[-14.4,1.80],[-13.05,1.75],[-13.14,2.10],[-14.15,2.18]],'chin-window');
   for(const [i,x,w] of [[1,-9.9,1.70],[2,-7.53,2.42],[3,-4.46,1.46]])pane([[x,.96],[x+w,.94],[x+w-.12,1.62],[x+.08,1.65]],'cabin-window-'+i);
   skinSeam('airframe.fuselage',fuselage,[[-7.94,side*.80],[-4.75,side*.80],[-4.7,side*2.23],[-7.94,side*2.23],[-7.94,side*.80]],'cabin-door-'+side);
   const handle=skinPoint(fuselage,-6.9,side*1.82,.08);line('airframe.fuselage',[[handle[0]-.23,handle[1],handle[2]],[handle[0]+.23,handle[1],handle[2]]],trim,.035,'door-handle-'+side);
   loft('airframe.landing',[[-6.42,-5.61,side*2.58,.03,.03],[-5.70,-5.68,side*2.77,.41,.53],[-3.4,-5.68,side*2.77,.40,.54],[-1.92,-5.59,side*2.58,.03,.04]],skin,'wheel-fairing-'+side);
   mark(cylinder('airframe.landing',[-3.45,-5.53,side*2.32],[-3.43,-6.90,side*2.56],.12,C.silver),'main-gear-strut');
   wheel('airframe.landing',[-3.43,-6.92,side*2.56],.58,.45,'main-wheel');
   foil('airframe.tail',{root:[16.8,-1.95,0],span:3.3,rootChord:2.1,tipChord:1.03,sweep:.58,side,thickness:.08},trim,'tailplane-'+side);
  }
  mark(cylinder('airframe.landing',[-12.43,-5.72,0],[-12.31,-7.03,0],.11,C.silver),'nose-gear-strut');
  for(const z of [-.25,.25])wheel('airframe.landing',[-12.31,-7.06,z],.44,.29,'nose-wheel');
  foil('airframe.tail',{root:[16.8,-2.5,0],span:4.62,rootChord:4.05,tipChord:1.22,sweep:2.80,vertical:true,thickness:.08},skin,'vertical-fin');
  // The forward transmission fairing meets the removable engine cowling.
  // The mast passes through a dedicated opening in the forward skin.
  loft('airframe.mounts',[[-10.8,-.50,0,.035,.036],[-9.6,-.11,0,.62,1.02],[-8.1,.27,0,1.34,1.58],[-6.65,.41,0,1.49,1.52],[-5.57,0,0,1.22,1.22]],skin,'transmission-fairing',
   [c=>Math.abs(c[0]-layout.mastX)<.53&&Math.abs(c[2])<.45]);
  const deckCover=loft('airframe.nacelle',[[-5.57,0,0,1.22,1.22],[-4.5,-.1,0,1.85,1.8],[-1.8,-.15,0,1.95,1.9],[1.8,-.15,0,1.95,1.9],[3.6,-.1,0,2.25,2.2],[5.8,0,0,2.3,2.3],[6.45,0,0,.85,.85]],skin,'installed-nacelle',[c=>Math.abs(c[0]-3.75)<.52&&c[1]>-.1&&c[1]<1.15&&Math.abs(c[2])>1.25]);
  deckCover.userData.installationCover=true;
  for(const side of [-1,1]){const seam=skinSeam('airframe.nacelle',deckCover,[[-3.8,side*.28],[-3.8,side*2.2],[1.8,side*2.2],[1.8,side*.28],[-3.8,side*.28]],'engine-access-panel-'+side);seam.userData.installationCover=true;}
  const deck=mark(box('airframe.mounts',[.5,-1.78,0],[10.8,.16,3.7],trim),'engine-deck');deck.userData.enclosedByCowling=true;
  for(const x of [-3.9,2.8])for(const z of [-.95,.95])mark(cylinder('airframe.mounts',[x,-.72,z*.75],[x,-1.7,z*1.5],.055,C.silver),'engine-mount');
 }else{
  const z=layout.bodyZ,y=prop?-.1:3.4,rz=prop?2.65:3.1,ry=prop?2.75:3.2,nose=prop?-22:-25,tail=prop?43.66:40.13;
  const fuselage=loft('airframe.fuselage',[[nose,y-1.0,z,.03,.03],[nose+.44,y-.88,z,ry*.16,rz*.24],[nose+1.25,y-.64,z,ry*.42,rz*.42],[nose+2.65,y-.35,z,ry*.71,rz*.68],[nose+4.0,y-.10,z,ry*.87,rz*.86],[nose+6.3,y,z,ry,rz],[tail-12,y,z,ry,rz],[tail-7,y+.15,z,ry*.75,rz*.72],[tail-2,y+.55,z,.55,.42],[tail,y+.65,z,.035,.035]],skin,'fuselage');
  for(const side of [-1,1]){
   skinWindow('airframe.cockpit',fuselage,[[nose+2.50,side*.10],[nose+4.35,side*.19],[nose+4.82,side*.91],[nose+3.23,side*1.05]],'windscreen-'+side);
   skinWindow('airframe.cockpit',fuselage,[[nose+4.69,side*.34],[nose+6.02,side*.45],[nose+6.12,side*1.12],[nose+5.02,side*1.08]],'side-windscreen-'+side);
   for(let i=0;i<(prop?20:24);i++){const x=nose+8.5+i*(prop?2.15:1.9);skinWindow('airframe.cockpit',fuselage,[[x-.28,side*1.12],[x+.28,side*1.12],[x+.28,side*1.48],[x-.28,side*1.48]],'cabin-window-'+side+'-'+i);}
   for(const x of [nose+7,tail-10.6])skinSeam('airframe.fuselage',fuselage,[[x,side*.68],[x,side*2.2],[x+1.05,side*2.2],[x+1.05,side*.68],[x,side*.68]],'cabin-door-'+side+'-'+x);
   const wy=prop?2.55:2.65,rootX=prop?1.1:-.6,semi=prop?28.42:28.3,sweep=prop?1.5:13.0,rootChord=prop?6.4:11.0,tipChord=2.7,dihedral=prop?.018:.046;
   foil('wing',{root:[rootX,wy,z],span:semi,rootChord,tipChord,sweep,dihedral,side,thickness:.12},skin,'wing-'+side);
   if(!prop){
    const tipX=rootX+sweep,tipY=wy+semi*dihedral,tipZ=z+side*semi;
    foil('wing',{root:[tipX+.28,tipY-.31,tipZ],span:1.5,rootChord:2.25,tipChord:.69,sweep:.65,vertical:true,thickness:.067},trim,'tip-fence-'+side);
   }
   const seam=[.2,.5,.92].map(t=>[rootX+sweep*t+(rootChord+(tipChord-rootChord)*t)*.76,wy+semi*t*dihedral+.1,z+side*semi*t]);line('wing',seam,trim,.018,'trailing-control-seam-'+side);
   foil('airframe.tail',{root:[tail-8,prop?y+9.0:y+.7,z],span:prop?8.5:10.0,rootChord:prop?5.0:6.8,tipChord:2.1,sweep:prop?1.5:4.5,side,dihedral:.03,thickness:.09},skin,'tailplane-'+side);
  }
  foil('airframe.tail',{root:[tail-11,y+.4,z],span:prop?8.6:10.4,rootChord:prop?8.0:10.2,tipChord:prop?3.0:3.1,sweep:prop?3.0:6.0,vertical:true,thickness:.09},skin,'vertical-fin');
  for(const ez of [0,layout.oppositeEngineZ]){
   // Wing roots remain at the fuselage; each pod has a visible structural pylon.
   foil('airframe.mounts',{root:[prop?0:1.1,prop?1.65:1.8,ez],span:prop?1.0:1.3,rootChord:prop?4.8:3.8,tipChord:3.2,sweep:prop?2.85:3.5,vertical:true,thickness:.08},trim,'pylon-'+ez);
   for(const x of [-2.9,2.6])mark(cylinder('airframe.mounts',[x,prop?.9:1.8,ez],[x,prop?1.35:2.2,ez],.075,C.silver),'engine-mount-'+ez);
  }
  const cowling=(ez)=>prop?[[-6.25,0,ez,1.5,1.5],[-5.75,0,ez,1.6,1.6],[-4.3,-.15,ez,1.95,1.9],[1.6,-.15,ez,1.95,1.9],[4.45,0,ez,1.18,1.18],[4.9,0,ez,1.08,1.08]]:[[-5.55,0,ez,2.16,2.16],[-4.8,0,ez,2.25,2.25],[-2.6,-.3,ez,2.6,2.55],[1.5,-.3,ez,2.6,2.55],[3.7,-.1,ez,2.2,2.15],[4.45,0,ez,1.94,1.94]];
  const installedCowl=loft('airframe.nacelle',cowling(0),skin,'installed-nacelle');installedCowl.userData.installationCover=true;
  if(!prop)for(const side of [-1,1]){
   const ez=z+side*19.35,shift=5.1;
   loft('airframe.companion',cowling(ez).map(([x,...rest])=>[x+shift,...rest]),skin,'outer-engine-'+side);
   const mouth=mesh('airframe.companion',new T.CircleGeometry(1.86,24),glass,[-5.51+shift,0,ez]);mouth.rotation.y=-Math.PI/2;mark(mouth,'outer-engine-intake-'+side);
   foil('airframe.mounts',{root:[shift+1.1,1.78,ez],span:1.78,rootChord:4.3,tipChord:3.0,sweep:3.5,vertical:true,thickness:.085},trim,'outer-pylon-'+side);
  }
  const ez=layout.oppositeEngineZ,r=prop?1.3:2.15;
  loft('airframe.companion',cowling(ez),skin,'context-engine-nacelle');
  const intake=mesh('airframe.companion',new T.CircleGeometry(r*.86,lowDetail?18:32),glass,[-5.51,0,ez]);intake.rotation.y=-Math.PI/2;mark(intake,'context-engine-intake');
  const exhaust=mesh('airframe.companion',new T.CircleGeometry(r*.45,16),trim,[4.81,0,ez]);exhaust.rotation.y=Math.PI/2;mark(exhaust,'context-engine-exhaust');
  if(prop){
   mark(cylinder('airframe.companion',[-7.2,0,ez],[-6.1,0,ez],.1,C.silver),'context-prop-shaft');
   loft('airframe.companion',[[-7.65,0,ez,.03,.03],[-7.3,0,ez,.36,.36],[-6.7,0,ez,.39,.39]],skin,'context-prop-spinner');
   const blade=new T.Shape();
   blade.moveTo(-.10,.22);blade.quadraticCurveTo(-.31,1.46,-.30,3.17);
   blade.quadraticCurveTo(-.29,3.62,-.07,3.68);blade.quadraticCurveTo(.12,3.65,.14,3.21);
   blade.quadraticCurveTo(.28,1.40,.13,.22);blade.closePath();
   const bladeShape=new T.ExtrudeGeometry(blade,{depth:.07,bevelEnabled:true,bevelThickness:.021,bevelSize:.021,bevelSegments:1,curveSegments:5});
   bladeShape.rotateY(Math.PI/2);
   for(let i=0;i<4;i++){
    const o=mesh('airframe.companion',bladeShape.clone(),trim,[-7.2,0,ez]);o.rotation.x=i*Math.PI/2;mark(o,'context-prop-blade');
   }
   bladeShape.dispose();
  }
  // Airframe context uses retracted gear. There is no ground pose or gear
  // extension simulation, and the propeller disc therefore cannot imply a
  // physically impossible ground-clearance configuration.
  for(const [x,wz]of [[prop?-6:-10,z],[8,z-1.15],[8,z+1.15]])line('airframe.landing',[[x-1.1,y-ry+.03,wz-.22],[x+1.1,y-ry+.03,wz-.22],[x+1.1,y-ry+.03,wz+.22],[x-1.1,y-ry+.03,wz+.22],[x-1.1,y-ry+.03,wz-.22]],trim,.018,'retracted-gear-door');
 }
 carveWindowApertures();return layout;
}

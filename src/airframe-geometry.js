// Original teaching airframes: Bell 412 cabin/boom, Dash 8 high wing/T-tail,
// and 737 swept-wing proportions. References and deliberate engine/rotor
// simplifications are recorded in docs/SOURCES.md; these are not type CAD.
export const AIRFRAME_LAYOUT={
 helicopter:{mastX:-6.3,tailX:20.5,rotorRadius:18,center:[0,-1,0],span:42,camera:[-22,18,34]},
 turboprop:{center:[7,.3,-8.8],span:64,camera:[-25,19,34],bodyZ:-8.8,oppositeEngineZ:-17.6},
 turbofan:{center:[8,1.5,-10],span:66,camera:[-29,22,37],bodyZ:-10,oppositeEngineZ:-20}
};

export function buildAirframeGeometry(a,m){
 const {T,C,mesh,cylinder,pipe,box,lowDetail=false}=a,layout=AIRFRAME_LAYOUT[m.kind],heli=m.kind==='helicopter',prop=m.kind==='turboprop';
 const skin=0xcdd8d6,trim=0x426575,glass=0x213f50,tyre=0x26343a;
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
 function skinPoint(body,x,angle,offset=.045){
  const {centers,radii}=loftSamplers.get(body);let lo=0,hi=1;
  for(let i=0;i<24;i++){const t=(lo+hi)/2;if(centers.getPoint(t).x<x)lo=t;else hi=t;}
  const t=(lo+hi)/2,c=centers.getPoint(t),r=radii.getPoint(t);
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
  const fuselage=loft('airframe.fuselage',[[-15,-3.8,0,.04,.04],[-14,-3.8,0,1.45,1.8],[-11.6,-3.5,0,2.8,2.9],[-7,-3.45,0,2.7,3.0],[-1,-3.3,0,2.65,2.9],[3,-2.9,0,1.8,1.7],[6,-2.6,0,.9,.9]],skin,'fuselage');
  loft('airframe.fuselage',[[3,-2.65,0,1.35,1.3],[8,-2.5,0,.88,.8],[15,-2.5,0,.48,.43],[20.5,-2.5,0,.24,.25]],skin,'tail-boom');
  for(const side of [-1,1]){
   skinWindow('airframe.cockpit',fuselage,[[-13.7,side*.57],[-10.15,side*.5],[-10.15,side*1.51],[-13.7,side*1.61]],'windscreen-'+side);
   skinWindow('airframe.cockpit',fuselage,[[-9.75,side*.63],[-6.9,side*.67],[-6.75,side*1.62],[-9.75,side*1.62]],'pilot-window-'+side);
   for(const x of [-5.7,-2.8])skinWindow('airframe.cockpit',fuselage,[[x,side*.74],[x+2.2,side*.74],[x+2.2,side*1.6],[x,side*1.6]],'cabin-window-'+side+'-'+x);
   skinSeam('airframe.fuselage',fuselage,[[-6.35,side*.55],[-6.35,side*2.43],[.25,side*2.43],[.25,side*.55],[-6.35,side*.55]],'cabin-door-'+side);
   const handle=skinPoint(fuselage,-.35,side*1.77,.08);line('airframe.fuselage',[[handle[0]-.27,handle[1],handle[2]],[handle[0]+.27,handle[1],handle[2]]],trim,.04,'door-handle-'+side);
   line('airframe.landing',[[-12.2,-6.3,side*3.05],[-11.3,-7,side*3.1],[5.6,-7,side*3.1],[6.3,-6.9,side*3.1]],trim,.115,'skid-'+side);
   for(const x of [-8.5,2.2])mark(cylinder('airframe.landing',[x,-5,side*1.8],[x,-7,side*3.1],.1,C.silver),'skid-strut-'+side);
   foil('airframe.tail',{root:[15,-2.2,0],span:3.3,rootChord:2.7,tipChord:1.2,sweep:.7,side,thickness:.08},skin,'tailplane-'+side);
  }
  foil('airframe.tail',{root:[17,-2.5,0],span:4.3,rootChord:3.3,tipChord:1.2,sweep:2.0,vertical:true,thickness:.08},skin,'vertical-fin');
  // An engine deck and actual mounts connect accessories/case to the airframe.
  loft('airframe.mounts',[[-8.4,-.8,0,.04,.04],[-7.7,-.35,0,1.25,.95],[-6.35,.55,0,2.0,1.05],[-5.68,-.65,0,.05,.05]],skin,'transmission-fairing');
  const deckCover=loft('airframe.nacelle',[[-5.57,0,0,1.22,1.22],[-4.5,-.1,0,1.85,1.8],[-1.8,-.15,0,1.95,1.9],[1.8,-.15,0,1.95,1.9],[3.6,-.1,0,2.25,2.2],[5.8,0,0,2.3,2.3],[6.45,0,0,.85,.85]],skin,'installed-nacelle',[c=>Math.abs(c[0]-3.75)<.52&&c[1]>-.1&&c[1]<1.15&&Math.abs(c[2])>1.25]);deckCover.userData.installationCover=true;
  for(const side of [-1,1]){const seam=skinSeam('airframe.nacelle',deckCover,[[-3.8,side*.28],[-3.8,side*2.2],[1.8,side*2.2],[1.8,side*.28],[-3.8,side*.28]],'engine-access-panel-'+side);seam.userData.installationCover=true;}
  const deck=mark(box('airframe.mounts',[.5,-1.78,0],[10.8,.16,3.7],trim),'engine-deck');deck.userData.enclosedByCowling=true;
  for(const x of [-3.9,2.8])for(const z of [-.95,.95])mark(cylinder('airframe.mounts',[x,-.72,z*.75],[x,-1.7,z*1.5],.055,C.silver),'engine-mount');
 }else{
  const z=layout.bodyZ,y=prop?-.1:3.4,rz=prop?2.65:3.1,ry=prop?2.75:3.2,nose=prop?-22:-25,tail=prop?43.66:40.13;
  const fuselage=loft('airframe.fuselage',[[nose,y-.5,z,.03,.03],[nose+1.1,y-.45,z,ry*.36,rz*.33],[nose+3.5,y-.12,z,ry*.84,rz*.78],[nose+6.5,y,z,ry,rz],[tail-12,y,z,ry,rz],[tail-7,y+.15,z,ry*.75,rz*.72],[tail-2,y+.55,z,.55,.42],[tail,y+.65,z,.035,.035]],skin,'fuselage');
  for(const side of [-1,1]){
   skinWindow('airframe.cockpit',fuselage,[[nose+2.4,side*.62],[nose+5.3,side*.62],[nose+5.4,side*1.17],[nose+2.9,side*1.23]],'windscreen-'+side);
   for(let i=0;i<(prop?20:24);i++){const x=nose+8.5+i*(prop?2.15:1.9);skinWindow('airframe.cockpit',fuselage,[[x-.28,side*1.12],[x+.28,side*1.12],[x+.28,side*1.48],[x-.28,side*1.48]],'cabin-window-'+side+'-'+i);}
   for(const x of [nose+7,tail-10.6])skinSeam('airframe.fuselage',fuselage,[[x,side*.68],[x,side*2.2],[x+1.05,side*2.2],[x+1.05,side*.68],[x,side*.68]],'cabin-door-'+side+'-'+x);
   const wy=prop?2.55:2.65,rootX=prop?1.1:-.6,semi=prop?28.42:28.3,sweep=prop?1.5:13.0,rootChord=prop?6.4:11.0,tipChord=prop?2.7:2.7;
   foil('wing',{root:[rootX,wy,z],span:semi,rootChord,tipChord,sweep,dihedral:prop?.018:.046,side,thickness:.12},skin,'wing-'+side);
   const seam=[.2,.5,.92].map(t=>[rootX+sweep*t+(rootChord+(tipChord-rootChord)*t)*.76,wy+semi*t*(prop?.018:.046)+.1,z+side*semi*t]);line('wing',seam,trim,.018,'trailing-control-seam-'+side);
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
  const ez=layout.oppositeEngineZ,r=prop?1.3:2.15;
  loft('airframe.companion',cowling(ez),skin,'context-engine-nacelle');
  const intake=mesh('airframe.companion',new T.CircleGeometry(r*.86,lowDetail?18:32),glass,[-5.51,0,ez]);intake.rotation.y=-Math.PI/2;mark(intake,'context-engine-intake');
  const exhaust=mesh('airframe.companion',new T.CircleGeometry(r*.45,16),trim,[4.81,0,ez]);exhaust.rotation.y=Math.PI/2;mark(exhaust,'context-engine-exhaust');
  if(prop){
   mark(cylinder('airframe.companion',[-7.2,0,ez],[-6.1,0,ez],.1,C.silver),'context-prop-shaft');
   loft('airframe.companion',[[-7.65,0,ez,.03,.03],[-7.3,0,ez,.36,.36],[-6.7,0,ez,.39,.39]],skin,'context-prop-spinner');
   for(let i=0;i<4;i++){const q=i*Math.PI/2,o=mesh('airframe.companion',new T.BoxGeometry(.13,3.35,.42),trim,[-7.2,Math.cos(q)*1.95,ez+Math.sin(q)*1.95]);o.rotation.x=q;mark(o,'context-prop-blade');}
  }
  // Airframe context uses retracted gear. There is no ground pose or gear
  // extension simulation, and the propeller disc therefore cannot imply a
  // physically impossible ground-clearance configuration.
  for(const [x,wz]of [[prop?-6:-10,z],[8,z-1.15],[8,z+1.15]])line('airframe.landing',[[x-1.1,y-ry+.03,wz-.22],[x+1.1,y-ry+.03,wz-.22],[x+1.1,y-ry+.03,wz+.22],[x-1.1,y-ry+.03,wz+.22],[x-1.1,y-ry+.03,wz-.22]],trim,.018,'retracted-gear-door');
 }
 carveWindowApertures();return layout;
}

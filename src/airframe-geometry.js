// Illustrated H175, Dash 8 and A340 airframe cues around the teaching installations.
// EC175 B exterior coordinates (metres) registered to the teaching mast.
const h175Scale=18/7.4;
const h175X=x=>-6.3+(x-5.02)*h175Scale;
const h175Y=y=>-7.55+y*h175Scale;
const h175OutletX=h175X(6.16),h175OutletY=h175Y(3.19);
export const AIRFRAME_LAYOUT={
 helicopter:{mastX:-6.3,rotorY:h175Y(4.40),tailX:h175X(14.08),tailRotorY:h175Y(3.97),tailRotorRadius:1.6*h175Scale,tailDriveX:h175X(13.65),rotorRadius:18,center:[0,-1,0],span:36,camera:[-20,13,37]},
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
 function loft(id,sections,color,feature,openings=[],profile=(x,component)=>component){
  const centers=new T.CatmullRomCurve3(sections.map(s=>new T.Vector3(s[0],s[1],s[2])),false,'centripetal'),radii=new T.CatmullRomCurve3(sections.map(s=>new T.Vector3(s[0],s[3],s[4])),false,'centripetal');
  const h175Skin=heli&&['fuselage','installed-nacelle'].includes(feature);
  const longitudinal=h175Skin?96:lowDetail?48:64,radial=h175Skin?48:lowDetail?28:40,p=[],idx=[],skinUV=[];
  for(let i=0;i<=longitudinal;i++){const q=centers.getPoint(i/longitudinal),r=radii.getPoint(i/longitudinal);for(let j=0;j<=radial;j++){const t=j/radial*Math.PI*2;p.push(q.x,q.y+Math.max(.008,r.y)*profile(q.x,Math.cos(t)),q.z+Math.max(.008,r.z)*profile(q.x,Math.sin(t)));skinUV.push([q.x,t]);}}
  for(let i=0;i<longitudinal;i++)for(let j=0;j<radial;j++){const k=i*(radial+1)+j,n=k+radial+1,c=[0,1,2].map(axis=>(p[k*3+axis]+p[(k+1)*3+axis]+p[n*3+axis]+p[(n+1)*3+axis])/4);if(openings.some(open=>open(c)))continue;idx.push(k,k+1,n,n,k+1,n+1);}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(idx);g.computeVertexNormals();const o=make(id,g,color,feature);loftSamplers.set(o,{centers,radii,profile,skinUV,windows:[]});windowBodies.push(o);return o;
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
  const {profile}=loftSamplers.get(body);
  return [c.x,c.y+(Math.max(.008,r.y)+offset)*profile(c.x,Math.cos(angle)),c.z+(Math.max(.008,r.z)+offset)*profile(c.x,Math.sin(angle))];
 }
 function skinWindow(id,body,corners,feature){
  loftSamplers.get(body).windows.push(corners.map(([x,angle])=>[x,(angle+Math.PI*2)%(Math.PI*2)]));
  const positions=[],indices=[],nx=lowDetail?8:12,ny=lowDetail?6:10;
  const uv=(u,v)=>[0,1].map(k=>(1-v)*((1-u)*corners[0][k]+u*corners[1][k])+v*((1-u)*corners[3][k]+u*corners[2][k]));
  for(let i=0;i<=nx;i++)for(let j=0;j<=ny;j++)positions.push(...skinPoint(body,...uv(i/nx,j/ny)));
  for(let i=0;i<nx;i++)for(let j=0;j<ny;j++){const a=i*(ny+1)+j,b=a+ny+1;indices.push(a,b,a+1,b,b+1,a+1);}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();const o=make(id,g,glass,feature,true);o.userData.conformsToSkin=true;
  const outline=[];for(let edge=0;edge<4;edge++)for(let i=0;i<8;i++){const t=i/8,p=corners[edge],q=corners[(edge+1)%4];outline.push(skinPoint(body,p[0]*(1-t)+q[0]*t,p[1]*(1-t)+q[1]*t,.065));}outline.push(outline[0]);const gasket=line(id,outline,trim,.027,feature+'-gasket');gasket.userData.keepAperture=true;return o;
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
  // Trace the same nose, cabin and raised tail envelope as the realistic EC175 B.
  const stations=rows=>rows.map(([x,top,bottom,width])=>[
   h175X(x),h175Y((top+bottom)/2),0,(top-bottom)*h175Scale/2,width*h175Scale
  ]);
  const fuselage=loft('airframe.fuselage',stations([
   [0,1.13,1.10,.015],[.46,1.47,.73,.68],[1.18,1.99,.61,1.04],
   [1.98,2.66,.56,1.30],[2.55,2.80,.54,1.47],[3.45,2.80,.53,1.52],
   [5.65,2.83,.53,1.53],[6.68,2.81,.55,1.51],[7.85,2.70,.84,1.32],
   [9.06,2.60,1.34,.88],[10.45,2.52,1.64,.53],[12.73,2.41,1.76,.36],
   [13.78,2.43,1.88,.25],[14.03,2.26,2.24,.01]
  ]),skin,'fuselage',[],(x,value)=>{
   const cabin=Math.max(0,Math.min(1,(x-h175X(1.6))/3,(h175X(8.6)-x)/4));
   return Math.sign(value)*Math.abs(value)**(1-.46*cabin);
  });
  const deckCover=loft('airframe.nacelle',stations([
   [1.95,2.69,2.66,.015],[2.93,3.18,2.48,1.03],[3.64,3.49,2.43,1.17],
   [4.78,4.08,2.47,1.23],[5.23,4.07,2.49,1.19],[5.79,3.95,2.49,1.16],
   [6.45,3.72,2.47,1.09],[7.20,3.48,2.50,.91],[7.91,3.16,2.50,.69],
   [8.63,2.85,2.50,.38],[9.28,2.62,2.57,.025]
  ]),skin,'installed-nacelle',[
   c=>Math.abs(c[0]-layout.mastX)<.56&&Math.abs(c[2])<.47,
   c=>Math.abs(c[0]-h175OutletX)<.64&&Math.abs(c[1]-h175OutletY)<.53
  ]);
  deckCover.userData.installationCover=true;
  for(const side of [-1,1]){
   const coordinates=points=>points.map(([x,t])=>[h175X(x),side*t]);
   const pane=(points,feature)=>skinWindow('airframe.cockpit',fuselage,coordinates(points),feature+'-'+side);
   pane([[1.22,.06],[2.01,.05],[2.47,1.17],[1.45,1.36]],'windscreen');
   pane([[2.52,.91],[3.23,.90],[3.29,1.50],[2.52,1.58]],'pilot-window');
   pane([[1.28,1.85],[2.10,1.73],[2.00,2.09],[1.39,2.19]],'chin-window');
   for(const [i,x,w] of [[1,3.56,.84],[2,4.71,1.19],[3,6.15,.69]])pane([[x,1.01],[x+w,1.02],[x+w-.05,1.59],[x+.04,1.61]],'cabin-window-'+i);
   for(const [x,w,feature] of [[2.47,.93,'pilot-door'],[4.55,1.46,'cabin-door'],[7.27,.92,'cargo-door']]){
    skinSeam('airframe.fuselage',fuselage,coordinates([[x,.86],[x+w,.86],[x+w-.06,2.04],[x+.03,2.13],[x,.86]]),feature+'-'+side);
   }
   const handle=skinPoint(fuselage,h175X(4.94),side*1.79,.08);
   line('airframe.fuselage',[[handle[0]-.19,handle[1],handle[2]],[handle[0]+.19,handle[1],handle[2]]],trim,.035,'door-handle-'+side);
   const fairingZ=side*3.28,mainZ=side*2.75,mainX=h175X(6.38);
   loft('airframe.landing',[[h175X(4.56),h175Y(.77),fairingZ,.02,.02],[h175X(4.94),h175Y(.76),fairingZ,.45,.46],[h175X(6.12),h175Y(.76),fairingZ,.50,.50],[h175X(6.67),h175Y(.78),side*3.10,.03,.04]],skin,'wheel-fairing-'+side);
   mark(cylinder('airframe.landing',[mainX+.35,h175Y(.83),side*2.53],[mainX,h175Y(.345),mainZ],.12,C.silver),'main-gear-strut');
   wheel('airframe.landing',[mainX,h175Y(.345),mainZ],.84,.54,'main-wheel');
   foil('airframe.tail',{root:[h175X(12.36),h175Y(2.12),0],span:3.43,rootChord:2.46,tipChord:1.19,sweep:.39,side,thickness:.08},trim,'tailplane-'+side);
   foil('airframe.tail',{root:[h175X(12.56),h175Y(1.83),side*3.38],span:.9,rootChord:1.25,tipChord:.49,sweep:.33,vertical:true,thickness:.08},trim,'tailplane-tip-'+side);
   // Each outlet projects just beyond the curved upper cowling.
   const outletZ=side*2.72;
   for(const [from,to,r,color,feature] of [
    [[h175OutletX,h175OutletY,side*2.15],[h175OutletX,h175OutletY,outletZ],.48,C.silver,'exhaust-rim'],
    [[h175OutletX,h175OutletY,outletZ],[h175OutletX,h175OutletY,side*2.74],.36,tyre,'exhaust-mouth']
   ]){
    const outlet=mark(cylinder('airframe.nacelle',from,to,r,color),feature+'-'+side);
    outlet.userData.installationCover=true;
   }
  }
  const noseX=h175X(2.38);
  mark(cylinder('airframe.landing',[noseX+.3,h175Y(.74),0],[noseX,h175Y(.265),0],.13,C.silver),'nose-gear-strut');
  for(const z of [-.31,.31])wheel('airframe.landing',[noseX,h175Y(.265),z],.64,.36,'nose-wheel');
  foil('airframe.tail',{root:[h175X(12.31),h175Y(2.14),0],span:5.23,rootChord:4.04,tipChord:1.36,sweep:2.72,vertical:true,thickness:.08},skin,'vertical-fin');
  mark(cylinder('airframe.tail',[layout.tailX-.26,layout.tailRotorY,0],[layout.tailX,layout.tailRotorY,.74],.28,trim),'tail-rotor-fairing');
  const mastBase=mark(cylinder('airframe.mounts',[layout.mastX,layout.rotorY-.86,0],[layout.mastX,layout.rotorY-.20,0],.46,trim),'mast-fairing');
  mastBase.userData.installationCover=true;
  const cap=make('rotor',new T.SphereGeometry(1,20,12),trim,'rotor-head');
  cap.scale.set(.96,.31,.96);cap.position.set(layout.mastX,layout.rotorY+.20,0);cap.userData.installationCover=true;
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

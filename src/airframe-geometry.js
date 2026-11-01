// Original generic airframes. These dimensionless teaching shapes are not CAD
// for an aircraft type. Only the selected engine has a numerical plant.
export const AIRFRAME_LAYOUT={
 helicopter:{mastX:-6.3,center:[4,-2.1,0],span:44,camera:[-22,18,34]},
 turboprop:{center:[8,.3,-8.8],span:45,camera:[-25,19,34],bodyZ:-8.8,oppositeEngineZ:-17.6},
 turbofan:{center:[8,1.5,-10],span:54,camera:[-29,22,37],bodyZ:-10,oppositeEngineZ:-20}
};

export function buildAirframeGeometry(a,m){
 const {T,C,mesh,cylinder,pipe,box,lowDetail=false}=a,layout=AIRFRAME_LAYOUT[m.kind],heli=m.kind==='helicopter',prop=m.kind==='turboprop';
 const skin=0xcdd8d6,trim=0x426575,glass=0x213f50,tyre=0x26343a;
 const mark=(o,feature)=>{o.userData.airframeFeature=feature;o.userData.airframeContext=true;return o;};
 // Closed skins have outward winding and cull their back faces. SVGRenderer
 // uses a painter's sort rather than a depth buffer: drawing the dark reverse
 // faces of a thin airfoil makes them incorrectly overpaint its front skin.
 // Only the explicitly zero-thickness glazing patches need two-sided faces.
 const make=(id,geometry,color,feature,twoSided=false)=>mark(mesh(id,geometry,color,[0,0,0],{side:twoSided?T.DoubleSide:T.FrontSide}),feature);
 // A sequence of cross-sections gives a shaped nose, cabin and taper. Smooth
 // interpolation is applied to the centre and elliptical radii independently.
 function loft(id,sections,color,feature,openings=[]){
  const centers=new T.CatmullRomCurve3(sections.map(s=>new T.Vector3(s[0],s[1],s[2])),false,'centripetal'),radii=new T.CatmullRomCurve3(sections.map(s=>new T.Vector3(s[0],s[3],s[4])),false,'centripetal');
  const longitudinal=lowDetail?38:64,radial=lowDetail?20:36,p=[],idx=[];
  for(let i=0;i<=longitudinal;i++){const q=centers.getPoint(i/longitudinal),r=radii.getPoint(i/longitudinal);for(let j=0;j<=radial;j++){const t=j/radial*Math.PI*2;p.push(q.x,q.y+Math.max(.008,r.y)*Math.cos(t),q.z+Math.max(.008,r.z)*Math.sin(t));}}
  for(let i=0;i<longitudinal;i++)for(let j=0;j<radial;j++){const k=i*(radial+1)+j,n=k+radial+1,c=[0,1,2].map(axis=>(p[k*3+axis]+p[(k+1)*3+axis]+p[n*3+axis]+p[(n+1)*3+axis])/4);if(openings.some(open=>open(c)))continue;idx.push(k,k+1,n,n,k+1,n+1);}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(idx);g.computeVertexNormals();return make(id,g,color,feature);
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
 function pane(id,points,feature){const p=points.flat(),g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex([0,1,2,0,2,3]);g.computeVertexNormals();return make(id,g,glass,feature,true);}
 function wheel(id,pos,r,width,feature){const o=mesh(id,new T.CylinderGeometry(r,r,width,lowDetail?12:24),tyre,pos);o.rotation.x=Math.PI/2;mark(o,feature);const hub=mesh(id,new T.CylinderGeometry(r*.46,r*.46,width+.035,16),C.silver,pos);hub.rotation.x=Math.PI/2;mark(hub,feature);}
 function line(id,points,color,r,feature){return mark(pipe(id,points,color,r),feature);}
 if(heli){
  loft('airframe.fuselage',[[-15,-3.5,0,.04,.04],[-13.8,-3.6,0,1.25,1.6],[-10.5,-3.5,0,2.55,2.5],[-5.5,-3.45,0,2.7,2.65],[.5,-3.3,0,2.65,2.5],[5,-3,0,1.9,1.75],[9,-2.6,0,.95,.95]],skin,'fuselage');
  loft('airframe.fuselage',[[6,-2.6,0,1.1,1.05],[13,-2.5,0,.75,.72],[22,-2.5,0,.43,.43],[29,-2.5,0,.24,.25]],skin,'tail-boom');
  for(const side of [-1,1]){
   pane('airframe.cockpit',[[-14,-3.2,side*1.32],[-11.5,-1.5,side*1.95],[-9.3,-1.35,side*2.25],[-9.9,-3.6,side*2.45]],'windscreen-'+side);
   pane('airframe.cockpit',[[-9.1,-1.4,side*2.27],[-6.9,-1.15,side*2.36],[-6.6,-3.55,side*2.67],[-9,-3.55,side*2.6]],'pilot-window-'+side);
   for(const x of [-5.3,-2.6])pane('airframe.cockpit',[[x,-1.35,side*2.34],[x+1.9,-1.35,side*2.34],[x+1.9,-3.4,side*2.68],[x,-3.4,side*2.68]],'cabin-window-'+side+'-'+x);
   line('airframe.fuselage',[[-6.2,-1.2,side*2.42],[-6.15,-5.6,side*1.55],[.2,-5.6,side*1.55],[.2,-1.2,side*2.3]],trim,.025,'cabin-door-'+side);
   line('airframe.landing',[[-12.2,-6.3,side*3.05],[-11.3,-7,side*3.1],[5.6,-7,side*3.1],[6.3,-6.9,side*3.1]],trim,.115,'skid-'+side);
   for(const x of [-8.5,2.2])mark(cylinder('airframe.landing',[x,-5,side*1.8],[x,-7,side*3.1],.1,C.silver),'skid-strut-'+side);
   foil('airframe.tail',{root:[22,-2.2,0],span:3.6,rootChord:3.5,tipChord:1.6,sweep:1.0,side,thickness:.08},skin,'tailplane-'+side);
  }
  foil('airframe.tail',{root:[24,-2.5,0],span:5.8,rootChord:5.4,tipChord:1.7,sweep:3.2,vertical:true,thickness:.08},skin,'vertical-fin');
  // An engine deck and actual mounts connect accessories/case to the airframe.
  loft('airframe.mounts',[[-8.4,-.8,0,.04,.04],[-7.7,-.35,0,1.25,.95],[-6.35,.55,0,2.0,1.05],[-5.68,-.65,0,.05,.05]],skin,'transmission-fairing');
  const deckCover=loft('airframe.nacelle',[[-5.57,0,0,1.22,1.22],[-4.5,-.1,0,1.85,1.8],[-1.8,-.15,0,1.95,1.9],[1.8,-.15,0,1.95,1.9],[3.6,-.1,0,2.25,2.2],[5.8,0,0,2.3,2.3],[6.45,0,0,.85,.85]],skin,'installed-nacelle',[c=>Math.abs(c[0]-3.75)<.52&&c[1]>-.1&&c[1]<1.15&&Math.abs(c[2])>1.25]);deckCover.userData.installationCover=true;
  const deck=mark(box('airframe.mounts',[.5,-1.78,0],[10.8,.16,3.7],trim),'engine-deck');deck.userData.enclosedByCowling=true;
  for(const x of [-3.9,2.8])for(const z of [-.95,.95])mark(cylinder('airframe.mounts',[x,-.72,z*.75],[x,-1.7,z*1.5],.055,C.silver),'engine-mount');
 }else{
  const z=layout.bodyZ,y=prop?.6:3.4,rz=prop?1.7:2.3,ry=prop?1.8:2.4,nose=prop?-13:-19,tail=prop?29:35;
  loft('airframe.fuselage',[[nose,y-.3,z,.03,.03],[nose+1.8,y-.2,z,.65,.7],[nose+4.5,y,z,ry*.85,rz*.85],[nose+7.5,y,z,ry,rz],[15,y,z,ry,rz],[tail-8,y+.2,z,ry*.85,rz*.85],[tail-2,y+.5,z,.48,.4],[tail,y+.65,z,.035,.035]],skin,'fuselage');
  for(const side of [-1,1]){
   pane('airframe.cockpit',[[nose+2.8,y+.45,z+side*.7],[nose+4.9,y+1.42,z+side*1.1],[nose+6.8,y+1.49,z+side*1.42],[nose+6,y+.35,z+side*(rz*.96)]],'windscreen-'+side);
   for(let i=0;i<(prop?10:16);i++){const x=nose+8.5+i*(prop?1.55:1.65),window=mesh('airframe.cockpit',new T.SphereGeometry(1,lowDetail?8:14,lowDetail?6:8),glass,[x,y+.55,z+side*(rz*.958)]);window.scale.set(prop?.32:.28,.39,.035);mark(window,'cabin-window-'+side);}
   const wy=prop?2.05:2.65,rootX=prop?1.1:-.6,semi=prop?17.2:23.2,sweep=prop?3.4:12.0,rootChord=prop?7.0:10.1,tipChord=prop?2.3:2.4;
   foil('wing',{root:[rootX,wy,z],span:semi,rootChord,tipChord,sweep,dihedral:prop?.018:.046,side,thickness:.12},skin,'wing-'+side);
   const seam=[.2,.5,.92].map(t=>[rootX+sweep*t+(rootChord+(tipChord-rootChord)*t)*.76,wy+semi*t*(prop?.018:.046)+.1,z+side*semi*t]);line('wing',seam,trim,.018,'trailing-control-seam-'+side);
   foil('airframe.tail',{root:[tail-8,y+.7,z],span:prop?6.4:8.0,rootChord:prop?4.3:5.8,tipChord:1.6,sweep:prop?1.4:3.2,side,dihedral:.03,thickness:.09},skin,'tailplane-'+side);
  }
  foil('airframe.tail',{root:[tail-10,y+.4,z],span:prop?6.1:8.1,rootChord:prop?7.0:9.2,tipChord:prop?2.1:2.7,sweep:prop?4.0:5.5,vertical:true,thickness:.09},skin,'vertical-fin');
  for(const ez of [0,layout.oppositeEngineZ]){
   // Wing roots remain at the fuselage; each pod has a visible structural pylon.
   foil('airframe.mounts',{root:[prop?0:1.1,prop?1.05:1.8,ez],span:prop?1.0:1.3,rootChord:prop?4.8:3.8,tipChord:3.2,sweep:prop?2.85:3.5,vertical:true,thickness:.08},trim,'pylon-'+ez);
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
 return layout;
}

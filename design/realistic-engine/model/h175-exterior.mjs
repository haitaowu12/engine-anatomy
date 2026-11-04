import { GEO, THREE } from 'machine-kit';

// EC175 B exterior, serial 5006. Dimensions and photo references in docs/SOURCES.md.
export function h175Exterior(parent) {
const mainRadius=7.40, tailRadius=1.60, wheelbase=4.00, mastX=5.02, tailX=14.08;
  const paintFinish={roughness:.32,metalness:.08,clearcoat:.62,clearcoatRoughness:.25};
  const paint = new THREE.MeshPhysicalMaterial({color:0xf4b200,...paintFinish});
  const red = new THREE.MeshPhysicalMaterial({color:0xa72214,...paintFinish});
  const dark = new THREE.MeshStandardMaterial({color:0x242a2d,roughness:.62,metalness:.28});
  const metal = new THREE.MeshStandardMaterial({color:0x919ba0,roughness:.39});
  const polished = new THREE.MeshStandardMaterial({color:0xd2dadd,roughness:.2});
  const tire = new THREE.MeshStandardMaterial({color:0x1a1918,roughness:.86});
  const blade = new THREE.MeshPhysicalMaterial({color:0x383e42,roughness:.48,metalness:.12,clearcoat:.18,side:THREE.DoubleSide});
  const windowMaterial = new THREE.MeshPhysicalMaterial({color:0x2a3f48,metalness:.09,roughness:.24,clearcoat:.76,clearcoatRoughness:.17,side:THREE.DoubleSide,transparent:true,opacity:.84,depthWrite:false});
  const group = (parent,x=0,y=0,z=0) => {
    const g=new THREE.Group(); g.position.set(x,y,z); if(parent)parent.add(g); return g;
  };
  function mesh(parent,geo,mat,pos=[0,0,0],rot=[0,0,0]) {
    const m=new THREE.Mesh(geo,mat); m.position.set(...pos); m.rotation.set(...rot); parent.add(m); return m;
  }
  const pipe = (p,pts,r,mat=metal) => mesh(p,GEO.pipe(pts,r,12),mat);
  const box = (p,w,h,d,r,mat,pos) => mesh(p,GEO.rbox(w,h,d,r),mat,pos);
  function disc(p,r,w,mat,pos,axis='y') {
    return mesh(p,GEO.disc(r,w,Math.min(w*.22,r*.11),36),mat,pos,axis==='z'?[Math.PI/2,0,0]:axis==='x'?[0,0,Math.PI/2]:[0,0,0]);
  }

  function interpolate(rows,x,k) {
    const i=Math.min(rows.length-2,Math.max(0,rows.findLastIndex(r=>r[0]<=x)));
    const a=rows[i], b=rows[i+1], prev=rows[Math.max(0,i-1)], next=rows[Math.min(rows.length-1,i+2)];
    const d=b[0]-a[0], t=THREE.MathUtils.clamp((x-a[0])/d,0,1);
    const slope=(r,s)=>(s[k]-r[k])/(s[0]-r[0]);
    const middle=slope(a,b), tangent=(p,q)=>p*q>0?2*p*q/(p+q):0;
    const m=a===prev?middle:tangent(slope(prev,a),middle);
    const n=b===next?middle:tangent(middle,slope(b,next));
    return (2*t**3-3*t*t+1)*a[k]+(-2*t**3+3*t*t)*b[k]+d*((t**3-2*t*t+t)*m+(t**3-t*t)*n);
  }
  // Nose datum, crown, keel, half width and cross-section roundness.
  // Side elevations trace F-WWOH. Front-quarter OO-NSD constrains the windscreen
  // bridge and shoulder. Unpublished cross-sections are reconstructed.
  const body = [
    [0,1.13,1.10,.015,2],[.15,1.30,.89,.38,2.1],[.46,1.47,.73,.68,2.25],
    [.84,1.66,.66,.87,2.3],[1.18,1.99,.61,1.04,2.45],[1.57,2.38,.58,1.18,2.6],
    [1.98,2.66,.56,1.30,2.9],[2.32,2.79,.55,1.43,3.3],[2.74,2.80,.54,1.50,3.9],
    [3.45,2.80,.53,1.52,4.7],[4.45,2.81,.52,1.53,4.9],[5.65,2.83,.53,1.53,4.9],
    [6.68,2.81,.55,1.51,4.7],[7.27,2.77,.65,1.44,4.0],[7.85,2.70,.84,1.32,3.4],
    [8.45,2.62,1.09,1.10,2.9],[9.06,2.60,1.34,.88,2.45],[9.75,2.57,1.54,.66,2.2],
    [10.45,2.52,1.64,.53,2.1],[11.65,2.45,1.71,.42,2.05],[12.73,2.41,1.76,.36,2],
    [13.45,2.43,1.78,.33,2],[13.78,2.43,1.88,.25,2],[13.96,2.35,2.05,.08,2],
    [14.03,2.26,2.24,.01,2],
  ];
  const cowl = [
    [1.95,2.69,2.66,.015,2],[2.33,2.88,2.59,.55,2.25],[2.93,3.18,2.56,1.03,2.6],
    [3.64,3.49,2.59,1.17,2.9],[4.31,3.83,2.62,1.26,3.1],[4.78,4.08,2.68,1.23,3.4],
    [5.23,4.07,2.69,1.19,3.15],[5.79,3.95,2.67,1.16,2.8],[6.45,3.72,2.63,1.09,2.55],
    [7.20,3.48,2.60,.91,2.3],[7.91,3.16,2.55,.69,2.15],[8.63,2.85,2.53,.38,2],
    [9.28,2.62,2.57,.025,2]
  ];
  function point(rows,x,a,inset=0) {
    const top=interpolate(rows,x,1), bottom=interpolate(rows,x,2), width=interpolate(rows,x,3);
    const power=2/interpolate(rows,x,4);
    const round=n=>Math.sign(n)*Math.abs(n)**power;
    return [x,(top+bottom)/2+((top-bottom)/2-inset)*round(Math.cos(a)),(width-inset)*round(Math.sin(a))];
  }
  function loft(rows,lengthwise=220,around=128,inset=0) {
    const pos=[], uv=[], indices=[];
    const lo=rows[0][0], hi=rows.at(-1)[0];
    for(let i=0;i<=lengthwise;i++) {
      const x=THREE.MathUtils.lerp(lo,hi,i/lengthwise);
      for(let j=0;j<=around;j++) {
        pos.push(...point(rows,x,2*Math.PI*j/around-Math.PI,inset));
        uv.push(i/lengthwise,j/around);
        if(!i||!j)continue;
        const d=i*(around+1)+j, a=d-around-2;
        indices.push(a,a+1,d,a,d,d-1);
      }
    }
    for(const i of [0,lengthwise]) {
      const a=i*(around+1), center=pos.length/3;
      const x=i?hi:lo;
      pos.push(x,(interpolate(rows,x,1)+interpolate(rows,x,2))/2,0);
      uv.push(i/lengthwise,.5);
      for(let j=0;j<around;j++) {
        indices.push(center,...(i?[a+j,a+j+1]:[a+j+1,a+j]));
      }
    }
    const geo=new THREE.BufferGeometry();
    geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
    geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
    geo.setIndex(indices); geo.computeVertexNormals(); return geo;
  }

  // UV outlines use x stations and angular ordinates, shared by skin openings,
  // recessed glazing and molded frames. Both pilot panes extend to the bridge.
  const panes = [
    {trim:'black', points:[[1.07,.82],[1.23,.045],[2.00,.036],[2.42,.52],[2.50,1.01],[2.28,1.39],[1.53,1.31]]},
    {trim:'red', points:[[2.52,.96],[2.84,.93],[2.90,1.12],[2.83,1.52],[2.69,1.64],[2.44,1.52],[2.46,1.23]]},
    {trim:'black', points:[[2.94,.94],[3.20,.93],[3.26,1.09],[3.26,1.51],[3.05,1.60],[2.90,1.52]]},
    {trim:'black', points:[[1.22,1.87],[1.56,1.79],[2.13,1.69],[2.08,1.91],[1.92,2.13],[1.56,2.23],[1.29,2.13]]},
    {trim:'red', points:[[3.62,.97],[4.27,.97],[4.38,1.08],[4.40,1.55],[4.29,1.65],[3.65,1.65],[3.56,1.53],[3.56,1.10]]},
    {trim:'red', points:[[4.78,.96],[5.72,.97],[5.84,1.08],[5.90,1.53],[5.78,1.63],[4.80,1.64],[4.71,1.53],[4.70,1.11]]},
    {trim:'red', points:[[6.20,.98],[6.72,1.01],[6.83,1.16],[6.79,1.49],[6.67,1.63],[6.26,1.65],[6.14,1.51],[6.13,1.12]]}
  ];
  const doorLines=[
    [[2.48,.91],[3.31,.86],[3.45,1.02],[3.43,2.12],[2.73,2.17],[2.32,1.59],[2.48,.91]],
    [[4.55,.84],[5.94,.84],[6.00,1.99],[5.90,2.14],[4.57,2.14],[4.55,.84]],
    [[7.31,1.03],[8.20,1.13],[8.15,1.66],[7.29,1.72],[7.31,1.03]]
  ];
  const textureWidth=4096, textureHeight=1536, bodyLength=body.at(-1)[0];
  const u=(x)=>textureWidth*x/bodyLength, v=(a)=>textureHeight*(.5-a/(2*Math.PI));
  function texture(draw,srgb=false) {
    const canvas=document.createElement('canvas'); canvas.width=textureWidth; canvas.height=textureHeight;
    draw(canvas.getContext('2d'));
    const tex=new THREE.CanvasTexture(canvas);
    if(srgb)tex.colorSpace=THREE.SRGBColorSpace;
    tex.anisotropy=8;
    return tex;
  }
  function trace(ctx,pts,s,closed=true) {
    const p=pts.map(([x,a])=>[u(x),v(a*s)]);
    ctx.beginPath();
    if(!closed) { p.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));return; }
    const blend=(a,b)=>[a[0]*.84+b[0]*.16,a[1]*.84+b[1]*.16];
    ctx.moveTo(...blend(p[0],p.at(-1)));
    p.forEach(([x,y],i)=>{
      ctx.lineTo(...blend(p[i],p[(i-1+p.length)%p.length]));
      ctx.quadraticCurveTo(x,y,...blend(p[i],p[(i+1)%p.length]));
    });
    ctx.closePath();
  }
  function eachPane(ctx,run) { for(const sign of [-1,1])for(const pane of panes){trace(ctx,pane.points,sign);run(pane,sign);} }
  const hullMaterial=new THREE.MeshPhysicalMaterial({color:0xffffff,...paintFinish});
  hullMaterial.side=THREE.DoubleSide;
  hullMaterial.alphaTest=.5;
  hullMaterial.map=texture(ctx=>{
    ctx.fillStyle='#ecab10';ctx.fillRect(0,0,textureWidth,textureHeight);
    ctx.fillStyle='#a7a6a0'; ctx.fillRect(u(1.9),0,u(5.65),v(2.50)); ctx.fillRect(u(1.9),v(-2.50),u(5.65),textureHeight);
    for(const sign of [-1,1]) {
      ctx.strokeStyle='#795920';ctx.lineWidth=2.2;
      for(const path of doorLines){trace(ctx,path,sign,false);ctx.stroke();}
      for(const [x,a] of [[3.09,1.69],[4.94,1.74],[7.72,1.38]]) {
        ctx.beginPath();ctx.ellipse(u(x),v(a*sign),x>7?8:20,5,0,0,Math.PI*2);ctx.fillStyle='#292c2b';ctx.fill();
      }
      for(let x=2.9;x<9.4;x+=.16) {
        ctx.fillStyle='#886926';ctx.fillRect(u(x),v(.92*sign),2,2);ctx.fillRect(u(x),v(2.20*sign),2,2);
      }
      ctx.strokeStyle='#ab721a';ctx.lineWidth=2;trace(ctx,[[9.37,1.12],[13.61,1.17]],sign,false);ctx.stroke();
    }
    eachPane(ctx,pane=>{ctx.strokeStyle=pane.trim==='red'?'#a82b1b':'#22272a';ctx.lineWidth=pane.trim==='red'?16:12;ctx.stroke();});
  },true);
  hullMaterial.alphaMap=texture(ctx=>{
    ctx.fillStyle='white';ctx.fillRect(0,0,textureWidth,textureHeight);
    ctx.fillStyle='black';eachPane(ctx,()=>ctx.fill());
  });
  windowMaterial.side=THREE.DoubleSide;
  windowMaterial.alphaTest=.47;
  windowMaterial.alphaMap=texture(ctx=>{
    ctx.fillStyle='black';ctx.fillRect(0,0,textureWidth,textureHeight);
    ctx.fillStyle='white';ctx.strokeStyle='white';ctx.lineWidth=5;
    eachPane(ctx,()=>{ctx.fill();ctx.stroke();});
  });
  const shell=group();
  mesh(shell,loft(body),hullMaterial);
  mesh(shell,loft(body,220,128,.022),windowMaterial);
  const seat=new THREE.MeshStandardMaterial({color:0x464b4b,metalness:0,roughness:.9});
  const upholstery=new THREE.MeshStandardMaterial({color:0x343735,metalness:0,roughness:.92});
  box(shell,5.22,.13,2.26,.055,upholstery,[4.15,1.04,0]);
  for(const side of [-1,1]) {
    box(shell,.42,.59,.47,.065,seat,[2.52,1.76,side*.66]);
    box(shell,.47,.17,.47,.048,seat,[2.35,1.39,side*.66]);
    box(shell,.31,.23,.30,.055,upholstery,[2.54,2.12,side*.66]);
    box(shell,.30,.28,.60,.068,dark,[1.75,1.60,side*.52]);
    for(const x of [3.9,5.17,6.45]) {
      box(shell,.31,.66,.44,.062,seat,[x,1.65,side*.93]);
      box(shell,.48,.17,.45,.049,seat,[x-.13,1.32,side*.93]);
      box(shell,.29,.22,.28,.053,upholstery,[x,2.07,side*.93]);
    }
  }
  for(const sign of [-1,1]) {
    const at=(x,a)=>point(body,x,a*sign,-.018);
    pipe(shell,[at(1.36,1.10),at(1.60,1.15),at(1.99,.62)],.018,dark);
    const p=at(.93,1.62);
    pipe(shell,[p,[p[0]-.16,p[1]+.01,p[2]+sign*.12],[p[0]-.37,p[1]+.01,p[2]+sign*.12]],.016,dark);
    const p2=at(2.53,1.8);
    box(shell,.25,.06,.06,.025,dark,p2);
  }
  parent.add(shell);

  const deck=group();
  mesh(deck,loft(cowl,140,96),paint);
  const vent=new THREE.MeshStandardMaterial({color:0x323632,roughness:.82});
  for(const s of [-1,1]) {
    const at=(x,a)=>point(cowl,x,a*s,-.016);
    // Forward intake panel and recessed, rear-facing exhaust.
    const grille=[[3.91,1.15],[4.07,.95],[4.40,.83],[4.58,.88],[4.53,1.13],[4.28,1.28]];
    const grilleGeo=new THREE.BufferGeometry();
    grilleGeo.setAttribute('position',new THREE.Float32BufferAttribute(grille.flatMap(([x,a])=>at(x,a)),3));
    grilleGeo.setIndex([0,1,2,0,2,3,0,3,4,0,4,5]);
    grilleGeo.computeVertexNormals();
    const ventFace=vent.clone();ventFace.side=THREE.DoubleSide;
    mesh(deck,grilleGeo,ventFace);
    pipe(deck,[...grille,grille[0]].map(([x,a])=>at(x,a)),.023,metal);
    for(let j=0;j<7;j++) {
      const x=4.10+j*.057;
      pipe(deck,[at(x,1.12),at(x,.98)],.009,metal);
    }
    const outlet=group(deck,6.16,3.19,s*1.11);outlet.rotation.y=-s*.18;
    mesh(outlet,GEO.lathe([[.01,-.46],[.23,-.40],[.35,-.15],[.33,.21],[.27,.24],[.01,.24]]),paint,[0,0,0],[0,0,-Math.PI/2]);
    mesh(outlet,GEO.tube(.292,.242,.34,48),metal,[.23,0,0],[0,0,-Math.PI/2]);
    disc(outlet,.24,.035,vent,[.235,0,0],'x');
    for(const path of [
      [[3.75,1.30],[4.33,1.41],[4.90,1.44],[5.48,1.48],[5.78,1.44]],
      [[4.76,.37],[4.77,1.07],[4.86,1.43]],
      [[6.82,.58],[6.87,1.17],[6.76,1.58]],
    ])pipe(deck,path.map(([x,a])=>at(x,a)),.009,metal);
    const p=at(4.96,1.42);
    disc(deck,.090,.03,dark,p,'z');
  }
  parent.add(deck);

  function foil(parent,stations,material) {
    const profile=Array.from({length:48},(_,j)=>{
      const a=2*Math.PI*j/48;
      const x=(1-Math.cos(a))/2;
      return [x, Math.sin(a)*(.56-.22*x)];
    });
    const pos=[],indices=[], count=profile.length;
    for(const [x,y,z,chord,thick] of stations) for(const [p,q] of profile)pos.push(x+chord*p,y+thick*q,z);
    for(let i=1;i<stations.length;i++)for(let j=0;j<count;j++){
      const a=(i-1)*count+j,b=(i-1)*count+(j+1)%count,c=a+count,d=b+count;
      indices.push(a,b,c,b,d,c);
    }
    for(const i of [0,stations.length-1]) {
      const [x,y,z,chord]=stations[i], center=pos.length/3;
      pos.push(x+chord*.42,y,z);
      for(let j=0;j<count;j++){
        const a=i*count+j,b=i*count+(j+1)%count;
        indices.push(center,...(i?[a,b]:[b,a]));
      }
    }
    const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(indices);g.computeVertexNormals();
    const m=material; m.side=THREE.DoubleSide;
    return mesh(parent,g,m);
  }
  const tail=group();
  const fin=foil(tail,[[0,0,0,1.66,.35],[.11,0,.27,1.62,.32],[.72,0,1.45,1.19,.20],[.98,0,2.05,.81,.14],[1.12,0,2.15,.56,.06]],paint);
  fin.position.set(12.31,2.14,0);fin.rotation.x=-Math.PI/2;
  for(const s of [-1,1]) {
    foil(tail,[[12.36,2.12,0,1.01,.16],[12.43,2.13,s*.95,.75,.11],[12.52,2.16,s*1.41,.49,.045]],red);
    const winglet=foil(tail,[[0,0,0,.62,.08],[.18,0,.24,.42,.05],[.36,0,.36,.24,.025]],red);
    winglet.position.set(12.49,2.10,s*1.40);winglet.rotation.x=s*Math.PI/2;
  }
  parent.add(tail);

  const frontX=2.38, mainX=frontX+wheelbase;
  const noseGear=group(null,frontX,.265,0);
  const portGear=group(null,mainX,.345,1.13);
  const starboardGear=group(null,mainX,.345,-1.13);
  function wheel(parent,z,r,w) {
    const profile=[[.19,-.5],[.71,-.54],[.94,-.40],[1,-.22],[1,.22],[.94,.40],[.71,.54],[.19,.5],[.19,-.5]];
    mesh(parent,GEO.lathe(profile.map(([rr,h])=>[rr*r,h*w])),tire,[0,0,z],[Math.PI/2,0,0]);
    disc(parent,r*.54,w*.94,metal,[0,0,z],'z');
    for(const side of [-1,1]) {
      disc(parent,r*.36,.024,dark,[0,0,z+side*w*.49],'z');
      disc(parent,r*.19,.040,polished,[0,0,z+side*w*.54],'z');
      for(let i=0;i<8;i++){
        const a=Math.PI*i/4;
        disc(parent,.012,.015,polished,[r*.28*Math.cos(a),r*.28*Math.sin(a),z+side*w*.54],'z');
      }
    }
  }
  wheel(noseGear,-.121,.265,.165);wheel(noseGear,.121,.265,.165);
  pipe(noseGear,[[0,.04,0],[.04,.21,0],[.15,.41,0]],.053,polished);
  pipe(noseGear,[[.15,.40,0],[.21,.75,0]],.088,dark);
  pipe(noseGear,[[-.32,.44,0],[.03,.18,0]],.037,metal);
  parent.add(noseGear);
  for(const [g,s] of [[portGear,1],[starboardGear,-1]]) {
    const fairing=group(shell,5.63,.72,s*1.39);
    const f=GEO.lathe([[.012,-1.07],[.16,-.91],[.24,-.62],[.25,.51],[.19,.82],[.04,1.02],[.012,-1.07]]);
    const fm=mesh(fairing,f,paint,[0,0,0],[0,0,-Math.PI/2]);fm.scale.set(1,1,.82);
    box(fairing,1.27,.18,.12,.06,metal,[.19,-.003,s*.17]);
    for(let x=-.35;x<=.8;x+=.16)disc(fairing,.015,.018,dark,[x,.047,s*.23],'z');
    wheel(g,0,.345,.265);
    pipe(g,[[0,.06,0],[.14,.43,-s*.15]],.070,polished);
    pipe(g,[[.13,.39,-s*.14],[.25,.72,-s*.30]],.096,metal);
    pipe(g,[[.02,.15,-s*.08],[-.39,.40,-s*.14],[-.51,.51,-s*.30]],.042,dark);
    parent.add(g);
  }

  const hub=group(null,mastX,4.36,0);
  pipe(deck,[[mastX,3.74,0],[mastX,4.47,0]],.115,metal);
  disc(deck,.31,.13,dark,[mastX,4.10,0]);
  disc(hub,.31,.14,metal,[0,0,0]);
  disc(hub,.28,.17,dark,[0,.11,0]);
  mesh(hub,GEO.lathe([[.012,-.07],[.46,-.07],[.45,-.015],[.37,.09],[.20,.137],[.012,.145],[.012,-.07]]),paint,[0,.30,0]);
  for(let i=0;i<5;i++){
    const grip=group(hub);grip.rotation.y=i*2*Math.PI/5;
    box(grip,.22,.105,.48,.040,metal,[0,.04,.39]);
    box(grip,.31,.105,.22,.038,dark,[0,.04,.62]);
    pipe(grip,[[.08,-.23,.18],[.14,-.08,.39],[.14,.025,.57]],.025,polished);
    disc(grip,.084,.06,metal,[.008,.116,.61]);
    foil(grip,[[-.105,.058,.56,.21,.078],[-.235,.067,1.07,.48,.066],[-.21,.010,4.90,.46,.043],[-.23,-.064,6.89,.43,.034],[-.19,-.082,7.17,.32,.029]],blade);
    foil(grip,[[-.19,-.082,7.17,.32,.029],[-.14,-.096,mainRadius,.14,.023]],paint);
  }
  parent.add(hub);

  const tailRotor=group(null,tailX,3.97,.28);
  disc(tail,.17,.31,metal,[tailX,3.97,.14],'z');
  disc(tailRotor,.18,.18,dark,[0,0,.12],'z');
  disc(tailRotor,.12,.069,polished,[0,0,.24],'z');
  for(let i=0;i<3;i++){
    const arm=group(tailRotor);arm.rotation.z=i*Math.PI*2/3;
    const m=foil(arm,[[-.10,0,.22,.21,.08],[-.14,0,.47,.30,.065],[-.12,0,1.42,.23,.041]],blade);
    m.rotation.x=-Math.PI/2; m.position.z=.12;
    const tip=foil(arm,[[-.12,0,1.42,.23,.041],[-.075,0,tailRadius,.14,.026]],paint);
    tip.rotation.x=-Math.PI/2;tip.position.z=.12;
    box(arm,.10,.42,.105,.028,metal,[.01,.24,.12]);
  }
  parent.add(tailRotor);
  return {length:18.06, center:[6.55,2.60,0], animate(mainPhase,tailPhase=mainPhase) {
    hub.rotation.y=-mainPhase;
    tailRotor.rotation.z=tailPhase+.28;
  }};
}

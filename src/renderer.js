import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {components} from './components.js';

const TAU=Math.PI*2;
export function createEngineRenderer(host,onSelect){
  const scene=new THREE.Scene();
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setClearColor(0x000000,0);
  renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.55;host.append(renderer.domElement);
  const gl=renderer.getContext(),debug=gl.getExtension('WEBGL_debug_renderer_info');host.dataset.gpu=debug?gl.getParameter(debug.UNMASKED_RENDERER_WEBGL):'WebGL renderer (details unavailable)';
  renderer.domElement.setAttribute('aria-label','Original interactive turboshaft cutaway. Use component buttons and camera controls for keyboard access.');
  const camera=new THREE.OrthographicCamera(-8,8,4,-4,.1,90);
  const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.09;
  controls.minZoom=.65;controls.maxZoom=3;controls.minPolarAngle=.15;controls.maxPolarAngle=Math.PI*.85;controls.enablePan=true;
  const engine=new THREE.Group();scene.add(engine);
  const groups=new Map(),rotors=[],casings=[],labels=[],allMeshes=[];
  const metals={silver:new THREE.MeshStandardMaterial({color:0xa5bac1,metalness:.68,roughness:.36}),
    dark:new THREE.MeshStandardMaterial({color:0x506c77,metalness:.62,roughness:.43}),
    copper:new THREE.MeshStandardMaterial({color:0xc7a575,metalness:.68,roughness:.33}),
    liner:new THREE.MeshStandardMaterial({color:0x927968,metalness:.6,roughness:.45}),
    casing:new THREE.MeshStandardMaterial({color:0x6f8c96,metalness:.62,roughness:.48,side:THREE.DoubleSide}),
    shaft:new THREE.MeshStandardMaterial({color:0x8bb6c6,metalness:.65,roughness:.3}),
    fuel:new THREE.MeshStandardMaterial({color:0xcfa871,metalness:.6,roughness:.4}),
    green:new THREE.MeshStandardMaterial({color:0x6b9a86,metalness:.5,roughness:.45}),
    violet:new THREE.MeshStandardMaterial({color:0x8688b9,metalness:.5,roughness:.4})};
  scene.add(new THREE.HemisphereLight(0xd9f2ff,0x25333a,2.8));
  for(const [color,intensity,pos] of [[0xe2f0ff,4,[0,8,5]],[0xf8d4a4,3,[5,3,-4]],[0x9cd7ee,2,[-6,1,4]]]){
    const l=new THREE.DirectionalLight(color,intensity);l.position.set(...pos);scene.add(l);
  }
  const glow=new THREE.PointLight(0xe59b55,7,6,2);glow.position.set(.7,.6,.3);scene.add(glow);
  const grid=new THREE.GridHelper(30,30,0x6b8d97,0x6b8d97);grid.position.y=-1.65;grid.material.transparent=true;grid.material.opacity=.09;scene.add(grid);
  function group(id,x){const g=new THREE.Group();g.position.x=x;g.userData.id=id;g.userData.baseX=x;engine.add(g);groups.set(id,g);return g;}
  function mesh(g,geometry,mat,pos=[0,0,0]){const m=new THREE.Mesh(geometry,mat.clone());m.position.set(...pos);m.userData.baseColor=m.material.color.clone();g.add(m);allMeshes.push(m);return m;}
  function cyl(g,x,r,len,mat,r2=r){const m=mesh(g,new THREE.CylinderGeometry(r2,r,len,48),mat,[x,0,0]);m.rotation.z=-Math.PI/2;return m;}
  function ring(g,x,r,t,mat){const m=mesh(g,new THREE.TorusGeometry(r,t,8,64),mat,[x,0,0]);m.rotation.y=Math.PI/2;return m;}
  function shell(g,profile,mat,cut=true){
    const points=[],idx=[],steps=64,start=cut?Math.PI*.7:0,len=cut?Math.PI*1.3:TAU;
    for(const [x,r] of profile)for(let j=0;j<=steps;j++){const a=start+len*j/steps;points.push(x,Math.cos(a)*r,Math.sin(a)*r);}
    for(let i=0;i<profile.length-1;i++)for(let j=0;j<steps;j++){const a=i*(steps+1)+j,b=a+steps+1;idx.push(a,b,a+1,b,b+1,a+1);}
    const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(points,3));geo.setIndex(idx);geo.computeVertexNormals();return mesh(g,geo,mat);
  }
  function bladeGeometry(h,w){
    const s=new THREE.Shape();s.moveTo(0,-w*.5);s.bezierCurveTo(h*.3,-w*.5,h*.7,-w*.1,h,w*.2);s.lineTo(h,w*.65);s.bezierCurveTo(h*.65,w*.2,h*.35,w*.1,0,w*.5);s.closePath();
    const geo=new THREE.ExtrudeGeometry(s,{depth:.045,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.018,bevelThickness:.018});
    // Shape x becomes radial y; shape y becomes axial x.
    geo.rotateZ(Math.PI/2);return geo;
  }
  function row(g,x,r,hub,count,mat,rotating,shaft='g'){
    const row=new THREE.Group();row.position.x=x;g.add(row);cyl(row,0,hub,.16,metals.dark);
    const geometry=bladeGeometry(r-hub,.25);const material=mat.clone();
    const blades=new THREE.InstancedMesh(geometry,material,count);blades.userData.baseColor=material.color.clone();row.add(blades);allMeshes.push(blades);
    const dummy=new THREE.Object3D();for(let i=0;i<count;i++){const a=i/count*TAU;dummy.position.set(0,Math.cos(a)*hub,Math.sin(a)*hub);dummy.rotation.set(a,0,0);dummy.updateMatrix();blades.setMatrixAt(i,dummy.matrix);}
    if(rotating)rotors.push({object:row,shaft});return row;
  }
  const inlet=group('inlet',-4.65);shell(inlet,[[-.5,1.12],[-.35,1.04],[.4,.96],[.6,.95]],metals.casing);ring(inlet,-.5,1.11,.035,metals.silver);cyl(inlet,.35,.28,.5,metals.dark,.18);
  const compressor=group('compressor',-2.75);
  for(let i=0;i<5;i++){const x=-1.1+i*.44,r=.96-i*.055;row(compressor,x,r,.3+i*.025,22,metals.silver,true);if(i<4)row(compressor,x+.23,r-.025,.32+i*.025,22,metals.dark,false);}
  cyl(compressor,.1,.19,3.6,metals.shaft);shell(compressor,[[-1.5,1.02],[1.3,.78]],metals.casing);ring(compressor,-1.47,1.03,.045,metals.dark);ring(compressor,1.3,.8,.045,metals.silver);
  const combustor=group('combustor',.1);shell(combustor,[[-1.45,.8],[-1.15,1.12],[.6,1.12],[1.08,.86]],metals.casing);
  shell(combustor,[[-.95,.92],[-.8,.96],[.5,.96],[.77,.78]],metals.liner);shell(combustor,[[-1.1,.42],[.85,.42]],metals.liner,false);
  for(let i=0;i<3;i++)ring(combustor,-.65+i*.47,.965,.028,metals.copper);
  const holeGeo=new THREE.SphereGeometry(.035,5,4),holeMat=new THREE.MeshStandardMaterial({color:0x263944});
  for(let j=0;j<4;j++)for(let i=0;i<22;i++){const a=Math.PI*.7+i/22*Math.PI*1.3;mesh(combustor,holeGeo,holeMat,[-.63+j*.32,Math.cos(a)*.969,Math.sin(a)*.969]);}
  cyl(combustor,-.15,.13,2.9,metals.shaft);ring(combustor,-1.18,.96,.03,metals.fuel);
  const ggt=group('ggt',1.65);row(ggt,-.23,.83,.35,24,metals.dark,false);row(ggt,0,.81,.34,24,metals.silver,true);row(ggt,.24,.79,.32,24,metals.dark,false);cyl(ggt,0,.13,.85,metals.shaft);shell(ggt,[[-.4,.88],[.4,.86]],metals.casing);ring(ggt,.4,.87,.035,metals.dark);
  const pt=group('power',2.85);row(pt,-.22,.85,.32,26,metals.dark,false);row(pt,0,.86,.31,26,metals.copper,true,'p');row(pt,.3,.86,.31,26,metals.copper,true,'p');cyl(pt,.27,.15,1.1,metals.copper);shell(pt,[[-.43,.89],[.5,.94]],metals.casing);ring(pt,-.43,.91,.04,metals.copper);
  const exhaust=group('exhaust',4.0);shell(exhaust,[[-.6,.94],[.7,1.05]],metals.casing);shell(exhaust,[[-.5,.32],[.7,.17]],metals.dark,false);ring(exhaust,.7,1.05,.032,metals.silver);
  const gearbox=group('gearbox',5.3);cyl(gearbox,-.5,.13,1.5,metals.copper);cyl(gearbox,.1,.48,.55,metals.dark);ring(gearbox,-.2,.5,.05,metals.copper);
  const hub=row(gearbox,.43,.35,.26,12,metals.copper,true,'output');cyl(hub,.18,.13,.45,metals.silver);
  const fuel=group('fuel',-.35);const pipePoints=[new THREE.Vector3(-.6,-1.45,.9),new THREE.Vector3(-.7,-1.1,.95),new THREE.Vector3(-.7,.15,1.08),new THREE.Vector3(-.45,.65,.8)];mesh(fuel,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pipePoints),24,.035,6,false),metals.fuel);mesh(fuel,new THREE.BoxGeometry(.55,.34,.38),metals.fuel,[-.6,-1.2,.9]);
  const fadec=group('fadec',1.5);mesh(fadec,new THREE.BoxGeometry(.9,.23,.6),metals.violet,[0,-1.38,.9]);for(let i=0;i<7;i++)mesh(fadec,new THREE.BoxGeometry(.05,.07,.62),metals.dark,[-.35+i*.115,-1.23,.9]);
  const accessory=group('accessory',-2.6);cyl(accessory,0,.17,.6,metals.green);const acc=mesh(accessory,new THREE.BoxGeometry(1,.4,.55),metals.green,[0,-1.13,.75]);
  // Synthetic energy traces: narrow strokes, separate from the solid mechanical shafts.
  const path=new THREE.CatmullRomCurve3([new THREE.Vector3(-5.5,.42,.55),new THREE.Vector3(-3,.5,.55),new THREE.Vector3(-.5,.69,.55),new THREE.Vector3(1,.55,.55),new THREE.Vector3(3,.55,.55),new THREE.Vector3(5,.6,.55)]);
  const particleGeo=new THREE.SphereGeometry(.035,6,4),particleMat=new THREE.MeshBasicMaterial({color:0x93d8e9});
  const particles=new THREE.InstancedMesh(particleGeo,particleMat,55);particles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);engine.add(particles);const particleDummy=new THREE.Object3D();
  for(const [id,profile] of groups){const casingMeshes=profile.children.filter(c=>c.isMesh&&c.geometry.type==='BufferGeometry');for(const m of casingMeshes)if(m.material.side===THREE.DoubleSide)casings.push(m);}
  // Full covers are only visible on request. Cutaway removes the front/top sector.
  const covers=[];
  for(const [id,x,r,len] of [['compressor',-2.7,1.04,2.7],['combustor',-.1,1.15,2.4],['ggt',1.65,.9,.8],['power',2.85,.96,.95]]){
    const g=groups.get(id);const m=shell(g,[[-len/2,r],[len/2,r]],metals.casing,false);m.position.x=x-g.position.x;m.visible=false;covers.push(m);
  }
  const controlLinks=new THREE.Group();fadec.add(controlLinks);controlLinks.visible=false;
  const infoMat=new THREE.LineDashedMaterial({color:0xb2b0ef,dashSize:.09,gapSize:.065,transparent:true,opacity:.8});
  for(const [x,y,z] of [[.15,.96,.35],[1.5,.98,.35],[-2.45,-1.2,.9]]){
    const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(x,y,z),new THREE.Vector3(x,-.75,1.4),new THREE.Vector3(0,-1.35,.9)]);
    const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(35)),infoMat);line.computeLineDistances();controlLinks.add(line);
    mesh(controlLinks,new THREE.SphereGeometry(.07,10,8),metals.violet,[x,y,z]);
  }
  const labelData=[['inlet',-4.8,1.42,0],['compressor',-2.8,1.43,0],['combustor',-.1,1.65,0],['ggt',1.65,1.88,0],['power',3,1.42,0],['gearbox',5.3,-.9,.7]];
  for(const [id,x,y,z] of labelData){const c=components.find(c=>c.id===id);const el=document.createElement('button');el.className='part-label';el.textContent=c.index+' '+(id==='ggt'?'Gas generator':id==='power'?'Free turbine':id==='gearbox'?'Output drive':c.name);el.setAttribute('aria-label','Select '+c.name);el.setAttribute('aria-pressed','false');el.addEventListener('click',()=>onSelect(id));host.append(el);labels.push({id,el,point:new THREE.Vector3(x,y,z),baseX:x});}
  let selected='compressor',isolated=false,exploded=false,view='engine',cutaway=true;
  const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let down;
  renderer.domElement.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY];});
  renderer.domElement.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5)return;const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);raycaster.setFromCamera(pointer,camera);for(const hit of raycaster.intersectObjects([...groups.values()],true)){let o=hit.object;while(o&&!o.userData.id)o=o.parent;if(o&&o.visible&&hit.object.visible){onSelect(o.userData.id);break;}}});
  function resetCamera(){camera.position.set(6,5.3,14);camera.zoom=1;controls.target.set(0,.02,0);camera.lookAt(controls.target);camera.updateProjectionMatrix();controls.update();}
  function resize(){const w=host.clientWidth,h=host.clientHeight;const span=Math.max(6.5,13.8/(w/h));camera.left=-span*w/h/2;camera.right=span*w/h/2;camera.top=span/2;camera.bottom=-span/2;camera.updateProjectionMatrix();renderer.setSize(w,h,false);}
  const observer=new ResizeObserver(resize);observer.observe(host);resize();resetCamera();
  function updateSelection(){for(const [id,g]of groups){g.visible=!isolated||id===selected;g.traverse(o=>{if(o.material?.emissive){o.material.emissive.setHex(id===selected?0x254756:0x000000);o.material.emissiveIntensity=id===selected?.28:0;}});}for(const l of labels){l.el.setAttribute('aria-pressed',String(l.id===selected));l.el.hidden=isolated&&l.id!==selected;}particles.visible=!isolated;}
  const originalPositions=new Map([...groups].map(([id,g])=>[id,g.position.clone()]));
  function updatePositions(){for(const [id,g]of groups){g.position.copy(originalPositions.get(id));if(exploded){const x=g.userData.baseX;g.position.x=x*1.2;}}}
  function render(state,d,reduced){
    for(const r of rotors)r.object.rotation.x=reduced?0:(r.shaft==='g'?state.angleG:state.angleP)/250/(r.shaft==='output'?10:1);
    for(let i=0;i<55;i++){const f=((i/55+(reduced?0:state.flowPhase))%1);const v=path.getPoint(f);const lane=i%3;v.y+=(lane-1)*.12;v.z+=(lane-1)*.1;particleDummy.position.copy(v);particleDummy.updateMatrix();particles.setMatrixAt(i,particleDummy.matrix);particles.setColorAt(i,new THREE.Color(f<.42?0x70c8df:f<.7?0xf4b574:0xb4c8d0));}particles.instanceMatrix.needsUpdate=true;if(particles.instanceColor)particles.instanceColor.needsUpdate=true;
    controls.update();scene.updateMatrixWorld();camera.updateMatrixWorld();
    const w=host.clientWidth,h=host.clientHeight;
    for(const l of labels){l.el.hidden=(isolated&&l.id!==selected)||(w<550&&l.id!==selected);const p=l.point.clone();if(exploded)p.x=l.baseX*1.2;p.project(camera);l.el.style.left=`${(p.x*.5+.5)*w}px`;l.el.style.top=`${(-p.y*.5+.5)*h}px`;l.el.style.visibility=(p.z>1||p.x<-.94||p.x>.94)?'hidden':'visible';}
    renderer.render(scene,camera);
    host.dataset.camera=JSON.stringify({position:camera.position.toArray().map(v=>+v.toFixed(5)),target:controls.target.toArray().map(v=>+v.toFixed(5)),zoom:+camera.zoom.toFixed(5)});
  }
  updateSelection();
  return {render,
    select(id){selected=id;updateSelection();},
    setIsolated(value){isolated=value;updateSelection();},setExploded(value){exploded=value;updatePositions();},
    setCutaway(value){cutaway=value;for(const m of covers)m.visible=!value;},
    setView(value){view=value;controlLinks.visible=value!=='engine';},resetCamera,
    orbit(amount){const p=camera.position.clone().sub(controls.target);p.applyAxisAngle(new THREE.Vector3(0,1,0),amount);camera.position.copy(controls.target).add(p);camera.lookAt(controls.target);controls.update();},
    zoom(factor){camera.zoom=THREE.MathUtils.clamp(camera.zoom*factor,.65,3);camera.updateProjectionMatrix();},
    dispose(){observer.disconnect();controls.dispose();renderer.dispose();host.replaceChildren();}
  };
}

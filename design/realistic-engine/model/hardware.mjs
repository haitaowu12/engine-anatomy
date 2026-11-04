import {THREE, GEO, MAT, smoothstep} from 'machine-kit';

export const metals = {
  aluminium: MAT.aluminium({color:[.51,.49,.46],roughness:.37}),
  casing: MAT.stainless({color:[.43,.45,.46],roughness:.5}),
  polished: MAT.stainless({roughness:.26}),
  hot: MAT.inconel({color:[.42,.35,.30],roughness:.57}),
  dark: MAT.steelDark(),
  grey: MAT.paint({color:[.30,.34,.35],roughness:.51}),
  airframe: MAT.paint({color:[.68,.72,.73],roughness:.41})
};

export function mesh(parent, geometry, material, position = [0,0,0], rotation = [0,0,0]) {
  const object = new THREE.Mesh(geometry, material);
  object.position.set(...position);
  object.rotation.set(...rotation);
  parent.add(object);
  return object;
}

export function group(parent, x = 0, y = 0, z = 0) {
  const object = new THREE.Group();
  object.position.set(x,y,z);
  parent.add(object);
  return object;
}

const alongX = [0,0,-Math.PI/2];

export function revolved(parent, profile, material, y = 0, z = 0) {
  return mesh(parent, GEO.lathe(profile), material, [0,y,z], alongX);
}

export function shell(parent, profile, thickness, material, y = 0, z = 0) {
  return mesh(parent, GEO.shell(profile, thickness), material, [0,y,z], alongX);
}

export function shaft(parent, x0, x1, radius, bore = 0, material = metals.polished) {
  return mesh(parent, GEO.tube(radius,bore,x1-x0,48), material, [(x0+x1)/2,0,0], alongX);
}

export function flange(parent, x, radius, bore, depth, boltCount = 32) {
  const ring = group(parent, x);
  ring.rotation.z = -Math.PI/2;
  mesh(ring, GEO.disc(radius,depth,depth*.13,96,bore), metals.aluminium);
  mesh(ring, GEO.bolts(boltCount,radius-depth*.4,depth*.12,depth*.26), metals.polished, [0,depth/2,0]);
  return ring;
}

export function stage(parent, x, root, tip, count, chord, material, {
  bore = 0, pitch = .52, twist = .35, sweep = 0, stator = false
} = {}) {
  const wheel = group(parent,x);
  const rootChord = Array.isArray(chord) ? chord[0] : chord;
  if (!stator) mesh(wheel, GEO.disc(root,rootChord*.5,rootChord*.06,56,bore), material, [0,0,0], alongX);
  mesh(wheel, GEO.rotor({
    axis:'x', r0:stator ? root : root*.97, r1:tip, count, chord,
    thick:[.14,.075], camber:.055, pitch, twist, sweep, nS:7, nC:9
  }), material);
  return wheel;
}

export function pipe(parent, points, radius, material = metals.polished) {
  return mesh(parent, GEO.pipe(points,radius,10), material);
}

export function modulePart(lab, name, y, displacement, schedule = [0,1]) {
  const object = new THREE.Group();
  object.position.y = y;
  lab.add(object,{name});
  return {
    object,
    pose(amount) {
      const t = smoothstep(...schedule,amount);
      lab.place(object,displacement[0]*t,y+displacement[1]*t,displacement[2]*t);
    }
  };
}

export function ghostShell(lab, object, name, profile, thickness, material) {
  const casing = shell(object,profile,thickness,material);
  lab.add(casing,{parent:object,name,xray:'shell'});
  return casing;
}

// Side-view airfoil extruded along the span, with a rounded leading edge and
// taper at the trailing edge. The local bay omits remote aircraft structure.
export function wingSection(parent, {x,y,z,chord,span,thickness}) {
  const foil = new THREE.Shape();
  foil.moveTo(0,0);
  foil.bezierCurveTo(.02*chord,thickness,.38*chord,thickness,chord,0);
  foil.bezierCurveTo(.58*chord,-thickness*.53,.03*chord,-thickness*.58,0,0);
  return mesh(parent,new THREE.ExtrudeGeometry(foil,{depth:span,steps:1,bevelEnabled:false}),metals.airframe,[x,y,z]);
}

export function installationControl(lab, context, {view, returnView} = {}) {
  const controls = lab.ui.querySelector('.lab-ctls');
  const container = document.createElement('div');
  container.className = 'machine-subsystems on';
  const button = document.createElement('button');
  button.textContent = 'Installed context';
  container.appendChild(button);
  controls.appendChild(container);
  let shown = false;
  button.setAttribute('aria-pressed',String(shown));
  context.visible = shown;
  button.addEventListener('click',() => {
    shown = !shown;
    if (shown) {
      lab._selection = null;
      lab.ui.querySelector('[data-module-inspector]').value='';
      lab.toggle('explode',false);
    }
    if (shown && view) lab.setView(view);
    if (!shown && returnView) lab.setView(returnView);
    button.setAttribute('aria-pressed',String(shown));
  });
  lab.onTick(() => {
    if (shown && (lab.target.explode > 0 || lab._selection)) {
      shown = false;
      if (returnView) lab.setView(returnView);
      button.setAttribute('aria-pressed','false');
    }
    context.visible = shown && lab.state.explode < .002;
  });
}

// The solid disk carries swept vanes that turn incoming axial flow radially.
export function impeller(parent, x, radius, bore, direction) {
  const rotor = group(parent,x);
  if (direction < 0) rotor.rotation.z = Math.PI;
  shaft(rotor,-.012,.012,radius,bore,metals.aluminium);
  const vertices = [];
  const indices = [];
  const segments = 12;
  const count = 18;
  for (let blade = 0; blade < count; blade++) {
    const base = vertices.length/3;
    for (let j = 0; j <= segments; j++) {
      const u = j/segments;
      const r = radius*(.32+.67*u);
      const theta = 2*Math.PI*blade/count+.73*u;
      const a = radius*(-.33+.24*u);
      const w = .0018/r;
      for (const [ax,az] of [[a,theta-w],[a,theta+w],[.001,theta-w],[.001,theta+w]]) {
        vertices.push(ax,r*Math.cos(az),r*Math.sin(az));
      }
    }
    for (let j = 0; j < segments; j++) {
      const a = base+4*j;
      const b = a+4;
      for (const [i,k] of [[0,1],[1,3],[3,2],[2,0]]) {
        indices.push(a+i,b+k,a+k,a+i,b+i,b+k);
      }
    }
    const end = base+segments*4;
    indices.push(base,base+3,base+2,base,base+1,base+3,end,end+3,end+1,end,end+2,end+3);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return mesh(rotor,geometry,metals.aluminium);
}

// Annular casing with two lateral ports. Generate both skins and close the
// wall at the ends and at each opening so the cutaway still has solid edges.
export function portedCollector(parent, profile, thickness, material) {
  const count=64, rowCount=profile.length-1, vertices=[], indices=[];
  for (const [r,x] of profile) {
    for (let i=0;i<count;i++) {
      const angle=2*Math.PI*i/count;
      for (const radius of [r,r-thickness]) vertices.push(x,radius*Math.sin(angle),radius*Math.cos(angle));
    }
  }
  const hasWall = (row,i) => row>=0 && row<rowCount &&
    !(row>=1 && row<4 && (i<4 || i>=60 || (i>=28 && i<36)));
  const vertex=(row,i)=>2*(row*count+(i+count)%count);
  const quad=(a,b,c,d)=>indices.push(a,c,b,a,d,c);
  for (let row=0;row<rowCount;row++) {
    for (let i=0;i<count;i++) {
      if (!hasWall(row,i)) continue;
      const a=vertex(row,i), b=vertex(row,i+1), c=vertex(row+1,i+1), d=vertex(row+1,i);
      quad(a,b,c,d);
      quad(d+1,c+1,b+1,a+1);
      if (!hasWall(row-1,i)) quad(b,a,a+1,b+1);
      if (!hasWall(row+1,i)) quad(d,c,c+1,d+1);
      if (!hasWall(row,(i+count-1)%count)) quad(a,d,d+1,a+1);
      if (!hasWall(row,(i+1)%count)) quad(c,b,b+1,c+1);
    }
  }
  const geometry=new THREE.BufferGeometry();
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return mesh(parent,geometry,material);
}

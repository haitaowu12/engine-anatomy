import {orderFaces} from './face-order.js';
import * as T from 'three';
import {matOf,step3,sp,fill,ink,hull} from './colorfigures-core.js';

// The atlas retains its semantic geometry, transforms, camera and picking.
// This adapter replaces the GPU/Three SVG draw with Colorfigures' three-tone
// faces and ink. Coplanar regions keep real openings and avoid triangle wireframes.
const NS='http://www.w3.org/2000/svg';
const EDGE_COS=Math.cos(28*Math.PI/180);
const edgeKey=(a,b)=>a<b?a+':'+b:b+':'+a;
export function prepareColorfiguresGeometry(geometry){
  const attribute=geometry.getAttribute('position'),index=geometry.index;
  if(!attribute)return {vertices:[],faces:[]};
  const vertices=[],canonical=[],keys=new Map();
  for(let i=0;i<attribute.count;i++){
    const p=[attribute.getX(i),attribute.getY(i),attribute.getZ(i)],key=p.map(v=>Math.round(v*1e6)).join(',');
    let id=keys.get(key);if(id===undefined){id=vertices.length;keys.set(key,id);vertices.push(p);}canonical.push(id);
  }
  const triangles=[],edges=new Map(),v1=new T.Vector3(),v2=new T.Vector3();
  const count=index?index.count:attribute.count,start=geometry.drawRange.start||0,end=Math.min(count,start+geometry.drawRange.count);
  for(let i=start;i+2<end;i+=3){
    const ids=[0,1,2].map(k=>canonical[index?index.getX(i+k):i+k]);
    if(new Set(ids).size<3)continue;
    const [a,b,c]=ids.map(id=>vertices[id]);
    v1.set(b[0]-a[0],b[1]-a[1],b[2]-a[2]);v2.set(c[0]-a[0],c[1]-a[1],c[2]-a[2]);v1.cross(v2);
    if(v1.lengthSq()<1e-20)continue;v1.normalize();
    const group=geometry.groups.find(g=>i>=g.start&&i<g.start+g.count);
    const t={ids,normal:v1.clone(),material:group?.materialIndex||0};triangles.push(t);
    for(let k=0;k<3;k++){const key=edgeKey(ids[k],ids[(k+1)%3]);if(!edges.has(key))edges.set(key,[]);edges.get(key).push(triangles.length-1);}
  }
  const parent=triangles.map((_,i)=>i),find=i=>{while(parent[i]!==i){parent[i]=parent[parent[i]];i=parent[i];}return i;};
  for(const adjacent of edges.values())if(adjacent.length===2){const [a,b]=adjacent;
    if(triangles[a].material===triangles[b].material&&triangles[a].normal.dot(triangles[b].normal)>.999999)parent[find(b)]=find(a);
  }
  const regions=new Map();
  triangles.forEach((t,i)=>{const root=find(i);if(!regions.has(root))regions.set(root,{normal:t.normal,material:t.material,boundary:[]});
    for(let k=0;k<3;k++){const a=t.ids[k],b=t.ids[(k+1)%3],adjacent=edges.get(edgeKey(a,b));
      if(!adjacent.some(j=>j!==i&&find(j)===root))regions.get(root).boundary.push([a,b]);
    }
  });
  const faces=[...regions.values()],owners=new Map();
  faces.forEach((face,i)=>{for(const [a,b]of face.boundary){const key=edgeKey(a,b);if(!owners.has(key))owners.set(key,[]);owners.get(key).push(i);}});
  for(const face of faces){
    const next=new Map();for(const e of face.boundary){if(!next.has(e[0]))next.set(e[0],[]);next.get(e[0]).push(e);}
    const unused=new Set(face.boundary),loops=[];
    while(unused.size){let edge=unused.values().next().value;const first=edge[0],loop=[first];
      while(edge&&unused.has(edge)){unused.delete(edge);loop.push(edge[1]);if(edge[1]===first)break;edge=next.get(edge[1])?.find(e=>unused.has(e));}
      if(loop.at(-1)===first)loop.pop();if(loop.length>=3)loops.push(loop);
    }
    face.loops=loops;face.vertices=[...new Set(face.boundary.flat())];
    face.edges=face.boundary.map(([a,b])=>({a,b,neighbors:owners.get(edgeKey(a,b))}));
  }
  return {vertices,faces};
}

export class ColorfiguresRenderer {
  constructor({raster=true}={}){
    this.isColorfiguresRenderer=true;this.isSVGRenderer=true;this.isWebGLRenderer=false;
    this.raster=raster;this.domElement=raster?document.createElement('canvas'):document.createElementNS(NS,'svg');this.domElement.dataset.renderer='colorfigures';
    this.context=raster?this.domElement.getContext('2d'):null;this.pixelRatio=1;this.disposed=false;
    this.domElement.style.cssText='display:block;width:100%;height:100%;background:#f4f1e8';
    this.domElement.setAttribute('role','img');this.domElement.setAttribute('xmlns',NS);
    this.shadowMap={enabled:false};this.info={render:{calls:0,faces:0,triangles:0},memory:{geometries:0}};
    this.width=800;this.height=600;this.cache=new WeakMap();this.drawCache=new WeakMap();this.palettes=new Map();
    this.orderCache=null;this.background='#f4f1e8';this.quality='auto';
  }
  setSize(width,height){this.width=Math.max(1,width);this.height=Math.max(1,height);if(this.raster){const w=Math.round(this.width*this.pixelRatio),h=Math.round(this.height*this.pixelRatio);if(this.domElement.width!==w)this.domElement.width=w;if(this.domElement.height!==h)this.domElement.height=h;}else this.domElement.setAttribute('viewBox',`0 0 ${this.width} ${this.height}`);}
  setPixelRatio(value){this.pixelRatio=Math.min(2,value||1);this.setSize(this.width,this.height);}
  setClearColor(){}
  setQuality(value){this.quality=value;}
  getContext(){return {getExtension:()=>null};}
  dispose(){this.disposed=true;this.orderCache=null;this.cache=new WeakMap();this.drawCache=new WeakMap();this.domElement.replaceChildren();}
  render(scene,camera){
    if(this.disposed)return;
    const started=performance.now(),materials=new Map(),matrix=new T.Matrix4(),view=new T.Matrix4(),project=new T.Matrix4(),normalMatrix=new T.Matrix3();
    let parts=[];
    const instance=new T.Matrix4(),n=new T.Vector3(),color=new T.Color();let faceCount=0,meshCount=0;
    scene.updateMatrixWorld();camera.updateMatrixWorld();
    const projectVertices=(vertices,mvp,mv,world)=>vertices.map(p=>{
      const [x,y,z]=p,e=mvp.elements,v=mv.elements,g=world.elements,w=e[3]*x+e[7]*y+e[11]*z+e[15];
      return [(e[0]*x+e[4]*y+e[8]*z+e[12])/w*this.width/2+this.width/2,
        -(e[1]*x+e[5]*y+e[9]*z+e[13])/w*this.height/2+this.height/2,
        v[2]*x+v[6]*y+v[10]*z+v[14],w,(e[2]*x+e[6]*y+e[10]*z+e[14])/w,
        g[0]*x+g[4]*y+g[8]*z+g[12],g[1]*x+g[5]*y+g[9]*z+g[13],g[2]*x+g[6]*y+g[10]*z+g[14]];
    });
    // Clip in view space before projection. Dropping a whole face when one
    // corner crosses the near plane makes floors and casings disappear on zoom.
    const nearPoint=(a,b)=>{
      const t=(-camera.near-a[2])/(b[2]-a[2]),p=a.map((v,i)=>v+(b[i]-v)*t);
      n.set(p[5],p[6],p[7]).project(camera);
      p[0]=(n.x+1)*this.width/2;p[1]=(1-n.y)*this.height/2;p[4]=n.z;return p;
    };
    const clipNear=loop=>{
      const result=[];
      for(let i=0,j=loop.length-1;i<loop.length;j=i++){
        const a=loop[j],b=loop[i],ain=a[2]<=-camera.near,bin=b[2]<=-camera.near;
        if(ain!==bin)result.push(nearPoint(a,b));
        if(bin)result.push(b);
      }
      return result;
    };
    const boundsOf=points=>{
      const rect=[Infinity,Infinity,-Infinity,-Infinity];
      for(const p of points){rect[0]=Math.min(rect[0],p[0]);rect[1]=Math.min(rect[1],p[1]);rect[2]=Math.max(rect[2],p[0]);rect[3]=Math.max(rect[3],p[1]);}
      return rect;
    };
    const materialColor=material=>{
      if(materials.has(material))return materials.get(material);
      color.copy(material.color||new T.Color(0xb5c4c6));
      if(material.emissive&&material.emissiveIntensity)color.add(material.emissive.clone().multiplyScalar(material.emissiveIntensity));
      const key=color.getHexString(T.SRGBColorSpace);
      if(!this.palettes.has(key))this.palettes.set(key,matOf('#'+key));const palette=this.palettes.get(key);materials.set(material,palette);return palette;
    };
    const drawObject=(object,world)=>{
      if(object.material?.visible===false||object.material?.opacity<.015)return;
      view.multiplyMatrices(camera.matrixWorldInverse,world);project.multiplyMatrices(camera.projectionMatrix,view);
      if(object.isLine){
        const attr=object.geometry.getAttribute('position');if(!attr?.count)return;
        const verts=Array.from({length:attr.count},(_,i)=>[attr.getX(i),attr.getY(i),attr.getZ(i)]),points=projectVertices(verts,project,view,world),mat=object.material;
        const pieces=[];for(let i=0;i+1<points.length;i+=object.isLineSegments?2:1){const a=points[i],b=points[i+1];if(a[3]<=0||b[3]<=0||a[4]<-1||b[4]<-1)continue;pieces.push(`M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`);}
        if(pieces.length)parts.push({depth:mat.depthTest===false?Infinity:points.reduce((sum,p)=>sum+p[2],0)/points.length,order:object.renderOrder,
          points,loops:[],bounds:boundsOf(points),path:pieces.join(''),line:true,stroke:'#'+mat.color.getHexString(T.SRGBColorSpace),width:mat.linewidth||1,opacity:mat.opacity??1,dash:mat.isLineDashedMaterial});return;
      }
      if(!object.isMesh)return;
      let cached=this.cache.get(object.geometry);const attribute=object.geometry.getAttribute('position');if(!attribute)return;
      if(!cached||cached.version!==attribute.version||cached.indexVersion!==object.geometry.index?.version){cached={...prepareColorfiguresGeometry(object.geometry),version:attribute.version,indexVersion:object.geometry.index?.version};this.cache.set(object.geometry,cached);}
      meshCount++;const pts=projectVertices(cached.vertices,project,view,world);normalMatrix.getNormalMatrix(view);
      if(!pts.some(p=>p[3]>0&&p[4]>=-1&&p[4]<=1))return;
      const minX=Math.min(...pts.map(p=>p[0])),maxX=Math.max(...pts.map(p=>p[0])),minY=Math.min(...pts.map(p=>p[1])),maxY=Math.max(...pts.map(p=>p[1]));
      if(maxX<0||minX>this.width||maxY<0||minY>this.height)return;
      const smallLimit=this.quality==='detail'?0:this.quality==='economy'?65:32;
      if(Math.max(maxX-minX,maxY-minY)<smallLimit&&!Array.isArray(object.material)){
        const mat=object.material,outline=hull(pts.map(p=>[p[0],p[1]])),path=sp(outline),opacity=mat.opacity??1;
        parts.push({depth:pts.reduce((sum,p)=>sum+p[2],0)/pts.length,order:object.renderOrder,
          points:pts,loops:[outline],bounds:boundsOf(pts),path,shade:materialColor(mat).m,opacity,edges:path,width:.55});faceCount++;return;
      }
      const normals=cached.faces.map(face=>face.normal.clone().applyMatrix3(normalMatrix).normalize());
      const facing=cached.faces.map((face,i)=>{
        if(!camera.isPerspectiveCamera)return normals[i].z>0;
        const p=cached.vertices[face.vertices[0]];n.fromArray(p).applyMatrix4(view);return normals[i].dot(n)<0;
      });
      for(let i=0;i<cached.faces.length;i++){
        const face=cached.faces[i],mat=Array.isArray(object.material)?object.material[face.material]:object.material;
        if(!mat||mat.visible===false||mat.opacity<.015||mat.side===T.FrontSide&&!facing[i]||mat.side===T.BackSide&&facing[i])continue;
        const loops=face.loops.map(loop=>clipNear(loop.map(id=>pts[id]))).filter(loop=>loop.length>=3);if(!loops.length)continue;
        const depth=face.vertices.reduce((sum,id)=>sum+pts[id][2],0)/face.vertices.length;
        const norm=normals[i],sign=facing[i]?1:-1,light=sign*(-.35*norm.x+.55*norm.y+.76*norm.z);
        const shade=step3(light>.58?1:light>.04?.3:-1,.62,.12,materialColor(mat)),path=loops.map(loop=>sp(loop)).join('');
        let edges='';
        for(const edge of face.edges){const others=edge.neighbors.filter(j=>j!==i);
          if(!others.length||others.some(j=>facing[i]!==facing[j]||norm.dot(normals[j])<EDGE_COS)){
            let a=pts[edge.a],b=pts[edge.b];
            if(a[2]>-camera.near&&b[2]>-camera.near)continue;
            if(a[2]>-camera.near)a=nearPoint(a,b);else if(b[2]>-camera.near)b=nearPoint(a,b);
            if(Math.hypot(a[0]-b[0],a[1]-b[1])>.6)edges+=`M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
          }
        }
        const opacity=mat.opacity??1,points=loops.flat();
        const q=norm.clone().transformDirection(camera.matrixWorld),p=points[0];
        const plane=[q.x,q.y,q.z,-q.x*p[5]-q.y*p[6]-q.z*p[7]];
        parts.push({depth:mat.depthTest===false?Infinity:depth,order:object.renderOrder,
          points,loops,plane,bounds:boundsOf(points),path,shade,opacity,edges,width:.65});faceCount++;
      }
    };
    // Retain projected paths while the camera, material and geometry are
    // unchanged. A running shaft must not rebuild every stationary cabinet,
    // casing, window and fastener on each animation frame.
    const cameraKey=[this.width,this.height,this.quality,...camera.matrixWorldInverse.elements.map(v=>+v.toFixed(9)),...camera.projectionMatrix.elements.map(v=>+v.toFixed(9))].join(':');
    let reused=0;
    const submit=(object,world,instanceId=0)=>{
      const geometry=object.geometry,attribute=geometry?.getAttribute('position');
      const materials=Array.isArray(object.material)?object.material:[object.material];
      const materialKey=materials.map(m=>m?[m.visible,m.opacity,m.side,m.depthTest,m.color?.getHex(),m.emissive?.getHex(),m.emissiveIntensity,m.linewidth,m.isLineDashedMaterial].join(':'):'').join('/');
      let entries=this.drawCache.get(object);if(!entries){entries=new Map();this.drawCache.set(object,entries);}
      const old=entries.get(instanceId),version=attribute?.version,indexVersion=geometry?.index?.version;
      if(old&&old.geometry===geometry&&old.attribute===attribute&&old.version===version&&old.indexVersion===indexVersion&&old.cameraKey===cameraKey&&old.materialKey===materialKey&&old.order===object.renderOrder&&old.matrix.every((v,i)=>Math.abs(v-world.elements[i])<1e-9)){
        parts.push(...old.parts);faceCount+=old.faces;meshCount+=old.meshes;reused++;return;
      }
      const first=parts.length,faces=faceCount,meshes=meshCount;drawObject(object,world);
      entries.set(instanceId,{geometry,attribute,version,indexVersion,cameraKey,materialKey,order:object.renderOrder,matrix:[...world.elements],parts:parts.slice(first),faces:faceCount-faces,meshes:meshCount-meshes});
    };
    scene.traverseVisible(object=>{
      if(object.isInstancedMesh){for(let i=0;i<object.count;i++){object.getMatrixAt(i,instance);matrix.multiplyMatrices(object.matrixWorld,instance);submit(object,matrix,i);}}
      else if(object.isMesh||object.isLine)submit(object,object.matrixWorld);
    });
    // Reuse the proved drawing order when all submitted paths are unchanged.
    const previous=this.orderCache;
    if(previous&&previous.submitted.length===parts.length&&parts.every((p,i)=>p===previous.submitted[i]))parts=previous.ordered;
    else{
      const submitted=parts.slice();orderFaces(parts,camera,this.width,this.height);
      this.orderCache={submitted,ordered:parts};
    }
    if(this.raster){
      // Colorfigures path data is painted directly to a 2D surface. A dense
      // engine has tens of thousands of facets; a live SVG DOM or SVG-image
      // decode per frame would prevent its existing controls from responding.
      const ctx=this.context;ctx.setTransform(this.pixelRatio,0,0,this.pixelRatio,0,0);ctx.globalAlpha=1;ctx.fillStyle=this.background;ctx.fillRect(0,0,this.width,this.height);ctx.lineJoin='round';ctx.lineCap='round';
      for(const part of parts){
        ctx.globalAlpha=part.opacity??1;
        if(part.line){ctx.strokeStyle=part.stroke;ctx.lineWidth=part.width;ctx.setLineDash(part.dash?[5,4]:[]);ctx.stroke((part.paintPath??=new Path2D(part.path)));ctx.setLineDash([]);continue;}
        const path=(part.paintPath??=new Path2D(part.path));ctx.fillStyle=part.shade;ctx.fill(path,'evenodd');ctx.strokeStyle=part.shade;ctx.lineWidth=.35;ctx.stroke(path);
        if(part.edges){ctx.strokeStyle='#231e16';ctx.lineWidth=part.width;ctx.stroke((part.inkPath??=new Path2D(part.edges)));}
      }
      ctx.globalAlpha=1;
    }else{
      this.domElement.innerHTML=parts.map(part=>part.line?`<path d="${part.path}" fill="none" stroke="${part.stroke}" stroke-width="${part.width}" opacity="${part.opacity}" ${part.dash?'stroke-dasharray="5 4"':''}/>`:`<g opacity="${part.opacity}">${fill(part.path,part.shade,'fill-rule="evenodd"')}${part.edges?ink(part.edges,part.width):''}</g>`).join('');
    }
    this.info.render={calls:parts.length,faces:faceCount,triangles:faceCount};this.info.memory.geometries=meshCount;
    this.domElement.dataset.renderStats=JSON.stringify({faces:faceCount,parts:meshCount,reused,ms:Math.round((performance.now()-started)*10)/10});
  }
}

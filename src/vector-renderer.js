import * as T from 'three';
import {SVGRenderer} from 'three/addons/renderers/SVGRenderer.js';
// Pinned Three's vector backend projects the SAME semantic scene. It has no
// environment reflections or soft shadows. Temporary expansion is required
// because Projector does not natively process InstancedMesh instance matrices.
export function createVectorDisplay(){
 const svg=new SVGRenderer(),cache=new WeakMap();svg.setPrecision(1);svg.setQuality('low');svg.overdraw=.2;
 const render=svg.render.bind(svg),clearColor=svg.setClearColor.bind(svg);svg.setClearColor=()=>clearColor(0x28292f);svg.setClearColor();svg.isSVGRenderer=true;svg.setPixelRatio=()=>{};svg.getContext=()=>({getExtension:()=>null});svg.dispose=()=>{};
 svg.render=(scene,camera)=>{
  const swaps=[];scene.traverseVisible(o=>{if(!o.isInstancedMesh)return;let copy=cache.get(o);if(!copy){copy=new T.Group();copy.matrixAutoUpdate=false;for(let i=0;i<o.count;i++){const mesh=new T.Mesh(o.geometry,o.material);mesh.matrixAutoUpdate=false;mesh.userData=o.userData;copy.add(mesh);}cache.set(o,copy);}copy.matrix.copy(o.matrix);for(let i=0;i<o.count;i++){o.getMatrixAt(i,copy.children[i].matrix);copy.children[i].material=o.material;}swaps.push([o,copy,o.parent]);});
  for(const [o,copy,parent]of swaps){o.visible=false;parent.add(copy);}try{render(scene,camera);}finally{for(const [o,copy,parent]of swaps){parent.remove(copy);o.visible=true;}}
 };
 return svg;
}

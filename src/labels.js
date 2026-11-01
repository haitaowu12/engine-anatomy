// Deterministic screen-space label placement, also exercised without WebGL.
export function placeLabels(items,width,height,{top=88,bottom=104,gap=10}={}){
 const result=[];
 for(const item of [...items].sort((a,b)=>(b.priority||0)-(a.priority||0))){
  const w=Math.min(item.width||220,Math.max(80,width-20)),h=item.height||32;
  const minX=10+w/2,maxX=Math.max(minX,width-10-w/2),minY=Math.min(top+h/2,height/2),maxY=Math.max(minY,height-bottom-h/2);
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));let x=clamp(item.x,minX,maxX),y=clamp(item.y-30,minY,maxY);
  const overlap=(px,py)=>result.some(r=>Math.abs(px-r.x)<(w+r.width)/2+gap&&Math.abs(py-r.y)<(h+r.height)/2+gap);
  if(overlap(x,y)){const candidates=[];for(let step=1;step<10;step++)for(const sign of [1,-1])candidates.push([x,clamp(y+sign*step*(h+gap),minY,maxY)]);for(const sign of [-1,1])candidates.push([clamp(x+sign*(w+gap),minX,maxX),y]);const found=candidates.find(([px,py])=>!overlap(px,py));if(found)[x,y]=found;else continue;}
  result.push({...item,x,y,width:w,height:h,offscreen:item.x<0||item.y<0||item.x>width||item.y>height});
 }
 return result;
}

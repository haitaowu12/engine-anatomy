// Large coplanar faces cannot be sorted by their centre depth: a floor's
// centre can be nearer than equipment standing on its far end. Use actual
// plane separation where it proves an order, retaining depth order otherwise.
function area(loops){
  let sum=0;
  for(const loop of loops){
    let a=0;
    for(let i=0,j=loop.length-1;i<loop.length;j=i++)a+=loop[j][0]*loop[i][1]-loop[i][0]*loop[j][1];
    sum+=Math.abs(a)/2;
  }
  return sum;
}
function inside(loops,x,y){
  let hit=false;
  for(const loop of loops)for(let i=0,j=loop.length-1;i<loop.length;j=i++){
    const a=loop[i],b=loop[j];
    if((a[1]>y)!==(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])hit=!hit;
  }
  return hit;
}
const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
function overlaps(a,b){
  const A=a.bounds,B=b.bounds;
  if(A[2]<=B[0]||B[2]<=A[0]||A[3]<=B[1]||B[3]<=A[1])return false;
  for(const loop of b.loops)if(inside(a.loops,...loop[0]))return true;
  for(const loop of a.loops)if(inside(b.loops,...loop[0]))return true;
  for(const la of a.loops)for(let i=0,j=la.length-1;i<la.length;j=i++){
    for(const lb of b.loops)for(let u=0,v=lb.length-1;u<lb.length;v=u++){
      if(cross(la[j],la[i],lb[v])*cross(la[j],la[i],lb[u])<-1e-8&&
         cross(lb[v],lb[u],la[j])*cross(lb[v],lb[u],la[i])<-1e-8)return true;
    }
  }
  return false;
}
function separation(a,b,eye,toward,orthographic){
  const n=a.plane;
  if(!n)return 0;
  const side=orthographic?n[0]*toward[0]+n[1]*toward[1]+n[2]*toward[2]:n[0]*eye[0]+n[1]*eye[1]+n[2]*eye[2]+n[3];
  if(Math.abs(side)<1e-8)return 0;
  let lo=Infinity,hi=-Infinity;
  for(const p of b.points){
    const d=n[0]*p[5]+n[1]*p[6]+n[2]*p[7]+n[3];
    lo=Math.min(lo,d);hi=Math.max(hi,d);
  }
  if(lo>=-1e-7&&hi>1e-7)return side>0?-1:1;
  if(hi<=1e-7&&lo<-1e-7)return side>0?1:-1;
  return 0;
}
export function orderFaces(parts,camera,width,height,graph){
  const known=graph.parts||new Set(),nextEdges=new Map();
  parts.sort((a,b)=>a.order-b.order||a.depth-b.depth);
  const eye=camera.getWorldPosition(camera.position.clone()).toArray();
  const toward=camera.getWorldDirection(camera.position.clone()).negate().toArray();
  for(let start=0;start<parts.length;){
    let end=start+1;
    while(end<parts.length&&parts[end].order===parts[start].order)end++;
    const group=parts.slice(start,end),n=group.length;start=end;
    if(n<2||!group.some(p=>p.plane&&area(p.loops)>1200))continue;
    // Spatial bins bound comparisons to overlapping screen regions. Small
    // details keep their existing LOD; broad surfaces establish constraints.
    const cols=Math.ceil(width/64),rows=Math.ceil(height/64),bins=new Map(),changedBins=new Map();
    const broad=new Uint8Array(n),changed=new Uint8Array(n),incoming=new Uint32Array(n),seen=new Uint32Array(n);
    const out=new Array(n),involved=new Uint8Array(n);let stamp=0;
    const cells=r=>{
      const result=[];
      for(let y=Math.max(0,Math.floor(r[1]/64));y<=Math.min(rows-1,Math.floor(r[3]/64));y++){
        for(let x=Math.max(0,Math.floor(r[0]/64));x<=Math.min(cols-1,Math.floor(r[2]/64));x++)result.push(y*cols+x);
      }
      return result;
    };
    let changedPanel=false;
    for(let i=0;i<n;i++){
      const p=group[i];
      broad[i]=Boolean(p.plane&&area(p.loops)>1200);changed[i]=!known.has(p);
      if(broad[i]&&changed[i])changedPanel=true;
    }
    for(let i=0;i<n;i++){
      const p=group[i];
      if(!p.bounds||!p.loops.length||!Number.isFinite(p.depth)||!changedPanel&&!changed[i])continue;
      for(const key of cells(p.bounds)){
        if(changedPanel){if(!bins.has(key))bins.set(key,[]);bins.get(key).push(i);}
        if(changed[i]){
          if(!changedBins.has(key))changedBins.set(key,[]);
          changedBins.get(key).push(i);
        }
      }
    }
    // Keep constraints between unchanged projected parts. Only pairs involving
    // a changed part need geometric comparison during mechanism animation.
    const positions=new Map(group.map((p,i)=>[p,i])),edges=[];
    const connect=(from,to)=>{(out[from]??=[]).push(to);incoming[to]++;involved[from]=involved[to]=1;edges.push([group[from],group[to]]);};
    for(const [a,b]of graph.edges?.get(group[0].order)||[]){
      const from=positions.get(a),to=positions.get(b);
      if(from!==undefined&&to!==undefined)connect(from,to);
    }
    for(let i=0;i<n;i++){
      if(!broad[i])continue;
      stamp++;const a=group[i],candidates=changed[i]?bins:changedBins;
      for(const key of cells(a.bounds))for(const j of candidates.get(key)||[]){
        if(i===j||seen[j]===stamp||broad[j]&&(!changed[i]||changed[j]&&j<i))continue;
        seen[j]=stamp;const b=group[j];
        let order=separation(a,b,eye,toward,camera.isOrthographicCamera);
        if(!order&&broad[j])order=-separation(b,a,eye,toward,camera.isOrthographicCamera);
        if(!order||!overlaps(a,b))continue;
        connect(order<0?i:j,order<0?j:i);
      }
    }
    nextEdges.set(group[0].order,edges);
    if(!edges.length)continue;
    // A stable topological order respects all proved separations. A comparator
    // combining plane tests and centre depth is non-transitive and loses them.
    const heap=[],done=new Uint8Array(n),ordered=[];
    const push=id=>{
      heap.push(id);let i=heap.length-1;
      while(i){const p=(i-1)>>1;if(heap[p]<=id)break;heap[i]=heap[p];i=p;}
      heap[i]=id;
    };
    const pop=()=>{
      const id=heap[0],last=heap.pop();
      if(heap.length){
        let i=0;
        while(i*2+1<heap.length){
          let c=i*2+1;if(c+1<heap.length&&heap[c+1]<heap[c])c++;
          if(heap[c]>=last)break;heap[i]=heap[c];i=c;
        }
        heap[i]=last;
      }
      return id;
    };
    for(let i=0;i<n;i++)if(involved[i]&&!incoming[i])push(i);
    let free=0;
    while(ordered.length<n){
      while(free<n&&involved[free])free++;
      let i;
      if(free<n&&(!heap.length||free<heap[0]))i=free++;
      else{
        // Intersecting geometry can form a painter cycle. Retain the original
        // far-to-near priority at that boundary rather than dropping any face.
        if(!heap.length){let first=0;while(done[first])first++;push(first);}
        i=pop();
      }
      if(done[i])continue;
      done[i]=1;ordered.push(group[i]);
      if(out[i])for(const j of out[i])if(!done[j]&&--incoming[j]===0)push(j);
    }
    for(let i=0;i<n;i++)parts[end-n+i]=ordered[i];
  }
  graph.parts=new Set(parts);graph.edges=nextEdges;
}

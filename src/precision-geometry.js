// Original bounded edge treatments for manufactured housings. Dimensions are
// outer dimensions: bevels remove sharp edges without enlarging an assembly.
export function bevelledBox(T, size, radius = .035) {
  const [w,h,d]=size, b=Math.min(radius,Math.min(w,h,d)*.16);
  if(b<.003)return new T.BoxGeometry(w,h,d);
  const x=w/2-b,y=h/2-b,r=b,s=new T.Shape();
  s.moveTo(-x+r,-y);s.lineTo(x-r,-y);s.quadraticCurveTo(x,-y,x,-y+r);
  s.lineTo(x,y-r);s.quadraticCurveTo(x,y,x-r,y);s.lineTo(-x+r,y);
  s.quadraticCurveTo(-x,y,-x,y-r);s.lineTo(-x,-y+r);s.quadraticCurveTo(-x,-y,-x+r,-y);
  const g=new T.ExtrudeGeometry(s,{depth:d-2*b,bevelEnabled:true,bevelThickness:b,bevelSize:b,bevelSegments:1,curveSegments:3});
  g.translate(0,0,-d/2+b);g.userData.outerDimensions=[...size];g.userData.edgeTreatment='bounded bevel';return g;
}

// A closed annular flange with small chamfers catches light at both rims while
// retaining a genuine bore. It does not cover an independent rotating shaft.
export function flangeGeometry(T,inner,outer,depth,segments=40){
  const b=Math.min(.012,(outer-inner)*.15,depth*.2);
  const p=[[inner+b,-depth/2],[outer-b,-depth/2],[outer,-depth/2+b],[outer,depth/2-b],[outer-b,depth/2],[inner+b,depth/2],[inner,depth/2-b],[inner,-depth/2+b],[inner+b,-depth/2]].map(p=>new T.Vector2(...p));
  return new T.LatheGeometry(p,segments);
}

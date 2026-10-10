// Exhibition visual reconstruction based on the user's Xidong Bridge photograph.
// Continuous covered passage, raised central double roof, wind boards and woven timber arch.
export function createXidongBridge(material,T){
 const {Color,Vector3,BufferAttribute,BufferGeometry,BoxGeometry,CylinderGeometry,Quaternion,Mesh,mergeGeometries}=T;
 const parts=[],wood=new Color('#885f49'),boards=new Color('#914b42'),roofColor=new Color('#4d5351'),trim=new Color('#97816a'),stone=new Color('#807866');
 let seed=24117;const random=()=>{seed=Math.imul(seed,1664525)+1013904223|0;return(seed>>>0)/4294967296;};
 function add(g,color,variation=.12){
  const plain=g.index?g.toNonIndexed():g;if(plain!==g)g.dispose();plain.deleteAttribute('uv');
  const data=new Float32Array(plain.attributes.position.count*3),c=color.clone().multiplyScalar(1-variation/2+random()*variation);
  for(let i=0;i<data.length;i+=3)c.toArray(data,i);plain.setAttribute('color',new BufferAttribute(data,3));parts.push(plain);
 }
 function box(x,y,z,w,h,d,color=wood){add(new BoxGeometry(w,h,d).translate(x,y,z),color);}
 function beam(a,b,r=.045,color=wood){
  const start=new Vector3(...a),end=new Vector3(...b),direction=end.clone().sub(start);
  const g=new CylinderGeometry(r,r*1.025,direction.length(),6);
  g.applyQuaternion(new Quaternion().setFromUnitVectors(new Vector3(0,1,0),direction.normalize()));
  g.translate(...start.add(end).multiplyScalar(.5).toArray());add(g,color);
 }
 function surface(points,color){const g=new BufferGeometry();g.setAttribute('position',new BufferAttribute(new Float32Array(points),3));g.computeVertexNormals();add(g,color,.035);}
 function quad(a,b,c,d,color){surface([...a,...b,...d,...b,...c,...d],color);}
 const halfLength=5.35,depth=.68,deck=x=>.27+.60*(1-Math.min(1,Math.max(0,Math.abs(x)-1.4)/3.95));
 const arch3=[[-4.10,-1.43],[-1.30,-.02],[1.30,-.02],[4.10,-1.43]];
 const arch5=[[-4.10,-1.43],[-2.85,-.70],[-1.05,.03],[1.05,.03],[2.85,-.70],[4.10,-1.43]];
 function bottom(x){const u=Math.abs(x);if(u<=1.30)return -.10;return -.10-(Math.min(u,4.10)-1.30)/2.8*1.36;}
 function windPlank(x,w,z){
  const a=x-w/2,b=x+w/2,loA=bottom(a),loB=bottom(b),hiA=deck(a)+.77,hiB=deck(b)+.77;
  const f=z+.026,k=z-.026;
  quad([a,loA,f],[b,loB,f],[b,hiB,f],[a,hiA,f],boards);
  quad([b,loB,k],[a,loA,k],[a,hiA,k],[b,hiB,k],boards);
  quad([a,loA,k],[a,loA,f],[a,hiA,f],[a,hiA,k],boards);
  quad([b,loB,f],[b,loB,k],[b,hiB,k],[b,hiB,f],boards);
  quad([a,hiA,f],[b,hiB,f],[b,hiB,k],[a,hiA,k],boards);
  quad([a,loA,k],[b,loB,k],[b,loB,f],[a,loA,f],boards);
 }
 // The arch crosses the stream in one span; there are no invented piers in its centre.
 for(let row=0;row<9;row++){
  const z=-.6+row*.15,p=row%2?arch5:arch3;
  for(let i=0;i<p.length-1;i++)beam([...p[i],z],[...p[i+1],z],.058);
 }
 for(const [x,y]of [...arch3,...arch5])beam([x,y+.035,-.77],[x,y+.035,.77],.061);
 for(const x of[-3.9,-3.1,-2.25,2.25,3.1,3.9])for(const z of[-.48,.48]){
  beam([x,bottom(x)+.09,z],[x,deck(x),z],.037);
  beam([x,bottom(x)+.09,z],[x+(x<0?.38:-.38),deck(x),z],.034);
 }
 for(let i=0;i<60;i++){const x=-halfLength+(i+.5)*halfLength*2/60;box(x,deck(x),0,halfLength*2/60+.006,.12,1.46);}
 // Closely spaced vertical planks form the characteristic deep red-brown wind boards.
 const posts=[-5.35,-4.7,-4.1,-3.5,-2.8,-2.1,-1.4,-.47,.47,1.4,2.1,2.8,3.5,4.1,4.7,5.35];
 const bays=posts.length-1;
 for(const z of[-depth,depth]){
  for(let i=0;i<=bays;i++){
   const x=posts[i];beam([x,deck(x),z],[x,deck(x)+1.36,z],.043);
  }
  for(let i=0;i<bays;i++){
   const width=posts[i+1]-posts[i],centre=(posts[i]+posts[i+1])/2,top=deck(centre)+.78;
   for(let j=0;j<7;j++){
    const x=centre+(j-3)*width/7;
    // Weather boards sit outside the posts and deck edge, hiding interior framing.
    if(Math.abs(x)<4.1)windPlank(x,width/7-.006,z+Math.sign(z)*.17);
   }
   box(centre,top,z,width-.028,.05,.085,wood);
   box(centre,deck(centre)+1.31,z,width-.028,.055,.08,wood);
   // The approach bays are open colonnades, not extensions of the deep wind boards.
   if(Math.abs(centre)>4.1){
    beam([posts[i],deck(posts[i])+.16,z],[posts[i+1],deck(posts[i+1])+.16,z],.028);
    beam([posts[i],deck(posts[i])+.56,z],[posts[i+1],deck(posts[i+1])+.56,z],.028);
    for(const f of[.22,.5,.78]){const x=posts[i]+f*width;beam([x,deck(x)+.16,z],[x,deck(x)+.56,z],.022);}
   }
   // The dark, open window strip remains genuinely open geometry.
  }
  for(let i=0;i<arch3.length-1;i++)beam([...arch3[i],z+.04*Math.sign(z)],[...arch3[i+1],z+.04*Math.sign(z)],.063);
 }
 // Two stone abutments are confined to the banks.
 for(const sign of[-1,1])for(let row=0;row<8;row++)for(let col=0;col<5;col++){
  const x=sign*(4.22+col*.20),y=-1.49+row*.245;
  box(x+(row%2?.035:0),y,0,.19,.23,1.42,stone);
 }
 function roof({half,base,rise,reach,tiles,hip=.0,upturn=.28,hipped=false,decorated=false}){
  const columns=Math.round(half*2*tiles),rows=8;
  function point(x,t,sign){
   const normalized=Math.abs(x)/half,corner=Math.pow(normalized,12);
   const endLift=upturn*corner*(.8+Math.pow(t,3));
   // Shallow end hips close the roof ends without separate little pavilions.
   const hipDrop=hip*Math.pow(Math.max(0,(normalized-.87)/.13),2)*(1-t);
   return[x*(hipped?.80+.20*Math.pow(t,.75):1),base(x)+rise*Math.pow(1-t,1.58)+endLift-hipDrop,sign*reach*t];
  }
  for(const sign of[-1,1]){
   const triangles=[];
   for(let col=0;col<columns;col++)for(let row=0;row<rows;row++){
    const x0=-half+col*half*2/columns,x1=x0+half*2/columns,t0=row/rows,t1=(row+1)/rows;
    triangles.push(...point(x0,t0,sign),...point(x1,t0,sign),...point(x0,t1,sign),...point(x1,t0,sign),...point(x1,t1,sign),...point(x0,t1,sign));
   }
   surface(triangles,roofColor);
   for(let col=0;col<=columns;col++){
    const x=-half+col*half*2/columns;
    for(let row=0;row<4;row++)beam(point(x,row/4,sign),point(x,(row+1)/4,sign),.010,roofColor);
   }
   for(let col=0;col<columns;col++)beam(point(-half+col*half*2/columns,1,sign),point(-half+(col+1)*half*2/columns,1,sign),.021,trim);
   for(const side of[-1,1]){
    for(let row=0;row<rows;row++)beam(point(side*half,row/rows,sign),point(side*half,(row+1)/rows,sign),.024,trim);
    const corner=point(side*half,1,sign),curl=[corner[0]+side*.13,corner[1]+.10,corner[2]+sign*.035];
    beam(corner,curl,.024,trim);beam(curl,[corner[0]+side*.18,corner[1]+.25,corner[2]+sign*.05],.018,trim);
   }
  }
  for(let i=0;i<48;i++)beam(point(-half+i*half*2/48,0,1),point(-half+(i+1)*half*2/48,0,1),.033,trim);
  // Upper roof: shortened ridge, red triangular gable and tiled end hips.
  for(const sign of[-1,1]){
   const x=sign*(half-.025),baseY=base(x),tip=point(x,0,1);
   if(hipped){
    const a=[tip[0],baseY+.18,-reach*.45],b=[tip[0],baseY+.18,reach*.45];
    surface([...a,...tip,...b],boards);
    beam(a,tip,.030,boards);beam(tip,b,.030,boards);beam(a,b,.030,boards);
    quad(point(x,1,-1),a,b,point(x,1,1),roofColor);
    beam(point(x,1,-1),a,.025,trim);beam(b,point(x,1,1),.025,trim);
   }else surface([x,baseY,-reach,...tip,x,baseY,reach],roofColor);
  }
  if(decorated){
   const ceramic=new Color('#b0a996'),redEdge=new Color('#a35c50');
   for(let i=0;i<40;i++){
    const a=point(-half+i*half*2/40,0,1),b=point(-half+(i+1)*half*2/40,0,1);
    const u=[a[0],a[1]+.15,0],v=[b[0],b[1]+.15,0];
    quad([a[0],a[1],.032],[b[0],b[1],.032],[v[0],v[1],.032],[u[0],u[1],.032],ceramic);
    quad([b[0],b[1],-.032],[a[0],a[1],-.032],[u[0],u[1],-.032],[v[0],v[1],-.032],ceramic);
    beam(u,v,.024,redEdge);
   }
   // Small simplified ornamental finials; these are not claimed as scanned carvings.
   for(const sign of[-1,1]){
    const p=point(sign*half,0,1),a=[p[0],p[1]+.15,0],b=[p[0]+sign*.045,p[1]+.33,0],c=[p[0]-sign*.015,p[1]+.44,0];
    beam(a,b,.041,ceramic);beam(b,c,.025,trim);
   }
   const p=point(0,0,1),cy=p[1]+.25,r=.074;
   for(let i=0;i<16;i++){
    const a=i*Math.PI/8,b=(i+1)*Math.PI/8;
    beam([Math.cos(a)*r,cy+Math.sin(a)*r,0],[Math.cos(b)*r,cy+Math.sin(b)*r,0],.015,ceramic);
   }
   for(let i=0;i<7;i++){
    const a=.15+i*(Math.PI-.30)/6;
    beam([Math.cos(a)*r,cy+Math.sin(a)*r,0],[Math.cos(a)*(r+.046),cy+Math.sin(a)*(r+.068),0],.010,redEdge);
   }
  }
 }
 roof({half:5.60,base:x=>deck(x)+1.35,rise:.46,reach:.94,tiles:15,hip:.025});
 // Raised central three-bay roof: broad, low and double-eaved, not a stacked pagoda.
 const upperHalf=1.72;
 for(const z of[-.58,.58]){
  box(0,2.77,z,2.82,.41,.055,boards);
  for(const x of[-1.40,-.47,.47,1.40])beam([x,2.42,z],[x,3.01,z],.037);
  box(0,2.95,z,2.85,.065,.07,wood);
 }
 roof({half:upperHalf,base:()=>2.95,rise:.49,reach:.88,tiles:18,hip:.02,upturn:.25,hipped:true,decorated:true});
 const geometry=mergeGeometries(parts,false);parts.forEach(g=>g.dispose());geometry.computeBoundingSphere();geometry.computeBoundingBox();
 const mesh=new Mesh(geometry,material);mesh.frustumCulled=false;mesh.name='XidongBridge';
 mesh.userData.bridgeReference='Taishun Xidong Bridge — exhibition visual reconstruction, not a surveyed model';
 return mesh;
}

/* Painting water motion, enabled by default; no controls or boat splash overlay. */
(() => {
 'use strict';
 const route=location.pathname;
 const assetRoot=new URL('.',document.currentScript.src);
 const profiles={
  cover:{selector:'.backdrop',polygons:[[[.177,.614],[.233,.605],[.247,.614],[.251,.638],[.32,.66],[.40,.658],[.46,.636],[.60,.625],[1,.625],[1,1],[.474,1],[.462,.955],[.411,.945],[.389,.918],[.35,.899],[.306,.894],[.294,.868],[.31,.845],[.303,.809],[.257,.786],[.245,.772],[.227,.769],[.219,.746],[.194,.728],[.184,.704],[.201,.679],[.184,.659],[.171,.658]]],direction:[1,-.15]},
  prologue:{selector:'.backdrop',polygons:[[[0,.74],[1,.74],[1,1],[0,1]],[[0,.693],[.274,.693],[.279,.74],[0,.74]],[[.87,.731],[.91,.699],[1,.696],[1,.74],[.87,.74]]],direction:[1,.08]},
  workshop:{selector:'.scene-image',polygons:[[[.485,.485],[.65,.481],[.67,.52],[.646,.59],[.664,.64],[.68,.70],[.65,.78],[.67,.83],[.63,.89],[.65,.93],[.59,1],[.48,1],[.457,.94],[.448,.88],[.42,.85],[.413,.81],[.443,.77],[.455,.72],[.48,.66],[.482,.59],[.462,.55]],[[.17,0],[.34,0],[.307,.095],[.287,.17],[.28,.24],[.33,.30],[.35,.345],[.292,.34],[.27,.27],[.22,.22],[.22,.14],[.16,.12]],[[.548,.39],[.58,.38],[.609,.36],[.648,.34],[.675,.32],[.704,.34],[.73,.39],[.72,.42],[.66,.445],[.60,.45],[.55,.43]]],direction:[.2,1]},
  banner:{selector:'.hero img',polygons:[[[0,.79],[.29,.73],[.34,.68],[.36,.612],[.64,.612],[.69,.65],[.82,.68],[.91,.70],[.91,.75],[.85,.80],[.78,.86],[.77,.90],[.90,.96],[1,.99],[1,1],[0,1]]],direction:[1,.05]},
  bridge:{selector:'.hero img',polygons:[[[.588,.626],[.63,.622],[.65,.675],[.617,.738],[.66,.80],[.65,.86],[.76,.92],[.84,.98],[.85,1],[.55,1],[.51,.95],[.46,.91],[.42,.90],[.40,.85],[.45,.81],[.43,.78],[.50,.75],[.54,.70],[.58,.68]]],holes:[[[.50,.795],[.54,.78],[.58,.79],[.615,.82],[.60,.854],[.55,.854],[.52,.84]]],direction:[-.18,1]},
  opera:{selector:'.stage-bg',polygons:[[[0,.659],[.035,.648],[.062,.655],[.082,.686],[.076,.713],[.05,.747],[.028,.77],[0,.785]],[[.923,.665],[.97,.661],[1,.66],[1,.782],[.975,.767],[.948,.745],[.922,.719]]],direction:[.12,1],strength:.8},
  finale:{selector:'.final-background',source:new URL('assets/finale-clean.png',assetRoot).href,container:'.final-art',before:'.final-boat',polygons:[[[.30,.885],[.39,.847],[.53,.848],[.68,.853],[.82,.815],[.91,.755],[.96,.74],[.963,.887],[.995,.917],[.97,.967],[.93,1],[.29,1],[.30,.94]]],direction:[1,.12]}
 };
 const vs='attribute vec2 a;varying vec2 v;void main(){v=vec2(a.x*.5+.5,.5-a.y*.5);gl_Position=vec4(a,0.,1.);}';
 const fs=`precision highp float;
 uniform sampler2D painting;uniform sampler2D water;uniform vec2 crop;uniform vec2 origin;uniform vec2 direction;
 uniform float time;uniform float strength;uniform float aspect;varying vec2 v;
 void main(){
  vec2 uv=origin+v*crop;float mask=texture2D(water,uv).r;
  if(mask<.002){gl_FragColor=vec4(0.);return;}
  float depth=.35+.65*smoothstep(.42,1.,uv.y);
  vec2 p=vec2(uv.x*aspect,uv.y);
  float broad=sin(p.x*19.+p.y*27.-time*.43);
  float small=sin(p.x*41.-p.y*67.+sin(p.x*9.)*.85-time*.68);
  vec2 wave=vec2(broad*.0008+small*.00042,small*.00024)*strength*depth;
  float phase=fract(time*.04),phaseB=fract(phase+.5),blend=abs(phase*2.-1.);
  vec2 current=direction*.014*strength*depth;
  vec2 a=wave+current*(phase-.5),b=wave+current*(phaseB-.5);
  float edge=mask*texture2D(water,uv+a).r*texture2D(water,uv+b).r;
  vec3 still=texture2D(painting,uv).rgb;
  vec3 moving=mix(texture2D(painting,uv+a*edge).rgb,texture2D(painting,uv+b*edge).rgb,blend);
  gl_FragColor=vec4(mix(still,moving,edge),mask);
 }`;
 function settings(){return {enabled:true,strength:2.6};}
 function polygon(c,points){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x*c.canvas.width,y*c.canvas.height):c.moveTo(x*c.canvas.width,y*c.canvas.height));c.closePath();c.fill();}
 async function loaded(image){if(image.complete&&image.naturalWidth)return image;await new Promise((resolve,reject)=>{image.addEventListener('load',resolve,{once:true});image.addEventListener('error',reject,{once:true});});return image;}
 class WaterLayer{
  constructor(image,profile,target=image){
   this.image=image;this.target=target;this.profile=profile;this.time=0;this.last=0;this.lastDraw=0;this.visible=true;this.alive=true;this.raf=0;
   const canvas=this.canvas=document.createElement('canvas');canvas.className='shuimu-water-motion';canvas.setAttribute('aria-hidden','true');canvas.dataset.waterProfile=profile.name;
   const container=profile.container?document.querySelector(profile.container):(target.tagName==='IMG'?target.parentElement:target);
   const z=target.tagName==='IMG'?getComputedStyle(target).zIndex:'0';
   Object.assign(canvas.style,{position:'absolute',inset:'0',width:'100%',height:'100%',pointerEvents:'none',zIndex:z==='auto'?'0':z});
   if(profile.before)container.insertBefore(canvas,container.querySelector(profile.before));else if(target.tagName==='IMG')target.after(canvas);else container.prepend(canvas);
   this.gl=canvas.getContext('webgl',{alpha:true,antialias:false,depth:false,stencil:false,premultipliedAlpha:false,powerPreference:'low-power'});
   if(!this.gl){canvas.remove();return;}
   addEventListener('pagehide',()=>this.dispose(),{once:true});
   loaded(image).then(()=>this.init()).catch(error=>{console.warn('Water motion unavailable',error);canvas.remove();});
  }
  init(){
   if(!this.alive)return;const gl=this.gl;
   try{
    const compile=(type,src)=>{const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw Error(gl.getShaderInfoLog(s));return s;};
    this.shaders=[compile(gl.VERTEX_SHADER,vs),compile(gl.FRAGMENT_SHADER,fs)];const program=this.program=gl.createProgram();this.shaders.forEach(s=>gl.attachShader(program,s));gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error(gl.getProgramInfoLog(program));gl.useProgram(program);
    this.buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,this.buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const attr=gl.getAttribLocation(program,'a');gl.enableVertexAttribArray(attr);gl.vertexAttribPointer(attr,2,gl.FLOAT,false,0,0);
    const mask=document.createElement('canvas');mask.width=1024;mask.height=Math.round(1024*this.image.naturalHeight/this.image.naturalWidth);const c=mask.getContext('2d');c.fillStyle='black';c.fillRect(0,0,mask.width,mask.height);c.fillStyle='white';c.filter='blur(2px)';this.profile.polygons.forEach(p=>polygon(c,p));c.fillStyle='black';(this.profile.holes||[]).forEach(p=>polygon(c,p));
    this.textures=[this.texture(this.image,0),this.texture(mask,1)];gl.uniform1i(gl.getUniformLocation(program,'painting'),0);gl.uniform1i(gl.getUniformLocation(program,'water'),1);
    this.u=Object.fromEntries(['crop','origin','time','strength','aspect','direction'].map(name=>[name,gl.getUniformLocation(program,name)]));gl.uniform1f(this.u.aspect,this.image.naturalWidth/this.image.naturalHeight);gl.uniform2fv(this.u.direction,this.profile.direction);
    this.ready=true;this.canvas.dataset.waterReady='true';this.resize();
    this.resizeObserver=new ResizeObserver(()=>this.resize());this.resizeObserver.observe(this.target);
    this.intersectionObserver=new IntersectionObserver(entries=>{this.visible=entries[0].isIntersecting;this.last=0;this.schedule();});this.intersectionObserver.observe(this.target);
    this.change=()=>{this.last=0;this.draw();this.schedule();};
    document.addEventListener('visibilitychange',this.change);
    this.motionObserver=new MutationObserver(this.change);this.motionObserver.observe(document.body,{attributes:true,attributeFilter:['data-motion']});const scene=document.querySelector('.scene[data-motion]');if(scene)this.motionObserver.observe(scene,{attributes:true,attributeFilter:['data-motion']});
    this.canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();this.ready=false;this.canvas.hidden=true;cancelAnimationFrame(this.raf);});
    this.schedule();
   }catch(error){console.warn('Water motion init',error);this.canvas.remove();this.dispose();}
  }
  texture(source,unit){const gl=this.gl,t=gl.createTexture();gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,t);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,source);return t;}
  resize(){
   if(!this.ready)return;const box=this.target.getBoundingClientRect();if(!box.width||!box.height)return;
   const dpr=Math.min(devicePixelRatio||1,1.15,1700/box.width),gl=this.gl;
   this.canvas.width=Math.round(box.width*dpr);this.canvas.height=Math.round(box.height*dpr);gl.viewport(0,0,this.canvas.width,this.canvas.height);
   const style=getComputedStyle(this.target),fit=this.profile.background?'cover':style.objectFit;
   let scaleX=1,scaleY=1,offsetX=0,offsetY=0;
   if(fit==='cover'||fit==='contain'){
    const ratio=(fit==='cover'?Math.max:Math.min)(box.width/this.image.naturalWidth,box.height/this.image.naturalHeight);
    scaleX=box.width/(this.image.naturalWidth*ratio);scaleY=box.height/(this.image.naturalHeight*ratio);
    const position=(this.profile.background?style.backgroundPosition:style.objectPosition).split(' ');
    const pos=p=>p?.endsWith('%')?parseFloat(p)/100:p==='left'||p==='top'?0:p==='right'||p==='bottom'?1:.5;
    offsetX=(1-scaleX)*pos(position[0]);offsetY=(1-scaleY)*pos(position[1]);
   }
   gl.uniform2f(this.u.crop,scaleX,scaleY);gl.uniform2f(this.u.origin,offsetX,offsetY);this.draw();
  }
  paused(){return matchMedia('(prefers-reduced-motion: reduce)').matches||document.body.dataset.motion==='paused'||document.querySelector('.scene[data-motion="paused"]');}
  draw(){if(!this.ready||!this.alive)return;const s=settings();this.canvas.hidden=!s.enabled;if(!s.enabled)return;this.gl.uniform1f(this.u.time,this.time);this.gl.uniform1f(this.u.strength,s.strength*(this.profile.strength||1));this.gl.drawArrays(this.gl.TRIANGLES,0,6);}
  schedule(){cancelAnimationFrame(this.raf);this.raf=0;if(this.ready&&this.alive&&this.visible&&!document.hidden&&!this.paused()&&settings().enabled)this.raf=requestAnimationFrame(now=>this.frame(now));}
  frame(now){if(this.last)this.time+=Math.min((now-this.last)/1000,.1);this.last=now;if(now-this.lastDraw>=33){this.draw();this.lastDraw=now;}this.schedule();}
  dispose(){if(!this.alive)return;this.alive=false;cancelAnimationFrame(this.raf);this.resizeObserver?.disconnect();this.intersectionObserver?.disconnect();this.motionObserver?.disconnect();document.removeEventListener('visibilitychange',this.change);this.textures?.forEach(t=>this.gl.deleteTexture(t));this.shaders?.forEach(s=>this.gl.deleteShader(s));if(this.buffer)this.gl.deleteBuffer(this.buffer);if(this.program)this.gl.deleteProgram(this.program);}
 }
 function mount(name){const profile={...profiles[name],name};const target=document.querySelector(profile.selector);if(!target)return;
  let image=target;
  if(profile.source||target.tagName!=='IMG'){
   image=new Image();image.src=profile.source||new URL('assets/shanshui-banner.png',location.href);profile.background=target.tagName!=='IMG';
  }
  new WaterLayer(image,profile,target);
 }
 addEventListener('DOMContentLoaded',()=>{
  if(route.endsWith('/cover.html'))mount('cover');
  else if(route.endsWith('/prologue.html'))mount('prologue');
  else if(route.endsWith('/woodtype/start.html')){mount('workshop');const sheen=document.querySelector('.water-sheen');if(sheen)sheen.style.display='none';}
  else if(route.endsWith('/woodtype/index.html'))mountWithBackground();
  else if(route.endsWith('/woodtype/intro.html'))mount('banner');
  else if(route.endsWith('/bridge/intro.html'))mount('bridge');
  else if(route.endsWith('/chapters/opera/index.html'))mount('opera');
  else if(route.endsWith('/finale.html'))mount('finale');
 });
 function mountWithBackground(){profiles.banner={...profiles.banner,selector:'.hero',background:true};mount('banner');}
})();

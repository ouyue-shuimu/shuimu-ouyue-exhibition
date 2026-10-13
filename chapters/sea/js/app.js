import {smooth,lerp,cargoPose,portPose} from './motion.js?v=20261012-11';
const A='assets/';
const SOURCES={
 river:{label:'浙江省交通运输厅｜温州—丽水海河联运启航（2024）',url:'https://jtyst.zj.gov.cn/art/2024/12/27/art_1229304975_59039943.html'},
 port:{label:'浙江新闻｜朔门古港遗址考古发现（2023）',url:'https://zjnews.zjol.com.cn/202303/t20230328_25571788.shtml'},
 maritime:{label:'新华网｜温州千年古港与海上丝绸之路（2022）',url:'https://www.xinhuanet.com/2022-09/28/c_1129039940.htm'},
 city:{label:'温州市国资委｜朔门古港遗址保护展示项目（2025）',url:'https://wzgzw.wenzhou.gov.cn/art/2025/5/14/art_1221492_58955059.html'},
 towers:{label:'温州市文化广电旅游局｜江心屿双塔',url:'https://wl.wenzhou.gov.cn/art/2020/11/13/art_1229438201_58884370.html'},
 book:{label:'《宋元时期温州港口及其相关城市建设研究》',url:null},
 sediment:{label:'《瓯江口朔门港沉积环境演变与温州港城关系初探》',url:null},
 wreck:{label:'《一艘宋代沉船的千年“船”奇》',url:null},
 ou:{label:'瓯居海中｜一部瓯窑史：瓯海先民留下的陶器遗存（2022）',url:'https://mp.weixin.qq.com/s/8_msvsT0h498wu8hYnkFIw'}
};
const SCENES=[
 {title:'循江而来',lead:'循着江水向东，山地与港城由此相连。',action:'启程',card:{title:'瓯江：山水之间的航运通道',text:'瓯江流经浙南山地，连接丽水、温州并汇入东海。温州港的兴衰也与河口泥沙、岸线变迁及港城建设有关。有关研究梳理了朔门港沉积环境演变与温州港城发展的关系。',note:'长卷里的航行路线用于串联五幕场景，不代表一条已考定的宋元航线。',sources:[SOURCES.river,SOURCES.sediment]},hotspots:[
  {x:27,y:72,label:'瓯江水路',icon:'水',title:'山水连接港城',text:'瓯江贯穿浙南山地并通向东海，是内陆与温州港之间的重要水系。今天，温州—丽水海河联运仍沿瓯江连接内河与海运。',sources:[SOURCES.river]},
  {x:76,y:59,label:'港口与河口',icon:'港',title:'港口随水岸而变',text:'河口水深、泥沙淤积和岸线变化会影响船只停泊与港口空间。朔门港相关研究从沉积环境变化讨论了港城关系。',sources:[SOURCES.sediment,SOURCES.book]}
 ]},
 {title:'临江入城',lead:'船只靠近江岸，水路与城中街巷相接。',action:'让船靠岸',card:{title:'从江岸入城：港口连接城市生活',text:'朔门古港遗址位于温州古城北侧、瓯江南岸。城门、瓮城、江岸与码头等遗存，呈现宋元以来港区和城市空间之间的联系。南宋绍兴二年（1132），温州设置市舶务管理对外贸易。',note:'',sources:[SOURCES.port,SOURCES.city,SOURCES.book]},hotspots:[
  {x:66,y:43,label:'城与港',icon:'城',title:'朔门古港位于古城北侧',text:'朔门古港遗址的城门、瓮城、江岸及码头遗迹，为观察温州港区与城市北部空间关系提供了考古材料。',sources:[SOURCES.port,SOURCES.city]},
  {x:48,y:58,label:'港口管理',icon:'贸',title:'南宋温州设市舶务',text:'地方志记载，南宋绍兴二年（1132）温州设置市舶务，管理对外贸易。',sources:[SOURCES.book]}
 ]},
 {title:'朔门集舟',lead:'船舶停靠江岸，货物经由码头装载。',action:'开始装卸',card:{title:'宋代船舶与朔门港的装载线索',text:'朔门港遗址发现宋代沉船及码头遗存。二号沉船现存船体残长约15.9米、宽约4.26米；整船约20米长、约6米宽属于研究推估。船体舱壁和分舱结构，为认识宋代木船建造与港口运输提供了实物线索。',note:'残存尺寸与复原推估分别标示；长卷中的船只不是沉船的精确复原。',sources:[SOURCES.port,SOURCES.book,SOURCES.wreck]},hotspots:[
  {x:47,y:54,label:'沉船船体',icon:'舟',title:'船体、船艏与分舱',text:'研究资料据现存船体推估二号沉船原长约20米、宽约6米，并记录了约七个隔舱等结构。尖艏、船体线形、排水孔和舱壁共同反映船的形制与建造方式；尺寸推估应与现存残长约15.9米区分。',sources:[SOURCES.book,SOURCES.wreck]},
  {x:72,y:74,label:'码头设施',icon:'港',title:'码头见证停泊与装卸',text:'朔门古港考古发现宋代码头及江岸设施。木桩、铺板和岸线结构等材料，为研究船只停靠和港口建设提供线索。',sources:[SOURCES.port,SOURCES.book]}
 ]},
 {title:'双塔引航',lead:'船行开阔江面，江心屿双塔渐渐显现。',action:'扬帆起航',card:{title:'江心屿双塔：江面上的方向标志',text:'江心屿位于瓯江之中，东西双塔是温州历史地标。地方资料记载，往来船只曾以双塔辨认温州方向。双塔为砖塔建筑，成为江面与城市之间醒目的视觉参照。',note:'“引航”指地标帮助辨认方位，不代表现代灯塔设备或主动导航。',sources:[SOURCES.towers,SOURCES.book]},hotspots:[
  {x:31,y:43,label:'东西双塔',icon:'塔',title:'江心屿的两座砖塔',text:'江心屿双塔隔江相望，是温州城市景观的重要历史地标。地方文献记载了双塔形制与高度。',sources:[SOURCES.towers,SOURCES.book]},
  {x:56,y:64,label:'辨认方向',icon:'航',title:'远望岛屿与塔影',text:'从江面观察岛岸和塔影，可以理解江心屿在航道、温州古城与瓯江空间中的位置。',sources:[SOURCES.towers]}
 ]},
 {title:'一江通海',lead:'江道渐宽，船载器物由此走向更远的海路。',action:'驶向江海',card:{title:'瓯窑与龙泉青瓷：港口流通的器物线索',text:'温州本地瓯窑与龙泉窑青瓷是不同窑口。瓯窑在宋元时期持续发展；朔门古港出土的陶瓷遗存也包括龙泉窑产品。港口与内河水路为瓷器流通和海上贸易提供了交通条件。',note:'瓯窑和龙泉窑不可混称；长卷中的货物画面不对应某艘沉船的确切货单。',sources:[SOURCES.ou,SOURCES.port,SOURCES.maritime,SOURCES.book]},hotspots:[
  {x:75,y:62,label:'瓯窑与龙泉窑',icon:'瓷',title:'两种窑口，各有脉络',text:'瓯窑是温州地方窑业传统；龙泉窑青瓷则是另一重要窑口。宋元时期的生产、内河运输与港口贸易共同构成瓷器流通背景。',sources:[SOURCES.ou,SOURCES.port,SOURCES.book]},
  {x:25,y:78,label:'古今水路',icon:'江',title:'瓯江仍连接内陆与沿海',text:'2024年，温州七里港至青田温溪港集装箱海河联运航线启航，为瓯江水路在当代的运输功能提供了实例。',sources:[SOURCES.river]}
 ]}
];
const byId=id=>document.getElementById(id);
const ui={stage:byId('stage'),nav:byId('chapterNav'),bgs:byId('backgrounds'),actors:byId('actorsCanvas'),count:byId('sceneCount'),eyebrow:byId('chapterEyebrow'),title:byId('chapterTitle'),lead:byId('chapterLead'),status:byId('actionStatus'),primary:byId('primaryButton'),prev:byId('previousButton'),next:byId('nextButton'),skip:byId('skipButton'),replay:byId('replayButton'),knowledge:byId('knowledgeButton'),modal:byId('modalBackdrop'),modalClose:byId('modalClose'),modalArt:byId('modalArt'),modalKicker:byId('modalKicker'),modalTitle:byId('modalTitle'),modalText:byId('modalText'),modalNote:byId('modalNote'),sources:byId('modalSources'),intro:byId('intro'),start:byId('startButton'),sound:byId('soundButton'),soundLabel:byId('soundLabel'),ending:byId('ending')};

const state={current:0,unlocked:0,phase:[0,0,0,0,0],completed:[false,false,false,false,false],travel:[0,0,0,0,0],started:false,ready:false,sound:false,action:null,transition:null,lastFocus:null,sceneStart:performance.now()};
let water={update(){}};
const images={};
const assets={boat1:'ships/01-向右货舟.png',boat2:'ships/02-靠岸货船.png',boat4:'ships/04-行航帆船.png',boat5:'ships/05-远行海船.png',distantBoat:'ships/05-远处双帆小舟.png',small:'ships/04-小舟.png',wake:'sprites/船行水纹.png',workers:'sprites/02-空手与搬货-4列2行.png',loaders:'sprites/03-装卸-4列2行.png'};
for(let i=1;i<=5;i++)assets['bg'+i]=`backgrounds/0${i}-净底图.png`;
function loadImage(key,path){return new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>{
 if(key==='distantBoat'){
  const sprite=document.createElement('canvas');sprite.width=im.width;sprite.height=im.height;
  const sc=sprite.getContext('2d',{willReadFrequently:true});sc.drawImage(im,0,0);
  const pixels=sc.getImageData(0,0,sprite.width,sprite.height);
  for(let k=3;k<pixels.data.length;k+=4){const a=pixels.data[k];pixels.data[k]=a<70?0:Math.min(255,(a-70)*255/180);}
  sc.putImageData(pixels,0,0);images[key]=sprite;
 }else images[key]=im;
 resolve();};im.onerror=()=>reject(new Error(path));im.src=A+path;});}
const loading=Promise.all(Object.entries(assets).map(([k,p])=>loadImage(k,p)));
function setup(){
 ui.bgs.innerHTML=Array.from({length:5},(_,i)=>`<img class="bg${i===0?' active':''}" data-bg="${i}" src="${A+assets['bg'+(i+1)]}" alt="第${i+1}幕：${SCENES[i].title}">`).join('');
 ui.nav.innerHTML=SCENES.map((s,i)=>`<button class="chapter-link" data-chapter="${i}" type="button"><i class="chapter-dot" aria-hidden="true"></i>${s.title}</button>`).join('');
 ui.nav.addEventListener('click',e=>{const b=e.target.closest('[data-chapter]');if(b)navigate(+b.dataset.chapter);});
 const layer=document.createElement('div');layer.className='hotspot-layer';layer.hidden=true;ui.stage.append(layer);
 ui.start.disabled=true;ui.start.textContent='画卷载入中…';
}
function hotspots(){
 const layer=ui.stage.querySelector('.hotspot-layer');
 layer.hidden=!state.started||!state.ready||!!state.transition||(state.current===4&&state.completed[4]);
 if(layer.dataset.scene!==String(state.current)){
  layer.dataset.scene=state.current;
  layer.innerHTML=SCENES[state.current].hotspots.map((h,i)=>`<button class="hotspot" type="button" data-hot="${i}" style="left:${h.x}%;top:${h.y}%"><span class="hotspot-icon">${h.icon}</span>${h.label}</button>`).join('');
  layer.querySelectorAll('[data-hot]').forEach(b=>b.onclick=()=>openCard(SCENES[state.current].hotspots[+b.dataset.hot]));
 }
}
function updateUI(){
 const i=state.current,s=SCENES[i],busy=!!state.action||!!state.transition,done=state.completed[i];
 ui.count.textContent=`${String(i+1).padStart(2,'0')} / 05`;
 ui.eyebrow.textContent=`第${['一','二','三','四','五'][i]}幕 · ${s.title}`;ui.title.textContent=s.title;ui.lead.textContent=s.lead;
 const action=i===1&&state.phase[i]===1?'搬运货物':s.action;
 ui.status.textContent=state.transition?'画卷徐徐展开…':state.action?state.action.label:done?(i===4?'旅程已抵达江海之间':'本幕已完成，可以继续前行'):i===1&&state.phase[i]===1?'两艘船已靠岸，点击搬运货物':action;
 ui.primary.textContent=action;ui.primary.hidden=done;ui.primary.disabled=busy||!state.started||!state.ready;
 ui.prev.disabled=i===0||busy;ui.next.hidden=!done||i===4;ui.next.disabled=busy;ui.next.textContent=i<4?`进入${SCENES[i+1].title}`:'下一幕';ui.skip.hidden=!state.action;ui.replay.disabled=busy;ui.knowledge.disabled=!!state.transition||!state.ready;
 [...ui.nav.children].forEach((b,n)=>{b.disabled=n>state.unlocked||busy;b.classList.toggle('active',i===n);b.classList.toggle('visited',n<=state.unlocked);});
 ui.stage.classList.toggle('transitioning',!!state.transition);hotspots();
}
function progress(now){return state.action?Math.max(0,Math.min(1,(now-state.action.start)/state.action.duration)):state.travel[state.current];}
function complete(){const i=state.current;state.travel[i]=1;state.completed[i]=true;if(i<4)state.unlocked=Math.max(state.unlocked,i+1);state.action=null;updateUI();if(i===4){ui.ending.hidden=false;requestAnimationFrame(()=>ui.ending.classList.add('visible'));}}
function runAction(label,duration,callback){if(state.action||state.transition)return;state.action={label,duration,start:performance.now(),callback};updateUI();}
function finishAction(){if(!state.action)return;const fn=state.action.callback;state.travel[state.current]=1;state.action=null;fn();}
function perform(){
 if(!state.started||!state.ready||state.action||state.transition||!ui.modal.hidden||state.completed[state.current])return;
 const i=state.current;
 if(i===0)runAction('小舟向右启程…',8500,()=>{complete();navigate(1);});
 else if(i===1){
  if(state.phase[i]===0){citySound();runAction('两艘船缓缓靠岸…',10000,()=>{state.phase[i]=1;state.travel[i]=0;updateUI();});}
  else{state.phase[i]=2;runAction('沿岸道取货，沿原路返回…',26000,complete);}
 }else if(i===2){playCue('rope',.13);runAction('搬运、装载与系缆…',9000,complete);}
 else if(i===3)runAction('扬帆驶过双塔…',11000,complete);
 else runAction('船帆渐远，驶向江海…',20000,complete);
}
function navigate(i){
 if(state.action||state.transition||i<0||i>state.unlocked||i>4||i===state.current)return;
 closeCard();const snapshot=document.createElement('canvas');snapshot.width=ui.actors.width;snapshot.height=ui.actors.height;snapshot.getContext('2d').drawImage(ui.actors,0,0);
 const old=state.current;state.current=i;state.sceneStart=performance.now();state.transition={from:old,start:performance.now(),duration:3200,snapshot};
 cityTimers.forEach(clearTimeout);cityTimers=[];['port','vendor','wedding'].forEach(k=>cues[k].pause());
 ui.ending.classList.remove('visible');ui.ending.hidden=true;updateUI();
}
function replay(){if(state.action||state.transition)return;state.phase[state.current]=0;state.travel[state.current]=0;state.completed[state.current]=false;ui.ending.classList.remove('visible');ui.ending.hidden=true;state.sceneStart=performance.now();updateUI();}
function drawAtlas(ctx,key,col,row,cols,rows,x,y,w,h,alpha=1,flip=false){const im=images[key];if(!im)return;const sw=im.width/cols,sh=im.height/rows;ctx.save();ctx.globalAlpha*=alpha;ctx.translate(x,y);if(flip)ctx.scale(-1,1);ctx.drawImage(im,col*sw,row*sh,sw,sh,-w/2,-h,w,h);ctx.restore();}
function drawBoat(ctx,key,cx,base,w,h,alpha=1,moving=false){
 const im=images[key];if(!im)return;ctx.save();ctx.globalAlpha*=alpha;ctx.translate(cx,base);
 ctx.save();ctx.globalAlpha*=.12;ctx.filter='blur(2px) saturate(.42)';ctx.scale(1,-.24);ctx.drawImage(im,-w/2,-h,w,h);ctx.restore();
 if(moving){ctx.save();ctx.globalAlpha*=.35;ctx.drawImage(images.wake,-w*.55,-6,w*1.1,16);ctx.restore();}
 ctx.drawImage(im,-w/2,-h,w,h);ctx.restore();
}
function restoreForegroundTree(ctx){
 const bg=images.bg2;if(!bg)return;
 ctx.save();ctx.beginPath();
 [[618,286],[645,246],[681,219],[726,228],[764,257],[778,302],[754,348],[730,387],[704,445],[670,474],[637,444],[621,388]].forEach(([x,y],n)=>n?ctx.lineTo(x,y):ctx.moveTo(x,y));
 ctx.closePath();ctx.clip();ctx.drawImage(bg,0,0,1000,562.5);ctx.restore();
}
function drawActors(now){
 const canvas=ui.actors,ctx=canvas.getContext('2d'),r=ui.stage.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,1.5);
 const w=Math.round(r.width*dpr),h=Math.round(r.height*dpr);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
 ctx.setTransform(w/1000,0,0,h/562.5,0,0);ctx.clearRect(0,0,1000,562.5);
 const i=state.current,local=(now-state.sceneStart)/1000,p=progress(now),phase=state.phase[i],moving=!!state.action;
 const weight=state.transition?smooth((now-state.transition.start)/state.transition.duration):1;
 if(state.transition?.snapshot){ctx.save();ctx.globalAlpha=1-weight;ctx.drawImage(state.transition.snapshot,0,0,1000,562.5);ctx.restore();}
 ctx.save();ctx.globalAlpha=weight;
 const bob=moving?Math.sin(local*1.25)*.6:0;
 if(i===0)drawBoat(ctx,'boat1',lerp(530,893,smooth(p)),445+bob,213,82,1,moving);
 if(i===1){
  const dock=phase===0?smooth(p):1;
  drawBoat(ctx,'boat2',lerp(1110,903,smooth(Math.max(0,(dock-.12)/.88))),384,128,94,1,moving&&phase===0);
  drawBoat(ctx,'boat2',lerp(1150,878,dock),485+bob,205,150,1,moving&&phase===0);
  // Nobody walks until docking has completed AND the visitor clicks 搬运货物.
  if(phase===2){
   const elapsed=state.action?(now-state.action.start)/1000:26;
   const poses=[0,1,2].map(j=>({...cargoPose(p,j),j})).sort((a,b)=>a.y-b.y);
   for(const a of poses){
    if(a.alpha<=0)continue;
    const frame=Math.floor(elapsed*5+a.j)%4;
    if(a.picking)drawAtlas(ctx,'loaders',Math.min(2,Math.floor(a.pickup*3)),0,4,2,a.x,a.y,a.height,a.height,a.alpha);
    else drawAtlas(ctx,'workers',frame,a.returning?1:0,4,2,a.x,a.y,a.height,a.height,a.alpha,a.dx<0);
   }
   restoreForegroundTree(ctx);
  }
 }
 if(i===2&&(moving||state.completed[2])){
  const elapsed=moving?(now-state.action.start)/1000:0;
  const porters=[0,1,2,3].map(j=>({...portPose(p,j),j})).sort((a,b)=>a.y-b.y);
  for(const a of porters){
   if(a.alpha<=0)continue;
   const frame=moving?Math.floor(elapsed*(a.picking?3:5)+a.j)%4:1;
   const sheet=a.picking?'loaders':a.returning?'loaders':'workers';
   const row=a.returning?1:0;
   drawAtlas(ctx,sheet,frame,row,4,2,a.x,a.y,27,36,a.alpha,a.returning?a.dx>0:a.dx<0);
  }
 }
 if(i===3){drawBoat(ctx,'boat4',lerp(604,422,smooth(p)),525+bob,185,83,1,moving);drawBoat(ctx,'small',lerp(822,905,smooth(p)),399,95,39,1,moving);}
 if(i===4){
  const fade=1-smooth((p-.6)/.4);
  ctx.save();
  ctx.globalAlpha*=.72*(1-smooth((p-.52)/.22));
  ctx.filter='grayscale(.66) saturate(.48) brightness(.73)';
  ctx.drawImage(images.distantBoat,687-100*smooth(p/.72),194+48*p,113-60*p,88-50*p);
  ctx.restore();
  drawBoat(ctx,'boat5',lerp(300,730,p),476-180*p,lerp(375,60,p),lerp(230,38,p),fade,moving);
 }
 ctx.restore();
}
function tick(now){
 if(state.action&&progress(now)>=1)finishAction();
 if(state.transition&&now-state.transition.start>=state.transition.duration){state.transition=null;updateUI();if(state.current===4&&state.completed[4]){ui.ending.hidden=false;ui.ending.classList.add('visible');}}
 const t=state.transition,weight=t?smooth((now-t.start)/t.duration):1;
 [...ui.bgs.children].forEach((b,n)=>{b.style.transition='none';b.style.zIndex=n===state.current?'1':'0';b.style.opacity=n===state.current?weight:t&&n===t.from?1:0;});
 // During the dissolve use only the blended paintings, so old water never overlays incoming land.
 water.update(now/1000,state.current,-1,t?0:1);
 drawActors(now);requestAnimationFrame(tick);
}
function openCard(card){state.lastFocus=document.activeElement;ui.modalKicker.textContent=`第${['一','二','三','四','五'][state.current]}幕 · 文化笔记`;ui.modalTitle.textContent=card.title;ui.modalText.textContent=card.text;ui.modalNote.textContent=card.note||'';ui.modalNote.hidden=!card.note;ui.modalArt.style.backgroundImage=`url('${A+assets['bg'+(state.current+1)]}')`;ui.sources.replaceChildren();(card.sources||[]).forEach(s=>{const el=document.createElement(s.url?'a':'span');if(s.url){el.href=s.url;el.target='_blank';el.rel='noopener noreferrer';}el.textContent=`资料来源：${s.label}${s.url?' ↗':''}`;ui.sources.append(el);});ui.modal.hidden=false;ui.modalClose.focus();}
function closeCard(){if(ui.modal.hidden)return;ui.modal.hidden=true;state.lastFocus?.focus?.();}
class Loop{constructor(src,vol){this.audio=new Audio(src);this.audio.preload="none";this.audio.loop=true;this.audio.volume=vol;this.vol=vol;}start(){this.audio.volume=this.vol;this.audio.play().catch(()=>{});}stop(){this.audio.pause();this.audio.currentTime=0;}}
const ambience=[new Loop(A+'audio/01-water-synthetic.wav',.13),new Loop(A+'audio/02-wind-synthetic.wav',.045)];const cues={port:new Audio(A+'audio/03-port-murmur-stylized.wav'),wood:new Audio(A+'audio/04-wood-creak-synthetic.wav'),rope:new Audio(A+'audio/05-rope-friction-synthetic.wav'),vendor:new Audio(A+'audio/叫卖-茶水.wav'),wedding:new Audio(A+'audio/迎亲吹奏-合成.wav')};Object.values(cues).forEach(audio=>audio.preload="none");let cityTimers=[];
function playCue(a,vol=.2){if(!state.sound)return;const c=cues[a];if(c){c.currentTime=0;c.volume=vol;c.play().catch(()=>{});}}
function applySound(enabled){
 const changed=state.sound!==enabled;state.sound=enabled;
 ui.soundLabel.textContent=state.sound?'关闭声音':'开启声音';ui.sound.setAttribute('aria-label',ui.soundLabel.textContent);ui.sound.setAttribute('aria-pressed',String(state.sound));
 if(!changed)return;
 if(state.sound){ambience.forEach(a=>a.start());if(state.current===1)citySound();}
 else{ambience.forEach(a=>a.stop());Object.values(cues).forEach(a=>{a.pause();a.currentTime=0;});cityTimers.forEach(clearTimeout);cityTimers=[];}
}
function syncJourneySound(s){applySound(state.started&&s.started&&!s.muted&&!document.hidden);}
function toggleSound(){if(window.JourneySfx){window.JourneySfx.toggle();return;}applySound(!state.sound);}
const unsubscribeSound=window.JourneySfx?.subscribe(syncJourneySound);
window.addEventListener('pagehide',()=>{unsubscribeSound?.();applySound(false);water.dispose?.();});
function citySound(){if(!state.sound||state.current!==1)return;playCue('port',.22);playCue('vendor',.26);playCue('wedding',.15);cityTimers=[setTimeout(()=>playCue('vendor',.23),8500),setTimeout(()=>playCue('wedding',.14),14500)];}

function bind(){
 ui.start.onclick=()=>{if(!state.ready)return;state.started=true;ui.intro.classList.add('closed');if(window.JourneySfx){window.JourneySfx.start();syncJourneySound(window.JourneySfx.state());}else applySound(true);state.transition={from:0,start:performance.now(),duration:950,intro:true};updateUI();};
 ui.sound.onclick=toggleSound;ui.primary.onclick=perform;ui.prev.onclick=()=>navigate(state.current-1);ui.next.onclick=()=>navigate(state.current+1);ui.skip.onclick=finishAction;ui.replay.onclick=replay;ui.knowledge.onclick=()=>openCard(SCENES[state.current].card);ui.modalClose.onclick=closeCard;ui.modal.onclick=e=>{if(e.target===ui.modal)closeCard();};
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeCard();return;}if(!state.started||!ui.modal.hidden||state.action||state.transition)return;if(e.key==='ArrowLeft')navigate(state.current-1);if(e.key==='ArrowRight')navigate(state.current+1);});
 let start=null;ui.stage.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;start={x:e.clientX,y:e.clientY};});ui.stage.addEventListener('pointerup',e=>{if(!start||!state.started||state.action||state.transition)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.4)navigate(state.current+(dx<0?1:-1));});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)applySound(false);else if(window.JourneySfx)syncJourneySound(window.JourneySfx.state());});
}
setup();bind();updateUI();
loading.then(()=>{state.ready=true;ui.start.disabled=false;ui.start.textContent='开始行舟 →';updateUI();requestAnimationFrame(tick);}).catch(e=>{console.error(e);ui.start.textContent='素材载入失败，请刷新重试';ui.status.textContent=`素材读取失败：${e.message}`;});
// Optional water rendering must not block loading the rest of the experience.
import('./water-scene.js').then(({WaterScene})=>{water=new WaterScene(ui.stage,console.warn);}).catch(e=>console.warn('水面暂不可用，其他交互正常。',e));

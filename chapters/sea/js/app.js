import {createSceneUI} from './scene-ui.js?v=20261018-sea3';
import {smooth,lerp,cargoPose,portPose} from './motion.js?v=20261012-11';
import {ShipInspection} from './ship-inspection.js?v=20261018-sea3';
const A='assets/';
const SOURCES={
 river:{label:'浙江省交通运输厅｜温州—丽水海河联运启航（2024）',url:'https://jtyst.zj.gov.cn/art/2024/12/27/art_1229304975_59039943.html'},
 port:{label:'梁岩华《走近温州朔门古港遗址》，《人民日报》2023年4月15日第6版',url:'https://paper.people.com.cn/rmrb/html/2023-04/15/nw.D110000renmrb_20230415_1-06.htm'},
 towers:{label:'温州市文化广电旅游局｜江心屿双塔',url:'https://wl.wenzhou.gov.cn/art/2020/11/13/art_1229438201_58884370.html'},
 book:{label:'褚子婧《宋元时期温州港口及其相关城市建设研究》，东南大学硕士学位论文',url:null},
 sediment:{label:'韦鑫等《瓯江口朔门港沉积环境演变与温州港城关系初探》',url:null},
 wreck:{label:'应忠彭《一艘宋代沉船的千年“船”奇》，《浙江日报》2026年5月22日第006版',url:'https://zjnews.zjol.com.cn/zjnews/202605/t20260522_31677706.shtml?mode=m2pc'},
 painting:{label:'《江山胜览图》画作局部',url:null},
 qiu:{label:'邱志诚《宋代温州市舶务设置时间考辨》，《浙江海洋学院学报（人文科学版）》2013年第30卷第6期，第5—8页',url:null},
 yang:{label:'杨蟠《孤屿山》，载《孤屿志》卷三《诗》',url:null},
 wei2025:{label:'Wei Xin等，Hydrodynamic processes and extreme events recognized from the sedimentary records at ancient Port Shuomen in the Oujiang River mouth, Southeast China，Marine Geology，2025，486：107562',url:'https://doi.org/10.1016/j.margeo.2025.107562'},
 ou:{label:'温州博物馆《永嘉青瓷窑址专题调查成果喜人》',url:'https://www.wzmuseum.cn/Art/Art_85/Art_85_4021.aspx'},
 ceramics:{label:'梁岩华、朱冠星《温州朔门古港遗址出土商品瓷浅析及相关问题探讨》，《故宫博物院院刊》2025年第7期',url:'https://www.dpm.org.cn/journal/372404.html'},
 ceramicsPhoto:{label:'新华社《实证千年商港 再现“海丝”繁华》，2023年3月30日；朔门古港遗址出土陶瓷器照片，翁忻旸摄',url:'https://www.xinhuanet.com/2023-03/30/c_1129479017.htm'}
};
const SCENES=[
 {title:'循江而来',lead:'循着江水向东，山地与港城由此相连。',action:'启程',card:{title:'瓯江：山水之间的航运通道',text:'瓯江流经浙南山地，连接丽水、温州并汇入东海。温州港的兴衰也与河口泥沙、岸线变迁及港城建设有关。有关研究梳理了朔门港沉积环境演变与温州港城发展的关系。',note:'长卷里的航行路线用于串联五幕场景，不代表一条已考定的宋元航线。',sources:[SOURCES.river,SOURCES.sediment]},hotspots:[
  {x:27,y:72,label:'瓯江水路',icon:'水',title:'山水连接港城',text:'瓯江下游连接山地、河口与东海。图中以地形、水系和河口分区呈现这一空间关系：从河流作用占优势的上段，经过河流与海洋作用的过渡区，走向海洋作用占优势的下段。',figure:'terrain',sources:[SOURCES.sediment,SOURCES.wei2025]},
  {x:76,y:59,label:'港口与河口',icon:'港',title:'港口随水岸而变',text:'河口水深、泥沙淤积和岸线变化会影响船只停泊与港口空间。朔门港相关研究从沉积环境变化讨论了港城关系。',figure:'shoreline',sources:[SOURCES.sediment]}
 ]},
 {title:'临江入城',lead:'船只靠近江岸，水路与城中街巷相接。',action:'让船靠岸',card:{"title": "从《江山胜览图》到临江入城", "text": "本幕从原画中提取岸边行旅、轿舆队伍、临时摊位与沿街商铺，重新组织为可交互的临江街市。点击画面中的四个“译”字标记，可以对照原画局部与本幕对应区域。", "figure": "translation", "image": "江山胜览图-沿岸场景.png", "rect": [0, 0, 100, 100], "sources": [SOURCES.painting]},hotspots:[
  {"x": 83, "y": 57, "label": "沿岸入城", "icon": "译", "title": "从原画的岸边行旅到临江入城", "text": "原画中，舟船停在岸边，岸上分布着建筑、树木与行旅人物。本幕借鉴舟岸相接、人物沿路活动的组织方式，将其转译为船只靠岸、货物进入街市的连续场景。", "image": "江山胜览图-沿岸场景.png", "rect": [73, 43, 25, 48], "figure": "translation", "sources": [SOURCES.painting]},
  {"x": 83, "y": 24, "label": "迎亲转译", "icon": "译", "title": "从轿舆与行旅队伍到迎亲场景", "text": "原画局部可见轿舆、挑担与行旅队伍。本幕提取队伍沿街行进的构图与人物组合，创作了远处的迎亲场景，并加入锣鼓声与渐入动画。迎亲情节是本作的叙事设计。", "image": "江山胜览图-行旅队伍.png", "rect": [72, 15, 22, 22], "figure": "translation", "sources": [SOURCES.painting]},
  {"x": 49, "y": 58, "label": "临时摊位", "icon": "译", "title": "从简易凉棚到街边茶摊", "text": "原画局部以立柱、棚顶与牵绳搭起临时凉棚，棚下聚集人物。本幕借鉴棚架与人物围聚的形式，将其转译为前景茶摊，并加入叫卖声与人物活动。", "image": "江山胜览图-棚亭人物局部.png", "rect": [36, 50, 29, 24], "figure": "translation", "sources": [SOURCES.painting]},
  {"x": 24, "y": 47, "label": "沿街商铺", "icon": "译", "title": "从画中街市到沿街商铺", "text": "原画局部呈现临街建筑、檐下空间以及行人、挑担者。本幕提取店铺沿街排列、人物在店前停留与穿行的关系，转译为左侧的商铺与街市活动；色彩、货物与动态人物由本作重新组织。", "image": "江山胜览图-街市人物局部.png", "rect": [10, 25, 34, 29], "figure": "translation", "sources": [SOURCES.painting]},
  {x:28,y:36,label:'港口管理',icon:'贸',title:'南宋温州的市舶管理',text:'市舶机构管理海外贸易，承担货物征税（抽解）、官府收购（博买）、相关货物存储、船舶查验与商船公凭发给，以及外商接待等事务。港口由此连接起停泊、贸易与城市管理。\n\n温州在南宋设有市舶务。邱志诚考证，其初设时间应在建炎二年至四年（1128—1130）之间。',note:'图示为市舶机构的建置时间与分布，画面中的热点位置仅作为交互入口，不代表市舶机构的实际建筑位置。',figure:'shibo',sources:[SOURCES.book,{label:'图示底图：《中国古代地图历史地图集册》',url:null},SOURCES.qiu]}
 ]},
 {title:'朔门集舟',lead:'船舶停靠江岸，货物经由码头装载。',action:'开始装卸',card:{title:'宋代船舶与朔门港的装载线索',text:'朔门港遗址发现宋代沉船及码头遗存。二号沉船现存船体残长约15.9米、宽约4.26米；整船约20米长、约6米宽属于研究推估。船体舱壁和分舱结构，为认识宋代木船建造与港口运输提供了实物线索。',note:'残存尺寸与复原推估分别标示；长卷中的船只不是沉船的精确复原。',sources:[SOURCES.port,SOURCES.book,SOURCES.wreck]},hotspots:[
  {"x": 33, "y": 59, "label": "城与港", "icon": "城", "title": "朔门古港位于古城北侧", "text": "拱辰门区域位于朔门古港遗址西端南侧，为古城北门拱辰门外。遗迹群包括宋元和明清时期的瓮城、出城道路、石砌建筑或院墙以及不同时期的码头。图中可对照瓮城、道路、7号码头、9号码头与木栈道的位置，理解港区与古城的空间联系。", "figure": "portLayout", "sources": [{"label": "褚子婧《宋元时期温州港口及其相关城市建设研究》§4.1，第47—48页，图4-2", "url": null}]},
  {x:72,y:74,label:'码头设施',icon:'港',title:'码头见证停泊与装卸',text:'码头连接水路与陆路，供船舶停泊、货物装卸、旅客上下与补充给养。朔门古港遗址发现石砌码头与栈桥式码头两种结构。\n\n9号码头采用石边土心结构，并以底部木桩、侧边横木适应滩涂软土环境；其东侧栈桥式码头遗迹保留了7组等距桩基及横梁构件。木桩与横梁支承栈桥，使岸上道路能够向停泊船只延伸。',figure:'dock',sources:[{label:'褚子婧《宋元时期温州港口及其相关城市建设研究》§4.1.1“泊船码头”，第48—49页',url:null},SOURCES.painting]}
 ]},
 {title:'双塔引航',lead:'船行开阔江面，江心屿双塔渐渐显现。',action:'扬帆起航',card:{title:'江心屿双塔：江面上的方向标志',text:'江心屿位于瓯江之中，东西双塔是温州历史地标。地方资料记载，往来船只曾以双塔辨认温州方向。双塔为砖塔建筑，成为江面与城市之间醒目的视觉参照。',note:'“引航”指地标帮助辨认方位，不代表现代灯塔设备或主动导航。',sources:[SOURCES.towers,SOURCES.book]},hotspots:[
  {"x": 31, "y": 43, "label": "东西双塔", "icon": "塔", "title": "江心双塔：江面上的参照", "text": "江心屿的东西双塔是瓯江江面上醒目的地标。杨蟠《孤屿山》有“塔灯相对影，夜夜照蛟龙”之句，写出塔灯与江面相映的景象。\n\n左侧原画局部可见峰石、楼阁、塔影与舟船。本幕借鉴这种岛屿与船只相互映衬的构图，以双塔作为航行中的视觉焦点，将原画意象转译为江心屿场景。", "figure": "islandPainting", "sources": [SOURCES.towers,SOURCES.yang,SOURCES.painting]},
  {"x": 56, "y": 64, "label": "辨认方向", "icon": "航", "title": "从海上标志到入江航路", "text": "从外海进入瓯江，船只需要借助可辨识的岛屿、山峰与塔影判断方向。古代方志记录了岛屿、山峰等航行参照；江心屿双塔也曾帮助往来船只辨认温州方向。\n\n图2-3以海防图为底图标示瓯江入海口航线，可帮助理解外海、河口与府城之间的联系。岛屿与塔影帮助辨认方位，进入河口后的航行还与水道条件有关。", "note": "此图依据清代海防底图绘制，为航线示意，不是宋元时期的实测航道图。", "figure": "estuaryRoute", "sources": [{"label": "（永乐）《乐清县志》卷二《山川》；（光绪）《永嘉县志》卷首《海防图》", "url": null},{"label": "航线示意绘图：褚子婧《宋元时期温州港口及其相关城市建设研究》图2-3，第22页", "url": null},SOURCES.towers]}
 ]},
 {title:'一江通海',lead:'江道渐宽，船载器物由此走向更远的海路。',action:'驶向江海',card:{title:'瓯窑与龙泉青瓷：港口流通的器物线索',text:'温州本地瓯窑与龙泉窑青瓷是不同窑口。瓯窑在宋元时期持续发展；朔门古港出土的陶瓷遗存也包括龙泉窑产品。港口与内河水路为瓷器流通和海上贸易提供了交通条件。',note:'瓯窑和龙泉窑不可混称；长卷中的货物画面不对应某艘沉船的确切货单。',sources:[SOURCES.ou,SOURCES.ceramics,SOURCES.port]},hotspots:[
  {"x": 75, "y": 62, "label": "港口瓷器", "icon": "瓷", "title": "港口里的瓷器：多种窑口汇聚", "text": "朔门古港出土瓷器以龙泉窑系产品为主，同时包含瓯窑等其他窑口。不同产地的瓷器在港口汇聚，留下了商品流通与贸易往来的线索。", "figure": "ceramics", "sources": [SOURCES.ceramics,SOURCES.port,SOURCES.ceramicsPhoto]},
  {x:25,y:78,label:'古今水路',icon:'江',title:'从内陆窑场到海上航路',text:'宋元时期，龙泉窑瓷器的一条运输通道沿龙泉溪进入瓯江，经青田等地运抵温州港。内陆窑场、沿江城镇与海港，由水路相互连接。图中运输路线为研究推测。',note:'古今水路：2024年，温州七里港至青田温溪港集装箱海河联运航线启航，为瓯江水路在当代的运输功能提供了实例。',figure:true,sources:[{label:'褚子婧《宋元时期温州港口及其相关城市建设研究》§2.3，第30—31页、图2-10',url:null},{label:'图2-10底图：《中国古代地图历史地图集册》南宋时期',url:null},SOURCES.river]}
 ]}
];
const byId=id=>document.getElementById(id);
const ui={stage:byId('stage'),nav:byId('chapterNav'),bgs:byId('backgrounds'),actors:byId('actorsCanvas'),count:byId('sceneCount'),eyebrow:byId('chapterEyebrow'),title:byId('chapterTitle'),lead:byId('chapterLead'),status:byId('actionStatus'),primary:byId('primaryButton'),prev:byId('previousButton'),next:byId('nextButton'),skip:byId('skipButton'),replay:byId('replayButton'),knowledge:byId('knowledgeButton'),modal:byId('modalBackdrop'),modalClose:byId('modalClose'),modalArt:byId('modalArt'),modalKicker:byId('modalKicker'),modalTitle:byId('modalTitle'),modalText:byId('modalText'),modalNote:byId('modalNote'),sources:byId('modalSources'),intro:byId('intro'),start:byId('startButton'),sound:byId('soundButton'),soundLabel:byId('soundLabel'),ending:byId('ending')};

const state={current:0,unlocked:0,phase:[0,0,0,0,0],completed:[false,false,false,false,false],travel:[0,0,0,0,0],started:false,ready:false,sound:false,action:null,transition:null,lastFocus:null,sceneStart:performance.now()};
let shipPausedAt=null;
let updateSceneUI=()=>{};
const shipInspection=new ShipInspection({sceneAudio:true,soundEnabled:()=>state.sound,toggleSound:()=>toggleSound(),onOpen(){shipPausedAt=performance.now();},onClose(){if(state.action&&shipPausedAt!==null)state.action.start+=performance.now()-shipPausedAt;shipPausedAt=null;document.querySelector('[data-ship]')?.classList.add('observed');updateUI();}});
let water={update(){}};
const images={};
const WEDDING_FADE=3200;
const WEDDING_MUSIC_FADE_START=22500;
const WEDDING_MUSIC_FADE_DURATION=2000;
let wedding={start:null};
const assets={boat1:'ships/01-向右货舟.png',boat2:'ships/02-靠岸货船.png',boat4:'ships/04-行航帆船.png',boat5:'ships/05-远行海船.png',distantBoat:'ships/05-远处双帆小舟.png',small:'ships/04-小舟.png',wake:'sprites/船行水纹.png',workers:'sprites/02-空手与搬货-4列2行.png',loaders:'sprites/03-装卸-4列2行.png'};
for(let i=1;i<=5;i++)assets['bg'+i]=`backgrounds/0${i}-净底图.png`;
assets.cityClean='backgrounds/02-迎亲空街.png';
function prepareWeddingLayers(){
 const original=images.bg2,make=()=>{const c=document.createElement('canvas');c.width=original.width;c.height=original.height;return c;};
 const mask=make(),m=mask.getContext('2d');m.scale(mask.width/1000,mask.height/562.5);m.filter='blur(7px)';m.fillRect(738,149,177,81);
 const masked=(source)=>{const c=make(),ctx=c.getContext('2d');ctx.drawImage(source,0,0,c.width,c.height);ctx.globalCompositeOperation='destination-in';ctx.drawImage(mask,0,0);return c;};
 images.weddingLayer=masked(original);
 const base=make(),ctx=base.getContext('2d');ctx.drawImage(original,0,0);ctx.drawImage(masked(images.cityClean),0,0);images.bg2=base;
 ui.bgs.children[1].src=base.toDataURL('image/png');
}
function weddingOpacity(now){return wedding.start===null?0:smooth((now-wedding.start)/WEDDING_FADE);}
function weddingMusicLevel(now){if(wedding.start===null||state.completed[1])return 0;return weddingOpacity(now)*(1-smooth((now-wedding.start-WEDDING_MUSIC_FADE_START)/WEDDING_MUSIC_FADE_DURATION));}
function beginWedding(){wedding={start:performance.now()};startWeddingAudio();}
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
 const layer=document.querySelector('.hotspot-layer');
 layer.hidden=!state.started||!state.ready||!!state.transition||(state.current===4&&state.completed[4]);
 if(layer.dataset.scene!==String(state.current)){
  layer.dataset.scene=state.current;
  layer.innerHTML=SCENES[state.current].hotspots.map((h,i)=>`<button class="hotspot" type="button" data-hot="${i}" style="left:${h.x}%;top:${h.y}%"><span class="hotspot-icon">${h.icon}</span>${h.label}</button>`).join('')+(state.current===2?'<button class="ship-ripple" type="button" data-ship aria-label="点击船，观察王振鹏画中的船舶"><i aria-hidden="true"></i><span>点船观形</span></button>':'');
  layer.querySelectorAll('[data-hot]').forEach(b=>b.onclick=()=>openCard(SCENES[state.current].hotspots[+b.dataset.hot]));
  const shipButton=layer.querySelector('[data-ship]');if(shipButton)shipButton.onclick=()=>shipInspection.open();
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
 ui.stage.classList.toggle('transitioning',!!state.transition);hotspots();updateSceneUI();
}
function progress(now){return state.action?Math.max(0,Math.min(1,(now-state.action.start)/state.action.duration)):state.travel[state.current];}
function complete(){const i=state.current;state.travel[i]=1;state.completed[i]=true;if(i<4)state.unlocked=Math.max(state.unlocked,i+1);state.action=null;if(i===1){cues.wedding.pause();cues.wedding.currentTime=0;fadeOutCity();}if(i===2)fadeOutAudio(thirdWater);updateUI();if(i===4){ui.ending.hidden=false;requestAnimationFrame(()=>ui.ending.classList.add('visible'));}}
function runAction(label,duration,callback){if(state.action||state.transition)return;state.action={label,duration,start:performance.now(),callback};if(state.sound&&isSailing())sailingSound.start();updateUI();}
function finishAction(){if(!state.action)return;const from=state.current,fn=state.action.callback,keepDockWater=from===1;state.travel[from]=1;state.action=null;if(from!==0&&!keepDockWater)sailingSound.stop();fn();if(from===0&&!state.transition)sailingSound.stop();}
function perform(){
 if(!state.started||!state.ready||state.action||state.transition||!ui.modal.hidden||shipInspection.isOpen||state.completed[state.current])return;
 const i=state.current;
 if(i===0)runAction('小舟向右启程…',8500,()=>complete());
 else if(i===1){
  if(state.phase[i]===0){citySound();runAction('两艘船缓缓靠岸…',10000,()=>{state.phase[i]=1;state.travel[i]=0;updateUI();});}
  else{state.phase[i]=2;runAction('沿岸道取货，沿原路返回…',26000,complete);beginWedding();}
 }else if(i===2){playCue('rope',.13);runAction('搬运、装载与系缆…',9000,complete);}
 else if(i===3)runAction('扬帆驶过双塔…',11000,complete);
 else runAction('船帆渐远，驶向江海…',20000,complete);
}
function navigate(i){
 if(state.action||state.transition||shipInspection.isOpen||i<0||i>state.unlocked||i>4||i===state.current)return;
 closeCard();const snapshot=document.createElement('canvas');snapshot.width=ui.actors.width;snapshot.height=ui.actors.height;snapshot.getContext('2d').drawImage(ui.actors,0,0);
 const old=state.current;state.current=i;state.sceneStart=performance.now();state.transition={from:old,start:performance.now(),duration:3200,snapshot};
 stopCitySound();if(!(old===0&&i===1))sailingSound.stop();
 if(i===1&&state.sound)startMarket(0);
 thirdWater.stop();if(i===2)startThirdWater();
 ui.ending.classList.remove('visible');ui.ending.hidden=true;updateUI();
}
function replay(){if(state.action||state.transition)return;state.phase[state.current]=0;state.travel[state.current]=0;state.completed[state.current]=false;state.sceneStart=performance.now();if(state.current===1){stopCitySound();sailingSound.stop();wedding={start:null};citySound();}if(state.current===2){thirdWater.stop();startThirdWater();}ui.ending.classList.remove('visible');ui.ending.hidden=true;updateUI();}
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
  ctx.save();ctx.globalAlpha*=weddingOpacity(now);ctx.drawImage(images.weddingLayer,0,0,1000,562.5);ctx.restore();
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
 if(!shipInspection.isOpen&&state.action&&progress(now)>=1)finishAction();
 for(let n=audioFades.length-1;n>=0;n--){const fade=audioFades[n],amount=Math.max(0,Math.min(1,(now-fade.start)/fade.duration));fade.audio.volume=fade.from+((fade.to??0)-fade.from)*smooth(amount);if(amount>=1){if((fade.to??0)===0){fade.audio.pause();fade.audio.currentTime=0;}audioFades.splice(n,1);}}
 if(state.current===1&&state.sound&&!state.completed[1]&&!state.transition){
  const voice=cues.vendor,remaining=Number.isFinite(voice.duration)?voice.duration-voice.currentTime:Infinity;
  const voiceLevel=voice.paused?0:smooth(voice.currentTime/.7)*smooth(remaining/.9);
  voice.volume=.08*voiceLevel;
  if(marketOn)cityMarket.audio.volume=lerp(cityMarket.audio.volume,cityMarket.vol*(1-.28*voiceLevel),.12);
 }
 if(state.current===1&&state.sound&&wedding.start!==null){const level=weddingMusicLevel(now);cues.wedding.volume=.24*level;if(level===0&&!cues.wedding.paused){cues.wedding.pause();cues.wedding.currentTime=0;}}
 if(state.transition&&now-state.transition.start>=state.transition.duration){const firstToCity=state.transition.from===0&&state.current===1;state.transition=null;updateUI();if(firstToCity)sailingSound.stop();if(state.current===1){if(state.sound)cityMarket.audio.volume=cityMarket.vol;citySound();}if(state.current===2)startThirdWater();if(state.current===4&&state.completed[4]){ui.ending.hidden=false;ui.ending.classList.add('visible');}}
 const t=state.transition,weight=t?smooth((now-t.start)/t.duration):1;
 // The inscription uses the same dissolve clock as the incoming painting.
 const poem=document.querySelector('.paper-poem');
 if(poem){
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  poem.style.opacity=String(weight);
  // A feathered ink front spreads out through the paper, then settles into type.
  const radius=weight*155;
  const mask=weight>=1||reduced?'none':`radial-gradient(ellipse at 50% 42%, #000 0%, #000 ${Math.max(0,radius-38).toFixed(2)}%, transparent ${Math.max(.1,radius).toFixed(2)}%)`;
  poem.style.maskImage=mask;poem.style.webkitMaskImage=mask;
  poem.style.filter=weight<1&&!reduced?'blur('+(6*(1-weight)*(1-weight)).toFixed(2)+'px)':'none';
 }
 if(t&&state.current===1&&state.sound){if(t.from===0)sailingSound.audio.volume=sailingSound.vol*(1-weight);cityMarket.audio.volume=cityMarket.vol*weight;}
 [...ui.bgs.children].forEach((b,n)=>{b.style.transition='none';b.style.zIndex=n===state.current?'1':'0';b.style.opacity=n===state.current?weight:t&&n===t.from?1:0;});
 // During the dissolve use only the blended paintings, so old water never overlays incoming land.
 water.update(now/1000,state.current,-1,t?0:1);
 drawActors(shipPausedAt??now);requestAnimationFrame(tick);
}
function openCard(card){state.lastFocus=document.activeElement;ui.modalKicker.textContent=`第${['一','二','三','四','五'][state.current]}幕 · 文化笔记`;ui.modalTitle.textContent=card.title;ui.modalText.textContent=card.text;ui.modalNote.textContent=card.note||'';ui.modalNote.hidden=!card.note;ui.modalArt.style.backgroundImage=`url('${A+assets['bg'+(state.current+1)]}')`;ui.modal.querySelector('.knowledge-panel').classList.toggle('has-route-figure',!!card.figure);
 ui.modalArt.replaceChildren();
 if(card.figure){
  ui.modalArt.style.backgroundImage='none';
  const figure=document.createElement('figure');figure.className='route-figure'+(card.figure==='shibo'||card.figure===true?' route-figure--tall':'');
  const link=document.createElement('a');link.href=A+'heritage/图2-10-龙泉窑运输路线.png';link.target='_blank';link.rel='noopener';link.title='打开大图';
  const img=document.createElement('img');img.src=link.href;img.alt='图2-10 龙泉窑窑址、港址和三路运输路线推测';link.append(img);figure.append(link);
  const caption=document.createElement('figcaption');caption.textContent='龙泉窑窑址、港址和三路运输路线推测';figure.append(caption);ui.modalArt.append(figure);
  if(card.figure==='cityLife'){
   link.href=A+'heritage/江山胜览图-街市人物局部.png';img.src=link.href;img.alt='《江山胜览图》街市与人物局部';
   caption.textContent='《江山胜览图》局部：街市与人物。';
  }
  if(card.figure==='dock'){
   link.href=A+'heritage/江山胜览图-泊船岸边.png';img.src=link.href;img.alt='《江山胜览图》泊船与岸边活动局部';
   caption.textContent='《江山胜览图》局部：泊船与岸边活动。';
  }
  if(card.figure==='portLayout'){
   link.href=A+'heritage/图4-2-拱辰门区域.png';img.src=link.href;img.alt='温州朔门古港遗址拱辰门区域：瓮城、道路、码头和木栈道';
   caption.textContent='温州朔门古港遗址拱辰门区域：瓮城、道路、码头与木栈道';
  }
  if(card.figure==='translation'){
   link.href=A+'heritage/'+card.image;img.src=link.href;img.alt=card.title+'：原画局部';
   caption.textContent='《江山胜览图》原画局部';
   const comparison=document.createElement('figure');comparison.className='translation-comparison';
   const frame=document.createElement('div');frame.className='translation-frame';
   const scene=document.createElement('img');scene.src=A+assets.bg2;scene.alt='第二幕临江入城对应区域';frame.append(scene);
   const area=document.createElement('span');area.className='translation-area';area.setAttribute('aria-hidden','true');
   const [x,y,w,h]=card.rect;Object.assign(area.style,{left:x+'%',top:y+'%',width:w+'%',height:h+'%'});frame.append(area);
   const label=document.createElement('figcaption');label.textContent='本幕转译 · 金框标出对应区域';comparison.append(frame,label);ui.modalArt.append(comparison);
  }
  if(card.figure==='islandPainting'){
   link.href=A+'heritage/江山胜览图-岛屿塔影.png';img.src=link.href;img.alt='《江山胜览图》局部中的岛屿、塔影与舟船';
   caption.textContent='《江山胜览图》局部：岛屿、塔影与舟船。';
  }
  if(card.figure==='estuaryRoute'){
   link.href=A+'heritage/图2-3-瓯江入海口航线.png';img.src=link.href;img.alt='图2-3 瓯江入海口航线';
   caption.textContent='瓯江入海口航线示意';
  }
  if(card.figure==='shibo'){
   link.href=A+'heritage/图4-9-市舶司建设时间及分布.png';img.src=link.href;img.alt='图4-9 宋元时期市舶司建设时间及分布';
   caption.textContent='宋元时期市舶机构建设时间及分布';
  }
  if(card.figure==='ceramics'){
   link.href='https://www.xinhuanet.com/2023-03/30/1129479017_16801628544001n.jpg';img.src=link.href;img.alt='朔门古港遗址出土陶瓷器';
   caption.textContent='朔门古港遗址出土陶瓷器';
  }
  if(card.figure==='terrain'||card.figure==='shoreline'){
   const terrain=card.figure==='terrain';
   link.href=A+'heritage/'+(terrain?'图1a-瓯江口地貌.png':'图1b-朔门港岸线.png');img.src=link.href;
   img.alt=terrain?'原图1（a）：瓯江口地貌环境及本研究现代表层样品分布':'原图1（b）：朔门古港发掘区域和钻孔位置';
   caption.textContent='瓯江下游地貌及表层样采样点和钻孔分布（'+(terrain?'a':'b')+'）'+(terrain?'：瓯江口地貌与河口分区':'：朔门古港发掘区域和钻孔位置');
  }

 }else{const label=document.createElement('span');label.textContent='瓯江行旅';ui.modalArt.append(label);}
 ui.sources.replaceChildren();const sources=[...new Map((card.sources||[]).map(s=>[s.label,s])).values()];if(sources.length){const heading=document.createElement('strong');heading.className='source-heading';heading.textContent='资料来源';ui.sources.append(heading);}sources.forEach(s=>{const el=document.createElement(s.url?'a':'span');if(s.url){el.href=s.url;el.target='_blank';el.rel='noopener noreferrer';}el.textContent=`${s.label}${s.url?' ↗':''}`;ui.sources.append(el);});ui.modal.hidden=false;ui.modalClose.focus();}
function closeCard(){if(ui.modal.hidden)return;ui.modal.hidden=true;state.lastFocus?.focus?.();}
class Loop{constructor(src,vol){this.audio=new Audio(src);this.audio.preload='none';this.audio.loop=true;this.audio.volume=vol;this.vol=vol;}start(initialVolume=this.vol){audioFades=audioFades.filter(f=>f.audio!==this.audio);this.audio.volume=initialVolume;this.audio.play().catch(()=>{});}stop(){audioFades=audioFades.filter(f=>f.audio!==this.audio);this.audio.pause();this.audio.currentTime=0;}}
const sailingSound=new Loop(A+'audio/流水.mp3',.24);
const thirdWater=new Loop(A+'audio/流水.mp3',.24);
function startThirdWater(){if(!state.sound||state.current!==2||state.completed[2]||!thirdWater.audio.paused)return;thirdWater.start(0);audioFades.push({audio:thirdWater.audio,from:0,to:thirdWater.vol,start:performance.now(),duration:1800});}
const cityMarket=new Loop(A+'audio/集市.mp3',.32);
const cues={wood:new Audio(A+'audio/04-wood-creak-synthetic.wav'),rope:new Audio(A+'audio/05-rope-friction-synthetic.wav'),vendor:new Audio(A+'audio/吃茶来-自然版-第二句快接.mp3'),wedding:new Audio(A+'audio/娶亲.mp3')};
Object.values(cues).forEach(audio=>audio.preload='none');
cues.wedding.loop=true;
let cityTimers=[],cityActive=false,marketOn=false,audioFades=[];
function playCue(a,vol=.2){if(!state.sound)return;const c=cues[a];if(c){c.currentTime=0;c.volume=vol;c.play().catch(()=>{});}}
function isSailing(){return !state.transition&&((!!state.action&&(state.current===0||state.current===3||state.current===4))||(state.current===1&&!state.completed[1]&&(!!state.action||state.phase[1]>0)));}
function fadeOutAudio(target,duration=WEDDING_FADE){const audio=target instanceof Loop?target.audio:target;if(audio.paused)return;audioFades=audioFades.filter(item=>item.audio!==audio);audioFades.push({audio,from:audio.volume,start:performance.now(),duration});}
function fadeOutCity(){cityTimers.forEach(clearTimeout);cityTimers=[];cityActive=false;marketOn=false;fadeOutAudio(cityMarket);fadeOutAudio(sailingSound);fadeOutAudio(cues.vendor);}
function startWeddingAudio(){if(!state.sound||state.current!==1||wedding.start===null||state.completed[1]||performance.now()-wedding.start>=WEDDING_MUSIC_FADE_START+WEDDING_MUSIC_FADE_DURATION)return;cues.wedding.volume=.24*weddingMusicLevel(performance.now());cues.wedding.play().catch(()=>{});}
function startMarket(volume=cityMarket.vol){if(!state.sound||state.current!==1||state.completed[1]||marketOn)return;cityMarket.start(volume);marketOn=true;}
function stopCitySound(){cityTimers.forEach(clearTimeout);cityTimers=[];cityMarket.stop();['vendor','wedding'].forEach(k=>{audioFades=audioFades.filter(f=>f.audio!==cues[k]);cues[k].pause();cues[k].currentTime=0;});cityActive=false;marketOn=false;}
function playVendor(){if(!state.sound||state.current!==1||state.completed[1])return;const voice=cues.vendor;voice.pause();voice.currentTime=0;voice.volume=0;voice.play().catch(()=>{});}
function citySound(){
 if(!state.sound||state.current!==1||state.completed[1]||cityActive||state.transition)return;
 cityActive=true;startMarket();
 cityTimers=[
  setTimeout(playVendor,Math.max(0,5000-(performance.now()-state.sceneStart)))
 ];
 startWeddingAudio();
}
function applySound(enabled){const changed=state.sound!==Boolean(enabled);state.sound=Boolean(enabled);ui.soundLabel.textContent=state.sound?'关闭声音':'开启声音';ui.sound.setAttribute('aria-label',ui.soundLabel.textContent);if(changed){if(state.sound){startThirdWater();if(isSailing())sailingSound.start();if(state.current===1&&!state.completed[1]){if(state.transition){const weight=smooth((performance.now()-state.transition.start)/state.transition.duration);if(state.transition.from===0)sailingSound.start(sailingSound.vol*(1-weight));startMarket(cityMarket.vol*weight);}else citySound();}}else{thirdWater.stop();sailingSound.stop();stopCitySound();Object.values(cues).forEach(a=>{a.pause();a.currentTime=0;});}}shipInspection.syncSound();}
function syncJourneySound(sound){applySound(state.started&&sound.started&&!sound.muted&&!document.hidden);}
function toggleSound(){if(window.JourneySfx){window.JourneySfx.toggle();return;}applySound(!state.sound);}
const unsubscribeSound=window.JourneySfx?.subscribe(syncJourneySound);


function bind(){
 ui.start.onclick=()=>{if(!state.ready)return;state.started=true;ui.intro.classList.add('closed');if(window.JourneySfx){window.JourneySfx.start();syncJourneySound(window.JourneySfx.state());}else applySound(true);state.transition={from:0,start:performance.now(),duration:950,intro:true};updateUI();};
 ui.sound.onclick=toggleSound;ui.primary.onclick=perform;ui.prev.onclick=()=>navigate(state.current-1);ui.next.onclick=()=>navigate(state.current+1);ui.skip.onclick=finishAction;ui.replay.onclick=replay;ui.knowledge.onclick=()=>openCard(SCENES[state.current].card);ui.modalClose.onclick=closeCard;ui.modal.onclick=e=>{if(e.target===ui.modal)closeCard();};
 document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeCard();return;}if(!state.started||!ui.modal.hidden||shipInspection.isOpen||state.action||state.transition)return;if(e.key==='ArrowLeft')navigate(state.current-1);if(e.key==='ArrowRight')navigate(state.current+1);});
 let start=null;ui.stage.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;start={x:e.clientX,y:e.clientY};});ui.stage.addEventListener('pointerup',e=>{if(!start||!state.started||state.action||state.transition)return;const dx=e.clientX-start.x,dy=e.clientY-start.y;start=null;if(Math.abs(dx)>70&&Math.abs(dx)>Math.abs(dy)*1.4)navigate(state.current+(dx<0?1:-1));});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)applySound(false);else if(window.JourneySfx)syncJourneySound(window.JourneySfx.state());});
 window.addEventListener('pagehide',()=>{applySound(false);unsubscribeSound?.();},{once:true});
}
setup();updateSceneUI=createSceneUI(ui,state);bind();updateUI();
loading.then(()=>{prepareWeddingLayers();state.ready=true;ui.start.disabled=false;ui.start.textContent='开始行舟 →';updateUI();requestAnimationFrame(tick);}).catch(e=>{console.error(e);ui.start.textContent='素材载入失败，请刷新重试';ui.status.textContent=`素材读取失败：${e.message}`;});
// Optional water rendering must not block loading the rest of the experience.
import('./water-scene.js?v=20261018-water1').then(({WaterScene})=>{water=new WaterScene(ui.stage,console.warn);}).catch(e=>console.warn('水面暂不可用，其他交互正常。',e));

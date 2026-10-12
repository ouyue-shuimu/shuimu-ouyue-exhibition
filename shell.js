(() => {
 const frame=document.getElementById('journeyFrame'),sound=window.JourneySound;
 const routes={
  'cover.html':{step:1,title:'封面｜水木之间',kind:'cover',next:'prologue.html',skip:'prologue.html',label:'循水入卷',hint:'轻点入卷，随舟启程'},
  'prologue.html':{step:2,title:'序章｜瓯居海中',kind:'prologue',previous:'cover.html',next:'woodtype/start.html',skip:'woodtype/start.html',label:'下一程 · 水木成器',hint:'山海之间，随舟寻见生活的来处'},
  'woodtype/start.html':{step:3,title:'第一篇｜水木成器',kind:'woodtype',previous:'prologue.html',next:'woodtype/intro.html',skip:'chapter.html?chapter=opera',label:'认识木活字',hint:'点击左侧活字印台，先认识技艺来历与修谱背景'},
  'woodtype/intro.html':{step:3,title:'第一篇｜木上有字',kind:'woodtype',previous:'woodtype/start.html',next:'woodtype/index.html',skip:'chapter.html?chapter=opera',label:'亲手排字 · 活字造句',hint:'看木成字、字成书，再亲手印下一句自己的话'},
  'woodtype/index.html':{step:3,title:'第一篇｜水木成器',kind:'woodtype',previous:'woodtype/intro.html',next:'chapter.html?chapter=opera',skip:'chapter.html?chapter=opera',label:'确认原句 · 下一程',hint:'选字成句，刷墨、覆纸刷印后，确认你的原句'},
  'chapter.html?chapter=opera':{step:4,title:'第二篇｜城中有声',kind:'opera',previous:'woodtype/index.html',next:'chapter.html?chapter=sea',skip:'chapter.html?chapter=sea',label:'下一程 · 一江通海',hint:'入席后点击帷幕听戏；唱毕可继续循江入海'},
  'chapter.html?chapter=sea':{step:5,title:'第三篇｜一江通海',kind:'sea',previous:'chapter.html?chapter=opera',next:'bridge/intro.html',skip:'bridge/intro.html',label:'下一程 · 泰顺廊桥',hint:'江流到山乡，先走近木拱廊桥的营造与生活'},
  'bridge/intro.html':{step:6,title:'第四篇｜山水成桥',kind:'present',previous:'chapter.html?chapter=sea',next:'chapter.html?chapter=present',skip:'chapter.html?chapter=present',label:'进入廊桥 · 今古相接',hint:'沿页签认识廊桥来处、编木结构、营造方法与乡村生活'},
  'chapter.html?chapter=present':{step:6,title:'第四篇｜今古相接',kind:'present',previous:'bridge/intro.html',next:'finale.html',skip:'finale.html',label:'收成我的诗笺',hint:'先见完整溪东桥；拖动右侧滑杆，桥身逐渐化为粒子'},
  'finale.html':{step:7,title:'结章｜生生瓯越',kind:'finale',previous:'chapter.html?chapter=present',next:'cover.html',label:'回到卷首',hint:'你的原句，留在这一程。收下属于你的瓯越诗笺'}
 };
 let current=null,pending=null,gateObserver=null;
 const next=document.getElementById('routeNext'),prev=document.getElementById('routePrevious'),skip=document.getElementById('routeSkip'),toggle=document.getElementById('soundToggle');
 function hasRoute(route){return typeof route==='string'&&Object.hasOwn(routes,route);}
 function safe(route){return hasRoute(route)?route:'cover.html';}
 function frameRoute(){
  try{const u=new URL(frame.contentWindow.location.href),root=new URL('.',location.href);if(u.origin!==root.origin)return null;const route=u.pathname.slice(root.pathname.length)+u.search;return hasRoute(route)?route:null;}catch{return null;}
 }
 // Rendering must never read a departing document and change the route back.
 function update(route,mode){
  const oldKind=routes[current]?.kind;current=route;const r=routes[route];
  if(route==='cover.html'){try{sessionStorage.removeItem('shuimu.journey.v1');}catch{}}
  document.getElementById('routeTitle').textContent=r.title;
  document.getElementById('routeCount').textContent=['封面','序章','水木成器','城中有声','一江通海','今古相接','结章'][r.step-1]+' · '+r.step+' / 七';
  document.getElementById('routeHint').textContent=r.hint;
  const dots=document.getElementById('routeDots');
  dots.replaceChildren(...Array.from({length:7},(_,i)=>{const dot=document.createElement('i');dot.className=i===r.step-1?'active':i<r.step-1?'past':'';return dot;}));
  dots.setAttribute('aria-valuenow',String(r.step));dots.setAttribute('aria-valuetext',r.title);
  prev.hidden=!r.previous;skip.hidden=!r.skip;skip.textContent=route==='cover.html'?'跳过封面':'跳过本篇';next.textContent=r.label;
  if(oldKind!==r.kind)sound.setChapter(r.kind);
  document.title=r.title+'｜水木之间';
  if(mode){const url=new URL(location.href);if(route==='cover.html')url.searchParams.delete('page');else url.searchParams.set('page',route);history[mode+'State']({route},'',url);}
  gate();
 }
 function go(route,mode='push'){
  if(!hasRoute(route))return;
  sound.start();sound.cue('sail');gateObserver?.disconnect();pending=route;
  update(route,mode);frame.contentWindow.location.replace(new URL(route,location.href).href);
 }
 function enter(route,source){
  if(source!==frame.contentWindow||!hasRoute(route)||frameRoute()!==route||(pending&&pending!==route))return;
  if(route!==current)update(route,'push');else gate();
 }
 function gate(){
  next.disabled=false;
  if(current==='woodtype/index.html'){
   try{next.disabled=frameRoute()!==current||frame.contentDocument.getElementById('journeyContinue')?.disabled!==false;}catch{next.disabled=true;}
   document.getElementById('routeHint').textContent=next.disabled?routes[current].hint:'刷印已完成，确认原句后继续下一程';
  }
 }
 frame.addEventListener('load',()=>{
  const route=frameRoute();if(!route||(pending&&pending!==route))return;
  pending=null;enter(route,frame.contentWindow);gateObserver?.disconnect();
  frame.contentDocument.documentElement.classList.add('in-journey');
  const confirm=frame.contentDocument.getElementById('journeyContinue');
  if(confirm){gateObserver=new MutationObserver(gate);gateObserver.observe(confirm,{attributes:true,attributeFilter:['disabled']});}
  gate();
 });
 next.addEventListener('click',()=>{if(current==='woodtype/index.html'){frame.contentDocument.getElementById('journeyContinue').click();return;}go(routes[current].next);});prev.addEventListener('click',()=>go(routes[current].previous));skip.addEventListener('click',()=>go(routes[current].skip));
 toggle.addEventListener('click',()=>{const s=sound.state();if(s.muted)sound.mute(false);else if(s.waitingForGesture||s.musicIssue)sound.start();else sound.toggle();});
 sound.subscribe(s=>{toggle.textContent=s.muted?'声音已关':s.musicIssue&&s.chapter!=='opera'?'重试配乐':s.waitingForGesture?'配乐已启用':'声音已开';toggle.setAttribute('aria-pressed',String(!s.muted));toggle.title=s.waitingForGesture?'配乐默认开启，首次点击画面或入卷后播放':s.musicIssue?'配乐暂未播放，点击重试':'配乐与互动音效开关';});
 function activateSound(event){if(event.target.closest?.('#soundToggle'))return;if(!sound.state().muted)sound.start();}
 document.addEventListener('pointerdown',activateSound,{capture:true});
 document.addEventListener('touchend',activateSound,{capture:true,passive:true});
 document.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' ')activateSound(event);},{capture:true});
 window.JourneyHost={go,gate,enter,hasRoute};
 window.addEventListener('popstate',()=>go(safe(new URLSearchParams(location.search).get('page')),null));
 window.addEventListener('message',event=>{if(event.origin===location.origin&&event.data?.type==='shuimu:route')enter(event.data.route,event.source);});
 const initial=safe(new URLSearchParams(location.search).get('page'));pending=initial;update(initial,'replace');if(frame.getAttribute('src')!==initial)frame.contentWindow.location.replace(new URL(initial,location.href).href);
 // Attempt immediately where permitted. Browsers that block autoplay unlock on the first real interaction.
 if(!sound.state().muted)sound.start();
})();

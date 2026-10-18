/* Responsive presentation only. Existing content, audio and action handlers are retained. */
(() => {
 const path=location.pathname;
 const routes=[['woodtype/start.html','workshop'],['woodtype/intro.html','wood-intro'],['woodtype/index.html','woodtype'],['chapters/opera/index.html','opera'],['chapters/sea/index.html','sea'],['chapters/present/index.html','present'],['bridge/intro.html','bridge'],['prologue.html','prologue'],['finale.html','finale'],['cover.html','cover']];
 const page=routes.find(([suffix])=>path.endsWith('/'+suffix))?.[1]||'shell';
 document.documentElement.dataset.mobilePage=page;
 const query=matchMedia('(max-width:760px)');
 const homes=new Map();
 function relocate(node,parent,before=null){
  if(!node||node.parentElement===parent)return;
  if(!homes.has(node))homes.set(node,{parent:node.parentNode,next:node.nextSibling});
  parent.insertBefore(node,before);
 }
 function restore(){for(const [node,home] of homes)home.parent.insertBefore(node,home.next?.parentNode===home.parent?home.next:null);homes.clear();}
 function adapt(){
  if(!query.matches){restore();return;}
  if(page==='opera'){
   const viewport=document.querySelector('#stageViewport'),box=document.querySelector('#stageBox'),caption=document.querySelector('.stage-caption');
   if(viewport&&box&&caption)relocate(caption,viewport,box.nextSibling);
  }
  if(page==='sea'){
   const visual=document.querySelector('#visualArea'),stage=document.querySelector('#stage');
   if(!visual||!stage)return;
   let reading=visual.querySelector('.mobile-sea-reading');
   if(!reading){reading=document.createElement('section');reading.className='mobile-sea-reading';reading.setAttribute('aria-label','行舟操作与文化热点');visual.append(reading);}
   const poem=visual.querySelector(':scope > .paper-poem');if(poem)relocate(poem,reading);
   const ending=stage.querySelector('#ending');if(ending)relocate(ending,document.body);
   for(const selector of ['.painting-title','.painting-tools','.hotspot-layer','.painting-action','.painting-next','.painting-skip','.painting-status']){
    const node=stage.querySelector(selector);if(node)relocate(node,reading);
   }
  }
  if(page==='workshop'){
   const scene=document.querySelector('.scene');if(!scene)return;
   let art=scene.querySelector('.mobile-workshop-art');
   if(!art){art=document.createElement('div');art.className='mobile-workshop-art';scene.insertBefore(art,scene.querySelector('.scene-image'));}
   for(const selector of ['.scene-image','.boat-track','.water-sheen','.cloud-canvas','.shuimu-water-motion','.type-hotspot']){
    const node=scene.querySelector(':scope > '+selector);if(node)relocate(node,art);
   }
  }
  if(page==='finale'&&!document.querySelector('.mobile-final-reading')){
   const art=document.querySelector('.final-art');
   const text=document.querySelector('.final-background')?.alt;
   if(art&&text){
    const reading=document.createElement('section');reading.className='mobile-final-reading';
    const heading=document.createElement('h1');heading.textContent='生生瓯越';reading.append(heading);
    const lead=document.createElement('p');lead.className='mobile-final-lead';lead.textContent='一江水路，至此有你。';reading.append(lead);
    const body=document.createElement('p');body.textContent=text.replace(/^生生瓯越：一江水路，至此有你。/,'');reading.append(body);art.after(reading);
   }
  }
 }
 function start(){
  adapt();query.addEventListener('change',adapt);
  if(page==='sea'||page==='workshop'){
   let queued=false;
   const observer=new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;adapt();});});
   observer.observe(document.body,{childList:true,subtree:true});
   addEventListener('pagehide',()=>observer.disconnect(),{once:true});
  }
 }
 if(document.readyState==='loading')addEventListener('DOMContentLoaded',start,{once:true});else start();
})();

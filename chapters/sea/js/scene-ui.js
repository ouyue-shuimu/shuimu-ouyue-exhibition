// Keep the original action handlers and audio timeline; relocate their controls into the painting.
export function createSceneUI(ui,state){
 const poems=[
  ['无数峰峦远近间','翁卷','野望'],
  ['城脚千家具舟楫','赵抃','自温将还衢郡题谢公楼'],
  ['沧海无波日万艘','陈傅良','和郡守沈持要赏柑之什三首·其一'],
  ['江心双塔压涛波','赵抃','自温将还衢郡题谢公楼'],
  ['目送风帆到海门','叶适','题学海楼']
 ];
 const poem=document.querySelector('.paper-poem');
 const panel=document.querySelector('.control-area');
 const title=document.createElement('div');title.className='painting-title';
 title.append(ui.eyebrow,ui.title,ui.lead);ui.stage.append(title);
 const tools=document.createElement('div');tools.className='painting-tools';
 ui.knowledge.textContent='文化笔记';ui.replay.textContent='↺ 重看';
 tools.append(ui.knowledge,ui.replay);ui.stage.append(tools);
 ui.primary.className='painting-action';ui.next.className='painting-next';
 ui.skip.className='painting-skip';ui.status.className='painting-status';
 ui.status.setAttribute('role','status');
 ui.stage.append(ui.primary,ui.next,ui.skip,ui.status);panel.hidden=true;
 const visual=document.getElementById('visualArea');
 const fit=()=>{const inset=visual.clientWidth<600?12:32,w=Math.max(1,Math.min(visual.clientWidth-inset, (visual.clientHeight-inset)*16/9));ui.stage.style.width=w+'px';ui.stage.style.height=w*9/16+'px';};
 new ResizeObserver(fit).observe(visual);fit();
 let previous=-1;
 return ()=>{
  const i=state.current,busy=!!state.action||!!state.transition,done=state.completed[i];
  poem.hidden=!state.started;
  if(state.transition){poem.style.opacity='0';poem.style.filter='blur(6px)';poem.style.maskImage='radial-gradient(ellipse, #000 0%, transparent .1%)';}
  else{poem.style.opacity='1';poem.style.filter='none';poem.style.maskImage='none';poem.style.webkitMaskImage='none';}
  const locations=[[53,76],[96,77],[43,69],[60,90],[30,72]];
  const position=i===1&&state.phase[1]>0?[40,69]:locations[i];
  const labels=['点船启程',state.phase[1]>0?'点货搬运':'点此迎船','点货装卸','点船扬帆','点船出海'];
  ui.primary.style.left=position[0]+'%';ui.primary.style.top=position[1]+'%';
  const label=document.createElement('span');label.textContent=labels[i];ui.primary.replaceChildren(label);ui.primary.setAttribute('aria-label',labels[i]);
  ui.primary.hidden=busy||done||!state.started||!state.ready;
  ui.next.hidden=!done||i===4||busy||!state.started;
  ui.next.textContent=i<4?'继续 · '+['循江而来','临江入城','朔门集舟','双塔引航','一江通海'][i+1]+' →':'';
  ui.status.hidden=!state.started||!state.ready||(!busy&&!done);
  tools.hidden=!state.started||!!state.transition;
  title.hidden=!state.started;ui.stage.classList.toggle('painting-busy',busy);
  if(previous!==i){
   const [verse,author,work]=poems[i];
   poem.querySelector('.paper-poem-line').textContent=verse;
   poem.querySelector('.paper-poem-source').replaceChildren(document.createTextNode(author),document.createElement('br'),document.createTextNode('《'+work+'》'));
   poem.setAttribute('aria-label',author+'诗句：'+verse+'。出自《'+work+'》');
   previous=i;title.classList.remove('arriving');void title.offsetWidth;title.classList.add('arriving');}
  if(!state.started)previous=-1;
 };
}

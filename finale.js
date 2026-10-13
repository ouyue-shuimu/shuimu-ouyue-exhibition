(() => {
 let data={};try{data=JSON.parse(sessionStorage.getItem('shuimu.journey.v1')||'{}');}catch{}
 const phrase=typeof data.phrase==='string'&&data.confirmedAt?data.phrase:'';
 const phraseNode=document.getElementById('originalPhrase'),save=document.getElementById('savePoem'),status=document.getElementById('saveStatus');
 if(phrase){const chars=Array.from(phrase);for(let i=0;i<chars.length;i+=6){const line=document.createElement('span');line.textContent=chars.slice(i,i+6).join('');line.style.display='block';phraseNode.append(line);}}else{phraseNode.textContent='这一笔，等你亲手写下。';}
 const visitedOpera=data.operaPlayed===true;
 const marks=[];if(phrase)marks.push('木字\n留言');if(visitedOpera)marks.push('戏中\n相逢');
 for(const text of marks){const stamp=document.createElement('span');stamp.className='mark';stamp.textContent=text;document.getElementById('marks').append(stamp);}
 save.disabled=!phrase;if(!phrase){document.getElementById('afterword').textContent='回到木活字页，刷印并确认你的原句。';document.getElementById('returnType').textContent='去造一句自己的话';}
 const bg=new Image();bg.src='assets/finale-textfixed.png';
 const clean=new Image();clean.src='assets/finale-clean.png';
 save.addEventListener('click',async()=>{
  if(!phrase)return;save.disabled=true;status.textContent='正在收下这一笔…';
  try{
   await Promise.all([bg.decode(),clean.decode()]);await document.fonts.load('300 42px JourneySerif');
   const c=document.createElement('canvas');c.width=1672;c.height=941;const ctx=c.getContext('2d');ctx.drawImage(bg,0,0,1672,941);
   // Match the on-page clear layers, preserving the corrected text everywhere else.
   ctx.drawImage(clean,1034,422,322,292,1034,422,322,292);
   const water=document.createElement('canvas');water.width=264;water.height=140;const waterCtx=water.getContext('2d');
   waterCtx.drawImage(clean,1390,716,264,140,0,0,264,140);waterCtx.globalCompositeOperation='destination-in';
   for(const [x,y] of [[264,0],[0,140]]){const gradient=waterCtx.createLinearGradient(0,0,x,y),edge=x?.06:.11;gradient.addColorStop(0,'transparent');gradient.addColorStop(edge,'#000');gradient.addColorStop(1-edge,'#000');gradient.addColorStop(1,'transparent');waterCtx.fillStyle=gradient;waterCtx.fillRect(0,0,264,140);}
   ctx.drawImage(water,1390,716);
   ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#725876';
   const chars=Array.from(phrase),lines=[];for(let i=0;i<chars.length;i+=6)lines.push(chars.slice(i,i+6).join(''));
   ctx.font='300 50px JourneySerif, serif';lines.forEach((line,i)=>ctx.fillText(line,1210,460+i*68));
   let x=marks.length===2?1140:1190;for(const mark of marks){ctx.strokeStyle='#a64436';ctx.lineWidth=2;ctx.strokeRect(x-25,558,50,55);ctx.fillStyle='#963b2f';ctx.font='300 20px JourneySerif,serif';mark.split('\n').forEach((t,i)=>ctx.fillText(t,x,575+i*22));x+=96;}
   ctx.font='300 20px JourneySerif,serif';ctx.fillStyle='#493a50';ctx.fillText('水路仍向前，故事待续。',1210,648);ctx.font='300 17px JourneySerif,serif';ctx.fillText('我的瓯越诗笺 · 木活字原句留存',1210,688);
   const boat=new Image();boat.src='assets/boat.png';await boat.decode();ctx.drawImage(boat,1410,720,235,120);
   const blob=await new Promise(r=>c.toBlob(r,'image/png'));if(!blob)throw Error('image');const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='我的瓯越诗笺.png';a.click();window.JourneySfx?.cue('collect');setTimeout(()=>URL.revokeObjectURL(url),20000);status.textContent='诗笺已下载，原句逐字保留。';
  }catch{status.textContent='未能下载，请稍后再试。';}finally{save.disabled=false;}
 });
})();

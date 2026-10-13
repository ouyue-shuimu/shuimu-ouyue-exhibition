const FEATURES=[
 {title:'桅杆、帆与索具',tag:'画中可见 · 航行装置',x:55,y:38,text:'画中竖起的桅杆承接帆面，斜拉的索具连接桅杆与船体。帆借助风力推进船只，索具用于支撑桅杆、调整帆面；它们共同构成船舶的航行装置。'},
 {title:'甲板与舱屋',tag:'画中可见 · 船上空间',x:85,y:46,text:'沿着船身观察，能看到甲板上的人员，以及向船尾延伸的舱屋。甲板承担通行与作业，舱屋形成有遮蔽的船上空间。仅凭绘画，不能确定每间舱屋的用途，也不能看清甲板以下的分舱。'},
 {title:'修长船身与起翘船尾',tag:'图像对照 · 外部形制',x:56,y:87,text:'这幅局部中的船身沿水面伸展，船尾向上起翘。研究和报道将画中长船、翘尾等外观，与朔门古港沉船作比较，为认识宋元温州船舶提供线索；这种比较并不意味着画中的船就是出土沉船。'},
 {title:'龙骨与分舱结构',tag:'考古补充 · 画外的结构',x:null,y:null,text:'绘画难以展示船底内部，考古材料补充了这一部分：龙骨沿船底纵向支撑船体，横向舱壁分隔舱室，接缝使用艌料密封。分舱能限制进水在船内扩散。报道记载，朔门二号沉船现存残长 15.9 米、残宽 4.26 米；这些是残存尺寸，不是完整船的尺寸。'}
];

export class ShipInspection{
 constructor({soundEnabled,toggleSound,onOpen,onClose,sceneAudio=false}){
  Object.assign(this,{soundEnabled,toggleSound,onOpen,onClose,sceneAudio});this.isOpen=false;this.closing=false;this.seen=new Set();
  this.audio=sceneAudio?null:new Audio('assets/audio/流水.mp3');if(this.audio){this.audio.loop=true;this.audio.volume=0;}
  this.root=document.createElement('div');this.root.className='ship-backdrop';this.root.hidden=true;
  this.root.innerHTML=`<section class="ship-sheet" role="dialog" aria-modal="true" aria-labelledby="shipTitle" tabindex="-1">
   <button class="ship-close" type="button" aria-label="关闭船舶观察">×</button>
   <header class="ship-heading"><p>第三幕 · 朔门集舟</p><h2 id="shipTitle">从画中看宋元船舶</h2><div>循着桅帆、舱屋与船体，读懂画中的船。</div></header>
   <div class="ship-layout"><figure class="ship-figure"><div class="ship-picture"><img src="assets/heritage/王振鹏画作-船舶局部.png" alt="用户提供的王振鹏画作局部，可见桅杆、索具、舱屋与船身"><span class="ship-marker" aria-hidden="true"></span></div><figcaption>王振鹏画作局部 · 用户提供图片</figcaption></figure>
   <div class="ship-reading"><nav class="ship-tabs" aria-label="选择船舶结构">${FEATURES.map((f,i)=>`<button type="button" data-feature="${i}" aria-pressed="false"><span>${String(i+1).padStart(2,'0')}</span>${f.title}</button>`).join('')}</nav>
   <article class="ship-feature" aria-live="polite"><p class="ship-feature-tag"></p><h3></h3><p class="ship-feature-copy"></p></article>
   <details class="ship-sources"><summary>图像与考古资料</summary><p>图像：用户提供的王振鹏画作局部。画面观察与考古解释分别标示。</p><p>褚子婧《宋元时期温州港口及其相关城市建设研究》§4.1.3，正文第 52—53 页（PDF 第 61—62 页）：船体、桅船与内部功能空间。</p><p>应忠彭《一艘宋代沉船的千年“船”奇》，《浙江日报》2026 年 5 月 22 日，第 006 版；所提供 PDF 第 1—2 页：二号沉船尺寸、龙骨、隔舱、艌料与画作对照。</p></details></div></div>
   <footer class="ship-footer"><span class="ship-progress" aria-live="polite"></span><button class="ship-audio" type="button"></button><button class="ship-next" type="button">下一处 →</button><button class="ship-finish" type="button">完成观察，返回长卷</button></footer>
  </section>`;
  document.body.append(this.root);this.sheet=this.root.querySelector('.ship-sheet');
  this.root.querySelectorAll('[data-feature]').forEach(b=>b.addEventListener('click',()=>this.select(+b.dataset.feature)));
  this.root.querySelector('.ship-close').onclick=()=>this.close();this.root.querySelector('.ship-finish').onclick=()=>this.close();
  this.root.querySelector('.ship-next').onclick=()=>this.select((this.selected+1)%FEATURES.length);
  this.root.querySelector('.ship-audio').onclick=()=>this.toggleSound();
  this.root.addEventListener('click',e=>{if(e.target===this.root)this.close();});
  this.root.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();this.close();}if(e.key==='Tab'){const items=[...this.root.querySelectorAll('button,summary')].filter(b=>!b.disabled);const first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
 }
 select(i){this.selected=i;this.seen.add(i);const f=FEATURES[i];this.root.querySelectorAll('[data-feature]').forEach(b=>{b.setAttribute('aria-pressed',String(+b.dataset.feature===i));b.classList.toggle('seen',this.seen.has(+b.dataset.feature));});this.root.querySelector('.ship-feature-tag').textContent=f.tag;this.root.querySelector('.ship-feature h3').textContent=f.title;this.root.querySelector('.ship-feature-copy').textContent=f.text;const marker=this.root.querySelector('.ship-marker');marker.hidden=f.x===null;if(f.x!==null){marker.style.left=f.x+'%';marker.style.top=f.y+'%';}this.root.querySelector('.ship-progress').textContent=`已观察 ${this.seen.size} / 4 处`;this.root.querySelector('.ship-next').textContent=i===3?'再看桅帆 ↺':'下一处 →';}
 open(){if(this.isOpen)return;this.isOpen=true;this.closing=false;this.lastFocus=document.activeElement;this.oldOverflow=document.body.style.overflow;document.body.style.overflow='hidden';this.seen.clear();this.select(0);this.root.querySelector('.ship-sources').open=false;this.root.hidden=false;this.onOpen();requestAnimationFrame(()=>{if(this.isOpen&&!this.closing)this.root.classList.add('visible');});this.root.querySelector('.ship-close').focus();this.syncSound();}
 fadeSound(to,duration,stop=false){if(this.sceneAudio)return;cancelAnimationFrame(this.audioFrame);const from=this.audio.volume,start=performance.now();const frame=now=>{const t=Math.max(0,Math.min(1,(now-start)/duration)),s=t*t*(3-2*t);this.audio.volume=from+(to-from)*s;if(t<1)this.audioFrame=requestAnimationFrame(frame);else if(stop){this.audio.pause();this.audio.currentTime=0;}};this.audioFrame=requestAnimationFrame(frame);}
 syncSound(){this.root.querySelector('.ship-audio').textContent=this.soundEnabled()?'关闭流水声':'开启流水声';if(this.sceneAudio||!this.isOpen)return;if(this.soundEnabled()&&!this.closing){this.audio.play().then(()=>{if(this.isOpen&&!this.closing&&this.soundEnabled())this.fadeSound(.22,1200);else this.audio.pause();}).catch(()=>{});}else this.fadeSound(0,this.closing?900:400,true);}
 close(){if(!this.isOpen||this.closing)return;this.closing=true;this.root.classList.remove('visible');this.fadeSound(0,900,true);setTimeout(()=>{this.root.hidden=true;this.isOpen=false;this.closing=false;document.body.style.overflow=this.oldOverflow;this.onClose();this.lastFocus?.focus?.();},650);}
}

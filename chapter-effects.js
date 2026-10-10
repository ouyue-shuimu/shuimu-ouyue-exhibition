(() => {
 const sound=window.JourneySfx;if(!sound)return;
 const opera=document.getElementById('audio');let unsubscribe=()=>{};
 if(opera){
  const mute=document.getElementById('mute');
  unsubscribe=sound.subscribe(s=>{opera.muted=s.muted;if(mute){mute.textContent=s.muted?'开启声音':'静音';mute.setAttribute('aria-pressed',String(s.muted));}});
  mute?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();sound.toggle();},true);
  const record=()=>{if(opera.paused||opera.muted||opera.currentTime<.2)return;try{const d=JSON.parse(sessionStorage.getItem('shuimu.journey.v1')||'{}');if(!d.operaPlayed){d.operaPlayed=true;sessionStorage.setItem('shuimu.journey.v1',JSON.stringify(d));}}catch{}};
  opera.addEventListener('timeupdate',record);opera.addEventListener('volumechange',record);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)opera.pause();});
  const editor=document.getElementById('editToggle');if(editor)editor.hidden=true;
  document.querySelector('.brand')?.addEventListener('click',e=>{e.preventDefault();window.top.JourneyHost.go('cover.html');});
 }
 if(document.getElementById('soundButton')){
  unsubscribe=sound.subscribe(s=>{const label=s.muted?'开启声音':'关闭声音';document.getElementById('soundLabel').textContent=label;document.getElementById('soundButton').setAttribute('aria-label',label);});
  document.getElementById('startButton').addEventListener('click',()=>sound.cue('sail'));
 }
 const slider=document.getElementById('flowSlider'),canvas=document.getElementById('webgl'),dialog=document.getElementById('storyDialog');
 if(slider){slider.addEventListener('input',()=>sound.cue('flow'));let drag=null;canvas.addEventListener('pointerdown',e=>{drag={id:e.pointerId,x:e.clientX,y:e.clientY};});canvas.addEventListener('pointermove',e=>{if(drag&&drag.id===e.pointerId&&Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>3){sound.cue('flow');drag={id:e.pointerId,x:e.clientX,y:e.clientY};}});const end=()=>{drag=null;sound.stopBrush();};canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);
  let lastLine='';new MutationObserver(()=>{const text=document.querySelector('.story-lines').textContent.trim();if(dialog.open&&text&&text!==lastLine){lastLine=text;sound.cue('plucked');}}).observe(document.querySelector('.story-lines'),{subtree:true,childList:true,characterData:true});dialog.addEventListener('close',()=>{lastLine='';});
 }
 window.addEventListener('pagehide',()=>{unsubscribe();if(opera)opera.pause();});
 document.documentElement.dataset.audioReady='true';
})();

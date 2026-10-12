/* Persistent audio owner: chapters navigate within the frame. */
(() => {
 'use strict';
 let ctx,master,musicGain,brushGain,brushFilter,noise,started=false,muted=false,chapter='cover',lastBrush=0,brushLevel=0,hidden=false;
 const counters={},lastCue={},subscribers=new Set();
 try{muted=localStorage.getItem('shuimu.sound.muted')==='true';}catch{}
 const music=new Audio('assets/audio/journey-theme.mp3');music.preload='auto';music.loop=true;
 let musicIssue=false,trying=false,autoplayBlocked=false;
 function state(){return {started,muted,chapter,musicIssue,waitingForGesture:!muted&&(!started||autoplayBlocked||ctx?.state!=='running'),playing:!music.paused,currentTime:music.currentTime,context:ctx?.state,brushLevel,counters:{...counters}};}
 function notify(){for(const fn of subscribers)fn(state());}
 function init(){
  if(ctx)return true;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;
  ctx=new AC();ctx.addEventListener?.('statechange',notify);master=ctx.createGain();master.gain.value=muted?0:.6;master.connect(ctx.destination);
  musicGain=ctx.createGain();musicGain.gain.value=0;ctx.createMediaElementSource(music).connect(musicGain).connect(master);
  noise=ctx.createBuffer(1,ctx.sampleRate*3,ctx.sampleRate);const d=noise.getChannelData(0);let low=0;for(let i=0;i<d.length;i++){low=(low+Math.random()*2-1)/1.04;d[i]=low*.15;}
  const s=ctx.createBufferSource();s.buffer=noise;s.loop=true;brushFilter=ctx.createBiquadFilter();brushFilter.type='bandpass';brushFilter.Q.value=.5;brushGain=ctx.createGain();brushGain.gain.value=0;s.connect(brushFilter).connect(brushGain).connect(master);s.start();return true;
 }
 function playMusic(){if(!started||muted||hidden||chapter==='opera'||trying||!music.paused)return;trying=true;music.play().then(()=>{trying=false;musicIssue=false;autoplayBlocked=false;notify();}).catch(error=>{trying=false;if(error?.name==='NotAllowedError'){autoplayBlocked=true;musicIssue=false;}else{musicIssue=true;}notify();});}
 function start(){if(muted||hidden||!init())return;started=true;ctx.resume().then(()=>{playMusic();notify();}).catch(()=>{autoplayBlocked=true;notify();});playMusic();notify();}
 function mute(value){muted=Boolean(value);try{localStorage.setItem('shuimu.sound.muted',String(muted));}catch{}if(ctx)master.gain.setTargetAtTime(muted?0:.6,ctx.currentTime,.035);if(muted){music.pause();stopBrush();}else start();notify();}
 function setChapter(value){chapter=value;stopBrush();if(chapter==='opera'){if(musicGain)musicGain.gain.value=0;music.pause();}else playMusic();notify();}
 function canSound(){return started&&!muted&&!hidden&&ctx&&ctx.state==='running';}
 function tone(freq,seconds,level,delay=0){const o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime+delay;o.frequency.value=freq;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(level,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+seconds);o.connect(g).connect(master);o.start(t);o.stop(t+seconds+.02);o.onended=()=>{o.disconnect();g.disconnect();};}
 function texture(seconds,level,freq,delay=0){const s=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain(),t=ctx.currentTime+delay;s.buffer=noise;f.type='bandpass';f.frequency.value=freq;f.Q.value=.65;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(level,t+Math.min(.15,seconds*.2));g.gain.exponentialRampToValueAtTime(.0001,t+seconds);s.connect(f).connect(g).connect(master);s.start(t,Math.random());s.stop(t+seconds+.02);s.onended=()=>{s.disconnect();f.disconnect();g.disconnect();};}
 function cue(name){
  if(!canSound())return;const now=performance.now(),gap={wood:85,flow:240,sail:800,plucked:450}[name]||200;if(now-(lastCue[name]||-10000)<gap)return;lastCue[name]=now;counters[name]=(counters[name]||0)+1;
  if(name==='wood'){const f=430+Math.random()*55;tone(f,.085,.09);tone(f*2.7,.047,.027);texture(.065,.15,1700);}
  else if(name==='paper')texture(.35,.18,1800);
  else if(name==='reveal'){texture(.65,.21,2300);texture(.3,.07,950,.28);}
  else if(name==='collect'){texture(.65,.18,1700);tone(260,.12,.028,.3);}
  else if(name==='plucked'){tone(220,1.6,.032);tone(440,.8,.014);tone(660,.36,.004);}
  else if(name==='flow')texture(.42,.1,550);
  else if(name==='sail'){texture(1.4,.18,460);texture(.85,.1,1000,.18);}
 }
 function brush(speed,kind='ink'){if(!canSound()||speed<.3)return;lastBrush=performance.now();brushLevel=Math.min(.34,.07+speed*.003);brushFilter.frequency.setTargetAtTime(kind==='paper'?2100:1000,ctx.currentTime,.03);brushGain.gain.setTargetAtTime(brushLevel,ctx.currentTime,.018);counters.brush=(counters.brush||0)+1;}
 function stopBrush(){lastBrush=0;brushLevel=0;if(ctx)brushGain.gain.setTargetAtTime(0,ctx.currentTime,.025);}
 setInterval(()=>{if(!ctx)return;if(performance.now()-lastBrush>110)stopBrush();const edge=Number.isFinite(music.duration)?Math.max(0,Math.min(1,music.currentTime/1.2,(music.duration-music.currentTime)/1.2)):1;const target=started&&!muted&&!hidden&&chapter!=='opera'?(chapter==='woodtype'?.13:.22)*edge:0;musicGain.gain.setTargetAtTime(target,ctx.currentTime,.3);},80);
 music.addEventListener('error',()=>{musicIssue=true;notify();});
 document.addEventListener('visibilitychange',()=>{hidden=document.hidden;if(hidden){music.pause();stopBrush();if(ctx)ctx.suspend().catch(()=>{});}else if(started&&!muted){ctx?.resume().catch(()=>{});playMusic();}});
 window.JourneySound={start,mute,toggle:()=>mute(!muted),setChapter,cue,brush,stopBrush,subscribe(fn){subscribers.add(fn);notify();return()=>subscribers.delete(fn);},state};
})();

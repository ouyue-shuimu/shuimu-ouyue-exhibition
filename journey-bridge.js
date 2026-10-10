(() => {
 const root=new URL('.',document.currentScript.src);
 if(window===window.top){let route=location.pathname.slice(root.pathname.length)+location.search;if(route==='index.html'||!route)route='cover.html';location.replace(new URL('index.html?page='+encodeURIComponent(route),root));return;}
 document.documentElement.classList.add('in-journey');const sound=window.top.JourneySound;window.JourneySfx=sound;
 let route=location.pathname.slice(root.pathname.length)+location.search;
 if(route==='chapters/opera/index.html')route='chapter.html?chapter=opera';
 else if(route==='chapters/sea/index.html')route='chapter.html?chapter=sea';
 else if(route==='chapters/present/index.html')route='chapter.html?chapter=present';
 if(window.parent===window.top)window.top.JourneyHost?.enter(route,window);
 document.addEventListener('pointerdown',()=>sound?.start(),{capture:true});document.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' ')sound?.start();},{capture:true});
 window.addEventListener('pagehide',()=>sound?.stopBrush());
 document.addEventListener('click',event=>{const a=event.target.closest('a[href]');if(event.defaultPrevented||!a||a.target==='_blank'||a.hasAttribute('download')||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;const u=new URL(a.href);if(u.origin!==root.origin||!u.pathname.startsWith(root.pathname))return;let target=u.pathname.slice(root.pathname.length)+u.search;if(target==='index.html')target='cover.html';if(window.top.JourneyHost?.hasRoute(target)){event.preventDefault();window.top.JourneyHost.go(target);}});
})();

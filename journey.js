(() => {
  const pause=document.querySelector('.motion-control');
  let paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const update=()=>{document.body.dataset.motion=paused?'paused':'playing';pause.textContent=paused?'继续船行':'暂停船行';pause.setAttribute('aria-pressed',String(paused));};
  update();pause.addEventListener('click',()=>{paused=!paused;update();});
  document.querySelectorAll('a[href]').forEach(a=>a.addEventListener('click',e=>{
    if(e.defaultPrevented||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
    window.JourneySfx?.cue('sail');
    e.preventDefault();document.body.classList.add('departing');
    setTimeout(()=>{const target=new URL(a.href),route=target.pathname.slice(new URL('.',location.href).pathname.length)+target.search;const host=window.top.JourneyHost;if(target.origin===location.origin&&host?.hasRoute(route))host.go(route);else location.href=a.href;},matchMedia('(prefers-reduced-motion: reduce)').matches?0:500);
  }));
  addEventListener('pageshow',()=>document.body.classList.remove('departing'));
})();

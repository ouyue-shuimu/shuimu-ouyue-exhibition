(() => {
 const list={
  opera:{title:'第二章 · 城中有声',count:'四 / 七',url:'chapters/opera/index.html',previous:'woodtype/index.html',next:'chapter.html?chapter=sea',copy:'一出戏，让古老的声音与今天的你相逢。',nextText:'循水向海'},
  sea:{title:'第三章 · 一江通海',count:'五 / 七',url:'https://zhouyungu1994-wq.github.io/yijiang-tonghai-v2/',previous:'chapter.html?chapter=opera',next:'bridge/intro.html',copy:'江流到山乡，先走近廊桥的营造与生活。',nextText:'认识泰顺廊桥'},
  present:{title:'第四章 · 今古相接',count:'六 / 七',url:'https://jingu-xiangjie.zhaoxinyue991.chatgpt.site/',previous:'chapter.html?chapter=sea',next:'finale.html',copy:'字与戏，仍在今天的相逢里延续。',nextText:'收束我的瓯越诗笺'}
 };
 const key=new URLSearchParams(location.search).get('chapter');const chapter=list[key]||list.opera;
 document.title=chapter.title+'｜水木之间';
 document.getElementById('chapterTitle').textContent=chapter.title;document.getElementById('chapterCount').textContent=chapter.count;
 document.getElementById('transitionCopy').textContent=chapter.copy;
 document.getElementById('previous').href=chapter.previous;
 const next=document.getElementById('next');next.href=chapter.next;next.textContent=chapter.nextText;
 document.getElementById('external').href=chapter.url;
 const frame=document.getElementById('chapterFrame');frame.title=chapter.title;frame.src='chapters/'+(list[key]?key:'opera')+'/index.html';
 const status=document.getElementById('loadStatus');status.textContent='正在展开本章…';
 let loaded=false;frame.addEventListener('load',()=>{loaded=true;status.textContent='';});
 setTimeout(()=>{if(!loaded)status.textContent='加载较慢时，可单独打开本章，体验后回此继续。';},12000);
 try {const data=JSON.parse(sessionStorage.getItem('shuimu.journey.v1')||'{}');data.visited=[...new Set([...(data.visited||[]),key||'opera'])];sessionStorage.setItem('shuimu.journey.v1',JSON.stringify(data));}catch{}
})();

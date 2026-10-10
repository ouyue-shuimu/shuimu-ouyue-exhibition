'use strict';
(() => {
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
  let page = 0;
  function show(index, focus = false) {
    page = Math.max(0, Math.min(tabs.length - 1, index));
    tabs.forEach((tab, i) => {
      tab.setAttribute('aria-selected', String(i === page));
      tab.tabIndex = i === page ? 0 : -1;
      panels[i].hidden = i !== page;
    });
    document.getElementById('previous').disabled = page === 0;
    document.getElementById('next').disabled = page === tabs.length - 1;
    document.getElementById('pageCount').textContent = String(page + 1).padStart(2,'0') + ' / ' + String(tabs.length).padStart(2,'0') + ' · ' + tabs[page].textContent.trim().slice(1).trim();
    if (focus) tabs[page].focus();
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => show(i));
    tab.addEventListener('keydown', event => {
      let index;
      if (event.key === 'ArrowRight') index = (i + 1) % tabs.length;
      if (event.key === 'ArrowLeft') index = (i + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') index = 0;
      if (event.key === 'End') index = tabs.length - 1;
      if (index !== undefined) { event.preventDefault(); show(index, true); }
    });
  });
  document.getElementById('previous').addEventListener('click', () => show(page - 1, true));
  document.getElementById('next').addEventListener('click', () => show(page + 1, true));
  const steps = [
    ['备木字模','选择质地细密、坚韧的棠梨木，经干燥、锯刨，制成尺寸整齐的木字模。','先把材料处理成可刻、可排的木块，才有后面的文字。','木','字','棠梨木字模','刻字的材料',false],
    ['写反字 · 刻字','在木字模上写老宋体繁体反字，再沿笔画雕刻，去掉周围空白，让笔画凸出。','凸起字面接受墨汁，印出的字与它左右镜像。','譜','譜','反字字面','正字印文',true],
    ['拣字 · 排版','按捡字口诀归类字模，依稿件挑字排入版框，用竹片、木楔等固定，再校对。','字模能拆能换，“活”就在于可以反复重排。','字','版','从字盘挑字','排列与校对',true],
    ['研墨 · 上墨','调好墨汁，用墨刷蘸墨，在墨盘中匀墨，再均匀刷到字面上。','墨量需要掌握：不足会浅淡，过多容易模糊。','墨','字','研墨与匀墨','字面吃墨',false],
    ['覆纸 · 刷印','覆上纸张，使用棕刷均匀刷过纸背，让纸与吃墨的凸起字面接触，再揭下印页。','正字、字序与位置，都来自整块字版的镜像。','譜','譜','吃墨的反字','揭纸后的正字',true],
    ['成谱 · 归字','印页经过宗谱相关加工、整理、折页和装订成册。拆版后，字模归回字盘，留待再用。','一册书完成，一枚枚字还可以继续工作。','字','册','拆版归字','整理成册',false]
  ];
  const photoSteps = [null,null,null,null,
    ['lin-chuyin-printing.png','林初寅在印台前使用木活字进行印刷','国家级非遗代表性传承人林初寅在用木活字进行印刷。来源：中国非遗网专题，图片由用户提供。'],
    ['genealogy-books.png','木活字印制的宗谱','木活字印刷术印制的宗谱。供图：中国木活字印刷文化村展示馆。来源：中国非遗网专题，图片由用户提供。']
  ];
  const stepButtons = [...document.querySelectorAll('[data-step]')];
  stepButtons.forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.step), step = steps[index];
    stepButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.getElementById('stepNumber').textContent = String(index + 1).padStart(2,'0') + ' / 06';
    document.getElementById('stepTitle').textContent = step[0];
    document.getElementById('stepCopy').textContent = step[1];
    document.getElementById('stepDetail').textContent = step[2];
    document.querySelector('#woodSample span').textContent = step[3];
    document.getElementById('paperSample').textContent = step[4];
    document.getElementById('woodLabel').textContent = step[5];
    document.getElementById('paperLabel').textContent = step[6];
    document.getElementById('woodSample').classList.toggle('reverse',step[7]);
    const photo = photoSteps[index];
    document.getElementById('craftPhoto').hidden = !photo;
    if(photo){
      const src='./assets/heritage/'+photo[0];
      document.getElementById('craftPhotoImage').src=src;
      document.getElementById('craftPhotoImage').alt=photo[1];
      document.getElementById('craftPhotoButton').dataset.lightbox=src;
      document.getElementById('craftPhotoCaption').textContent=photo[2];
    }
  }));
  const photoDialog=document.getElementById('photoDialog');
  let photoTrigger=null;
  document.querySelectorAll('[data-lightbox]').forEach(button=>button.addEventListener('click',()=>{
    photoTrigger=button;
    const img=document.getElementById('photoDialogImage');
    img.src=button.dataset.lightbox;img.alt=button.querySelector('img').alt;
    document.getElementById('photoDialogCaption').textContent=button.closest('figure').querySelector('figcaption').textContent;
    photoDialog.showModal();
  }));
  document.getElementById('closePhoto').addEventListener('click',()=>photoDialog.close());
  photoDialog.addEventListener('click',event=>{if(event.target===photoDialog)photoDialog.close();});
  photoDialog.addEventListener('close',()=>photoTrigger?.focus());
  show(0);
})();

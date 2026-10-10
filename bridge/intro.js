(() => {
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
  const count = document.getElementById('pageCount');
  const previous = document.getElementById('previous');
  const next = document.getElementById('next');
  let active = 0;

  function show(index, focus = false) {
    active = (index + tabs.length) % tabs.length;
    tabs.forEach((tab, i) => {
      const selected = i === active;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      panels[i].hidden = !selected;
    });
    previous.disabled = active === 0;
    next.disabled = active === tabs.length - 1;
    count.textContent = `${String(active + 1).padStart(2, '0')} / ${String(tabs.length).padStart(2, '0')} · ${tabs[active].textContent.trim().replace(/^[壹贰叁肆伍]\s*/, '')}`;
    if (focus) tabs[active].focus();
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => show(i));
    tab.addEventListener('keydown', event => {
      let target = null;
      if (event.key === 'ArrowRight') target = i + 1;
      if (event.key === 'ArrowLeft') target = i - 1;
      if (event.key === 'Home') target = 0;
      if (event.key === 'End') target = tabs.length - 1;
      if (target !== null) { event.preventDefault(); show(target, true); }
    });
  });
  previous.addEventListener('click', () => show(active - 1));
  next.addEventListener('click', () => show(active + 1));

  // Keep reading anchors inside this page instead of reopening the journey route.
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(link.hash.slice(1));
    if (!target) return;
    event.preventDefault();
    event.stopPropagation();
    if (target.tagName === 'DETAILS') target.open = true;
    target.scrollIntoView({ block: 'start', behavior: 'auto' });
  }, true);

  const buildSteps = [
    { era: '顺着溪谷', title: '先看河道与两岸', copy: '造桥要看水从哪里来、河道有多宽、两岸是否稳固；这些条件关系到桥址与拱架怎样跨过溪流。桥不离开山水单独存在。', detail: '这是理解营造的环节之一，并非所有古桥都完全相同的施工清单。' },
    { era: '木料相编', title: '交错木料，榫卯成拱', copy: '木拱桥的关键不是一根长木独自跨溪，而是多根木料彼此交错、穿插并以榫卯连接，合成能够承托桥面的拱架。', detail: '编木结构的具体做法会因桥梁形制、跨度与地方经验而有所不同。' },
    { era: '为桥覆廊', title: '木构之上，再营廊屋', copy: '拱架成形后，桥面与廊屋共同组成可通行的桥。屋顶和外侧风雨板遮挡风雨，让过桥的人多一处停留与歇脚的空间。', detail: '桥屋与桥身连成整体，既回应日常使用，也呈现地方营造特色。' },
    { era: '共同守护', title: '修护旧桥，也传下手艺', copy: '古桥的延续离不开巡查、记录与传统修缮，也离不开传承人带徒、校园传习和社区持续使用。维护桥体，也是在让营造知识继续发生。', detail: '保护连接桥体、技艺、自然环境与村落生活。' }
  ];
  const buildNumber = document.getElementById('buildNumber');
  const buildEra = document.getElementById('buildEra');
  const buildTitle = document.getElementById('buildTitle');
  const buildCopy = document.getElementById('buildCopy');
  const buildDetail = document.getElementById('buildDetail');
  document.querySelectorAll('[data-build]').forEach(button => button.addEventListener('click', () => {
    const step = buildSteps[Number(button.dataset.build)];
    if (!step) return;
    document.querySelectorAll('[data-build]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    buildNumber.textContent = String(Number(button.dataset.build) + 1).padStart(2, '0');
    buildEra.textContent = step.era;
    buildTitle.textContent = step.title;
    buildCopy.textContent = step.copy;
    buildDetail.textContent = step.detail;
  }));

  document.querySelectorAll('[data-lightbox]').forEach(button => button.addEventListener('click', () => {
    const image = document.createElement('img');
    image.src = button.dataset.lightbox;
    image.alt = button.querySelector('img')?.alt || '';
    image.className = 'lightbox-image';
    const dialog = document.createElement('dialog');
    dialog.className = 'image-lightbox';
    const close = document.createElement('button');
    close.type = 'button'; close.textContent = '关闭'; close.setAttribute('aria-label', '关闭图片');
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => dialog.remove());
    dialog.append(close, image); document.body.append(dialog); dialog.showModal(); close.focus();
  }));
  const initialPanel = location.hash.slice(1);
  const initialIndex = panels.findIndex(panel => panel.id === initialPanel || panel.contains(document.getElementById(initialPanel)));
  show(initialIndex < 0 ? 0 : initialIndex);
  if (initialPanel && initialIndex >= 0) requestAnimationFrame(() => document.getElementById(initialPanel)?.scrollIntoView({ block: 'start' }));
})();

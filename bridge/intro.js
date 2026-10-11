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
    { era: '桥址与材料', title: '选址备料', copy: '根据河道、跨度与两岸地基确定桥址，备好木料。', detail: '四项为营造与维护的概览，不是具体古桥的施工清单。' },
    { era: '承重拱架', title: '编木成拱', copy: '木料交错搭接，两套体系经横梁联系，组成承重拱架。', detail: '具体做法随桥梁形制、跨度而变化。' },
    { era: '桥面与廊屋', title: '建廊覆瓦', copy: '铺设桥面，建廊屋、覆瓦，安装桥身侧面的风雨板。', detail: '廊屋供人通行，也遮护桥体。' },
    { era: '维护与传承', title: '巡查修护', copy: '检查木材与节点，记录损伤，按传统工艺修缮。', detail: '传承人带徒，在实践中传授营造方法。' }
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

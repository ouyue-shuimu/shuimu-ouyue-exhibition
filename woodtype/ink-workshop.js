/* Shared ink simulation: the visible impression is also used in the PNG export. */
'use strict';
window.createInkWorkshop = function ({ getLetters, getAlignment, onChange }) {
  const $ = id => document.getElementById(id);
  const dialog = $('inkDialog'), canvas = $('inkCanvas'), ctx = canvas.getContext('2d');
  let tiles = [], activePointer = null, last = null, brush = null;
  let phase = "ink", resolvePaper = null;
  const cells = 6, cellCount = cells * cells;
  const coverage = tile => tile.cells.filter(Boolean).length / cellCount;
  const ready = () => tiles.length > 0 && tiles.every(tile => coverage(tile) >= .78);
  const total = () => tiles.length ? tiles.reduce((sum, tile) => sum + coverage(tile), 0) / tiles.length : 0;

  function report() {
    const paperAmount = tiles.length ? tiles.reduce((sum,tile)=>sum+tile.paperCells.filter(Boolean).length/cellCount,0)/tiles.length : 0;
    const complete = phase === 'paper' ? tiles.length > 0 && tiles.every(tile=>tile.paperCells.filter(Boolean).length/cellCount >= .9) : ready();
    const amount = Math.round((phase === 'paper' ? paperAmount : total()) * 100);
    $('inkProgress').value = amount;
    $('inkProgressText').textContent = `${phase === 'paper' ? '刷印' : '上墨'} ${amount}%`;
    $('finishInkBtn').disabled = !complete;
    $('finishInkBtn').textContent = phase === 'paper' ? '揭纸看印页 →' : '完成上墨 →';
    $('inkTitle').textContent = phase === 'paper' ? '覆纸 · 元宝形棕刷' : '上墨 · 墨刷（下刷）';
    $('resetInkBtn').textContent = phase === 'paper' ? '重新刷印' : '重新上墨';
    $('inkInstruction').textContent = phase === 'paper'
      ? (complete ? '纸背已刷匀，可以揭纸查看印迹。' : '宣纸已覆在字版上。按住棕刷，均匀刷过纸背，再揭纸看印迹。')
      : (ready() ? '字面已经吃墨，可以覆纸刷印了。' : '按住墨刷在版面来回刷动，让每枚字的笔画都吃到墨。');
    onChange({ ready: ready(), amount });
  }

  function buildTiles() {
    tiles = window.TypeLayout.positions(getLetters(), getAlignment()).map(tile => ({
      ...tile, cells: Array(cellCount).fill(false), paperCells: Array(cellCount).fill(false)
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, 1000, 380);
    const wood = ctx.createLinearGradient(0, 0, 1000, 380);
    wood.addColorStop(0, '#69472f'); wood.addColorStop(1, '#422e22');
    ctx.fillStyle = wood; ctx.fillRect(0, 0, 1000, 380);
    ctx.strokeStyle = '#9d7550'; ctx.lineWidth = 2; ctx.strokeRect(10, 10, 980, 360);
    for (const tile of tiles) {
      const { x, y, size } = tile;
      ctx.fillStyle = '#281e17'; ctx.fillRect(x + 4, y + 6, size, size);
      const grain = ctx.createLinearGradient(x, y, x + size, y + size);
      grain.addColorStop(0, '#d8b78d'); grain.addColorStop(1, '#a9774c');
      ctx.fillStyle = grain; ctx.fillRect(x, y, size, size);
      ctx.strokeStyle = '#ebcba4'; ctx.strokeRect(x + 2, y + 2, size - 4, size - 4);
      const step = size / cells;
      ctx.fillStyle = 'rgba(30,34,27,.16)';
      tile.cells.forEach((inked, i) => { if (inked) ctx.fillRect(x + i % cells * step, y + Math.floor(i / cells) * step, step, step); });
      ctx.save(); ctx.translate(x + size / 2, y + size / 2); ctx.scale(-1, 1);
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = '400 80px "I.Ming", serif'; ctx.fillStyle = '#735334'; window.TypeLayout.paintGlyph(ctx,tile.char,0,-4);
      ctx.restore();
      ctx.save(); ctx.beginPath();
      tile.cells.forEach((inked, i) => { if (inked) ctx.rect(x + i % cells * step, y + Math.floor(i / cells) * step, step + .5, step + .5); });
      ctx.clip(); ctx.translate(x + size / 2, y + size / 2); ctx.scale(-1, 1);
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '400 80px "I.Ming", serif';
      ctx.fillStyle = '#151d18'; ctx.shadowColor = '#10190f88'; ctx.shadowBlur = 1.5; window.TypeLayout.paintGlyph(ctx,tile.char,0,-4); ctx.restore();
    }
    if (phase === 'paper') {
      ctx.fillStyle = '#f1e6cf'; ctx.fillRect(25, 22, 950, 336);
      ctx.strokeStyle = '#d6c4a2'; ctx.lineWidth = 1; ctx.strokeRect(25, 22, 950, 336);
      for (const tile of tiles) tile.paperCells.forEach((done, i) => {
        if (!done) return;
        const step = tile.size / cells;
        ctx.fillStyle = 'rgba(120,101,68,.09)';
        ctx.fillRect(tile.x + i % cells * step, tile.y + Math.floor(i / cells) * step, step, step);
      });
    }
    if (brush) drawTraditionalBrush(brush, phase === 'paper');
  }

  function drawTraditionalBrush(point, paper) {
    ctx.save(); ctx.translate(point.x, point.y);
    // The contact surface remains centered on the pointer and matches the ink footprint.
    ctx.fillStyle='rgba(30,23,15,.16)';
    ctx.beginPath();ctx.ellipse(2,12,paper?72:49,24,0,0,Math.PI*2);ctx.fill();
    if (paper) {
      // Palm-fibre rubbing brush: broad rounded ends and a bound, pinched waist.
      const body=ctx.createLinearGradient(0,-49,0,22);
      body.addColorStop(0,'#cfac75');body.addColorStop(.5,'#997343');body.addColorStop(1,'#604329');
      ctx.fillStyle=body;ctx.strokeStyle='#5c422a';ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(-69,15);
      ctx.bezierCurveTo(-77,-7,-64,-48,-46,-48);
      ctx.bezierCurveTo(-28,-46,-25,-21,0,-22);
      ctx.bezierCurveTo(25,-21,28,-46,46,-48);
      ctx.bezierCurveTo(64,-48,77,-7,69,15);
      ctx.quadraticCurveTo(0,35,-69,15);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.save();ctx.clip();
      for(let x=-70;x<=70;x+=2.6){
        ctx.strokeStyle=(Math.round(x*10)%3===0)?'#d5b782':'#775330';ctx.lineWidth=.75;
        ctx.beginPath();ctx.moveTo(x*.83,-52);
        ctx.bezierCurveTo(x*.68,-20,x*1.03,-4,x,25+(Math.sin(x)*2));ctx.stroke();
      }
      ctx.restore();
      // Thread binding around the narrower central grip, not a projecting wooden handle.
      for(let y=-24;y<=7;y+=4){
        ctx.strokeStyle=y%8===0?'#d8c195':'#6b5033';ctx.lineWidth=2.5;
        ctx.beginPath();ctx.moveTo(-19,y);ctx.quadraticCurveTo(0,y+8,19,y);ctx.stroke();
      }
      ctx.strokeStyle='#dbc295';ctx.lineWidth=1.4;
      ctx.beginPath();ctx.moveTo(-16,-20);ctx.lineTo(16,7);ctx.moveTo(16,-20);ctx.lineTo(-16,7);ctx.stroke();
    } else {
      // Compact bound bristle bundle (ink brush / lower brush), with ink-darkened tips.
      const body=ctx.createLinearGradient(0,-60,0,25);
      body.addColorStop(0,'#a58a59');body.addColorStop(.42,'#75613f');body.addColorStop(.72,'#363b2c');body.addColorStop(1,'#141d17');
      ctx.fillStyle=body;ctx.strokeStyle='#383323';ctx.lineWidth=1.4;
      ctx.beginPath();ctx.moveTo(-24,-56);ctx.quadraticCurveTo(0,-67,24,-56);
      ctx.bezierCurveTo(30,-38,43,-14,47,13);ctx.quadraticCurveTo(0,34,-47,13);
      ctx.bezierCurveTo(-43,-14,-30,-38,-24,-56);ctx.closePath();ctx.fill();ctx.stroke();
      ctx.save();ctx.clip();
      for(let x=-45;x<=45;x+=2.5){
        ctx.strokeStyle=x%5===0?'#a79268':'#4a4b34';ctx.lineWidth=.7;
        ctx.beginPath();ctx.moveTo(x*.51,-61);
        ctx.bezierCurveTo(x*.58,-33,x*.9,-3,x,20+Math.sin(x)*2);ctx.stroke();
      }
      ctx.restore();
      for(let y=-49;y<=-29;y+=4){
        ctx.strokeStyle=y%8===-1?'#d0b789':'#725535';ctx.lineWidth=2.8;
        ctx.beginPath();ctx.moveTo(-28,y);ctx.quadraticCurveTo(0,y+8,28,y);ctx.stroke();
      }
      ctx.fillStyle='#2c3022';ctx.beginPath();ctx.ellipse(0,-55,24,7,0,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle='#b49a67';ctx.lineWidth=1;ctx.stroke();
    }
    ctx.restore();
  }

  function stamp(point) {
    for (const tile of tiles) {
      const step = tile.size / cells;
      for (let row = 0; row < cells; row++) for (let col = 0; col < cells; col++) {
        const x = tile.x + (col + .5) * step, y = tile.y + (row + .5) * step;
        const radiusX = phase === 'paper' ? 70 : 47;
        if (Math.pow((point.x-x)/radiusX,2) + Math.pow((point.y-y)/26,2) <= 1)
          (phase === 'paper' ? tile.paperCells : tile.cells)[row*cells+col] = true;
      }
    }
    brush = point;
  }
  function stroke(from, to) {
    window.JourneySfx?.brush(Math.hypot(to.x-from.x,to.y-from.y),phase);
    const steps = Math.max(1, Math.ceil(Math.hypot(to.x - from.x, to.y - from.y) / 10));
    for (let i = 1; i <= steps; i++) stamp({ x: from.x + (to.x - from.x) * i / steps, y: from.y + (to.y - from.y) * i / steps });
    draw(); report();
  }
  function point(event) { const rect = canvas.getBoundingClientRect(); return { x: (event.clientX - rect.left) * 1000 / rect.width, y: (event.clientY - rect.top) * 380 / rect.height }; }
  canvas.addEventListener('pointerdown', event => {
    if (activePointer !== null) return;
    event.preventDefault(); activePointer = event.pointerId; canvas.setPointerCapture(event.pointerId);
    last = point(event); stroke(last, last);
  });
  canvas.addEventListener('pointermove', event => {
    if (event.pointerId !== activePointer) return;
    const next = point(event); stroke(last, next); last = next;
  });
  function endPointer(event) { if (event.pointerId === activePointer) { activePointer = null; last = null; window.JourneySfx?.stopBrush(); } }
  canvas.addEventListener('pointerup', endPointer); canvas.addEventListener('pointercancel', endPointer); canvas.addEventListener('lostpointercapture', endPointer);

  function stop() { activePointer = null; last = null; window.JourneySfx?.stopBrush(); report(); }
  dialog.addEventListener('close', () => { stop(); if(resolvePaper){const resolve=resolvePaper;resolvePaper=null;resolve(false);} });
  $('closeInkBtn').addEventListener('click', () => dialog.close());
  $('resetInkBtn').addEventListener('click', () => { stop(); if(phase==='paper')tiles.forEach(tile=>tile.paperCells.fill(false));else buildTiles(); brush = { x: 500, y: 330 }; draw(); report(); });
  $('finishInkBtn').addEventListener('click', () => {
    if ($('finishInkBtn').disabled) return;
    if (phase === 'paper' && resolvePaper) { window.JourneySfx?.cue('reveal');const resolve=resolvePaper;resolvePaper=null;resolve(true); }
    dialog.close(); $('printBtn').focus();
  });
  async function open() {
    if (!getLetters().length) return;
    phase = 'ink';
    if (!tiles.length) buildTiles();
    dialog.showModal(); brush = { x: 500, y: 330 }; draw(); report();
    try { await document.fonts.load('400 80px "I.Ming"'); } catch (_) {}
    if (dialog.open) draw();
  }
  function coverAndPrint() {
    if (!ready()) return Promise.resolve(false);
    window.JourneySfx?.cue('paper');
    phase='paper';tiles.forEach(tile=>tile.paperCells.fill(false));
    return new Promise(resolve=>{resolvePaper=resolve;dialog.showModal();brush={x:500,y:320};draw();report();});
  }
  function reset() { stop(); tiles = []; brush = null; if (dialog.open) dialog.close(); report(); }

  function random(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  async function impression(phrase) {
    try { await document.fonts.load('400 80px "I.Ming"'); } catch (_) {}
    const chars = Array.from(phrase), result = document.createElement('canvas'); result.width = 1400; result.height = 532;
    const out = result.getContext('2d'), layout = window.TypeLayout.reflected(chars, getAlignment());
    out.scale(1.4, 1.4);
    const inkAmounts = tiles.map(coverage);
    const seed = chars.reduce((n, ch) => Math.imul(n, 31) + ch.codePointAt(0) | 0, 7281), rng = random(seed);
    chars.forEach((char, index) => {
      const glyph = document.createElement('canvas'); glyph.width = 118; glyph.height = 118;
      const g = glyph.getContext('2d');
      g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = '400 80px "I.Ming", serif';
      const tone = Math.floor(27 + rng() * 12); g.fillStyle = `rgb(${tone},${tone + 3},${tone - 2})`;
      window.TypeLayout.paintGlyph(g,char,59,55);
      g.globalCompositeOperation = 'destination-in';
      const density = g.createLinearGradient(15, 12, 105, 110);
      density.addColorStop(0, `rgba(0,0,0,${.78 + rng() * .15})`); density.addColorStop(.48, 'rgba(0,0,0,1)'); density.addColorStop(1, `rgba(0,0,0,${.8 + rng() * .14})`);
      g.fillStyle = density; g.fillRect(0, 0, 118, 118);
      g.globalCompositeOperation = 'destination-out';
      // Ink breaks stay inside the strokes: the paper itself remains clean.
      for (let n = 0; n < 65; n++) {
        g.fillStyle = `rgba(0,0,0,${.2 + rng() * .6})`; g.beginPath();
        g.ellipse(15 + rng() * 90, 12 + rng() * 95, .35 + rng() * 1.05, .2 + rng() * .65, rng() * Math.PI, 0, Math.PI * 2); g.fill();
      }
      for (let n = 0; n < 9; n++) {
        const x = 15 + rng() * 90, y = 12 + rng() * 95;
        g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = .35 + rng() * .55;
        g.beginPath(); g.moveTo(x, y); g.lineTo(x + 3 + rng() * 7, y + rng() * 2); g.stroke();
      }
      const tile = layout[index];
      out.save();
      out.globalAlpha = .83 + (inkAmounts[index] || .85) * .17;
      out.shadowColor = 'rgba(38,36,27,.17)'; out.shadowBlur = .4;
      // No independent reflow, jitter or rotation: every glyph reflects its plate position.
      out.drawImage(glyph, tile.x, tile.y);
      out.restore();
    });
    return result;
  }
  function preview(target) {
    target.width = 1000; target.height = 380;
    const context = target.getContext('2d');
    context.font = '400 80px "I.Ming", serif';
    context.textAlign = 'center'; context.textBaseline = 'middle'; context.fillStyle = '#30372c';
    for (const tile of window.TypeLayout.reflected(getLetters(), getAlignment())) {
      window.TypeLayout.paintGlyph(context,tile.char,tile.x+tile.size/2,tile.y+tile.size/2-4);
    }
  }
  return { open, reset, ready, impression, preview, coverAndPrint, amounts: () => tiles.map(coverage) };
};

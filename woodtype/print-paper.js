/* Procedural handmade-paper rendering: real font glyphs, no AI-generated lettering. */
'use strict';
window.PrintPaper = (() => {
  const width = 640, height = 820;
  function random(seed) {
    return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }
  let texture = null, rules = null;
  function makeTexture() {
    const c = document.createElement('canvas'); c.width = width; c.height = height;
    const g = c.getContext('2d'), rng = random(284913);
    const image = g.createImageData(width, height);
    for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const cloud = Math.sin(x / 58 + Math.sin(y / 107)) * 2.1 + Math.sin(y / 79) * 1.8 + Math.sin(x / 7 + y / 9) * .7;
      const edge = Math.pow(Math.max(Math.abs(x - width / 2) / (width / 2), Math.abs(y - height / 2) / (height / 2)), 9) * 4;
      const grain = (rng() - .5) * 13 + cloud - edge;
      image.data[i] = 246 + grain; image.data[i + 1] = 240 + grain; image.data[i + 2] = 222 + grain; image.data[i + 3] = 255;
    }
    g.putImageData(image, 0, 0);
    // Visible mixed fibres and a few pulp flecks, without distressed yellow age stains.
    for (let i = 0; i < 4300; i++) {
      const x = rng() * width, y = rng() * height, length = 3 + rng() * 24, angle = rng() * Math.PI * 2;
      const dx = Math.cos(angle) * length, dy = Math.sin(angle) * length;
      g.strokeStyle = i % 3 ? `rgba(131,113,77,${.065 + rng() * .12})` : `rgba(255,253,242,${.3 + rng() * .3})`;
      g.lineWidth = .45 + rng() * .85; g.beginPath(); g.moveTo(x, y);
      g.quadraticCurveTo(x + dx * .4 + 1.5, y + dy * .4, x + dx, y + dy); g.stroke();
    }
    for (let i = 0; i < 500; i++) {
      g.fillStyle = `rgba(153,132,85,${.045 + rng() * .09})`; g.beginPath();
      g.ellipse(rng() * width, rng() * height, .4 + rng() * 1.3, .25 + rng() * .6, rng() * Math.PI, 0, Math.PI * 2); g.fill();
    }
    return c;
  }
  function makeRules() {
    const c = document.createElement('canvas'); c.width = width; c.height = height;
    const g = c.getContext('2d'), rng = random(77216);
    g.strokeStyle = '#38382e'; g.lineWidth = 7; g.strokeRect(40, 82, 560, 642);
    g.strokeStyle = '#444338'; g.lineWidth = 1.5; g.strokeRect(54, 96, 532, 614);
    g.strokeStyle = 'rgba(62,61,48,.62)'; g.lineWidth = .9;
    for (const x of [232, 408]) { g.beginPath(); g.moveTo(x, 97); g.lineTo(x, 709); g.stroke(); }
    g.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 2300; i++) {
      g.fillStyle = `rgba(0,0,0,${.3 + rng() * .65})`;
      g.beginPath(); g.ellipse(rng() * width, 78 + rng() * 652, .5 + rng() * 1.7, .3 + rng() * 1, rng() * Math.PI, 0, Math.PI * 2); g.fill();
    }
    return c;
  }
  function paint(g, { frame = true, caption = true } = {}) {
    texture ||= makeTexture(); g.drawImage(texture, 0, 0);
    if (frame) { rules ||= makeRules(); g.drawImage(rules, 0, 0); }
    if (caption) {
      g.save(); g.fillStyle = '#575444'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.font = '400 20px "I.Ming", serif'; g.fillText('水木之间 · 木活字印页', width / 2, 45);
      g.font = '400 16px "I.Ming", serif'; g.fillStyle = '#7b7564';
      g.fillText('宗谱版式启发 · 数字体验', width / 2, 767); g.restore();
    }
  }
  return { paint, width, height };
})();

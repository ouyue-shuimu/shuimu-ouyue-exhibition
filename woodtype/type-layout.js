/* One physical plate, shared by composition, inking and the reflected impression. */
'use strict';
window.TypeLayout = {
  // Display treatment only; the licensed font file remains unchanged.
  paintGlyph(ctx, char, x, y) {
    ctx.save();ctx.translate(x,y);ctx.scale(1.08,.94);
    ctx.font='400 80px "I.Ming", serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(char,0,0);
    // Strengthen upright cuts while preserving the old-Song thin horizontal strokes and counters.
    // This is a digital treatment of I.Ming, not a reproduction of a historical Ruian type block.
    ctx.fillText(char,-.78,0);ctx.fillText(char,.78,0);
    ctx.restore();
  },
  drawFace(canvas, char, mirror = true) {
    canvas.width = 118; canvas.height = 118;
    const ctx = canvas.getContext('2d');
    if (mirror) { ctx.translate(118, 0); ctx.scale(-1, 1); }
    ctx.font = '400 80px "I.Ming", serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#24231c'; this.paintGlyph(ctx,char,59,55);
  },
  paintPlateFrame(ctx) {
    ctx.save(); ctx.strokeStyle = '#bf9265'; ctx.lineWidth = 7;
    ctx.strokeRect(40, 82, 560, 642); ctx.lineWidth = 1.5; ctx.strokeRect(54, 96, 532, 614);
    ctx.lineWidth = .9;
    for (const x of [232, 408]) { ctx.beginPath(); ctx.moveTo(x, 97); ctx.lineTo(x, 709); ctx.stroke(); }
    ctx.restore();
  },
  drawPlateFrame(canvas) {
    canvas.width = this.width * 2; canvas.height = this.height * 2;
    const ctx = canvas.getContext('2d'); ctx.scale(2, 2); this.paintPlateFrame(ctx);
  },
  forPrinting(letters) {
    // Data stays in reading order. Only the physical coordinates and glyph faces mirror.
    return [...letters];
  },
  reading(letters) { return letters.join(''); },
  width: 640, height: 820, size: 118, rows: 4, columns: 3,
  positions(letters, alignment = 'left') {
    const { size, rows } = this;
    return letters.map((char, index) => {
      const col = Math.floor(index / rows), row = index % rows;
      const count = Math.min(rows, letters.length - col * rows);
      const offset = alignment === 'center' ? (rows - count) * 75 : alignment === 'right' ? (rows - count) * 150 : 0;
      // Plate columns run left-to-right; the reflected printed page runs right-to-left.
      return { char, index, size, x: 85 + col * 176, y: 126 + row * 150 + offset };
    });
  },
  reflected(letters, alignment = 'left') {
    return this.positions(letters, alignment).map(tile => ({ ...tile, x: this.width - tile.x - tile.size }));
  }
};

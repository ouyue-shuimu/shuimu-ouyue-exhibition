/* One physical plate, shared by composition, inking and the reflected impression. */
'use strict';
window.TypeLayout = {
  // Display treatment only; the licensed font file remains unchanged.
  paintGlyph(ctx, char, x, y) {
    ctx.save();ctx.translate(x,y);ctx.scale(1.08,.94);
    ctx.font='400 80px "I.Ming", serif';ctx.textAlign='center';ctx.textBaseline='middle';
    ctx.fillText(char,0,0);
    // A tiny horizontal spread strengthens vertical cuts without equally thickening horizontals.
    ctx.fillText(char,-.28,0);ctx.fillText(char,.28,0);
    ctx.restore();
  },
  drawFace(canvas, char, mirror = true) {
    canvas.width = 118; canvas.height = 118;
    const ctx = canvas.getContext('2d');
    if (mirror) { ctx.translate(118, 0); ctx.scale(-1, 1); }
    ctx.font = '400 80px "I.Ming", serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#24231c'; this.paintGlyph(ctx,char,59,55);
  },
  forPrinting(letters) {
    const result = [];
    for (let i = 0; i < letters.length; i += 6) result.push(...letters.slice(i, i + 6).reverse());
    return result;
  },
  reading(letters) { return this.forPrinting(letters).join(''); },
  width: 1000, height: 380, size: 118, gap: 18, columns: 6,
  positions(letters, alignment = 'left') {
    const { width, height, size, gap, columns } = this;
    const rows = Math.ceil(letters.length / columns);
    const margin = (width - columns * size - (columns - 1) * gap) / 2;
    return letters.map((char, index) => {
      const row = Math.floor(index / columns), col = index % columns;
      const count = Math.min(columns, letters.length - row * columns);
      const rowWidth = count * size + (count - 1) * gap;
      const start = alignment === 'center' ? (width - rowWidth) / 2 : alignment === 'right' ? width - margin - rowWidth : margin;
      return { char, index, size, x: start + col * (size + gap), y: (height - rows * size - (rows - 1) * gap) / 2 + row * (size + gap) };
    });
  },
  reflected(letters, alignment = 'left') {
    return this.positions(letters, alignment).map(tile => ({ ...tile, x: this.width - tile.x - tile.size }));
  }
};

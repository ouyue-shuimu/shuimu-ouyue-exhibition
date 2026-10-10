(() => {
  "use strict";
  const scene = document.querySelector(".scene");
  const image = scene.querySelector(".scene-image");
  const canvas = scene.querySelector(".cloud-canvas");
  const toggle = scene.querySelector(".motion-toggle");
  const context = canvas.getContext("2d");
  if (!context) return;

  let paused = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let time = 0;
  let previous = 0;
  let lastPaint = 0;
  let width = 0;
  let height = 0;
  let pixelRatio = 1;

  function setMotion(nextPaused) {
    paused = nextPaused;
    scene.dataset.motion = paused ? "paused" : "playing";
    toggle.textContent = paused ? "播放动效" : "暂停动效";
    toggle.setAttribute("aria-label", paused ? "播放云层和小船动画" : "暂停云层和小船动画");
  }
  setMotion(paused);
  toggle.addEventListener("click", () => setMotion(!paused));

  // Masks follow the painted cloud banks in the 1672 × 941 source.
  // Drawing into canvas does not read pixels, so this also works from file://.
  const definitions = [
    { x: 0, y: 0, w: 460, h: 155,
      ellipses: [[95, 17, 325, 99], [185, 71, 220, 58]],
      dx: 43, dy: 5, period: 15, phase: 0 },
    { x: 0, y: 625, w: 740, h: 316,
      ellipses: [[-15, 101, 191, 100], [361, 350, 411, 136]],
      dx: 37, dy: 6, period: 18, phase: .4 },
    { x: 1110, y: 600, w: 562, h: 341,
      ellipses: [[607, 183, 225, 182], [438, 348, 372, 157]],
      dx: -46, dy: 6, period: 17, phase: -.25 }
  ];

  const layers = definitions.map(def => {
    const patch = document.createElement("canvas");
    const mask = document.createElement("canvas");
    patch.width = mask.width = def.w;
    patch.height = mask.height = def.h;
    const paint = patch.getContext("2d");
    const maskContext = mask.getContext("2d");
    for (const [x, y, rx, ry] of def.ellipses) {
      maskContext.save();
      maskContext.translate(x, y);
      maskContext.scale(rx, ry);
      const gradient = maskContext.createRadialGradient(0, 0, 0, 0, 0, 1);
      gradient.addColorStop(0, "rgba(255,255,255,1)");
      gradient.addColorStop(.68, "rgba(255,255,255,1)");
      gradient.addColorStop(.87, "rgba(255,255,255,.65)");
      gradient.addColorStop(1, "rgba(255,255,255,0)");
      maskContext.fillStyle = gradient;
      maskContext.fillRect(-1, -1, 2, 2);
      maskContext.restore();
    }
    return { ...def, patch, mask, paint };
  });

  function resize() {
    width = scene.clientWidth;
    height = scene.clientHeight;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * pixelRatio);
    canvas.height = Math.round(height * pixelRatio);
  }

  function render() {
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const positionX = width <= height ? .19 : .5;
    const offsetX = (width - image.naturalWidth * scale) * positionX;
    const offsetY = (height - image.naturalHeight * scale) * .5;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    context.clearRect(0, 0, width, height);
    context.translate(offsetX, offsetY);
    context.scale(scale, scale);
    for (const layer of layers) {
      const phase = time * Math.PI * 2 / layer.period;
      const x = layer.dx * (Math.sin(phase + layer.phase) - Math.sin(layer.phase));
      const y = layer.dy * Math.sin(phase * .8);
      layer.paint.globalCompositeOperation = "source-over";
      layer.paint.clearRect(0, 0, layer.w, layer.h);
      layer.paint.drawImage(image, -layer.x + x, -layer.y + y);
      layer.paint.globalCompositeOperation = "destination-in";
      layer.paint.drawImage(layer.mask, 0, 0);
      context.drawImage(layer.patch, layer.x, layer.y);
    }
  }

  function frame(now) {
    const delta = previous ? Math.min((now - previous) / 1000, .1) : 0;
    previous = now;
    if (!paused && !document.hidden) time += delta;
    if (!document.hidden && now - lastPaint >= 1000 / 30) {
      render();
      lastPaint = now;
    }
    requestAnimationFrame(frame);
  }

  async function start() {
    if (!image.complete || !image.naturalWidth) {
      await new Promise((resolve, reject) => {
        image.addEventListener("load", resolve, { once: true });
        image.addEventListener("error", reject, { once: true });
      });
    }
    resize();
    render();
    toggle.hidden = false;
    new ResizeObserver(resize).observe(scene);
    requestAnimationFrame(frame);
  }
  start().catch(error => console.error("Cloud animation could not start:", error));
})();


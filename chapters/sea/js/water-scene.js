import * as THREE from 'three';

/** Five image-backed planes share one renderer. White mask pixels are water. */
export class WaterScene {
  constructor(stage, onError = () => {}) {
    this.stage = stage;
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, .1, 10);
    this.camera.position.z = 1;
    try {
      this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      this.renderer.setSize(stage.clientWidth, stage.clientHeight, false);
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      this.renderer.domElement.id = 'waterCanvas';
      this.renderer.domElement.setAttribute('aria-hidden', 'true');
      stage.insertBefore(this.renderer.domElement, document.getElementById('actorsCanvas'));
      this.loader = new THREE.TextureLoader();
      this.planes = [];
      for (let i = 0; i < 5; i++) this.addPlane(i);
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(stage);
      this.available = true;
    } catch (error) {
      onError(error);
      this.available = false;
    }
  }
  addPlane(i) {
    const load = (url, colorSpace) => {
      const texture = this.loader.load(url);
      texture.colorSpace = colorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      return texture;
    };
    const sceneTexture = load(`assets/backgrounds/0${i + 1}-净底图.png`, THREE.SRGBColorSpace);
    const maskTexture = load(`assets/masks/0${i + 1}-水域.png`, THREE.NoColorSpace);
    const material = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, uniforms: {
        uScene: { value: sceneTexture }, uMask: { value: maskTexture }, uTime: { value: 0 },
        uOpacity: { value: 0 }, uStrength: { value: .00105 }
      },
      vertexShader: `varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position,1.0);}`,
      fragmentShader: `uniform sampler2D uScene;uniform sampler2D uMask;uniform float uTime;uniform float uOpacity;uniform float uStrength;varying vec2 vUv;
        void main(){float mask=texture2D(uMask,vUv).r;vec2 wave=vec2(sin(vUv.y*180.0+uTime*.75),cos(vUv.x*130.0-uTime*.52)*.25)*uStrength;
        float edge=min(mask,texture2D(uMask,vUv+wave).r);vec3 still=texture2D(uScene,vUv).rgb;vec3 moved=texture2D(uScene,vUv+wave).rgb;
        gl_FragColor=vec4(mix(still,moved,edge),edge*uOpacity);
        #include <colorspace_fragment>
      }`
    });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    this.scene.add(mesh);
    this.planes.push(mesh);
  }
  resize() {
    if (!this.renderer) return;
    const { clientWidth, clientHeight } = this.stage;
    if (clientWidth && clientHeight) this.renderer.setSize(clientWidth, clientHeight, false);
  }
  update(time, active, previous, transition) {
    if (!this.available) return;
    for (let i = 0; i < this.planes.length; i++) {
      const u = this.planes[i].material.uniforms;
      u.uTime.value = time;
      u.uOpacity.value = i === active ? transition : (i === previous ? 1 - transition : 0);
    }
    this.renderer.render(this.scene, this.camera);
  }
  dispose() {
    this.resizeObserver?.disconnect();
    this.planes?.forEach(p => { p.geometry.dispose(); p.material.uniforms.uScene.value.dispose(); p.material.uniforms.uMask.value.dispose(); p.material.dispose(); });
    this.renderer?.dispose();
  }
}

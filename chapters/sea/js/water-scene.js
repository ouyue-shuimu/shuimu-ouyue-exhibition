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
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.15));
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
        uOpacity: { value: 0 }, uStrength: { value: 2.6 }
      },
      vertexShader: `varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position,1.0);}`,
      fragmentShader: `uniform sampler2D uScene;uniform sampler2D uMask;uniform float uTime;uniform float uOpacity;uniform float uStrength;varying vec2 vUv;
 void main(){
  float mask=texture2D(uMask,vUv).r;
  if(mask<.002){gl_FragColor=vec4(0.);return;}
  vec2 p=vec2(vUv.x*1.777,1.-vUv.y);
  float depth=.35+.65*smoothstep(.3,1.,p.y);
  float broad=sin(p.x*19.+p.y*27.-uTime*.43);
  float small=sin(p.x*41.-p.y*67.+sin(p.x*9.)*.85-uTime*.68);
  vec2 wave=vec2(broad*.0008+small*.00042,small*.00024)*uStrength*depth;
  float phase=fract(uTime*.04),phaseB=fract(phase+.5),blend=abs(phase*2.-1.);
  vec2 current=vec2(.014,-.0015)*uStrength*depth;
  vec2 a=wave+current*(phase-.5),b=wave+current*(phaseB-.5);
  float edge=mask*texture2D(uMask,vUv+a).r*texture2D(uMask,vUv+b).r;
  vec3 still=texture2D(uScene,vUv).rgb;
  vec3 moved=mix(texture2D(uScene,vUv+a*edge).rgb,texture2D(uScene,vUv+b*edge).rgb,blend);
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
    if (!this.available || document.hidden) return;
    const settings={enabled:true,strength:2.6};
    if(!settings.enabled&&this.wasDisabled)return;
    if(this.lastRender!==undefined&&time-this.lastRender<1/30)return;
    this.lastRender=time;this.wasDisabled=!settings.enabled;
    const frozen=matchMedia('(prefers-reduced-motion: reduce)').matches;
    for (let i = 0; i < this.planes.length; i++) {
      const u = this.planes[i].material.uniforms;
      u.uTime.value = frozen?0:time; u.uStrength.value=settings.strength;
      u.uOpacity.value = settings.enabled?(i === active ? transition : (i === previous ? 1 - transition : 0)):0; this.planes[i].visible=u.uOpacity.value>.001;
    }
    this.renderer.render(this.scene, this.camera);
  }
  dispose() {
    this.resizeObserver?.disconnect();
    this.planes?.forEach(p => { p.geometry.dispose(); p.material.uniforms.uScene.value.dispose(); p.material.uniforms.uMask.value.dispose(); p.material.dispose(); });
    this.renderer?.dispose();
  }
}

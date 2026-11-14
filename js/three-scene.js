// ============================================================
// Portfolio v4 — Three.js background scene
// Neon grid floor · wireframe core · floating code cards · data stream
// ============================================================
import * as THREE from "three";

const canvas = document.getElementById("webgl");
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
const MOBILE = matchMedia("(max-width: 768px)").matches;

function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch { return false; }
}

if (canvas && supportsWebGL()) init();
else canvas?.remove();

function init() {
  const GREEN = new THREE.Color("#39ff88");
  const CYAN = new THREE.Color("#22d3ee");

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !MOBILE, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, MOBILE ? 1.5 : 2));
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x07090d, 0.055);

  const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 0.6, 9);

  /* ---------------- Grid floor (shader) ---------------- */
  const gridMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uTime: { value: 0 }, uColor: { value: GREEN }, uColor2: { value: CYAN } },
    vertexShader: /* glsl */ `
      varying vec3 vPos;
      void main() {
        vPos = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform float uTime;
      uniform vec3 uColor;
      uniform vec3 uColor2;
      varying vec3 vPos;
      float grid(vec2 p, float size) {
        vec2 g = abs(fract(p / size - 0.5) - 0.5) / fwidth(p / size);
        return 1.0 - min(min(g.x, g.y), 1.0);
      }
      void main() {
        vec2 p = vPos.xy;
        p.y += uTime * 0.8;
        float big = grid(p, 2.0);
        float small = grid(p, 0.5) * 0.25;
        float d = length(vPos.xy) / 30.0;
        float fade = smoothstep(1.0, 0.05, d);
        vec3 col = mix(uColor, uColor2, smoothstep(-10.0, 10.0, vPos.x));
        float a = (big + small) * fade * 0.55;
        gl_FragColor = vec4(col, a);
      }`,
    extensions: { derivatives: true },
  });
  const grid = new THREE.Mesh(new THREE.PlaneGeometry(60, 60, 1, 1), gridMat);
  grid.rotation.x = -Math.PI / 2;
  grid.position.y = -2.6;
  scene.add(grid);

  /* ---------------- Core (wireframe + points) ---------------- */
  const core = new THREE.Group();
  scene.add(core);

  const icoGeo = new THREE.IcosahedronGeometry(1.7, 1);
  const wire = new THREE.LineSegments(
    new THREE.EdgesGeometry(icoGeo),
    new THREE.LineBasicMaterial({ color: GREEN, transparent: true, opacity: 0.75 })
  );
  core.add(wire);

  const inner = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.05, 0),
    new THREE.MeshBasicMaterial({ color: CYAN, wireframe: true, transparent: true, opacity: 0.35 })
  );
  core.add(inner);

  // glowing vertices on a denser sphere
  const dotsGeo = new THREE.IcosahedronGeometry(2.25, 4);
  const dotTex = makeDotTexture();
  const dots = new THREE.Points(dotsGeo, new THREE.PointsMaterial({
    size: 0.05, map: dotTex, color: GREEN, transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  core.add(dots);

  // orbit rings
  const ringMat = new THREE.MeshBasicMaterial({ color: GREEN, transparent: true, opacity: 0.25, side: THREE.DoubleSide });
  const ring1 = new THREE.Mesh(new THREE.TorusGeometry(3.0, 0.006, 8, 160), ringMat);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.4, 0.004, 8, 160), ringMat.clone());
  ring1.rotation.x = Math.PI / 2.4;
  ring2.rotation.x = Math.PI / 1.8; ring2.rotation.y = 0.5;
  ring2.material.color = CYAN;
  core.add(ring1, ring2);

  // satellite orbiting ring1
  const sat = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), new THREE.MeshBasicMaterial({ color: GREEN }));
  core.add(sat);

  /* ---------------- Floating code cards ---------------- */
  const SNIPPETS = [
    ["@Component({", "  selector: 'app-root',", "  changeDetection: OnPush", "})"],
    ["[HttpGet(\"{id}\")]", "public async Task<IActionResult>", "  Get(int id) => Ok(await", "  _svc.FindAsync(id));"],
    ["SELECT TOP 10 *", "FROM Orders o", "JOIN Users u ON u.Id = o.UserId", "ORDER BY o.CreatedAt DESC;"],
    ["class Attention(nn.Module):", "  def forward(self, x):", "    q, k, v = self.qkv(x)", "    return softmax(q@k.T)@v"],
    ["this.data$ = this.http", "  .get<User[]>(url)", "  .pipe(retry(2),", "        shareReplay(1));"],
    ["app.post('/api/auth',", "  async (req, res) => {", "  const token = jwt.sign(..)", "  res.json({ token }); });"],
  ];
  const cards = [];
  const cardCount = MOBILE ? 3 : SNIPPETS.length;
  for (let i = 0; i < cardCount; i++) {
    const tex = makeCodeTexture(SNIPPETS[i], i);
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.2), mat);
    const angle = (i / cardCount) * Math.PI * 2;
    const radius = MOBILE ? 3.2 : 4.2;
    mesh.userData = { angle, radius, y: (i % 2 ? 1 : -1) * (0.6 + Math.random() * 1.2), speed: 0.05 + Math.random() * 0.04, phase: Math.random() * 10 };
    cards.push(mesh);
    scene.add(mesh);
  }

  /* ---------------- Data stream particles ---------------- */
  const COUNT = MOBILE ? 500 : 1400;
  const pos = new Float32Array(COUNT * 3);
  const spd = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 34;
    pos[i * 3 + 1] = Math.random() * 14 - 4;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 4;
    spd[i] = 0.4 + Math.random() * 1.2;
  }
  const streamGeo = new THREE.BufferGeometry();
  streamGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const stream = new THREE.Points(streamGeo, new THREE.PointsMaterial({
    size: 0.06, map: dotTex, color: GREEN, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  scene.add(stream);

  /* ---------------- Interaction state ---------------- */
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  addEventListener("pointermove", (e) => {
    mouse.tx = (e.clientX / innerWidth) * 2 - 1;
    mouse.ty = (e.clientY / innerHeight) * 2 - 1;
  }, { passive: true });

  let scrollK = 0, scrollT = 0, burst = 0;
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    scrollT = max > 0 ? scrollY / max : 0;
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // click on hero → energy pulse on the core
  addEventListener("pointerdown", (e) => { if (e.target.closest?.("#hero") && !e.target.closest("a,button,.terminal")) burst = 1; });

  let intro = 0; // fades the scene in after boot
  window.addEventListener("app:ready", () => { intro = 0.0001; }, { once: true });
  if (!document.body.classList.contains("is-loading")) intro = 0.0001;

  /* ---------------- Resize ---------------- */
  function resize() {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight, false);
    core.position.x = innerWidth > 1080 ? 2.6 : 0;
    core.position.y = innerWidth > 1080 ? 0.2 : 2.4;
    core.position.z = innerWidth > 1080 ? 0 : -4;
  }
  addEventListener("resize", resize);
  resize();

  /* ---------------- Loop ---------------- */
  const clock = new THREE.Clock();
  let running = true;
  document.addEventListener("visibilitychange", () => {
    running = !document.hidden;
    if (running) { clock.getDelta(); requestAnimationFrame(tick); }
  });

  const baseCoreX = () => (innerWidth > 1080 ? 2.6 : 0);

  function tick() {
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    const motion = REDUCED ? 0.15 : 1;

    if (intro > 0 && intro < 1) intro = Math.min(1, intro + dt * 0.7);
    const ease = 1 - Math.pow(1 - intro, 3);

    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    scrollK += (scrollT - scrollK) * 0.08;
    burst *= 0.94;

    // grid
    gridMat.uniforms.uTime.value = t * motion;

    // core
    const s = (innerWidth > 1080 ? 1.3 : 0.75) * (0.6 + ease * 0.4) * (1 + burst * 0.25) * (1 - scrollK * 0.35);
    core.scale.setScalar(s);
    core.rotation.y += dt * 0.25 * motion + burst * 0.05;
    core.rotation.x = mouse.y * 0.3 + Math.sin(t * 0.3) * 0.1;
    core.position.x = baseCoreX() + mouse.x * 0.3 - scrollK * (innerWidth > 1080 ? 5 : 0);
    inner.rotation.x -= dt * 0.6 * motion;
    inner.rotation.z += dt * 0.4 * motion;
    dots.rotation.y -= dt * 0.08 * motion;
    dots.material.opacity = 0.8 * ease;
    wire.material.opacity = (0.55 + Math.sin(t * 2) * 0.15 + burst * 0.4) * ease * (MOBILE ? 0.5 : 1);
    dots.material.opacity *= MOBILE ? 0.5 : 1;
    ring1.rotation.z += dt * 0.3 * motion;
    ring2.rotation.z -= dt * 0.2 * motion;
    const a = t * 0.9 * motion;
    sat.position.set(Math.cos(a) * 3.0, Math.sin(a) * 3.0 * Math.cos(Math.PI / 2.4), Math.sin(a) * 3.0 * Math.sin(Math.PI / 2.4) * -1);

    // cards orbit around the core and face the camera
    cards.forEach((c, i) => {
      const u = c.userData;
      const ang = u.angle + t * u.speed * motion + scrollK * 2;
      c.position.set(
        core.position.x + Math.cos(ang) * u.radius,
        u.y + Math.sin(t * 0.8 + u.phase) * 0.25 * motion + scrollK * 3,
        Math.sin(ang) * u.radius * 0.6 - 1
      );
      c.lookAt(camera.position);
      const depth = THREE.MathUtils.clamp((c.position.z + 4) / 6, 0.15, 1);
      c.material.opacity = (MOBILE ? 0.35 : 0.6) * depth * ease;
    });

    // stream rises
    const p = streamGeo.attributes.position.array;
    for (let i = 0; i < COUNT; i++) {
      p[i * 3 + 1] += spd[i] * dt * motion;
      if (p[i * 3 + 1] > 10) p[i * 3 + 1] = -4;
    }
    streamGeo.attributes.position.needsUpdate = true;
    stream.material.opacity = 0.55 * ease;

    // camera: parallax + scroll dolly
    camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.04;
    camera.position.y += ((0.6 - mouse.y * 0.4 + scrollK * 1.5) - camera.position.y) * 0.04;
    camera.position.z = 9 + scrollK * 3;
    camera.lookAt(0, scrollK * 1.2, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }

  // Code textures need the mono font: redraw once fonts are ready
  document.fonts?.ready.then(() => {
    cards.forEach((c, i) => { c.material.map.dispose(); c.material.map = makeCodeTexture(SNIPPETS[i], i); c.material.needsUpdate = true; });
  });

  requestAnimationFrame(tick);

  /* ---------------- helpers ---------------- */
  function makeDotTexture() {
    const c = document.createElement("canvas");
    c.width = c.height = 64;
    const g = c.getContext("2d");
    const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.3, "rgba(255,255,255,0.6)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 64, 64);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  function makeCodeTexture(lines, idx) {
    const W = 512, H = 256;
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const g = c.getContext("2d");
    const r = 18;
    g.beginPath();
    g.roundRect ? g.roundRect(2, 2, W - 4, H - 4, r) : g.rect(2, 2, W - 4, H - 4);
    g.fillStyle = "rgba(10, 14, 20, 0.88)";
    g.fill();
    g.lineWidth = 2;
    g.strokeStyle = idx % 2 ? "rgba(34, 211, 238, 0.55)" : "rgba(57, 255, 136, 0.55)";
    g.stroke();
    ["#ff5f57", "#febc2e", "#28c840"].forEach((col, i) => { g.fillStyle = col; g.beginPath(); g.arc(28 + i * 20, 26, 6, 0, Math.PI * 2); g.fill(); });
    g.font = "500 21px 'JetBrains Mono', monospace";
    const palette = ["#f472b6", "#39ff88", "#22d3ee", "#d7dde6"];
    lines.forEach((ln, i) => {
      g.fillStyle = "#4a5463";
      g.fillText(String(i + 1), 24, 82 + i * 42);
      g.fillStyle = palette[(i + idx) % palette.length];
      g.fillText(ln, 56, 82 + i * 42);
    });
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }
}

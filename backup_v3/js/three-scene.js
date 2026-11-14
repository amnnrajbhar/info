// ============================================================
// Portfolio v3 — Three.js Hero Scene
// Floating geometric shapes with Electric Blue accent
// Lazy-loaded, respects prefers-reduced-motion
// ============================================================

function initHeroScene(canvas) {
  if (!canvas || typeof THREE === "undefined") return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Materials
  const accentColor = 0x3b82f6;
  const glowColor = 0x60a5fa;

  const wireMat = new THREE.MeshBasicMaterial({ color: accentColor, wireframe: true, transparent: true, opacity: 0.35 });
  const solidMat = new THREE.MeshStandardMaterial({ color: accentColor, metalness: 0.6, roughness: 0.3, transparent: true, opacity: 0.7 });
  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.05, transparent: true, opacity: 0.12, envMapIntensity: 1.0 });

  // Geometries — floating code/tech-inspired shapes
  const shapes = [];

  // Main icosahedron (center)
  const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(1.2, 1), wireMat);
  ico.position.set(0, 0, 0);
  scene.add(ico);
  shapes.push({ mesh: ico, rx: 0.003, ry: 0.005, floatSpeed: 0.8, floatAmp: 0.15 });

  // Inner solid icosahedron
  const icoInner = new THREE.Mesh(new THREE.IcosahedronGeometry(0.6, 0), solidMat);
  icoInner.position.set(0, 0, 0);
  scene.add(icoInner);
  shapes.push({ mesh: icoInner, rx: -0.004, ry: 0.006, floatSpeed: 1.0, floatAmp: 0.1 });

  // Torus ring
  const torus = new THREE.Mesh(new THREE.TorusGeometry(1.8, 0.04, 16, 100), new THREE.MeshBasicMaterial({ color: glowColor, transparent: true, opacity: 0.2 }));
  torus.rotation.x = Math.PI / 3;
  scene.add(torus);
  shapes.push({ mesh: torus, rx: 0.002, ry: 0.003, floatSpeed: 0.6, floatAmp: 0.05 });

  // Small floating cubes
  for (let i = 0; i < 5; i++) {
    const size = 0.12 + Math.random() * 0.15;
    const cube = new THREE.Mesh(
      new THREE.BoxGeometry(size, size, size),
      glassMat.clone()
    );
    cube.position.set(
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 3
    );
    cube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    scene.add(cube);
    shapes.push({
      mesh: cube,
      rx: (Math.random() - 0.5) * 0.01,
      ry: (Math.random() - 0.5) * 0.01,
      floatSpeed: 0.5 + Math.random() * 0.8,
      floatAmp: 0.1 + Math.random() * 0.2,
    });
  }

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(accentColor, 2, 20);
  pointLight.position.set(3, 3, 5);
  scene.add(pointLight);

  const pointLight2 = new THREE.PointLight(glowColor, 1, 15);
  pointLight2.position.set(-3, -2, 3);
  scene.add(pointLight2);

  // Mouse parallax
  let mouseX = 0, mouseY = 0;
  document.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Animation loop
  let animId;
  const clock = new THREE.Clock();

  function animate() {
    animId = requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    shapes.forEach((s) => {
      s.mesh.rotation.x += s.rx;
      s.mesh.rotation.y += s.ry;
      s.mesh.position.y += Math.sin(elapsed * s.floatSpeed) * s.floatAmp * 0.01;
    });

    // Parallax
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();

  // Resize
  function onResize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener("resize", onResize);

  // Cleanup
  window._cleanupThreeScene = () => {
    cancelAnimationFrame(animId);
    renderer.dispose();
    window.removeEventListener("resize", onResize);
  };
}

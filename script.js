// --- 1. INISIALISASI SCENE, CAMERA, & RENDERER ---
const container = document.getElementById('webgl-container');

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x050505, 0.03); // Efek kabut kedalaman

// Kamera: (Field of View, Aspect Ratio, Near, Far)
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 6);

// WebGL Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
container.appendChild(renderer.domElement);

// --- 2. KONTROL KONTROL MOUSE (ORBIT CONTROLS) ---
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Gerakan terasa lebih halus
controls.dampingFactor = 0.05;
controls.maxDistance = 15;
controls.minDistance = 3;

// --- 3. PENCAHAYAAN (LIGHTING) ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

// Cahaya Utama (Directional Light)
const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
mainLight.position.set(5, 5, 5);
scene.add(mainLight);

// Cahaya Titik Berwarna (Point Light)
const pointLight = new THREE.PointLight(0x00f2fe, 3, 10);
pointLight.position.set(-3, -2, -2);
scene.add(pointLight);

// --- 4. PEMBUATAN OBJEK 3D ---
// Geometri
const geometry = new THREE.OctahedronGeometry(1.5, 0);

// Material Metalik PBR
const material = new THREE.MeshStandardMaterial({
  color: 0x4facfe,
  metalness: 0.8,
  roughness: 0.2,
  wireframe: false
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Overlay Wireframe
const wireframeMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  wireframe: true,
  transparent: true,
  opacity: 0.15
});
const wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial);
wireframeMesh.scale.setScalar(1.001); // Mencegah artifact z-fighting
mesh.add(wireframeMesh);

// Partikel Latar Belakang
const particlesGeometry = new THREE.BufferGeometry();
const particleCount = 400;
const posArray = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 20;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.03,
  color: 0xffffff,
  transparent: true,
  opacity: 0.5
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// --- 5. ANIMASI LOOP ---
function animate() {
  requestAnimationFrame(animate);

  // Rotasi Objek 3D secara terus menerus
  mesh.rotation.x += 0.005;
  mesh.rotation.y += 0.008;

  // Rotasi Partikel Latar Belakang
  particlesMesh.rotation.y -= 0.0005;

  // Update Kontrol Kamera
  controls.update();

  // Render Ulang Frame
  renderer.render(scene, camera);
}
animate();

// --- 6. PENYESUAIAN UKURAN LAYAR (RESPONSIVE) ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// --- 7. INTERAKSI TOMBOL ---
const btn = document.getElementById('interact-btn');
btn.addEventListener('click', () => {
  // Mengubah warna material secara acak
  const randomColor = Math.random() * 0xffffff;
  material.color.setHex(randomColor);
  pointLight.color.setHex(randomColor);
});

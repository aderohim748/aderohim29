// --- 1. INISIALISASI SCENE & CAMERA ---
const container = document.getElementById('webgl-container');

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0d0b0a, 0.02);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 7);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

// --- 2. CONTROLS ---
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2; // Mencegah kamera masuk ke bawah lantai
controls.minDistance = 4;
controls.maxDistance = 12;

// --- 3. PENCAHAYAAN (AMBANCE RESTORAN HANGAT) ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// Lampu Sorot Emas dari Atas (Spotlight)
const spotLight = new THREE.SpotLight(0xd4af37, 3);
spotLight.position.set(0, 8, 3);
spotLight.angle = Math.PI / 4;
spotLight.penumbra = 0.5;
spotLight.castShadow = true;
scene.add(spotLight);

// Accent Light Hangat dari Belakang
const backLight = new THREE.PointLight(0xff6600, 2, 10);
backLight.position.set(-3, 2, -3);
scene.add(backLight);

// --- 4. PEMBUATAN OBJEK 3D (PLATE & CLOCHE) ---
const restaurantGroup = new THREE.Group();

// Material Emas Mewah
const goldMaterial = new THREE.MeshStandardMaterial({
  color: 0xd4af37,
  metalness: 0.9,
  roughness: 0.15
});

// Material Perak Chrome
const chromeMaterial = new THREE.MeshStandardMaterial({
  color: 0xcccccc,
  metalness: 0.95,
  roughness: 0.1
});

// A. Piring (Base Plate)
const plateGeometry = new THREE.CylinderGeometry(2, 1.5, 0.15, 64);
const plate = new THREE.Mesh(plateGeometry, chromeMaterial);
plate.position.y = -0.075;
plate.receiveShadow = true;
restaurantGroup.add(plate);

// B. Penutup Saji (Dome / Cloche)
const domeGeometry = new THREE.SphereGeometry(1.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
const dome = new THREE.Mesh(domeGeometry, goldMaterial);
dome.castShadow = true;
restaurantGroup.add(dome);

// C. Pegangan Penutup Saji (Handle)
const handleGeometry = new THREE.SphereGeometry(0.2, 16, 16);
const handle = new THREE.Mesh(handleGeometry, chromeMaterial);
handle.position.y = 1.7;
dome.add(handle);

scene.add(restaurantGroup);

// D. Efek Partikel Debu Cahaya
const particlesGeometry = new THREE.BufferGeometry();
const particleCount = 300;
const posArray = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i++) {
  posArray[i] = (Math.random() - 0.5) * 15;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.02,
  color: 0xd4af37,
  transparent: true,
  opacity: 0.6
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// --- 5. ANIMASI LOOP ---
let isDomeOpen = false;
let targetDomeY = 0;

function animate() {
  requestAnimationFrame(animate);

  // Rotasi lambat seluruh objek
  restaurantGroup.rotation.y += 0.003;
  particlesMesh.rotation.y -= 0.0005;

  // Animasi Terbuka/Tutup Penutup Saji (Smooth Lerp)
  dome.position.y += (targetDomeY - dome.position.y) * 0.05;

  controls.update();
  renderer.render(scene, camera);
}
animate();

// --- 6. EVENT RESPONSIVE ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// --- 7. INTERAKSI TOMBOL ---
const interactBtn = document.getElementById('interact-btn');
const colorBtn = document.getElementById('color-btn');

interactBtn.addEventListener('click', () => {
  isDomeOpen = !isDomeOpen;
  targetDomeY = isDomeOpen ? 2.5 : 0; // Mengangkat penutup saji ke atas
  interactBtn.innerText = isDomeOpen ? "Tutup Penutup Saji" : "Buka Penutup Saji";
});

const colors = [0xd4af37, 0xff4500, 0x00f2fe, 0xff007f];
let currentColorIdx = 0;

colorBtn.addEventListener('click', () => {
  currentColorIdx = (currentColorIdx + 1) % colors.length;
  spotLight.color.setHex(colors[currentColorIdx]);
  particlesMaterial.color.setHex(colors[currentColorIdx]);
});

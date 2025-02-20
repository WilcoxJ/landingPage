const scene = new THREE.Scene();
const canvas = document.createElement('canvas');
const renderer = new THREE.WebGLRenderer({ alpha: true, preserveDrawingBuffer: true, antialias: true, powerPreference: "high-performance" });
renderer.setClearColor(0x00000, 1);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Camera & Controls
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const camGroup = new THREE.Object3D();
let orbitControls = new THREE.OrbitControls(camera);
orbitControls.enabled = true;
camGroup.add(camera);
scene.add(camGroup);
camGroup.position.z = 100;

// Fade Effect
const fadeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.07 });
const fadePlane = new THREE.PlaneBufferGeometry(10, 10);
const fadeMesh = new THREE.Mesh(fadePlane, fadeMaterial);
fadeMesh.position.z = -0.12;
fadeMesh.renderOrder = -1;
camGroup.add(fadeMesh);

// Lighting
scene.add(new THREE.AmbientLight(0x404040));
const pointLight = new THREE.PointLight(0xffffff, 1);
camera.add(pointLight);

// Load Textures
const sprite = new THREE.TextureLoader().load('img/disc.png');

// Materials
const torusMaterial = new THREE.PointsMaterial({ size: .008, color: 0xFF005D });
const cubeMaterial = new THREE.PointsMaterial({ size: .008, color: 0xFF005D });
const particlesMaterial = new THREE.PointsMaterial({ size: .009, transparent: false, color: 0x32befa, map: sprite, opacity: 1 });

// Geometries
const torusGeometry = new THREE.TorusGeometry(13, 5, 25, 100);
const cubeGeometry = new THREE.BoxGeometry(30, 30, 30);
const particleGeometry = new THREE.BufferGeometry();

// Objects
const torus = new THREE.Points(torusGeometry, torusMaterial);
const cube = new THREE.Points(cubeGeometry, cubeMaterial);
scene.add(torus, cube);

// Particles
const particlesCount = 80000;
const posArray = new Float32Array(particlesCount * 3);
for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 360;
}
particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMesh = new THREE.Points(particleGeometry, particlesMaterial);
scene.add(particlesMesh);

// Bloom Effect
const params = { exposure: 1, bloomStrength: 0.9, bloomThreshold: 0, bloomRadius: 0.25 };
const renderScene = new THREE.RenderPass(scene, camera);
const bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;
const composer = new THREE.EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// Event Listeners
window.addEventListener('resize', onWindowResize);
document.addEventListener('mousemove', animateParticles);
document.addEventListener('wheel', onDocumentMouseWheel);
document.addEventListener("mousedown", enableTrails);
document.addEventListener("mouseup", disableTrails);
document.addEventListener('touchmove', onTouchMove);
document.addEventListener('touchstart', enableTrails);
document.addEventListener('touchend', disableTrails);
document.addEventListener('keydown', (event) => { if (event.key === ' ') switchColors(); });
document.addEventListener('dblclick', switchColors);

// document.addEventListener("DOMContentLoaded", function () {
//     document.getElementById("role").addEventListener("click", enableTrails);
// });

// Variables
let mouseX = 0, mouseY = 0, trails = false, colorIndex = 0;

var red = 0xFF005D; // reddish pink 
var blue = 0x2262c9;
var lightBlue = 0x32befa;
var pink = 0xff00dc;
var green = 0x5dff00;


// const colors = [red, blue, pink, lightBlue]; // Red, Purple 0xff00dc,, Green 0x5dff00, Blue 0x32befa   // 0xff00dc, 0x2262c9
// const torusColors = [pink, blue, lightBlue]
const torusColors = [lightBlue, red, pink];
const starfieldColors = [red, blue, lightBlue];

// const torusColors = [pink, blue, lightBlue];
// const starfieldColors = [blue, lightBlue, red];

const clock = new THREE.Clock();
camera.fov = 99;
let zoomDirection = 0.09;

// Functions
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseWheel(event) {
    let delta = event.deltaY * 0.02;
    camera.fov = Math.max(26, Math.min(101, camera.fov + delta));
    camera.updateProjectionMatrix();
}

function animateParticles(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
}

function onTouchMove(event) {
    let touch = event.touches[0];
    animateParticles({ clientX: touch.clientX, clientY: touch.clientY });
}

function enableTrails() {
    trails = true;
    renderer.autoClearColor = false;
    fadeMesh.position.z = -0.12;
}

function disableTrails() {
    trails = false;
    renderer.autoClearColor = true;
    fadeMesh.position.z = -0.02;
}

function switchColors() {
    let torusIndex = colorIndex % torusColors.length;
    let starfieldIndex = colorIndex % starfieldColors.length;
    if (torusColors[torusIndex] === starfieldColors[starfieldIndex]) {
        starfieldIndex = (starfieldIndex + 1) % starfieldColors.length;
    }
    torus.material.color.set(torusColors[torusIndex]);
    particlesMesh.material.color.set(starfieldColors[starfieldIndex]);
    colorIndex++;
}

function animate() {
    requestAnimationFrame(animate);
    torus.rotation.y += 0.01;
    cube.rotation.x += 0.01;
    cube.rotation.y -= 0.01;
    if (trails) {
        particlesMesh.rotation.y = mouseX * 0.0003;
        particlesMesh.rotation.x = mouseY * 0.0003;
        cube.rotation.x = mouseY * 0.0012;
        cube.rotation.y = mouseX * 0.0012;
    } else {
        particlesMesh.rotation.y = mouseX * 0.0009;
        particlesMesh.rotation.x = mouseY * 0.0009;
    }
    if (camera.fov <= 25 || camera.fov >= 100) zoomDirection *= -1;
    camera.fov -= zoomDirection;
    camera.updateProjectionMatrix();
    composer.render();
}

animate();

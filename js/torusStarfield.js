var fadeMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true,
    opacity: 0.05
});
var fadePlane = new THREE.PlaneBufferGeometry(10, 10);
var fadeMesh = new THREE.Mesh(fadePlane, fadeMaterial);

var camGroup = new THREE.Object3D();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
let orbitControls = new THREE.OrbitControls(camera);

orbitControls.enabled = true;


camGroup.add(camera);
camGroup.add(fadeMesh);

fadeMesh.position.z = -0.08;
fadeMesh.renderOrder = -1;

const canvas = document.createElement('canvas');
const scene = new THREE.Scene();
// const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer = new THREE.WebGLRenderer( { alpha: true, preserveDrawingBuffer: true, antialias: true } );

renderer.setClearColor(0x00000, 1);  
// renderer.autoClearColor = false;
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

scene.add(camGroup);
camGroup.position.z = 60;

const sprite = new THREE.TextureLoader().load( 'img/disc.png' );





//materials
const material = new THREE.PointsMaterial({ 
        size: .008,
        color: 0xFF005D //red
        // color: 0xff00dc // purple
        // color: 0x5dff00 //green
    });
const particlesMaterial = new THREE.PointsMaterial({ 
        size: .009,
        transparent: false,
        color: 0x2262c9,
        // color: 0x5dff00,
        map: sprite

    });

particlesMaterial.opacity = .99;



// geometry
const geometry = new THREE.TorusGeometry( 13, 5, 25, 100 );
const geometry2 = new THREE.BoxGeometry( 30, 30, 30 );

const sphere = new THREE.Points( geometry, material );
scene.add( sphere );
const cube = new THREE.Points( geometry2, material );

// Light
// const light = new THREE.HemisphereLight(0xf402bc, 0x236e89, .95);
// scene.add(light);

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize(){            
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();            
    renderer.setSize( window.innerWidth, window.innerHeight );            

}

//particles
const particleGeometry = new THREE.BufferGeometry;
const particlesCount = 20000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (math.random() - 0.5) * 120;
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMesh = new THREE.Points(particleGeometry, particlesMaterial);
scene.add( cube, particlesMesh );

//mouse
document.addEventListener('mousemove', animateParticles);
document.addEventListener('wheel', onDocumentMouseWheel); // camera.updateProjectionMatrix seems to break in firefox
document.addEventListener('mousedown', onDocumentMouseDown);
document.addEventListener('mouseup', onDocumentMouseUp);  // TODO: make this function opposite

let mouseX = 0;
let mouseY = 0;

function onDocumentMouseWheel(event) {
    var fovMAX = 125;
    var fovMIN = 25;
    camera.fov -= event.wheelDeltaY * 0.02;
    camera.fov = Math.max( Math.min( camera.fov, fovMAX ), fovMIN );
    camera.updateProjectionMatrix();

}

function onDocumentMouseDown(event) {
        renderer.autoClearColor = false; // trails 
        fadeMesh.position.z = -0.12;
        
  }

function onDocumentMouseUp(event) {
    renderer.autoClearColor = true;
    renderer.setClearColor(0x00000, 1); 
    fadeMesh.position.z = -0.02;

  }

function onDocumentClick(event) {
    renderer.autoClearColor = true;
    renderer.setClearColor(0x00000, 1); 
    material.color = 0xff00dc;

}

function animateParticles(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;

}

const clock = new THREE.Clock();
const elapsedTime = clock.getElapsedTime;

const animate = function () {
  requestAnimationFrame( animate );
  // Objects
  // sphere.rotation.x += 0.01
  sphere.rotation.y += 0.01;
  cube.rotation.x += 0.01;
  cube.rotation.y -= 0.01;

  particlesMesh.rotation.x += 0.001;
  particlesMesh.rotation.y += 0.001;

  // starfield
//   particlesMesh.rotation.y = mouseX * .0006;
//   particlesMesh.rotation.x = mouseY * .0006;
  renderer.render( scene, camera );
};          

animate();

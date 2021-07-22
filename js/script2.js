const canvas = document.createElement('canvas');
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);            

renderer.setClearColor(0x00000, 1);            

document.body.appendChild(renderer.domElement);
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 60
const material = new THREE.PointsMaterial({ 
        size: .005
    });
const particlesMaterial = new THREE.PointsMaterial({ 
        size: .012,
        transparent: true,
        color: 0x2262c9
    });
particlesMaterial.opacity = .80;

// test new shapes
const geometry = new THREE.TorusGeometry( 13, 5, 25, 100 );
// const geometry = new THREE.ConeGeometry( 20, 35, 32, 35 );

const geometry2 = new THREE.BoxGeometry( 30, 30, 30 );
const sphere = new THREE.Points( geometry, material );
scene.add( sphere );
const cube = new THREE.Points( geometry2, material );


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
    posArray[i] = (math.random() - 0.5) * 125
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

const particlesMesh = new THREE.Points(particleGeometry, particlesMaterial)

scene.add( cube, particlesMesh );

//mouse
document.addEventListener('mousemove', animateParticles)
document.addEventListener('wheel', onDocumentMouseWheel) // camera.updateProjectionMatrix seems to break in firefox

let mouseX = 0
let mouseY = 0

function onDocumentMouseWheel(event) {
    var fovMAX = 125;
    var fovMIN = 25;
    camera.fov -= event.wheelDeltaY * 0.05;
    camera.fov = Math.max( Math.min( camera.fov, fovMAX ), fovMIN );
    camera.updateProjectionMatrix();
}

function animateParticles(event) {
  mouseX = event.clientX
  mouseY = event.clientY

}

const clock = new THREE.Clock()
const elapsedTime = clock.getElapsedTime


const animate = function () {
  requestAnimationFrame( animate );

  // Objects
  // sphere.rotation.x += 0.01
  sphere.rotation.y += 0.01
  cube.rotation.x += 0.01
  cube.rotation.y -= 0.01

  // starfield
  particlesMesh.rotation.y = mouseX * .0012
  particlesMesh.rotation.x = mouseY * .0012
  renderer.render( scene, camera );
};          

animate();
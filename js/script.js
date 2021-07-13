const canvas = document.createElement('canvas');
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);            

renderer.setClearColor(0x00000, 1);            

document.body.appendChild(renderer.domElement);
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.z = 60

const material = new THREE.MeshStandardMaterial({ 
		color: 0xdd187e,
		wireframe: true,
	});
material.opacity = .9;

const materialCube = new THREE.MeshStandardMaterial({ 
		color: 0xdd187e,
		wireframe: true
	});

const particlesMaterial = new THREE.PointsMaterial({ 
		size: .012,
		transparent: true,
		color: 0x3b78db
	});
particlesMaterial.opacity = .70;



// Light
const light = new THREE.HemisphereLight(0xf402bc, 0x236e89, .5);
scene.add(light);

const frontLight = new THREE.DirectionalLight(0xb6ebef, .75);
frontLight.position.set(3000, 500, 3000).normalize();
scene.add(frontLight);

//geometry
const geometry = new THREE.IcosahedronGeometry( 12, 1 );
const geometry2 = new THREE.BoxGeometry( 30, 30, 30,);
const sphere = new THREE.Mesh( geometry, material );

sphere.receiveShadow = true;
scene.add( sphere );

const cube = new THREE.Mesh( geometry2, materialCube );

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
	posArray[i] = (math.random() - 0.5) * 180
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))

const particlesMesh = new THREE.Points(particleGeometry, particlesMaterial)

scene.add(cube);
scene.add(particlesMesh)

//mouse
document.addEventListener('mousemove', animateParticles)
document.addEventListener('wheel', onDocumentMouseWheel) // camera.updateProjectionMatrix seems to break in firefox
document.addEventListener('click', onUserClick)

let mouseX = 1228
let mouseY = 492

function animateParticles(event) {
	mouseX = event.clientX
	mouseY = event.clientY

}

let scrollY = 1
let scaleSphere = 1

function onDocumentMouseWheel(event) {
	var fovMAX = 135;
	var fovMIN = 25;
	camera.fov -= event.wheelDeltaY * 0.05;
	camera.fov = Math.max( Math.min( camera.fov, fovMAX ), fovMIN );
	camera.updateProjectionMatrix();
}

function onUserClick(event) {
	cube.rotation.y = mouseX * -.0032
	cube.rotation.x = mouseY * .0032
}

const animate = function () {
	requestAnimationFrame( animate );
  
	  // Objects
	  sphere.rotation.y += 0.005
	  cube.rotation.y = mouseX * -.0032
	  cube.rotation.x = mouseY * .0032
  
	  // starfield
	  particlesMesh.rotation.y = mouseX * .0012
	  particlesMesh.rotation.x = mouseY * .0012
	  renderer.render( scene, camera );
  
  };

animate();

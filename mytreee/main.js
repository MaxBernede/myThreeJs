import './style.css'

import * as THREE from 'three';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({color: 0x000000});
const torus = new THREE.Mesh(geometry, material);

// const material1 = new THREE.MeshBasicMaterial({color: 0x06E0EB, wireframe: true});
// const geometry1 = new THREE.OctahedronGeometry(5,2);
// const torus2 = new THREE.Mesh(geometry1, material1);
// scene.add(torus2);

scene.add(torus);

//!LIGHTS
const pointLight = new THREE.PointLight(0x00EA1A, 1000);
pointLight.position.set(9,13,10);

const pointLight1 = new THREE.PointLight(0xEA251C, 1000);
pointLight1.position.set(-9,13,10);

const pointLight2 = new THREE.PointLight(0x012EEB, 500);
pointLight2.position.set(0,-11,10);

const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, pointLight1, pointLight2);

const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(lightHelper);

const lightHelper1 = new THREE.PointLightHelper(pointLight1);
scene.add(lightHelper1);

const lightHelper2 = new THREE.PointLightHelper(pointLight2);
scene.add(lightHelper2);


//!Controls
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

//!Stars
function addStar() {
  const geo = new THREE.SphereGeometry(3,24,24);
  const material = new THREE.MeshStandardMaterial({color:0xffffff});
  const star = new THREE.Mesh(geo, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);

  return { star, initialPosition: { x, y, z } };
}
const stars = Array(8).fill().forEach(addStar);

function animateStars() {
  const rotationSpeed = 0.01;

  // Rotate all stars as a group
  stars.forEach((star) => {
    star.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotationSpeed);
  });
}

const spaceTexture = new THREE.TextureLoader().load('galaxy.jpeg');
scene.background = spaceTexture;

//!texture my head
const myTexture = new THREE.TextureLoader().load('max.jpeg');

const max = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial( {map:myTexture})
);
scene.add(max);

//!the moon

const moonTexture = new THREE.TextureLoader().load('linkedin.png');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
new THREE.MeshBasicMaterial({map:moonTexture}),
);
//scene.add(moon);

// moon.position.z = 30;
// moon.position.setX(-10);

function moveCamera(){
  const t= document.body.getBoundingClientRect().top;
  moon.roration.x += 0.05;
  moon.roration.y += 0.075;
  moon.roration.z += 0.05;

  max.position.y += 0.01;
  max.position.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.01;
  camera.position.z = t * -0.01;
}

document.body.onscroll = moveCamera

//!INIFINITE LOOP
function animate(){
  requestAnimationFrame(animate);
  torus.rotateOnAxis(new THREE.Vector3(1, 0.5, 0.2), 0.01);
  controls.update();
  //animateStars();
  renderer.render(scene, camera);
}

animate();
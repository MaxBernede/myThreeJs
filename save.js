import './style.css'

import * as THREE from 'three';
import * as cam from './camera.js';
import * as obj from './obj.js';


//!VARIABLES
let maxspeed = 0.01;
let minspeed = 0.00005;
let x = 0.001;
let y = 0.005;
let z = 0.01;
let incr = 1;
//The less the faster for rotation on ratio
let ratio = 90;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
  // antialias:true,
  canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

//!SHAPES
const torus = obj.geo(10, 2, 0, 0xffffff, "tor");
const torus2 = obj.geo(20, 3, 90, 0x04adf0, "tor");
const torus3 = obj.geo(30, 3, 45, 0xec018e, "tor");
const ball = obj.geo(3, 5, 135, 0xffd60a, "oct");
const big = obj.geo(700, 150, 70, 0x510087, "tor");
big.position.setX(250);
big.position.setY(-100);


// const tri_geo = new THREE.OctahedronGeometry(1, 0);
// const mat = new THREE.MeshBasicMaterial({ color: 0x9ef01a, wireframe:true});
// const tri = new THREE.Mesh(tri_geo, mat);
// tri.position.setX(-17);
// tri.position.setY(-6);
// scene.add(tri);

scene.add(torus);
scene.add(torus2);
scene.add(torus3);
scene.add(ball);
scene.add(big);

function update(obj){
  obj.rotation.x += x;
  obj.rotation.y += y;
  obj.rotation.z += z;
}
function rotate_shapes(){
  update(torus);
  update(torus2);
  update(torus3);
  big.rotation.z += 0.0005;
}

function accel(){
  if (incr == 1){
    x += x/ratio;
    y += y/ratio;
    z += z/ratio;
    //tri.position.x += 1/ratio;
  }
  if (incr == -1){
    x -= x/ratio;
    y -= y/ratio;
    z -= z/ratio;
    // tri.position.x -= 1/ratio;
  }
  //Change velocity
  if (x >= maxspeed || x < minspeed){
    incr *= -1;
  }
}
//!Camera
function moveCamera() {
	const t = document.body.getBoundingClientRect().top;
	let result = t * -0.01;
	console.log('t count : %d %f', t, result);
  if (result <= 0){
    camera_type(1)
  }
	camera.position.setZ(result);
	// camera.position.x = t * -0.01;
	// camera.rotation.y = t * -0.0001;
  }
  
  function camera_type(camera_t){
    if (camera_t ==1){
      cam.which_cam(1,camera);
      scene.remove(torus2);
      scene.remove(torus);
    }
    if (camera_t == 2){
      cam.which_cam(2,camera);
      scene.remove(torus3);
      ratio = 100;
      maxspeed = 0.0005;
      minspeed = 0.00001;
    }
    if (camera_t == 3){
      cam.which_cam(3,camera);
      ratio = 200;
      maxspeed = 0.01;
      minspeed = 0.00004;
    }
    if (camera_t == 4){
      cam.which_cam(3,camera);
      ratio = 200;
      maxspeed = 0.01;
      minspeed = 0.00004;
      camera.rotateY(0);
    }
  }
  camera_type();

  //-0.08 to 47.82
document.body.onscroll = moveCamera;
moveCamera();

function animate() {
  requestAnimationFrame(animate);
  accel();
  ball.rotation.x += 0.001;
  ball.rotation.y+= 0.002;
  //tri.rotation.y += 0.01;
  rotate_shapes();
  renderer.render(scene, camera);
}

animate();
import './style.css'

import * as THREE from 'three';
import * as cam from './camera.js';
import { pos_1, pos_2, pos_3, pos_4, pos_tor_start, pos_tor_end} from './camera.js';
import * as obj from './obj.js';
//import * as bezierEasing from 'bezier-easing';

//!VARIABLES
let maxspeed = 5;
let minspeed = 0.005;
let x = 0.001;
let y = 0.005;
let z = 0.01;
let incr = 1;

let p_1 = [10, 0, -20];
let p_2 = [50, 0, -40];
let p_3 = [110, 0, -60];
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

torus.position.set(pos_tor_start);
torus2.position.set(pos_tor_start);
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
  const acceleration = incr === 1 ? 1 : -1;
  x += (x / ratio) * acceleration;
  y += (y / ratio) * acceleration;
  z += (z / ratio) * acceleration;
  if (x >= maxspeed/1000 || x < minspeed/1000){
    incr *= -1;
  }
}

//const customEasing = bezierEasing(0.25, 0.1, 0.25, 1);

//!Camera
function move_cam(pos, doc_start, doc_end, pos_start, pos_end){

  let t = customEasing((pos-doc_start)/14);
  t = t * t / (t * t + (1 - t) * (1 - t));
  camera.position.x = pos_start[0] + t * (pos_end[0] - pos_start[0]);
  camera.position.y = pos_start[1] + t * (pos_end[1] - pos_start[1]);
  camera.position.z = pos_start[2] + t * (pos_end[2] - pos_start[2]);

  // console.log('pos = %f x=%f y=%f z=%f', pos, camera.position.x, y, z);
}

function move_tor(pos, doc_start, doc_end, pos_tor_start, pos_tor_end, obj){

  let t = customEasing((pos-doc_start)/14);
  let tx;
  let ty;
  let tz;
  tx = pos_tor_start[0] + t * (pos_tor_end[0] - pos_tor_start[0]);
  ty = pos_tor_start[1] + t * (pos_tor_end[1] - pos_tor_start[1]);
  tz = pos_tor_start[2] + t * (pos_tor_end[2] - pos_tor_start[2]);

  obj.position.set(tx,ty,tz);
  // console.log('pos = %f x=%f y=%f z=%f', pos, camera.position.x, y, z);
}

let mode = 1;

function moveCamera() {
	const t = document.body.getBoundingClientRect().top;
	let pos = t * -0.01;
  if (pos <= 0){
    cam.which_cam(1,camera);
    maxspeed = 0.5;
    minspeed = 0.005;
  }
  else if (pos <= 42/3){
    if (mode != 1){
      ratio = 150;
      maxspeed = 1;
      minspeed = 0.1;
      mode = 1;
    }
    move_cam(pos, 0, 14, pos_1, pos_2);
    move_tor(pos, 0, 14, pos_tor_start, pos_tor_end, torus);
    move_tor(pos, 0, 14, pos_tor_start, pos_tor_end, torus2);
  }
  else if (pos <= 42*2/3){
    if (mode != 2){
      ratio = 100;
      maxspeed = 10;
      minspeed = 0.1;
      mode = 2;
      torus.position.set(0,0,0);
      torus2.position.set(0,0,0);
    }
    move_cam(pos, 14, 28, pos_2, pos_3)
  }
  else if (pos <= 42.03){
    if (mode != 3){
      ratio = 150;
      maxspeed = 1;
      minspeed = 0.05;
      mode = 3;
      torus.position.set(0,0,0);
      torus2.position.set(0,0,0);
    }
    move_cam(pos, 28, 42, pos_3, pos_4);
    move_tor(pos, 28, 42, pos_tor_end, p_1, torus);
    move_tor(pos, 28, 42, pos_tor_end, p_2, torus2);
    move_tor(pos, 28, 42, pos_tor_end, p_3, torus3);
  }
  }
  

document.body.onscroll = moveCamera;
moveCamera();

function animate() {
  requestAnimationFrame(animate);
  accel();
  ball.rotation.x += 0.001;
  ball.rotation.y+= 0.002;
  rotate_shapes();
  renderer.render(scene, camera);
}

animate();
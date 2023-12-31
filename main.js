import './style.css'

import * as THREE from 'three';
import { 
  desktopPos_1, desktopPos_2, desktopPos_3, desktopPos_4,
  mobilePos_1, mobilePos_2, mobilePos_3, mobilePos_4,
  pos_tor_start, pos_tor_end,
  p_1, p_2, p_3
} from './camera.js';
import * as obj from './obj.js';
import { inject } from '@vercel/analytics';

inject();
// window.addEventListener('resize', function () {
//   location.reload();
// });

//!VARIABLES
let maxspeed = 5;
let minspeed = 0.005;
let x = 0.001;
let y = 0.005;
let z = 0.01;
let incr = 1;
let pos_1;
let pos_2;
let pos_3;
let pos_4;
let ratio = 90;

function get_cam_pos() {
  if (window.innerWidth < 600) {
      pos_1 = mobilePos_1;
      pos_2 = mobilePos_2;
      pos_3 = mobilePos_3;
      pos_4 = mobilePos_4;
  } else {
      pos_1 = desktopPos_1;
      pos_2 = desktopPos_2;
      pos_3 = desktopPos_3;
      pos_4 = desktopPos_4;
  }
  console.log(pos_1);
  console.log(pos_2);
  console.log(pos_3);
  console.log(pos_4);
}

get_cam_pos();

const documentHeight = Math.max(
  document.body.scrollHeight,
  document.documentElement.scrollHeight,
  document.body.offsetHeight,
  document.documentElement.offsetHeight,
  document.body.clientHeight,
  document.documentElement.clientHeight
);
const viewportHeight = window.innerHeight || document.documentElement.clientHeight;

const max_document = documentHeight - viewportHeight;
//! end

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

function move_obj(pos, doc_start, doc_end, pos_tor_start, pos_tor_end, obj){

  let d = doc_end - doc_start;
  let t = (pos - doc_start) / d;
  t = t * t / (t * t + (1 - t) * (1 - t));
  let tx = pos_tor_start[0] + t * (pos_tor_end[0] - pos_tor_start[0]);
  let ty = pos_tor_start[1] + t * (pos_tor_end[1] - pos_tor_start[1]);
  let tz = pos_tor_start[2] + t * (pos_tor_end[2] - pos_tor_start[2]);

  obj.position.set(tx,ty,tz);
  // console.log('pos = %f x=%f y=%f z=%f', pos, camera.position.x, y, z);
}

let mode = 1;

function moveCamera() {
	const t = document.body.getBoundingClientRect().top;
	let pos = t * -1 /max_document;

  if (pos <= 0){
    camera.position.set(pos_1[0],pos_1[1],pos_1[2]);
    maxspeed = 0.5;
    minspeed = 0.005;
  }
  else if (pos <= 1/3){
    if (mode != 1){
      ratio = 150;
      maxspeed = 1;
      minspeed = 0.1;
      mode = 1;
    }
    move_obj(pos, 0, 1/3, pos_1, pos_2, camera);
    move_obj(pos, 0, 1/3, pos_tor_start, pos_tor_end, torus);
    move_obj(pos, 0, 1/3, pos_tor_start, pos_tor_end, torus2);
  }
  else if (pos <= 2/3){
    if (mode != 2){
      ratio = 100;
      maxspeed = 10;
      minspeed = 0.1;
      mode = 2;
      torus.position.set(0,0,0);
      torus2.position.set(0,0,0);
      torus3.position.set(0,0,0);
    }
    move_obj(pos, 1/3, 2/3, pos_2, pos_3, camera)
  }
  else if (pos <= max_document){
    if (mode != 3){
      ratio = 150;
      maxspeed = 10;
      minspeed = 0.1;
      mode = 3;
      torus.position.set(0,0,0);
      torus2.position.set(0,0,0);
      torus3.position.set(0,0,0);
    }
    move_obj(pos, 2/3, 1, pos_3, pos_4, camera);
    move_obj(pos, 2/3, 1, pos_tor_end, p_1, torus);
    move_obj(pos, 2/3, 1, pos_tor_end, p_2, torus2);
    move_obj(pos, 2/3, 1, pos_tor_end, p_3, torus3);
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
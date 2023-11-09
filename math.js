import * as THREE from 'three';

//!VARIABLES
let maxspeed = 0.01;
let minspeed = 0.00005;
let x = 0.001;
let y = 0.005;
let z = 0.01;
let ratio = 90;
let incr = 1;
//The less the faster for rotation on ratio

export function update(obj){
	obj.rotation.x += x;
	obj.rotation.y += y;
	obj.rotation.z += z;
  }
export function rotate_shapes(){
	update(torus);
	update(torus2);
	update(torus3);
	big.rotation.z += 0.0005;
}
export function accel(){
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
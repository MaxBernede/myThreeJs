import * as THREE from 'three';

export function geo(size, nb,rotation, color, type) {
	let geometry;

	if (type == "tor"){
	  geometry = new THREE.TorusGeometry(size, nb, 16, 100);
	}
	else if (type == "oct"){
	  geometry = new THREE.OctahedronGeometry(size, nb);
	}
	const material = new THREE.MeshBasicMaterial({ color: color, wireframe: true});
	const torus = new THREE.Mesh(geometry, material);
  
	torus.rotation.x += rotation;
	torus.rotation.y += rotation;
	torus.rotation.z += rotation;
  
	return torus;
}

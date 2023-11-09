export const pos_1 = [-5, -3, 12];
export const pos_2 = [-10, 0, 20];
export const pos_3 = [90, 0, 100];
export const pos_4 = [0, -3, 20];

export function which_cam(cam_pos, camera) {
	let position;
  
	if (cam_pos == 1) {
	  position = pos_1;
	} else if (cam_pos == 2) {
	  position = pos_2;
	} else if (cam_pos == 3) {
	  position = pos_3;
	} else if (cam_pos == 4) {
	  position = pos_4;
	}

	if (position) {
	  const [x, y, z] = position;
	  camera.position.set(x, y, z);
	}
}
  
  
  
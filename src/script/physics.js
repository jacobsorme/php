// Rotate - never more than 360
function rotate(object, direction) {
  object.rot = (object.rot + direction) % 360;
}

function throttle(object,rotateVariable, speed) {
	var rot = (rotateVariable/360)*2*Math.PI;
	object.y = round(object.y - (speed*Math.cos(rot)));
	object.x  = round(object.x + (speed*Math.sin(rot)));
}

// Controls the slow-down of player
function speedDown(current){
  if(current < 1){
    return 0;
  } else {
    return current*0.985;
  }
}

function speedUp(current){
  if(current + 0.5 > 9) {
    return 6;
  } else {
    return current + 0.5;
  }
}

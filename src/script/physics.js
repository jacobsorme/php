// Rotate - never more than 360 or less than 0
function rotate(object, direction) {
  object.rot = (object.rot + direction) % 360;
}

function throttle(object,rotateVariable, speed) {
	var rot = (rotateVariable/360)*2*Math.PI;
	object.y = round(object.y - (speed*Math.cos(rot)));
	object.x  = round(object.x + (speed*Math.sin(rot)));
}

function addForceX(rotateVariable, speed) {
  var rot = (rotateVariable/360)*2*Math.PI;
  return round((speed*Math.sin(rot)));
}
function addForceY(rotateVariable, speed) {
  var rot = (rotateVariable/360)*2*Math.PI;
  return round((speed*Math.cos(rot)));
}

function move(object){
  object.x = round(object.x + object.force[0]);
  object.y = round(object.y + object.force[1]);
}

// Controls the slow-down of player
function speedDown(current){
  if(current < 1){
    return 0;
  } else {
    return round(current*0.985);
  }
}

function speedUp(current){
  if(current + 0.5 > 11) return 11;
  else return round(current + 0.5);
}

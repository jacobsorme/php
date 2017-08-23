function round(val){
  return parseInt(val*100)/100;
}

function rgbToHex(r,g,b){
  var rgb = b | (g << 8) | (r << 16);
  var hex =  (0x1000000 | rgb).toString(16).substring(1);
  return hex;
}

function proximity(val1, val2, margin){
  if( Math.abs(val1 - val2) <= margin){
    return true;
  } else {
    return false;
  }
}

function findSameId(list,id){
  for(var i in list){
    var p = list[i];
    if(p.id == id){
      return p;
    }
  }
  return false;
}

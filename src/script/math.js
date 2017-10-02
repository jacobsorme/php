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

/*  Checking if things have changed with the local player
    Returns true if it has changed
    Stores the previous value in game - to do some checks
*/
function changesCheck(){
  // if(Math.random() < 0.8){
  //   var olp = game.oldLocalPlayer;
  //   var lp = game.localPlayer;
  //   var val = false;
  //   if(olp == null){
  //     game.oldLocalPlayer = JSON.stringify(game.localPlayer);
  //     return true;
  //   }
  //   else if(olp != JSON.stringify(lp)) return true;
  //   game.oldLocalPlayer = JSON.stringify(game.localPlayer);
  //   // If we suddenly stop changing, make sure that is sent to others
  //   if(game.oldChangeCheck && !val){
  //     game.oldChangeCheck = val;
  //     return true;
  //   }
  //   game.oldChangeCheck = val;
  //   return val;
  // } else {
  //   return true;
  // }
  return true; 
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

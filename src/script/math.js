function round(val){
  return parseInt(val*1000)/1000;
}

function rgbToHex(r,g,b){
  var rgb = b | (g << 8) | (r << 16);
  var hex =  (0x1000000 | rgb).toString(16).substring(1);
  return hex;
}



/*  Checking if things have changed with the local player
    Returns true if it has changed - false if nothing changed
    Stores the previous value in game - to do some checks
*/
function changesCheck(){
  var res = true;
  if(game.oldLocalPlayer == null) {
    game.oldLocalPlayer = JSON.stringify(game.localPlayer);
  }
  else {
    if(JSON.stringify(game.localPlayer) == game.oldLocalPlayer) {
      res = false;
    }
    game.oldLocalPlayer = JSON.stringify(game.localPlayer);
  }
  // There is a 5% chance to still send - even if nothing changed
  if(Math.random()<0.95) return res;
  else return true;
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

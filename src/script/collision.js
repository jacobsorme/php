
function collision(){
  for(var p of game.globalPlayers.values()){
    for(var i in game.localPlayer.bullets){
      var b = game.localPlayer.bullets[i];
      if(proximity(p.x, b.x,40) && proximity(p.y, b.y,40)){
        game.localPlayer.bullets.splice(i,1);
        send("hit", p.socket);
      }
      if(proximity(game.localPlayer.x,b.x,40) && proximity(game.localPlayer.y,b.y,40)){
        if(game.localPlayer.penetration.indexOf(b.id) == -1){
          game.localPlayer.collisionCount += 1;

          if(game.localPlayer.collisionCount >= 21) surrender();

          game.localPlayer.bullets.splice(i,1);
        }
      } else {
        if(game.localPlayer.penetration.indexOf(b.id) != -1){
          game.localPlayer.penetration.splice(game.localPlayer.penetration.indexOf(b.id),1);
        }
      }
    }
  }
}

function bordercheck(object,margin){
  if(object.y < -margin){
    object.bounce += 1;
    object.rot = (180 - object.rot)%360;
    object.y = -margin;
  }
  else if(object.y > game.getHeight()+margin){
    object.bounce += 1;
    object.rot = (180 - object.rot)%360;
    object.y = game.getHeight()+margin;
  }
  if(object.x < -margin){
    object.bounce += 1;
    object.rot = (360 - object.rot)%360;
    object.x = -margin;
  }
  else if(object.x > game.getWidth()+margin){
    object.bounce += 1;
    object.rot = (360 - object.rot)%360;
    object.x = game.getWidth()+margin;
  }
}

function proximity(val1, val2, margin){
  if( Math.abs(val1 - val2) <= margin){
    return true;
  } else {
    return false;
  }
}

function bulletCloseToEdges(b){
  if(proximity(b.x,game.getWidth(),100) || proximity(b.x,0,100) ||proximity(b.y,game.getHeight(),100) || proximity(b.y,0,100)){
      return true;
  }
  return false;
}
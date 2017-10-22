
function collision(){
  for(var p of game.globalPlayers.values()){
    for(var i in game.localPlayer.bullets){
      var b = game.localPlayer.bullets[i];
      if(proximity(p.x, b.x,40) && proximity(p.y, b.y,40)){
        game.localPlayer.bullets.splice(i,1);
        send("hit", p.socket);
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
  if(object.y > game.getHeight()+margin){
    object.bounce += 1;
    object.rot = (180 - object.rot)%360;
    object.y = game.getHeight()+margin;
  }
  if(object.x < -margin){
    object.bounce += 1;
    object.rot = (360 - object.rot)%360;
    object.x = -margin;
  }
  if(object.x > game.getWidth()+margin){
    object.bounce += 1;
    object.rot = (360 - object.rot)%360;
    object.x = game.getWidth()+margin;
  }

}

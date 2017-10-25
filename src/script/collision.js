
function collision(){
  for(var p of game.globalPlayers.values()){
    for(var i in game.localPlayer.bullets){
      var b = game.localPlayer.bullets[i];
      if(proximity(p.x, b.x,40) && proximity(p.y, b.y,40)){
        // two players might be at same place! Can't remove bullet yet
        for(var q of game.globalPlayers.values()){
          if(p.id == q.id) continue;
          if(proximity(q.x, b.x,40) && proximity(q.y, b.y,40))send("hit", q.socket);
        }
        game.localPlayer.bullets.splice(i,1);
        send("hit", p.socket);
      }
      if(proximity(game.localPlayer.x, b.x,40) && proximity(game.localPlayer.y, b.y,40)){
        if(game.localPlayer.penetration.indexOf(b.id) == -1){
          game.localPlayer.collisionCount += 1;
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

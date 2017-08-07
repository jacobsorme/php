function collisionBool(player,bullet){
  return (player.x-50 < bullet.x && player.x+50 > bullet.x && player.y-50 <bullet.y && player.y+50 > bullet.y);
}

function collision(){
  // Double checking penetrating bullets - if database have them gone so shall we!
  // Be careful with your own bullets here!
  var found = false;
  var pL = game.localPlayer;
  for(var i in pL.penetration){
    var bp = pL.penetration[i];
    for(var j in game.globalPlayers){
      var pG = game.globalPlayers[j];
      if(pG.id != pL.id){
        for(var k in pG.bullets){
          var b = pG.bullets[k];
          if(b.id == bp.id && b.playerId == bp.playerId){
            found = true;
          }
        }
      }
    }
    if(!found){
      // Taking care of the problem with the own bullets
      if(pL.penetration[i].playerId != pL.id){
        pL.penetration.splice(i,1);
      }
    }
  }

  // Local checking
  var p = game.localPlayer
  for(var i in p.bullets){
    var b = p.bullets[i];
    if(p.x-50 < b.x && p.x+50 > b.x && p.y-50 <b.y && p.y+50 > b.y){
      // Checking if it is already inside the hitbox
      var alreadyInside = false;
      for(var j in p.penetration){
        if(p.penetration[j].id == b.id && p.penetration[j].playerId == b.playerId){
          alreadyInside = true;
        }
      }
      if(!alreadyInside){
        p.collisionCount += 1;
        p.penetration.push(b);
      }
    } else { // If the bullet is outside we shall remove it from penetration
      for(var k in p.penetration){
        if(p.penetration[k].id == b.id && p.penetration[k].playerId == b.playerId){
          p.penetration.splice(k,1);
        }
      }
    }
  }


  for(var i in game.globalPlayers){
    // We don't want to make checks on the local player based on what database says
    if(game.globalPlayers[i].id != game.localPlayer.id){
      var pG = game.globalPlayers[i];
      for(var j in pG.bullets){
        var b = pG.bullets[j];
        var pL = game.localPlayer;
        // If it is inside the hitbox
        if(pL.x-50 < b.x && pL.x+50 > b.x && pL.y-50 <b.y && pL.y+50 > b.y){
          // Checking if it is already inside the hitbox
          var alreadyInside = false;
          for(var k in pL.penetration){
            if(pL.penetration[k].id == b.id && pL.penetration[k].playerId == b.playerId){
              alreadyInside = true;
            }
          }
          if(!alreadyInside){
            pL.collisionCount += 1;
            pL.penetration.push(b);
          }
        } else { // If the bullet is outside we shall remove it from penetration
          for(var l in pL.penetration){
            if(pL.penetration[l].id == b.id && pL.penetration[l].playerId == b.playerId){
              pL.penetration.splice(l,1);
            }
          }
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

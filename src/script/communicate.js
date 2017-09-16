var iosocket = io.connect();

function Communication(){
  this.iosocket = io.connect();
}

Communication.prototype = {
  setResponse: function(tag,func){
    this.iosocket.on(tag,function(message){
      func(message);
    });
  },
  send: function(tag,content){
    this.iosocket.emit(tag,content);
  }
}

// Create a message with ID-request
function idMessage(username,r,g,b,roomId){
  var tag = "ID";
  var color = rgbToHex(r,g,b);
  //console.log(color);
  return "tag=" + tag + "&username=" + username + "&color=" + color + "&room=" + roomId;
}



// Create a message with data of player
function dataMessage(){
  var msg = "id=" + game.localPlayer.id;
  msg += "&x=" + parseInt(game.localPlayer.x);
  msg += "&y=" + parseInt(game.localPlayer.y);
  msg += "&rot=" + game.localPlayer.rot;
  msg += "&grot=" + game.localPlayer.glideRot;
  msg += "&spd=" + game.localPlayer.speed;
  msg += "&col=" + game.localPlayer.collisionCount;
  msg += "&gas=" + game.localPlayer.gas;
  msg += "&db=" + game.database;
  msg += "&rotSpd=" + game.localPlayer.rotSpeed;

  var bullets = JSON.parse(JSON.stringify(game.localPlayer.bullets));
  for(var i = 0; i < bullets.length; i++){
    delete bullets[i].bounce;
  }
  bullets = JSON.stringify(bullets);
  msg += "&bts=" + bullets;
  return msg;
}

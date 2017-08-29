var iosocket = io.connect();

function Communicate(){
  this.iosocket = io.connect();
}

Communicate.prototype = {
  setResponse: function(func,tag){
    this.iosocket.on(tag,function(message){
      func(message);
    });
  },
  send: function(content,tag){
    this.iosocket.emit(tag,content);
  }
}

iosocket.on('connect', function () {

// Send message to server.php, call callback with answer
function send(content,tag){

}




      function send(){
          var msg = document.getElementById("input").value;
          document.getElementById("content").innerHTML += msg + "<br>";
          document.getElementById("input").value = "";

      }


      $(function(){
          iosocket.on('connect', function () {
              connected();
              iosocket.on('message', function(message) {
                  interpretMessage(message);
              });
              iosocket.on('disconnect', function() {
                  disconnected();
              });
          });
      });
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

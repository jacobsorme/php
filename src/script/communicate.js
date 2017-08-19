// Send message to server.php, call callback with answer
function communicate(message,callback,serverSource){
  var message = message();
  if (window.XMLHttpRequest) {
    var xmlhttp=new XMLHttpRequest();
  }
  var d1 = new Date();
  var t1;
  xmlhttp.onreadystatechange= function() {
    if (this.readyState==4 && this.status==200) {
      var res = this.responseText;
      var d2 = new Date();
      t2 = d2.getTime();
      if(t2 - t1 < 500){
        callback(res);
      }
      //document.getElementById("connections").innerHTML += ("<tr><td>" + message + "</td><td>" + res + "</td></tr>" );
    }
  }
  xmlhttp.open("GET",serverSource+"?"+message,true);
  xmlhttp.send();
  t1 = d1.getTime();
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

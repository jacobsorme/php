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
      if(t2 - t1 < 5000){
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
function idMessage(username,r,g,b){
  var tag = "ID";
  var color = rgbToHex(r,g,b);
  //console.log(color);
  return "tag=" + tag + "&username=" + username + "&color=" + color;
}



// Create a message with data of player
function dataMessage(){
  var tag = "PD";
  var id = game.localPlayer.id;
  var left = parseInt(game.localPlayer.x);
  var top = parseInt(game.localPlayer.y);
  var rot = game.localPlayer.rot;
  var bullets = JSON.parse(JSON.stringify(game.localPlayer.bullets));
  var coll = game.localPlayer.collisionCount;
  for(var i = 0; i < bullets.length; i++){
    delete bullets[i].bounce;
    delete bullets[i].rot;
  }
  bullets = JSON.stringify(bullets);
  var res = "tag=" + tag + "&id=" + id + "&left=" + left + "&top=" + top + "&rotate=" + rot + "&bullets=" + bullets + "&collision=" + coll;
  return res;
}

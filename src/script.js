var player;
var keymap = [];
var runInterval;
var sendInterval;
var canvas = document.getElementById("frame");
var ctx = canvas.getContext("2d");

function test(text){
  document.write(text);

}

// Start function, used by button
function start(id) {
  if (runInterval != undefined){
    clearInterval(runInterval);
    clearInterval(sendInterval);
  }
  createPlayer(id);
  startController();
  runInterval = setInterval(run,100);

  // Start interval of function communicate() with paremeter update()
  setTimeout(function () {
    sendInterval = setInterval(communicate.bind(null,dataMessage,update),200);
  }, 1000);

}

// Send message to server.php, call callback with answer
function communicate(message,callback){
  var message = message();
  if (window.XMLHttpRequest) {
    var xmlhttp=new XMLHttpRequest();
  }
  xmlhttp.onreadystatechange= function() {
    if (this.readyState==4 && this.status==200) {
      var res = this.responseText;
      callback(res);
      //console.log(res);
      //document.getElementById("connections").innerHTML += ("<tr><td>" + message + "</td><td>" + res + "</td></tr>" );
    }
  }
  xmlhttp.open("GET","server.php?"+message,true);
  xmlhttp.send();
}

function createPlayer(idMessage){
  var idPlayer = JSON.parse(idMessage);
  var p = {
    id: idPlayer.id,
    left: 100,
    top: 100,
    rotate: 0,
  };

  checkMyPlayer(p);
}

function checkMyPlayer(p){
  if(player == undefined) {
    player = p;
  }
}


// Start the controlling of keys
function startController(){
  onkeydown = onkeyup = function(e) {
    keymap[e.keyCode] = (e.type == "keydown");
    document.getElementById("values").innerHTML = e.keyCode;
  }
}

function rotate(object, direction) {
	object.rot = object.rot + direction
}

function throttle(object, xSpeed, ySpeed) {
	var rot = (calculateRot(object)/360)*2*Math.PI;
	object.top = object.top - ySpeed*Math.cos(rot);
	object.left  = object.left + xSpeed*Math.sin(rot);
}

// Could reset the rotation, 360 = 0 etc. Cause trouble with smoothening CSS
function calculateRot(object) {
	var rot = object.rot;
  // if((rot > 360) || (rot < -360) ){
  //   rot = 0;
  // }
  return rot;
}


function run(){
  if(keymap[37]) rotate(player,-5);
  if(keymap[38]) throttle(player,15,15);
  if(keymap[39]) rotate(player,5);
  // if(keymap[32]) shoot(player);
}

// Update frame with data from server
function update(answer){
  var players = JSON.parse(answer);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for( i = 0; i< players.length; i++){
    ctx.fillRect(players[i].left, players[i].top, 100, 100);
  }
}

// Create a message with ID-request
function idMessage(username,r,g,b){
  var tag = "ID";
  return "tag=" + tag + "&username=" + username + "&r=" + r + "&g=" + g + "&b=" + b;
}

// Create a message with data of player
function dataMessage(){
  var tag = "PD";
  var id = player.id;
  var left = player.left;
  var top = player.top;
  var rot = player.rot;
  var res = "tag=" + tag + "&id=" + id + "&left=" + left + "&top=" + top + "&rotate=" + rot;
  return res;

}

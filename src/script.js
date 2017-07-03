var _player;
var _players;
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
  runInterval = setInterval(run,33.333333333333);

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
  if(_player == undefined) {
    _player = p;
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
	object.rotate = object.rotate + direction
}

function throttle(object, xSpeed, ySpeed) {
	var rot = (calculateRot(object)/360)*2*Math.PI;
	object.top = object.top - ySpeed*Math.cos(rot);
	object.left  = object.left + xSpeed*Math.sin(rot);
}

// Could reset the rotation, 360 = 0 etc. Cause trouble with smoothening CSS
function calculateRot(object) {
	var rot = object.rotate;
  if((rot > 360) || (rot < -360) ){
    rot = 0;
  }
  return rot;
}


function run(){
  if(keymap[37]) rotate(_player,-2);
  if(keymap[38]) throttle(_player,2,2);
  if(keymap[39]) rotate(_player,2);
  // if(keymap[32]) shoot(_player);
  //render(_player);
}


function update(answer){
  _players = JSON.parse(answer);
  render(_players);
}

// Update frame with data from server
function render(data){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for( i = 0; i< data.length; i++){
    var p = data[i];
    ctx.fillStyle = p.color;
    ctx.translate(p.left,p.top);
    ctx.rotate(p.rotate*(Math.PI/180));
    ctx.fillRect(0, 0, 100, 100);
    ctx.rotate(-1*p.rotate*(Math.PI/180));
    ctx.translate(-p.left,-p.top);
  }
}

// Create a message with ID-request
function idMessage(username,r,g,b){
  var tag = "ID";
  return "tag=" + tag + "&username=" + username + "&color=rgb(" + r + "," + g + "," + b + ")";
}

// Create a message with data of player
function dataMessage(){
  var tag = "PD";
  var id = _player.id;
  var left = parseInt(_player.left);
  var top = parseInt(_player.top);
  var rot = _player.rotate;
  var res = "tag=" + tag + "&id=" + id + "&left=" + left + "&top=" + top + "&rotate=" + rot;
  return res;

}

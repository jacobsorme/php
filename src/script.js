var _player;
var _players = [] ;
var keymap = [];
var runInterval;
var sendInterval;
var canvas = document.getElementById("frame");
var ctx = canvas.getContext("2d");

// The points
var planeBody = [[0,45],[-10,50],[-10,40],[-47,40],[-15,0],[-30,0],[-10,-20],[0,-50],[10,-20],[30,0],[15,0],[47,40],[10,40],[10,50]];
var planeWindow = [[0,-30],[-4,-25],[-4,-3],[0,0],[4,-3],[4,-25]];
// 40,30 35,90 46,90 50,60 54,90 65,90 60,30 50,0
var planeWing = [[-10,-20],[-15,40],[-4,40],[0,10],[4,40],[15,40],[10,-20],[0,-50]];

// Start function, used by button
// Starts the operation
function start(id) {
  if (runInterval != undefined){
    clearInterval(runInterval);
    clearInterval(sendInterval);
  }
  createPlayer(id);
  startController();
  runInterval = setInterval(run,25);

  // Start interval of function communicate() with paremeter update()
  setTimeout(function () {
    sendInterval = setInterval(communicate.bind(null,dataMessage,update),50);
  }, 500);
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

// Create a player - the variable _palyer is assigned
// Callback from communicate()
function createPlayer(idMessage){
  var idPlayer = JSON.parse(idMessage);
  var p = {
    username: idPlayer.username,
    id: idPlayer.id,
    left: 200,
    top: 200,
    rotate: 90,
    color: idPlayer.color,
    speed: 2,
    movementRotate: 0,
    bullets: [],
  };
  _player = p;
  checkMyPlayer(p);
}

function checkMyPlayer(p){
  if(_player == undefined) {
    _player = p;
  }
}

// Start the controlling of keys
// Use variable keymap
function startController(){
  onkeydown = onkeyup = function(e) {
    keymap[e.keyCode] = (e.type == "keydown");
    document.getElementById("values").innerHTML = e.keyCode;
  }
}

// Rotate - never more than 360
function rotate(object, direction) {
  object.rotate = (object.rotate + direction) % 360;
}

function throttle(object,rotateVariable, speed) {
	var rot = (rotateVariable/360)*2*Math.PI;
	object.top = object.top - (speed*Math.cos(rot));
	object.left  = object.left + (speed*Math.sin(rot));
}

// Controls the slow-down of player
function speedDown(current){
  if(current < 1){
    return 0;
  } else {
    return current*0.985;
  }
}

function speedUp(current){
  if(current + 0.5 > 6) {
    return 6;
  } else {
    return current + 0.5;
  }
}

function run(){
  // To check the real rotation and the rotation/direction of movement
  if(keymap[38]) {
    _player.speed = speedUp(_player.speed);
    _player.movementRotate = _player.rotate;
    throttle(_player,_player.rotate,_player.speed);
  } else {
    if(_player.speed > 0) _player.speed = speedDown(_player.speed);
    else _player.speed = 0;
    throttle(_player,_player.movementRotate,_player.speed);
  }
  if(keymap[37]) rotate(_player,-4);
  if(keymap[39]) rotate(_player,4);
  if(keymap[32]) {
    var bullet = {
      rotate: _player.rotate,
      top: parseInt(_player.top),
      left: parseInt(_player.left),
    }
    _player.bullets.push(bullet);
  }

  display(_players);
  render(_player);
}

function update(answer){
  _players = JSON.parse(answer);
}

// Update frame with data from server
function display(data){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for(var i = 0; i < data.length; i++){
    var p = data[i];
    if(_player.id != p.id){
        render(p);
    }
  }
}

function render(p){

  ctx.fillStyle = "#000";
  var bullets = p.bullets;
  for(var i = 0;i < bullets.length; i++){
  //if(bullets.length > 0){
    var b = bullets[i];
    ctx.translate(b.left,b.top);
    ctx.rotate(b.rotate*(Math.PI/180));
    ctx.fillRect(-5,-50,10,100);

    ctx.rotate(-1*b.rotate*(Math.PI/180));
    ctx.translate(-b.left,-b.top);
  }

  ctx.translate(p.left,p.top);
  ctx.rotate(p.rotate*(Math.PI/180));

  ctx.fillStyle = p.color;
  ctx.beginPath();
  ctx.moveTo(0,20);
  ctx.lineTo(-50,50);
  ctx.lineTo(0,-50);
  ctx.lineTo(50,50);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.moveTo(0,20);
  ctx.lineTo(-20,0);
  ctx.lineTo(0,-20);
  ctx.lineTo(20,0);
  ctx.closePath();
  ctx.fill();

  ctx.rotate(-1*p.rotate*(Math.PI/180));
  ctx.translate(-p.left,-p.top);
}

// Draws polygon accordingly
function polygons(objects){
  var object;
  var points;
  for(var i = 0; i < objects.length; i++) {
    object = objects[i];
    points = object[0];

    ctx.beginPath();
    ctx.moveTo(points[0][0],points[0][1]);
    for(var i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0],points[i][1]);
    }
    ctx.closePath();
    ctx.fillStyle = object[1];
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 4;
    ctx.fill();
    ctx.stroke();
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
  var bullets = JSON.stringify(_player.bullets);
  var res = "tag=" + tag + "&id=" + id + "&left=" + left + "&top=" + top + "&rotate=" + rot + "&bullets=" + bullets;
  return res;
}

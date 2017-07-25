var _player= {};
var _players = [];


var keymap = [];

var runInterval;
var sendInterval;

var canvas = document.getElementById("frame");
var ctx = canvas.getContext("2d");

var shootTime = true;

var KEYS = {
  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
}

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
    sendInterval = setInterval(communicate.bind(null,dataMessage,update),100);
  }, 500);
}

// Send message to server.php, call callback with answer
function communicate(message,callback){
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
  xmlhttp.open("GET","server.php?"+message,true);
  xmlhttp.send();
  t1 = d1.getTime();
}

// Create a player - the variable _palyer is assigned
// Callback from communicate()
function createPlayer(idMessage){
  var idPlayer = JSON.parse(idMessage);
  var p = {
    name: idPlayer.name,
    id: idPlayer.id,
    x: 500, y: 500, rot: 90,
    clr: idPlayer.clr,
    speed: 2,
    movementRotate: 0,
    bts: [],
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
  object.rot = (object.rot + direction) % 360;
}

function throttle(object,rotateVariable, speed) {
	var rot = (rotateVariable/360)*2*Math.PI;
	object.y = parseInt(100*(object.y - (speed*Math.cos(rot))))/100;
	object.x  = parseInt(100*(object.x + (speed*Math.sin(rot))))/100;
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
  var bts = _player.bts;
  if(keymap[KEYS.UP]) {
    _player.speed = speedUp(_player.speed);
    _player.movementRotate = _player.rot;
    throttle(_player,_player.rot,_player.speed);
  } else {
    if(_player.speed > 0) _player.speed = speedDown(_player.speed);
    else _player.speed = 0;
    throttle(_player,_player.movementRotate,_player.speed);
  }
  if(keymap[KEYS.LEFT]) rotate(_player,-4);
  if(keymap[KEYS.RIGHT]) rotate(_player,4);
  if(keymap[KEYS.SPACE] && shootTime) {
    shootTime = false;
    setTimeout(function() {shootTime = true;},400);
    var bullet = {
      rot: _player.rot,
      y: parseInt(_player.y), x: parseInt(_player.x),
      bounceCount: 0,
    }
    if(bts.length < 3) bts.push(bullet);
  }

  for(var i = 0; i < bts.length; i++){
    throttle(bts[i],bts[i].rot,10);
    if(bts[i].bounceCount < 4){
      bordercheck(bts[i],15);
    } else {
      bts.splice(i,1);
    }
  }
  display(_players);
  render(_player);

}

function bordercheck(object,margin){
  if(object.y < -margin){
    object.bounceCount += 1;
    object.rot = (180 - object.rot)%360;
    object.y = -margin;
  }
  if(object.y > canvas.height+margin){
    object.bounceCount += 1;
    object.rot = (180 - object.rot)%360;
    object.y = canvas.height+margin;
  }
  if(object.x < -margin){
    object.bounceCount += 1;
    object.rot = (360 - object.rot)%360;
    object.x = -margin;
  }
  if(object.x > canvas.width+margin){
    object.bounceCount += 1;
    object.rot = (360 - object.rot)%360;
    object.x = canvas.width+margin;
  }

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
  var bullets = p.bts;
  //console.log(bullets);
  for(var i = 0;i < bullets.length; i++){
    var b = bullets[i];
    ctx.translate(b.x,b.y);
    ctx.rotate(b.rot*(Math.PI/180));
    ctx.beginPath();
    ctx.arc(0,0,15,0,2*Math.PI);
    ctx.fill();
    ctx.rotate(-1*b.rot*(Math.PI/180));
    ctx.translate(-b.x,-b.y);
  }
  polygons(p.x,p.y,p.rot,[planeBody,planeWing,planeWindow],["#" + p.clr,"#888","#3FF"]);

  var margin = 50;
  var offset = 50;
  var width = canvas.width;
  var height = canvas.height;
  var x = parseInt(p.x);
  var y = parseInt(p.y);

  if(x+margin > width){
    if(x > (width+margin)){
      p.x = (x-width-offset);
      polygons(p.x,p.y,p.rot,[planeBody,planeWing,planeWindow],["#" + p.clr,"#888","#3FF"]);
    } else {
      polygons(x-width-offset,p.y,p.rot,[planeBody,planeWing,planeWindow],["#" + p.clr,"#888","#3FF"]);
    }
  }if((x-margin) < 0){
    if(x < -1*margin){
      p.x = (width+x+offset);
      polygons(p.x,p.y,p.rot,[planeBody,planeWing,planeWindow],["#" + p.clr,"#888","#3FF"]);
    } else {
      polygons(width+x+offset,p.y,p.rot,[planeBody,planeWing,planeWindow],["#" + p.clr,"#888","#3FF"]);
    }
  }if((y+margin) > height){
    if(y > (height+margin)){
      p.y = y-height-offset;
      polygons(p.x,p.y,p.rot,[planeBody,planeWing,planeWindow],["#" + p.clr,"#888","#3FF"]);
    } else {
      polygons(p.x,y-height-offset,p.rot,[planeBody,planeWing,planeWindow],["#" + p.clr,"#888","#3FF"]);
    }
  }if((y-margin) < 0 ){
    if(y < -1*margin){
      p.y = height+y+offset;
      polygons(p.x,p.y,p.rot,[planeBody,planeWing,planeWindow],["#" + p.clr,"#888","#3FF"]);
    } else {
      polygons(p.x,height+y+offset,p.rot,[planeBody,planeWing,planeWindow],["#" + p.clr,"#888","#3FF"]);
    }
  }
}

// Draws polygon accordingly
function polygons(x,y,rot,pointsList,colorList){
  ctx.translate(x,y);
  ctx.rotate(rot*(Math.PI/180));
  for(var i = 0; i< pointsList.length;i++){
    ctx.fillStyle = colorList[i];
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 4;
    ctx.beginPath();
    var points = pointsList[i];
    for(var j = 0; j < points.length; j++) {
      ctx.lineTo(points[j][0],points[j][1]);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
  ctx.rotate(-1*rot*(Math.PI/180));
  ctx.translate(-x,-y);
}

function rgbToHex(r,g,b){
  var rgb = b | (g << 8) | (r << 16);
  var hex =  (0x1000000 | rgb).toString(16).substring(1);
  return hex;
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
  var id = _player.id;
  var left = parseInt(_player.x);
  var top = parseInt(_player.y);
  var rot = _player.rot;
  var bullets = JSON.parse(JSON.stringify(_player.bts));
  for(var i = 0; i < bullets.length; i++){
    delete bullets[i].bounceCount;
    delete bullets[i].rot;
  }
  bullets = JSON.stringify(bullets);
  //console.log(bullets);
  var res = "tag=" + tag + "&id=" + id + "&left=" + left + "&top=" + top + "&rotate=" + rot + "&bullets=" + bullets;
  return res;
}

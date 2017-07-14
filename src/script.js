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
  runInterval = setInterval(run,25);

  // Start interval of function communicate() with paremeter update()
  setTimeout(function () {
    sendInterval = setInterval(communicate.bind(null,dataMessage,update),50);
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
    left: 200,
    top: 200,
    rotate: 0,
    color: idPlayer.color,
    speed: 1,
    movementRotate: 0,
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
function startController(){
  onkeydown = onkeyup = function(e) {
    keymap[e.keyCode % 37] = (e.type == "keydown");
    //document.getElementById("values").innerHTML = e.keyCode;
  }
}

function rotate(object, direction, throttle) {
  object.rotate = object.rotate + direction
}

function throttle(object,rotateVariable, speed) {
	var rot = (rotateVariable/360)*2*Math.PI;
	object.top = object.top - speed*Math.cos(rot);
	object.left  = object.left + speed*Math.sin(rot);
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
  if(current + 0.5 > 5) {
    return 5;
  } else {
    return current + 0.5;
  }
}

// Could reset the rotation, 360 = 0 etc. Cause trouble with smoothening CSS
function calculateRot(object) {
	var rot = object.rotate;
  // if((rot > 360) || (rot < -360) ){
  //   object.otate = 0;
  // }
  return rot;
}

function run(){

  // To check the real rotation and the rotation/direction of movement
  if(keymap[1]) {
    _player.speed = speedUp(_player.speed);
    _player.movementRotate = _player.rotate;
    throttle(_player,_player.rotate,_player.speed);
    if(keymap[0]) rotate(_player,-4,true);
    if(keymap[2]) rotate(_player,4,true);
  } else {
    throttle(_player,_player.movementRotate,_player.speed);
  }

  if(!keymap[1]) {
    if(keymap[0]) rotate(_player,-4,false);
    if(keymap[2]) rotate(_player,4,false);
    if(_player.speed > 0){
        _player.speed = speedDown(_player.speed) ;
    } else {
      _player.speed = 0;
    }
  }


  // if(keymap[32]) shoot(_player);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  display(_players);
  render(_player);

}


function update(answer){
  _players = JSON.parse(answer);
  //display(_players);
}

// Update frame with data from server
function display(data){
  //render(_player);
  for( i = 0; i < data.length; i++){
    var p = data[i];
    //console.log(p.username + "\n");
    if(_player.id != p.id){
        render(p);
    }
  }
}

function render(p){


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

  // ctx.fillRect(-50,-50, 100, 100);
  // ctx.lineWidth = 3;
  // ctx.lineStyle = "#000";
  // ctx.strokeRect(-50,-50,100,100);

  //polygons([[planeWing,"#888"],[planeBody,p.color],[planeWindow,"#3FF"]]);

  // var objects = [[planeWing,"#888"],[planeBody,p.color],[planeWindow,"#3FF"]];
  // var points;
  // var object;
  // for(i = 0; i < objects.length; i++) {
  //   object = objects[i];
  //   points = object[0];
  //
  //   ctx.beginPath();
  //   ctx.moveTo(points[0][0],points[0][1]);
  //   for(i = 1; i < points.length; i++) {
  //     ctx.lineTo(points[i][0],points[i][1]);
  //   }
  //   ctx.closePath();
  //   ctx.fillStyle = object[1];
  //   ctx.strokeStyle = "#000";
  //   ctx.lineWidth = 4;
  //   ctx.fill();
  //   ctx.stroke();
  // }

    ctx.rotate(-1*p.rotate*(Math.PI/180));
    ctx.translate(-p.left,-p.top);

}

// Draws polygon accordingly
function polygons(objects){
  var object;
  var points;
  for(i = 0; i < objects.length; i++) {
    object = objects[i];
    points = object[0];

    ctx.beginPath();
    ctx.moveTo(points[0][0],points[0][1]);
    for(i = 1; i < points.length; i++) {
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
  var res = "tag=" + tag + "&id=" + id + "&left=" + left + "&top=" + top + "&rotate=" + rot;
  return res;

}

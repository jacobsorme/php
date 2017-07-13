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
  runInterval = setInterval(run,50);

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
    left: 200,
    top: 200,
    rotate: 0,
    color: idPlayer.color,
  };
  _player = p;
  //checkMyPlayer(p);
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
    object.rotate = 0;
  }
  return rot;
}


function run(){
  if(keymap[37]) rotate(_player,-2);
  if(keymap[38]) throttle(_player,4,4);
  if(keymap[39]) rotate(_player,2);
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
    console.log(p.username + "\n");
    if(_player.id != p.id){
        render(p);
    }
  }
}

function render(p){


  ctx.translate(p.left,p.top);
  ctx.rotate(p.rotate*(Math.PI/180));


  ctx.fillStyle = p.color;
  ctx.fillRect(-50,-50, 100, 100);
  ctx.lineWidth = 3;
  ctx.lineStyle = "#000";
  ctx.strokeRect(-50,-50,100,100);

  // polygon(planeBody,true,true,p.color,"#000",4);
  // polygon(planeWing,true,true,"#888","#000",4);
  // polygon(planeWindow,true,true,"#3FF","#000",4);

  ctx.rotate(-1*p.rotate*(Math.PI/180));
  ctx.translate(-p.left,-p.top);
}

// Draws polygon accordingly
function polygon(points,fill,stroke,fillColor,strokeColor,lineWidth){
  ctx.beginPath();
  ctx.moveTo(points[0][0],points[0][1]);
  for(i = 1; i < points.length; i++) {
    ctx.lineTo(points[i][0],points[i][1]);
  }
  ctx.closePath();
  if(fill == true){
    ctx.fillStyle = fillColor;
    ctx.fill();
  }
  if(stroke == true){
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = lineWidth;
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

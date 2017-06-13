var player;
var keymap = [];
var runInterval;
var sendInterval;

function test(text){
  document.write(text); 

}

// Start function, used by button
function start() {
  if (runInterval != undefined){
    clearInterval(runInterval);
    clearInterval(sendInterval);
  }
  communicate(idMessage,createPlayer);
  startController();
  runInterval = setInterval(run,100);

  // Start interval of function communicate() with paremeter update()
  setTimeout(function () {
    sendInterval = setInterval(communicate.bind(null,dataMessage,update),100);
  }, 2000);

}

// Send message to server.php, call callback with answer
function communicate(messageFunc,callback){
  var message = messageFunc();
  if (window.XMLHttpRequest) {
    var xmlhttp=new XMLHttpRequest();
  }
  xmlhttp.onreadystatechange= function() {
    if (this.readyState==4 && this.status==200) {
      callback(this.responseText);
      document.getElementById("recv").innerHTML = this.responseText;
    }
  }
  xmlhttp.open("GET","server.php?msg="+message,true);
  xmlhttp.send();
}

function createPlayer(id){
  var p = document.createElement("DIV");
  p.id = id;
  p.style.width = "100px";
  p.style.height = "100px";
  p.style.backgroundColor = "#0000ff";
  p.style.position = "absolute";
  p.style.left = "100px";
  p.style.top = "100px";
  p.style.opacity = 0.5;
  p.style.transform = "rotate(0deg)";
  p.innerHTML = "ASs";
  document.getElementById("frame").appendChild(p);
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
	var rot = calculateRot(object) + direction;
	object.style.transform = "rotate(" + rot + "deg)";
}

function throttle(object, xSpeed, ySpeed) {
	var rot = (calculateRot(object)/360)*2*Math.PI;
	object.style.top = parseFloat(object.style.top) - ySpeed*Math.cos(rot) + "px";
	object.style.left  = parseFloat(object.style.left) + xSpeed*Math.sin(rot) + "px";
}

// Could reset the rotation, 360 = 0 etc. Cause trouble with smoothening CSS
function calculateRot(object) {
	var rot = parseInt(/rotate\(\-?\d+/.exec(object.style.transform).toString().substr(7));
  // if((rot > 360) || (rot < -360) ){
  //   rot = 0;
  // }
  return rot;
}


function run(){
  if(keymap[37]) rotate(player,-5);
  if(keymap[38]) throttle(player,15,15);
  if(keymap[39]) rotate(player,5);
  if(keymap[32]) shoot(player);
}

// Update frame with data from server
function update(answer){
  var players = JSON.parse(answer);
  for( i = 0; i< players.length; i++){
    if(players[i].id != player.id){
      if(document.getElementById(players[i].id) == undefined){
        createPlayer(players[i].id)
      } else {
        document.getElementById(players[i].id).style.left = players[i].left + "px";
        document.getElementById(players[i].id).style.top = players[i].top + "px";
        document.getElementById(players[i].id).style.transform = "rotate("+players[i].rotate+"deg)";
      }
    }
  }
}

// Create a message with ID-request
function idMessage(){
  return "ID";
}

// Create a message with data of player
function dataMessage(){
  var tag = "PD";
  var id = player.id;
  var left = parseInt(player.style.left);
  var top = parseInt(player.style.top);
  var rot = calculateRot(player);
  return tag + " " + id + " " + left + " " + top + " " + rot;
}

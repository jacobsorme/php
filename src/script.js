
function Game(){
  this.canvas = null;
  this.ctx = null;
  this.localPlayer = null;
  this.globalPlayers = null;
  this.runInterval = null;
  this.runTime = null;
  this.sendInterval = null;
  this.sendTime = null;
  this.keys = null;
  this.keymap = null;
}

Game.prototype = {
  setPlayer: function(p){
    this.localPlayer = p;
  },
  getPlayer: function(){
    return this.localPlayer;
  },
  setCanvas: function(canvas){
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
  },
  getWidth: function(){
    return this.canvas.width;
  },
  getHeight: function(){
    return this.canvas.height;
  },
  // Converts a server player to a client-like player.
  setglobalPlayers: function(data){
    this.globalPlayers = [];
    for(var i = 0; i < data.length; i++){
      var p1 = data[i];
      var p2 = new Player(p1.name,p1.id,p1.x,p1.y,p1.rot,p1.clr,null,null,p1.bts);
      this.globalPlayers.push(p2);
    }
  }
}

// Class Player
function Player(name,id,x,y,rot,color,speed,glideRot,bullets){
  this.name = name;
  this.id = id;
  this.x = x;
  this. y = y;
  this.rot = rot;
  this.color = color;
  this.speed = speed;
  this.glideRot = glideRot;
  this.bullets = bullets;
  this.bulletId = 0;
  this.shootTime = null;
  this.components = null;
  this.collisionCount = 0;
  this.penetration = [];
}

function Bullet(playerId,id,x,y,rot){
  this.playerId = playerId;
  this.id = id;
  this.x = x;
  this.y = y;
  this.rot = rot;
  this.bounce = 0;
}

// The points
var planeBody = [[0,45],[-10,50],[-10,40],[-47,40],[-15,0],[-30,0],[-10,-20],[0,-50],[10,-20],[30,0],[15,0],[47,40],[10,40],[10,50]];
var planeWindow = [[0,-30],[-4,-25],[-4,-3],[0,0],[4,-3],[4,-25]];
// 40,30 35,90 46,90 50,60 54,90 65,90 60,30 50,0
var planeWing = [[-10,-20],[-15,40],[-4,40],[0,10],[4,40],[15,40],[10,-20],[0,-50]];


 var game;
// Start function, used by button swag
// Starts the operation
function start(idMessage) {
  setTimeout(function() {
    //window.location = "http://duckduckgo.com";
  },10000);
  game = new Game();
  game.runTime = 50;
  game.sendTime =100;
  game.setCanvas(document.getElementById("frame"));
  game.keys = {
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
  };
  game.keymap = [];
  createPlayer(idMessage);
  startController();


  // Start interval of function communicate() with paremeter update()
  setTimeout(function() {
    game.sendInterval = setInterval(communicate.bind(null,dataMessage,update),game.sendTime);
  }, 1000);
  console.log("Send:" + game.sendTime);
  console.log("Run:" + game.runTime);
  game.runInterval = setInterval(run,game.runTime);
  setInterval(displayData,300);
  setTimeout(function() {
    setInterval(collision,200);
  }, 1000);
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
  var idObj = JSON.parse(idMessage);
  var p = new Player(idObj.name,idObj.id,400,400,90,idObj.clr,2,0,[]);
  p.shootTime = true;
  game.setPlayer(p);
}

// Start the controlling of keys
function startController(){
  onkeydown = onkeyup = function(e) {
    game.keymap[e.keyCode] = (e.type == "keydown");
    //document.getElementById("values").innerHTML = e.keyCode;
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
  if(current + 0.5 > 9) {
    return 6;
  } else {
    return current + 0.5;
  }
}

function run(){
  //console.log(JSON.stringify(game.localPlayer.penetration));
  // To check the real rotation and the rotation/direction of movement
  var p = game.localPlayer;
  var bullets = p.bullets;
  if(game.keymap[game.keys.UP]) {
    p.speed = speedUp(p.speed);
    p.glideRot = p.rot;
    throttle(p,p.rot,p.speed);
  } else {
    if(p.speed > 0) p.speed = speedDown(p.speed);
    else p.speed = 0;
    throttle(p,p.glideRot,p.speed);
  }
  if(game.keymap[game.keys.LEFT]) rotate(p,-4);
  if(game.keymap[game.keys.RIGHT]) rotate(p,4);
  if(game.keymap[game.keys.SPACE] && p.shootTime) {
    p.shootTime = false;
    if(bullets.length < 3){
      var bullet = new Bullet(p.id,p.bulletId,round(p.x),round(p.y),p.rot);
      p.bulletId += 1;
      bullets.push(bullet);
    }
    setTimeout(function() {p.shootTime = true;},400);
  }

  for(var i = 0; i < bullets.length; i++){
    throttle(bullets[i],bullets[i].rot,7);
    if(bullets[i].bounce < 4){
      bordercheck(bullets[i],15);
    } else {
      //removePenetration(bullets[i]);
      bullets.splice(i,1);
    }
  }
  display(game.globalPlayers);
  render(game.localPlayer);

}

function collisionBool(player,bullet){
  return (player.x-50 < bullet.x && player.x+50 > bullet.x && player.y-50 <bullet.y && player.y+50 > bullet.y);
}

function collision(){
  // Double checking penetrating bullets - if database have them gone so shall we!
  // Be careful with your own bullets here!
  var found = false;
  var pL = game.localPlayer;
  for(var i in pL.penetration){
    var bp = pL.penetration[i];
    for(var j in game.globalPlayers){
      var pG = game.globalPlayers[j];
      if(pG.id != pL.id){
        for(var k in pG.bullets){
          var b = pG.bullets[k];
          if(b.id == bp.id && b.playerId == bp.playerId){
            found = true;
          }
        }
      }
    }
    if(!found){
      // Taking care of the problem with the own bullets
      if(pL.penetration[i].playerId != pL.id){
        pL.penetration.splice(i,1);
      }
    }
  }

  // Local checking
  var p = game.localPlayer
  for(var c in p.bullets){
    var b = p.bullets[c];
    if(p.x-50 < b.x && p.x+50 > b.x && p.y-50 <b.y && p.y+50 > b.y){
      // Checking if it is already inside the hitbox
      var alreadyInside1 = false;
      for(var d in p.penetration){
        if(p.penetration[d].id == b.id && p.penetration[d].playerId == b.playerId){
          console.log("I have found the bullet in penetration");
          alreadyInside1 = true;
        }
      }
      if(!alreadyInside1){
        console.log("alreadyInside is false: I am in that if");
        p.collisionCount += 1;
        p.penetration.push(b);
      }
    } else { // If the bullet is outside we shall remove it from penetration
      for(var e in p.penetration){
        if(p.penetration[e].id == b.id && p.penetration[e].playerId == b.playerId){
          p.penetration.splice(e,1);
        }
      }
    }
  }


  for(var i in game.globalPlayers){
    // We don't want to make checks on the local player based on what database says
    if(game.globalPlayers[i].id != game.localPlayer.id){
      var pG = game.globalPlayers[i];
      for(var j in pG.bullets){
        var b = pG.bullets[j];
        var pL = game.localPlayer;
        // If it is inside the hitbox
        if(pL.x-50 < b.x && pL.x+50 > b.x && pL.y-50 <b.y && pL.y+50 > b.y){
          // Checking if it is already inside the hitbox
          var alreadyInside = false;
          for(var k in pL.penetration){
            if(pL.penetration[k].id == b.id && pL.penetration[k].playerId == b.playerId){
              alreadyInside = true;
            }
          }
          if(!alreadyInside){
            pL.collisionCount += 1;
            pL.penetration.push(b);
          }
        } else { // If the bullet is outside we shall remove it from penetration
          for(var l in pL.penetration){
            if(pL.penetration[l].id == b.id && pL.penetration[l].playerId == b.playerId){
              pL.penetration.splice(l,1);
            }
          }
        }
      }
    }
  }
}

function bordercheck(object,margin){
  if(object.y < -margin){
    object.bounce += 1;
    object.rot = (180 - object.rot)%360;
    object.y = -margin;
  }
  if(object.y > game.getHeight()+margin){
    object.bounce += 1;
    object.rot = (180 - object.rot)%360;
    object.y = game.getHeight()+margin;
  }
  if(object.x < -margin){
    object.bounce += 1;
    object.rot = (360 - object.rot)%360;
    object.x = -margin;
  }
  if(object.x > game.getWidth()+margin){
    object.bounce += 1;
    object.rot = (360 - object.rot)%360;
    object.x = game.getWidth()+margin;
  }

}

function update(answer){
    //document.getElementById("values").innerHTML = "<br>" + answer;
    game.setglobalPlayers(JSON.parse(answer));
}

// Update frame with data from server
function display(data){
  game.ctx.clearRect(0, 0, game.getWidth(), game.getHeight());
  for(var i = 0; i < data.length; i++){
    var p = data[i];
    if(game.localPlayer.id != p.id){
        render(p);
    }
  }
}


// Rendering
function render(p){
  bulletRender(p);
  polygons(p.x,p.y,p.rot,[planeBody,planeWing,planeWindow],["#" + p.color,"#888","#3FF"]);
  portalRender(p);
}


function displayData(){
  var html = "<tr><th>";
  html += game.localPlayer.name;
  html += "</th>";
  for(var i = 0; i < game.globalPlayers.length; i++){
    if(game.globalPlayers[i].id != game.localPlayer.id){
      html += "<th>"+ game.globalPlayers[i].name + "</th>";
    }
  }
  html += "</tr><tr><td>";
  html += game.localPlayer.collisionCount;
  html += "</td>";
  for(var i = 0; i < game.globalPlayers.length; i++){
    if(game.globalPlayers[i].id != game.localPlayer.id){
      html += "<td>"+ game.globalPlayers[i].collisionCount + "</td>";
    }
  }
  html += "</tr><tr><td>";
  html += JSON.stringify(game.localPlayer.penetration);
  html += "</td>";
  for(var i = 0; i < game.globalPlayers.length; i++){
    if(game.globalPlayers[i].id != game.localPlayer.id){
      html += "<td>"+ JSON.stringify(game.globalPlayers[i].penetration) + "</td>";
    }
  }
  html += "</tr>";
  document.getElementById("data").innerHTML = html;
}


// Render portals
function portalRender(p){
  var margin = 50;
  var offset = 50;
  var width = game.getWidth();
  var height = game.getHeight();
  var x = round(p.x);
  var y = round(p.y);

  if(x+margin > width){
    if(x > (width+margin)){
      p.x = (x-width-offset);
      polygons(p.x,p.y,p.rot,[planeBody,planeWing,planeWindow],["#" + p.color,"#888","#3FF"]);
    } else {
      polygons(x-width-offset,p.y,p.rot,[planeBody,planeWing,planeWindow],["#" + p.color,"#888","#3FF"]);
    }
  }if((x-margin) < 0){
    if(x < -1*margin){
      p.x = (width+x+offset);
      polygons(p.x,p.y,p.rot,[planeBody,planeWing,planeWindow],["#" + p.color,"#888","#3FF"]);
    } else {
      polygons(width+x+offset,p.y,p.rot,[planeBody,planeWing,planeWindow],["#" + p.color,"#888","#3FF"]);
    }
  }if((y+margin) > height){
    if(y > (height+margin)){
      p.y = y-height-offset;
      polygons(p.x,p.y,p.rot,[planeBody,planeWing,planeWindow],["#" + p.color,"#888","#3FF"]);
    } else {
      polygons(p.x,y-height-offset,p.rot,[planeBody,planeWing,planeWindow],["#" + p.color,"#888","#3FF"]);
    }
  }if((y-margin) < 0 ){
    if(y < -1*margin){
      p.y = height+y+offset;
      polygons(p.x,p.y,p.rot,[planeBody,planeWing,planeWindow],["#" + p.color,"#888","#3FF"]);
    } else {
      polygons(p.x,height+y+offset,p.rot,[planeBody,planeWing,planeWindow],["#" + p.color,"#888","#3FF"]);
    }
  }
}

// Render bullets
function bulletRender(p){
  game.ctx.fillStyle = "#000";
  var bullets = p.bullets;
  for(var i = 0;i < bullets.length; i++){
    var b = bullets[i];
    game.ctx.translate(b.x,b.y);
    game.ctx.rotate(b.rot*(Math.PI/180));
    game.ctx.beginPath();
    game.ctx.arc(0,0,15,0,2*Math.PI);
    game.ctx.fill();
    game.ctx.rotate(-1*b.rot*(Math.PI/180));
    game.ctx.translate(-b.x,-b.y);
  }
}


// Draws polygon accordingly
function polygons(x,y,rot,pointsList,colorList){
  game.ctx.translate(x,y);
  game.ctx.rotate(rot*(Math.PI/180));
  for(var i = 0; i< pointsList.length;i++){
    game.ctx.fillStyle = colorList[i];
    game.ctx.strokeStyle = "#000";
    game.ctx.lineWidth = 4;
    game.ctx.beginPath();
    var points = pointsList[i];
    for(var j = 0; j < points.length; j++) {
      game.ctx.lineTo(points[j][0],points[j][1]);
    }
    game.ctx.closePath();
    game.ctx.fill();
    game.ctx.stroke();
  }
  game.ctx.rotate(-1*rot*(Math.PI/180));
  game.ctx.translate(-x,-y);
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

function round(val){
  return parseInt(val*100)/100;
}

// Create a message with data of player
function dataMessage(){
  var tag = "PD";
  var id = game.localPlayer.id;
  var left = parseInt(game.localPlayer.x);
  var top = parseInt(game.localPlayer.y);
  var rot = game.localPlayer.rot;
  var bullets = JSON.parse(JSON.stringify(game.localPlayer.bullets));
  for(var i = 0; i < bullets.length; i++){
    delete bullets[i].bounce;
    delete bullets[i].rot;
  }
  bullets = JSON.stringify(bullets);
  var res = "tag=" + tag + "&id=" + id + "&left=" + left + "&top=" + top + "&rotate=" + rot + "&bullets=" + bullets
  // + "&collision=" + _player.coll;
  return res;
}

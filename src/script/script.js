
function Game(){
  this.canvas = null;
  this.ctx = null;
  this.localPlayer = null;
  this.globalPlayers = [];
  this.archivedGlobalPlayers = [];
  this.archivedData = [];
  this.runInterval = null;
  this.runTime = null;
  this.sendInterval = null;
  this.sendTime = null;
  this.keys = null;
  this.keymap = null;
  this.database = null;
  this.server = null;
  this.bulletSpeed = 0;
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
  // Also does checks on new incoming data VS last. This should affect globalPlayers.
  setglobalPlayers: function(data){
    this.archivedGlobalPlayers = this.globalPlayers;
    this.globalPlayers = [];
    for(var i = 0; i < data.length; i++){
      var p1 = data[i];
      if(p1.id == game.localPlayer.id) continue;
      var p2 = new Player(p1.name,p1.id,p1.x,p1.y,p1.rot,p1.clr,p1.spd,p1.grot,p1.bts,p1.col,p1.gas,p1.rotSpd);


      // Going through the older data to see if the new data is relevant
      // Comparing the old data with the new Player() p2 created from the new data
      for(var j in this.archivedData){
        var oldD = this.archivedData[j];
        if(oldD.id == p2.id){
          // Check the X values - The speed of the player will be compared
          // This will happen every 200 ms, while the run() goes 50ms. A player should have moved ca. 4*speed since last check.
          if(oldD.x == p2.x && p2.speed > 3 && ((p2.rot > 10 && p2.rot < 170) || (p2.rot < 350 && p2.rot > 190))) {
            var oldP = findSameId(this.archivedGlobalPlayers,p2.id);
            if(oldP != false){
              p2.x = oldP.x;
              p2.y = oldP.y;
              throttle(p2,p2.glideRot,p2.speed*0.7);
            }
          }
          // Check the Y values
          if(oldD.y == p2.y && p2.speed > 3 && ((p2.rot > 100 && p2.rot < 260) || (p2.rot < 80 || p2.rot > 280))) {
            var oldP = findSameId(this.archivedGlobalPlayers,p2.id);
            if(oldP != false){
              p2.x = oldP.x;
              p2.y = oldP.y;
              throttle(p2,p2.glideRot,p2.speed*0.7);
            }
          }
        }
      }
      this.globalPlayers.push(p2);
    }
    this.archivedData = data;
  }
}


    //
    //   for(var j in data){
    //     if(oldP.id == data[j].id){
    //       var newP = data[j];
    //       var id = oldP.id;
    //       if(proximity(oldP.x,newP.x,5) && ((newP.rot > 10 && newP.rot < 170) || (newP.rot < 350 && newP.rot > 190))) {
    //         var globalPlayer = findSameId(this.globalPlayers,id);
    //         throttle(globalPlayer,globalPlayer.glideRot,globalPlayer.speed);
    //         console.log("Here in the X");
    //       }
    //     }
    //   }
    // }
    //
    // this.archivedData = data;
    // this.archivedGlobalPlayers = this.globalPlayers;


    // for(var i = 0; i < data.length; i++){
    //   var p1 = data[i];
    //   var p2 = new Player(p1.name,p1.id,p1.x,p1.y,p1.rot,p1.clr,p1.spd,p1.grot,p1.bts,p1.col,p1.gas,p1.rotSpd);
      // for(var j = 0; j < oldGlobalPlayers.length; j++){
      //   // Here we do checks if this new data seems fair
      //   if(oldGlobalPlayers[j].id == p2.id){
      //     var oldP = oldGlobalPlayers[j];
      //     // If the player has speed - but have not moved. Checks that it does not travel vertically/horizontally
      //     //console.log(proximity(oldP.x,p2.x,5));
      //     if(proximity(oldP.x,p2.x,20) && ((p2.rot > 10 && p2.rot < 170) || (p2.rot < 350 && p2.rot > 190))) {
      //       throttle(p2,p2.glideRot,p2.speed);
      //       console.log("Here in the X");
      //     }
      //     //console.log(proximity(oldP.y,p2.y,5));
      //     if(proximity(oldP.y,p2.y,20) && ((p2.rot > 100 && p2.rot < 260) || (p2.rot < 80 || p2.rot > 280))) {
      //       throttle(p2,p2.glideRot,p2.speed);
      //       console.log("Here in the Y");
      //     }
      //   }
      // }
      // this.globalPlayers.push(p2);
    //}
//   }
// }

// Class Player
function Player(name,id,x,y,rot,color,speed,glideRot,bullets,collisionCount,gas,rotSpeed){
  this.name = name;
  this.id = id;
  this.x = x;
  this.y = y;
  this.rot = rot;
  this.color = color;
  this.speed = speed;
  this.glideRot = glideRot;
  this.bullets = bullets;
  this.collisionCount = collisionCount;
  this.bulletId = 0;
  this.shootTime = null;
  this.components = null;
  this.penetration = [];
  this.gas = gas;
  this.rotSpeed = rotSpeed;
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
var planeFlame = [[-5,50],[0,65],[5,50],[0,40]];
var planeWing = [[-10,-20],[-15,40],[-4,40],[0,10],[4,40],[15,40],[10,-20],[0,-50]];


 var game;
// Start function, used by button swag
// Starts the operation

function start(idMessage) {
  console.log(idMessage);
  if(idMessage == "Error"){
    document.getElementById("content").innerHTML = "Cound not join room!";
    return;
  }
  var idObj = JSON.parse(idMessage);
  // setTimeout(function() {
  //   window.location = "http://duckduckgo.com";
  // },1000000);
  var canvas = document.createElement("CANVAS");
  canvas.width = 1080;
  canvas.height = 720;
  canvas.style.border = "1px solid #000";
  canvas.id = "frame";
  document.getElementById("content").appendChild(canvas);
  game = new Game();
  game.bulletSpeed = 20;
  game.database = idObj.room;
  game.server = "php/server.php"
  game.runTime = 50;
  game.sendTime = 250;
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
    game.sendInterval = setInterval(communicate.bind(null,dataMessage,update,game.server),game.sendTime);
  }, 1000);
  console.log("Send:" + game.sendTime);
  console.log("Run:" + game.runTime);
  game.runInterval = setInterval(run,game.runTime);
  setInterval(displayData,300);
  setTimeout(function() {
    setInterval(collision,200);
  }, 1000);
}

// Create a player - the variable _palyer is assigned
// Callback from communicate()
function createPlayer(idMessage){
  console.log(idMessage);
  var idObj = JSON.parse(idMessage);
  var p = new Player(idObj.name,idObj.id,400,400,90,idObj.clr,2,0,[],0,0,0);
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

function run(){
  // To check the real rotation and the rotation/direction of movement
  var p = game.localPlayer;
  var bullets = p.bullets;
  if(game.keymap[game.keys.UP]) {
    p.gas = 1;
    p.speed = speedUp(p.speed);
    p.glideRot = p.rot;
    throttle(p,p.rot,p.speed);
  } else {
    p.gas = 0;
    if(p.speed > 0) p.speed = speedDown(p.speed);
    else p.speed = 0;
    throttle(p,p.glideRot,p.speed);
  }
  // Rot speed slow down here?
  p.rotSpeed = 0;
  if(game.keymap[game.keys.LEFT]){
    p.rotSpeed = -5;
    rotate(p,p.rotSpeed);
  }
  if(game.keymap[game.keys.RIGHT]){
    p.rotSpeed = 5;
    rotate(p,p.rotSpeed);
  }
  if(game.keymap[game.keys.SPACE] && p.shootTime) {
    p.shootTime = false;
    if(bullets.length < 3){
      var bullet = new Bullet(p.id,p.bulletId,round(p.x),round(p.y),p.rot);
      p.bulletId += 1;
      bullets.push(bullet);
      p.penetration.push(bullet);
    }
    setTimeout(function() {p.shootTime = true;},400);
  }

  for(var i = 0; i < bullets.length; i++){
    throttle(bullets[i],bullets[i].rot,game.bulletSpeed);
    if(bullets[i].bounce < 2){
      bordercheck(bullets[i],10);
    } else {
      //removePenetration(bullets[i]);
      bullets.splice(i,1);
    }
  }
  localupdate();
  display(game.globalPlayers);
  render(game.localPlayer);
}

function update(answer){
    //document.getElementById("values").innerHTML = "<br>" + answer;
    game.setglobalPlayers(JSON.parse(answer));
}

function localupdate(){
  for(var i = 0; i < game.globalPlayers.length; i++){
    var p = game.globalPlayers[i];
    if(p.id != game.localPlayer.id){
      rotate(p,p.rotSpeed*0.7);
      throttle(p,p.glideRot,p.speed);
    }
    for(var j = 0; j < p.bullets.length; j++){
      var b = p.bullets[j];
      throttle(b,b.rot,game.bulletSpeed);
    }
  }
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
  game.ctx.textAlign = "center";
  game.ctx.fillStyle = "#000";
  game.ctx.font = "25px Arial";
  game.ctx.fillText(p.name,p.x,p.y-60);
  bulletRender(p);
  polygons(p.x,p.y,p.rot,p.gas,[planeFlame,planeBody,planeWing,planeWindow],["#F60","#" + p.color,"#888","#3FF"]);
  portalRender(p);
}


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
  this.bulletSpeed = 0;
  this.pointsList = null;
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
  destroy: function(){
    clearInterval(this.runInterval);
    clearInterval(this.sendInterval);
  },
  // Converts a server player to a client-like player.
  // Also does checks on new incoming data VS last. This should affect globalPlayers.
  setglobalPlayers: function(data){
    //this.archivedGlobalPlayers = this.globalPlayers;
    this.globalPlayers = [];
    for(var i = 0; i < data.length; i++){
      var p1 = data[i];
      console.log(p1.name + "\n");
      if(p1.id == game.localPlayer.id) continue;
      this.globalPlayers.push(p1);
    }
  }
}


// Class Player
function Player(name,id,socket,x,y,rot,color,speed,glideRot,bullets,collisionCount,gas,rotSpeed){
  this.name = name;
  this.id = id;
  this.socket = socket;
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

Player.prototype = {
  convertToLight: function(){
    return new LightPlayer(this.name,this.id,this.socket,this.x,this.y,this.rot,this.color,this.bullets,this.collisionCount,this.gas);
  },
  toString: function(){
    return this.name;
  }
}

function LightPlayer(name,id,socket,x,y,rot,color,bullets,collisionCount,gas){
  this.name = name;
  this.id = id;
  this.socket = socket;
  this.x = x;
  this.y = y;
  this.rot = rot;
  this.color = color;
  this.bullets = bullets;
  this.collisionCount = collisionCount;
  this.gas = gas;
}

LightPlayer.prototype = {
  toString: function(){
    return this.name;
  }
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
  var canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 720;
  canvas.id = "frame";
  document.getElementById("content").appendChild(canvas);
  game = new Game();
  var login = document.getElementById("login");
  document.getElementById("setup").removeChild(login);

  game.pointsList = [planeFlame,planeBody,planeWing,planeWindow];
  game.bulletSpeed = 30;
  game.runTime = 30;
  game.sendTime = 50;
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
    game.sendInterval = setInterval(send.bind(null,"data",dataMessage),game.sendTime);
  }, 500);
  game.runInterval = setInterval(run,game.runTime);
  //setInterval(displayData,300);
}

// Create a player - the variable _palyer is assigned
// Callback from communicate()
function createPlayer(idMessage){
  var idObj = JSON.parse(idMessage);
  var p = new Player(idObj.name,idObj.id,idObj.socket,400,400,90,idObj.color,2,0,[],0,0,0);
  p.shootTime = true;
  game.setPlayer(p);
}

// Start the controlling of keys
function startController(){
  onkeydown = onkeyup = function(e) {
    game.keymap[e.keyCode] = (e.type == "keydown");
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
    if(bullets.length < 10){
      var bullet = new Bullet(p.id,p.bulletId,round(p.x),round(p.y),p.rot);
      p.bulletId += 1;
      bullets.push(bullet);
      p.penetration.push(bullet);
    }
    setTimeout(function() {p.shootTime = true;},200);
  }

  for(var i = 0; i < bullets.length; i++){
    throttle(bullets[i],bullets[i].rot,game.bulletSpeed);
    if(bullets[i].bounce < 2){
      bordercheck(bullets[i],10);
      if(bullets[i].bounce == 2) {
         bullets.splice(i,1);
       } // The final bounce might just have happened
    } else {
      //removePenetration(bullets[i]);
      bullets.splice(i,1);
    }
  }
  localupdate();
  display(game.globalPlayers);
  render(game.localPlayer);
  collision();
}

function update(answer){
    var ans = JSON.parse(answer);
    game.setglobalPlayers(ans);
}

function localupdate(){
  for(var i = 0; i < game.globalPlayers.length; i++){
    var p = game.globalPlayers[i];
    if(p.id != game.localPlayer.id){
      rotate(p,round(p.rotSpeed*0.7));
      throttle(p,p.glideRot,p.speed);
      for(var j = 0; j < p.bullets.length; j++){
        var b = p.bullets[j];
        throttle(b,b.rot,game.bulletSpeed);
      }
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
  //console.log(p.name + "  color:  " + p.color);
  game.ctx.textAlign = "center";
  game.ctx.fillStyle = "#000";
  game.ctx.font = "25px Arial";
  game.ctx.fillText(p.name,p.x,p.y-70);
  bulletRender(p);
  polygons(p.x,p.y,p.rot,p.gas,["#F60","#" + p.color,"#888","#3FF"]);
  portalRender(p);
}

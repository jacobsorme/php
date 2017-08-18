
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
  this.database = null;
  this.server = null;
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
      var p2 = new Player(p1.name,p1.id,p1.x,p1.y,p1.rot,p1.clr,null,null,p1.bts,p1.col,p1.gas);
      this.globalPlayers.push(p2);
    }
  }
}

// Class Player
function Player(name,id,x,y,rot,color,speed,glideRot,bullets,collisionCount,gas){
  this.name = name;
  this.id = id;
  this.x = x;
  this. y = y;
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
  var idObj = JSON.parse(idMessage);
  setTimeout(function() {
    //window.location = "http://duckduckgo.com";
  },10000);
  game = new Game();
  game.database = idObj.room;
  game.server = "php/server.php"
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
  var p = new Player(idObj.name,idObj.id,400,400,90,idObj.clr,2,0,[],0,0);
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
  //console.log(JSON.stringify(game.localPlayer.penetration));
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
  if(game.keymap[game.keys.LEFT]) rotate(p,-5);
  if(game.keymap[game.keys.RIGHT]) rotate(p,5);
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
    throttle(bullets[i],bullets[i].rot,20);
    if(bullets[i].bounce < 4){
      bordercheck(bullets[i],10);
    } else {
      //removePenetration(bullets[i]);
      bullets.splice(i,1);
    }
  }
  display(game.globalPlayers);
  render(game.localPlayer);
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
  polygons(p.x,p.y,p.rot,p.gas,[planeFlame,planeBody,planeWing,planeWindow],["#F60","#" + p.color,"#888","#3FF"]);
  portalRender(p);
}


function Game(){
  this.canvas = null;
  this.ctx = null;
  this.localPlayer = null;
  this.oldLocalPlayer = null;
  this.globalPlayers = new Map();
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
    /* Give a already stored player some updates
        Includes probability on updates that are non-critical
    */
    if(this.globalPlayers.has(data.id)){
      var p = this.globalPlayers.get(data.id);
      if(data.weight == 1) {
        p.x = data.x;
        p.y = data.y;
        p.bullets = data.bullets;
        p.force = data.force;
        p.gas = data.gas;
        p.rot = data.rot;
        p.rotSpeed = data.rotSpeed;
        p.collisionCount = data.collisionCount;
      }
      if(data.weight == 0)  {
        p.x = data.x;
        p.y = data.y;
        p.force = data.force;
        p.bullets = data.bullets;
      }
    } else {
      // A new player was found - this new one will need a full message from us
      playerDataSend(dataMessageFull,false);
      this.globalPlayers.set(data.id,data);
    } //Store a fully equipped player
  }
}


// Class Player
function Player(name,id,socket,color){
  this.name = name;
  this.id = id; // Not required globally
  this.socket = socket;
  this.x = null;
  this.y = null;
  this.rot = null;
  this.color = color;
  this.force = null;
  this.forceIncr = null;
  this.forceDecr = null;
  this.bullets = [];
  this.collisionCount = 0;
  this.bulletId = 0; // Not required globally
  this.shootTime = null; // Not required globally
  this.penetration = [];
  this.gas = 0;
  this.rotSpeed = null;
}

Player.prototype = {
  setPosition: function(x,y,rot) {
    this.x = x;
    this.y = y;
    this.rot = rot;
  },
  setForceParameters: function(force,incr,decr,min){
    this.force = force;
    this.forceIncr = incr;
    this.forceDecr = decr;
    this.forceMin = min;
  },
  setRotParameters: function(rotSpeed,max,change){
    this.rotSpeed = rotSpeed;
    this.rotMaxSpeed = max;
    this.rotChange = change;
  },
  convertToLight: function(){
    return new LightPlayer(this);
  },
  convertToExtraLight: function(){
    return new ExtraLightPlayer(this);
  },
  // OBS - this function depends on how LightPlayer looks
  convertFromLight: function(data){
    this.x = data.x;
    this.y = data.y;
    this.bullets = data.bullets;
    this.force = data.force;
    this.gas = data.gas;
    this.rot = data.rot;
    this.rotSpeed = data.rotSpeed;
    this.collisionCount = data.collisionCount;
  },
  // OBS - this function depends on how ExtraLightPlayer looks
  convertFromExtraLight: function(data){
    this.force = data.force;
  }
}

function LightPlayer(p){
  this.weight = 1;
  this.force = p.force;
  this.id = p.id;
  this.rotSpeed = p.rotSpeed;
  this.x = p.x;
  this.y = p.y;
  this.rot = p.rot;
  this.bullets = p.bullets;
  this.collisionCount = p.collisionCount;
  this.gas = p.gas;
}

/* Extra light player - good for thight sending.
    Has type 0 - extra light
 */
function ExtraLightPlayer(p){
  this.weight = 0;
  this.force = p.force;
  this.x = p.x;
  this.y = p.y;
  this.id = p.id;
  this.bullets = p.bullets;
}

function Bullet(playerId,id,x,y,rot){
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


var game = null;
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
  game.sendTime = 30;
  game.setCanvas(document.getElementById("frame"));
  game.keys = {
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
  };
  game.keymap = [];
  createPlayer(idMessage);
  playerDataSend(dataMessageFull,false); // Send a full equipped message
  startController();

  // Start interval of function communicate() with paremeter update()
  setTimeout(function() {
    game.sendInterval = setInterval(playerDataSend.bind(null,dataMessageLight,true),game.sendTime);
  }, 200);
  game.runInterval = setInterval(run,game.runTime);
  //setInterval(displayData,300);
}

// Create a player
// Callback from communicate()
function createPlayer(idMessage){
  var idObj = JSON.parse(idMessage);
  var p = new Player(idObj.name,idObj.id,idObj.socket,idObj.color);
  p.shootTime = true;
  p.setPosition(400,400,90);
  p.setForceParameters([5,-5],1,0.96,0.1);
  p.setRotParameters(20,6,1);
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
  var p = game.localPlayer; // Garbage?
  var bullets = p.bullets;

  if(Math.abs(p.force[0]) < p.forceMin) p.force[0] = 0;
  else p.force[0] = round(p.force[0]* p.forceDecr);
  if(Math.abs(p.force[1]) < p.forceMin) p.force[1] = 0;
  else p.force[1] = round(p.force[1]* p.forceDecr);

  if(game.keymap[game.keys.UP]) {
    p.gas = 1;
    p.force[0] += addForceX(p.rot, p.forceIncr);
    p.force[1] -= addForceY(p.rot, p.forceIncr);
  } else {
    p.gas = 0;
  }

  if(game.keymap[game.keys.LEFT]){
    if(p.rotSpeed - p.rotChange < -1*p.rotMaxSpeed) p.rotSpeed = -1*p.rotMaxSpeed;
    else p.rotSpeed -= p.rotChange;
  } else if(game.keymap[game.keys.RIGHT]){
    if(p.rotSpeed + p.rotChange > p.rotMaxSpeed) p.rotSpeed = p.rotMaxSpeed;
    else p.rotSpeed += p.rotChange;
  } else {
    if(p.rotSpeed > 0) p.rotSpeed -= p.rotChange;
    else if(p.rotSpeed < 0) p.rotSpeed += p.rotChange;
    else p.rotSpeed = 0;
  }
  rotate(p,p.rotSpeed);
  move(p);
  if(game.keymap[game.keys.SPACE] && p.shootTime) {
    p.shootTime = false;
    if(bullets.length < 50){
      var bullet = new Bullet(p.id,p.bulletId,round(p.x),round(p.y),p.rot);
      p.bulletId += 1;
      bullets.push(bullet);
      p.penetration.push(bullet.id);
    }
    setTimeout(function() {p.shootTime = true;},700);
  }

  for(var i = 0; i < bullets.length; i++){
    throttle(bullets[i],bullets[i].rot,game.bulletSpeed);
    if(bullets[i].bounce < 3){
      bordercheck(bullets[i],10);
      if(bullets[i].bounce == 3) {
         bullets.splice(i,1);
       } // The final bounce might just have happened
    } else {
      //removePenetration(bullets[i]);
      bullets.splice(i,1);
    }
  }
  localupdate();
  display();
  render(game.localPlayer);
  collision();
}

function update(answer){
    var ans = JSON.parse(answer);
    game.setglobalPlayers(ans);
}

function localupdate(){
  for(var p of game.globalPlayers.values()){
    rotate(p,round(p.rotSpeed));
    if(p.gas ==1){
      p.force[0] += addForceX(p.rot, 1);
      p.force[1] -= addForceY(p.rot, 1);
    }

    move(p);
    for(var j = 0; j < p.bullets.length; j++){
      var b = p.bullets[j];
      throttle(b,b.rot,game.bulletSpeed);
    }
  }
}

// Render on canvas from thee Map game.globalPlayers
function display(data){
  game.ctx.clearRect(0, 0, game.getWidth(), game.getHeight());
  for(var value of game.globalPlayers.values()){
    render(value);
  }
}

// Rendering
function render(p){
  //console.log(p.name + "  color:  " + p.color);
  game.ctx.textAlign = "center";
  game.ctx.fillStyle = "#000";
  game.ctx.font = "25px Arial";
  game.ctx.fillText(p.name + p.collisionCount,p.x,p.y-70);
  bulletRender(p);
  polygons(p.x,p.y,p.rot,p.gas,["#F60","#" + p.color,"#888","#3FF"]);
  portalRender(p);
}

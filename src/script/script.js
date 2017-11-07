
// The points
var planeBody = [[0,45],[-10,50],[-10,40],[-47,40],[-15,0],[-30,0],[-10,-20],[0,-50],[10,-20],[30,0],[15,0],[47,40],[10,40],[10,50]];
var planeWindow = [[0,-30],[-4,-25],[-4,-3],[0,0],[4,-3],[4,-25]];
// 40,30 35,90 46,90 50,60 54,90 65,90 60,30 50,0
var planeFlame = [[-5,50],[0,65],[5,50],[0,40]];
var planeWing = [[-10,-20],[-15,40],[-4,40],[0,10],[4,40],[15,40],[10,-20],[0,-50]];


var game = null;
// Start function, triggered by 'Play' button
// Starts the operation
function start(message) {
  var canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 720;
  canvas.id = "frame";
  document.getElementById("content").appendChild(canvas);

  game = new Game();
  game.canvas = canvas;
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
  createPlayer(message);
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
function createPlayer(message){
  var msg = JSON.parse(message);
  var p = new Player(msg.name,msg.id,msg.socket,msg.color);
  p.shootTime = true;
  p.setPosition(400,400,90);
  p.setForceParameters([5,-5],1,0.96,0.1);
  p.setRotParameters(20,6,1);
  game.setPlayer(p);

  if(msg.creator ==1){
    displayControls();
  }

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
function display(){
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

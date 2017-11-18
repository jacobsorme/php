var iosocket = io.connect();

iosocket.on('id',function(message){
  if(message != -1) start(message);
  else send("rooms","");
});

iosocket.on('match-start',function(position){
  stopRunning();
  console.log("Yuuh");
  var pos = JSON.parse(position);
  startSequence(pos);
});

iosocket.on('match-surrender',function(){
  //alert("WINNING");
});

iosocket.on('match-pos',function(message){
  var msg = JSON.parse(message);
  game.globalPlayers.get(msg.id).setPosition(msg.x,msg.y,msg.rot);
  display();
  render(game.localPlayer);
});

iosocket.on("chat",function(message){
  game.terminal.appendMessage(message);
});

iosocket.on('hit',function(){
  game.localPlayer.collisionCount++;
  if(game.localPlayer.collisionCount >= 21) surrender();
  console.log("Hit!");
});

iosocket.on('data', function(message) {
  update(message);
});

iosocket.on('rooms',function(message){
  updateRooms(message);
});

iosocket.on('disconnect',function(){
  clearInterval(game.runInterval);
  clearInterval(game.sendInterval);
});

iosocket.on('disco',function(socketId){
  console.log("A dicsonnect happened");
  for(var key of game.globalPlayers.keys()){
    if(game.globalPlayers.get(key).socket == socketId){
      game.globalPlayers.delete(key);
      var msg = {
        name:"Server",
        text:"A player left"
      };
      game.terminal.appendMessage(JSON.stringify(msg));
      console.log("Made a delete");
    }
  }
});


// changesCheck could make for less sending - if nothing changed = no send
function playerDataSend(message,makeChecks){
  if(!makeChecks) send("data",message());
  else if(changesCheck()){
    send("data",message());
  }
}

function send(tag,message){
  iosocket.emit(tag,message);
}

// Create a message with ID-request
function idMessage(username,room,r,g,b){
  var object = {
    name:username,
    r:r,
    g:g,
    b:b,
    room:room
  }
  console.log(JSON.stringify(object));
  return JSON.stringify(object);
}

// Create a message with data of player
function dataMessageLight(){
  //There is a X% chance that the data sent is a LightPlayer - otherwise ExtraLightPlayer
  //if(Math.random()<0.5) return JSON.stringify(new LightPlayer(game.localPlayer));
  //else return JSON.stringify(new ExtraLightPlayer(game.localPlayer));
  return JSON.stringify(new LightPlayer(game.localPlayer));
}

function dataMessageFull(){
  return JSON.stringify(game.localPlayer);
}


function startMatch(position){
  send("match",JSON.stringify(position));
}

function chatSend(message){
  send("chat",message);
}
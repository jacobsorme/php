var iosocket = io.connect();

iosocket.on('id',function(message){
  start(message)
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

function send(tag,message){
  var msg;
  if(typeof message === 'string') {
    msg = message
  } else {
    msg = message();
  }
  iosocket.emit(tag,msg);
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
function dataMessage(){
  return JSON.stringify(game.localPlayer);
}

var iosocket = io.connect();
iosocket.on('connect', function() {
  connected();
});
iosocket.on('message', function(message) {
  interpretMessage(message);
});
iosocket.on('disconnect', function() {
    disconnected();
});

function send(){
    var msg = document.getElementById("input").value;
    document.getElementById("content").innerHTML += msg + "<br>";
    document.getElementById("input").value = "";
    iosocket.emit('chat',msg);
}

function console(){
  iosocket.emit('console');
}

function connected(){
  document.getElementById("content").innerHTML += "Connected<br>";
}

function disconnected(){
  document.getElementById("content").innerHTML += "Disconnected<br>";
}

function interpretMessage(message){
  document.getElementById("content").innerHTML += message + "<br>";
}

function joinRoom(room){
  iosocket.emit('room',"room"+room);
}

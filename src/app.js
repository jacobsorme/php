var fs = require('fs')
    , http = require('http')
    , socketio = require('socket.io')
    , Room = require('./serverwork.js');

var data = {
  players:[],
  rooms:[
    {name:"Pjort",id:1,players:0},
    {name:"Gurka",id:2,players:0}
  ],
  id:1,
  roomId:3
}

var interval = null;

var counter = 0;

var server = http.createServer(function (req, res) {
  //console.log(req.url);
  var path = req.url;
  if(req.url == '/'){
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream("./index.php").pipe(res);
    }
  else if(path.substring(0,5) == '/play'){
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream("./play.php").pipe(res);
    }
else if(req.url == '/mystyle.css'){
  res.writeHead(200, {'Content-Type': 'text/css'});
  fs.createReadStream("./mystyle.css").pipe(res);
   }
  else if(path.substr(-2) == "js"){
    res.writeHead(200, {'Content-Type': 'text/javascript'});
    fs.createReadStream("."+path).pipe(res);
     }
  else {
    res.write('Skrrt');
    res.end();
  }
}).listen(3000, function (err) {
  if(err) console.log(err);
  console.log('Running');
});

function printData(){
  console.log("The data - counter: " + counter + "\n");
  counter++;
  console.log(data);
  console.log("\n\n\n");

}

socketio.listen(server).on('connection', function (socket) {
    if(interval == null){
      interval = setInterval(printData,10000);
    }

    // When a request for rooms is received
    socket.on('rooms', function (msg) {
      socket.emit('rooms',JSON.stringify(data.rooms));
    });

    // When a data message is received
    socket.on('data', function (msg) {
        //console.log(Object.keys(socket.rooms)[1]);
        //var room = Object.keys(socket.rooms)[1];
        //socket.to(room).emit('message',msg+"- Regards / server");
        var player = JSON.parse(msg);
        var found = false;
        var changed = true;
        for(var i = 0; i<data.players.length;i++){
          if(data.players[i].id == player.id){
            if(msg == JSON.stringify(data.players[i])){
              changed = false;
            } else {
              data.players[i] = player;
            }
            found = true;
          }
        }
        if(!found){
          data.players.push(player);
        }
        if(changed){
          console.log("Sending to: " + Object.keys(socket.rooms)[0]);
          socket.in(Object.keys(socket.rooms)[0]).emit('data',JSON.stringify(data.players));
        }
    });


    // When a disconnect happens
    socket.on('disconnecting', function(){
      for(var i = 0; i < data.players.length; i++){
        if(data.players[i].socket == socket.id){
          socket.in(data.players[i].room).emit('data',JSON.stringify(data.players));
          for(var j = 0; j< data.rooms.length; j++){
            console.log("In disconnect-event - data.rooms[j].id: " + data.rooms[j].id);
            //console.log(JSON.stringify(socket));
            if(data.rooms[j].id == (Object.keys(socket.rooms)[0])){ // "Remove" player from room
              console.log("Here: " + j);
              data.rooms[j].players -= 1;
            }
            if(data.rooms[j].players == 0){ // Remove a empty room
              data.rooms.splice(j,1);
            }
          }
          data.players.splice(i,1);
          break;
        }
      }
    });
    socket.on('id', function (msg) {
        var newId = data.id;
        console.log(msg);
        var msgObj = JSON.parse(msg);
        console.log(msgObj.name + " joined");

        var newRoomId = -1;

        if(msgObj.room == -1){ // Create a new room
          var newRoom = new Room(msgObj.roomName,data.roomId);
          newRoomId = newRoom.id;
          data.rooms.push(newRoom);
          data.roomId++;
        } else { // Join a existing room
          for(var i = 0; i < data.rooms.length; i++){
            if(data.rooms[i].id == msgObj.room){
              newRoomId = data.rooms[i].id;
              data.rooms[i].players++;
            }
          }
        }
        if(newRoomId != -1){ // Join the room (in socket manner) if found
          console.log("... and it joined: "+ newRoomId);
          socket.join(newRoomId);
        }

        var player = {
          room: newRoomId,
          id:newId,
          name:msgObj.name,
          color:rgbToHex(msgObj.r,msgObj.g,msgObj.b),
          socket:socket.id,
        }
        data.id++;
        socket.emit('id',JSON.stringify(player));
    });
});

function rgbToHex(r,g,b){
  var rgb = b | (g << 8) | (r << 16);
  var hex =  (0x1000000 | rgb).toString(16).substring(1);
  return hex;
}

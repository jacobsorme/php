var fs = require('fs')
    , http = require('http')
    , socketio = require('socket.io')
    , Room = require('./serverwork.js');

var data = {
  players:[],
  rooms:[],
  roomId:3
}

var interval = null;

var counter = 0;

var server = http.createServer(function (req, res) {
  //console.log(req.url);
  var path = req.url;
  if(req.url == '/'){
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream("./index.html").pipe(res);
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
  //counter++;
  console.log(data);
  console.log("\n\n\n");

}

socketio.listen(server).on('connection', function (socket) {
    if(interval == null){
      interval = setInterval(printData,5000);
    }

    // When a request for rooms is received
    socket.on('rooms', function (msg) {
      socket.emit('rooms',JSON.stringify(data.rooms));
    });

    // When a data message is received
    socket.on('data', function (msg) {
        counter++;
        socket.to(Object.keys(socket.rooms)[0]).emit('data',msg);
    });


    // When a disconnect happens
    socket.on('disconnecting', function(){
      var room = Object.keys(socket.rooms)[0];
      socket.to(room).emit('disco',socket.id);
      for(var j = 0; j< data.rooms.length; j++){
        //console.log("In disconnect-event - data.rooms[j].id: " + data.rooms[j].id);
        //console.log(JSON.stringify(socket));
        if(data.rooms[j].id == room){ // "Remove" player from room
          console.log("Here: " + j);
          data.rooms[j].players -= 1;
          if(data.rooms[j].players == 0){ // Remove a empty room
            data.rooms.splice(j,1);
          }
          break;
        }
      }
    });

    socket.on('hit', function (msg) {
        console.log("Hit, " + msg);
        socket.to(msg).emit("hit");
    });

    socket.on('id', function (message) {
        var msg = JSON.parse(message);
        var room;

        var player = {
            name:msg.name,
            color:rgbToHex(msg.r,msg.g,msg.b),
            socket:socket.id,
        }

        if(msg.room == 0){ // Create a new room
            room = new Room(msg.name + "'s Room",data.roomId);
            data.rooms.push(room);
            data.roomId++;
            socket.join(room.id);

            player.room = room.id;
            player.id = room.playerId;
            player.creator = 1;
            
            room.playerId++;
            socket.emit('id',JSON.stringify(player));
            return;
        } else { // Join a existing room
            for(var i = 0; i < data.rooms.length; i++){
                if(data.rooms[i].id == msg.room && data.rooms[i].players < 2){
                    data.rooms[i].players++;
                    room = data.rooms[i];
                    socket.join(room.id);

                    player.room = room.id;
                    player.id = room.playerId;
                    player.creator = 0;

                    room.playerId++;
                    socket.emit('id',JSON.stringify(player));
                    return;
                }
            }
        }
        console.log("Could not find room: " + data.roomId);
        socket.emit('id',-1);
        return;
    });
});

function rgbToHex(r,g,b){
  var rgb = b | (g << 8) | (r << 16);
  var hex =  (0x1000000 | rgb).toString(16).substring(1);
  return hex;
}

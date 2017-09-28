var fs = require('fs')
    , http = require('http')
    , socketio = require('socket.io');

var data = {
  players:[],
  id:1,
}

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

    setInterval(printData,10000);

    socket.on('data', function (msg) {

        //console.log('Got a msg: ', msg);
        //console.log(Object.keys(socket.rooms)[1]);
        //var room = Object.keys(socket.rooms)[1];
        //socket.to(room).emit('message',msg+"- Regards / server");
        var player = JSON.parse(msg);
        var found = false;
        for(var i = 0; i<data.players.length;i++){
          if(data.players[i].id == player.id){
            data.players[i] = player;
            found = true;
          }
        }
        if(!found){
          data.players.push(player);
        }
        socket.to("playroom").emit('data',JSON.stringify(data.players));

    });
    socket.on('disconnect', function(){
      console.log("Disconnect: " + socket.id);
      for(var i = 0; i < data.players.length; i++){
        if(data.players[i].socket == socket.id){
          console.log("The Socket.id was equal");
          data.players.splice(i,1);
          break;
        }
      }
    });
    socket.on('id', function (msg) {
      socket.join("playroom");
        var newid = data.id;
        var msgObj = JSON.parse(msg);

        console.log(msgObj.name + " joined");
        var player = {
          id:newid,
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

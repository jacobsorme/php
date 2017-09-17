var fs = require('fs')
    , http = require('http')
    , socketio = require('socket.io');



var server = http.createServer(function (req, res) {
  console.log(req.url);
  if(req.url == '/'){
    res.writeHead(200, {'Content-Type': 'text/html'});
    fs.createReadStream("./index.html").pipe(res);
    }
  else if(req.url == '/style.css'){
    res.writeHead(200, {'Content-Type': 'text/css'});
    fs.createReadStream("./style.css").pipe(res);
     }
     else if(req.url == '/script.js'){
       res.writeHead(200, {'Content-Type': 'text/javascript'});
       fs.createReadStream("./script.js").pipe(res);
      }
      else if(req.url == '/iosocket.js'){
        res.writeHead(200, {'Content-Type': 'text/javascript'});
        fs.createReadStream("./iosocket.js").pipe(res);
       }
     else {
      res.write('nibbo');
      res.end();
    }
  }).listen(3000, function (err) {
    console.log('Running');
  });

socketio.listen(server).on('connection', function (socket) {

    socket.on('chat', function (msg) {

        console.log('Got a msg: ', msg);
        console.log(Object.keys(socket.rooms)[1]);
        var room = Object.keys(socket.rooms)[1];
        socket.to(room).emit('message',msg+"- Regards / server");
        console.log(socket.rooms);


    });
    socket.on('console', function () {
        console.log("Bishass");
    });
    socket.on('room', function (room) {
        socket.join(room);
        //console.log(socket.rooms);

        //console.log(Object.values(socket.rooms));
    });
});

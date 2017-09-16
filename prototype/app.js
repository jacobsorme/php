var fs = require('fs')
    , http = require('http')
    , socketio = require('socket.io');



var server = http.createServer(function (req, res) {
  console.log(req.url);
  if(req.url == '/'){
      fs.readFile('index.html', function(err, page) {
          res.writeHead(200, {'Content-Type': 'text/html'});
          res.write(page);
          res.end();
      });
    }
    else if(req.url == '/style.css'){
      fs.readFile('style.css', function(err, data) {
        if (err) console.log(err);
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
        res.end();
       });
     }
     else if(req.url == '/script.css'){
       fs.readFile('style.css', function(err, data) {
         if (err) console.log(err);
         res.writeHead(200, {'Content-Type': 'text/css'});
         res.write(data);
         res.end();
        });
      }
     else {
      res.write('nibbo');
      res.end();
    }
  }).listen(3000, function () {
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

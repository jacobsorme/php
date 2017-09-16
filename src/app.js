var fs = require('fs')
    , http = require('http')
    , socketio = require('socket.io')


var express = express();

var server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/index.php'));
    res.writeHead(200, {'Content-type': 'text/css'});
    res.end(fs.readFileSync(__dirname + '/mystyle.css'));
}).listen(8080, function () {
    console.log('Running');
});

socketio.listen(server).on('connection', function (socket) {
  socket.on('rooms', function () {
    socket.emit('rooms',"Mvh Server");
    });
});

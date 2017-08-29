var fs = require('fs')
    , http = require('http')
    , socketio = require('socket.io');

var server = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-type': 'text/html'});
    res.end(fs.readFileSync(__dirname + '/index.html'));
}).listen(8080, function () {
    console.log('Running');
});

socketio.listen(server).on('connection', function (socket) {

    socket.on('chat', function (msg) {

        console.log('Got a msg: ', msg);
        socket.broadcast.emit('message',msg+"- Regards / server");

    });
    socket.on('console', function (msg) {

        console.log(msg);
    });
});

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.use(express.static('public'));

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on("message", function (msg){
        console.log(msg.message);
        socket.emit('chat', msg);
    });

});

http.listen(port, function(){
    console.log('listening on port:', port);
});
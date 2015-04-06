
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

var censored = require("./censoredWords");

app.use(express.static('public'));

io.on('connection', function(socket){
    console.log('a user connected');

    socket.on("message", function (msg){
        var sendMessage = true;
        console.log(msg.message);
        //break up into individual words
        var allWords = msg.message.split(' ');
        //caching length
        var length = allWords.length;
        //check for censored words, using for loop for faster performance
        for(var i = 0; i < length; i++){
            if(censored[allWords[i]]){
                sendMessage = false;
                break;
            }
        }

        if(sendMessage){
            socket.emit('chat', msg);
        }

    });

});

http.listen(port, function(){
    console.log('listening on port:', port);
});


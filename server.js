
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var async  = require('async');
var faker = require('faker');

var censored = require('./censoredWords');
var users = require('./users.js');


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
        //if no presence of censored words then emit
        if(sendMessage){
            socket.emit('chat', msg);
        }

    });
    var emitMessage = function(x){
        socket.emit('chat', x);
    };

    var userSendMessage = function(){ async.each(users, function(user, cb){
        var userMessage = {username: user.username, message: faker.hacker.phrase()};
        emitMessage(userMessage);
        cb();
    }, function(err){ if(err){console.log(err) }});
    };

    //five messages per minute
    setInterval(userSendMessage,2000);
});

http.listen(port, function(){
    console.log('listening on port:', port);
});


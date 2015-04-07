
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var async  = require('async');
var faker = require('faker');

var censored = require('./censoredWords');
var users = require('./users.js');
var onlineUsers = {};


app.use(express.static('public'));


io.on('connection', function(socket){

    socket.join('lobby');
    console.log()

    socket.on("message", function (msg){
        var sendMessage = true;
        //set socketId for private chats
        onlineUsers[msg.username] = socket.id;
        //break up into individual words
        var allWords = msg.message.split(' ');
        //caching length
        var length = allWords.length;
        //check for censored words
        for(var i = 0; i < length; i++){
            if(censored[allWords[i]]){
                sendMessage = false;
                break;
            }
        }
        //if no presence of censored words then emit
        if(sendMessage){
            io.to('lobby').emit('chat', msg);
        }

    });
    var emitMessage = function(msg){
        socket.to('lobby').emit('chat', msg);
    };

    var userSendMessage = function(){ async.each(users, function(user, cb){
        var userMessage = {username: user.username, message: faker.hacker.phrase()};
        emitMessage(userMessage);
        cb();
    }, function(err){ if(err){console.log(err) }});
    };

    //five messages per minute
    //setInterval(userSendMessage,12000);

    socket.on('privateMessage', function (msg){
        var theirId = onlineUsers[msg.otherUser];
        var myId = onlineUsers[msg.username];
        //because we censor messages on server, need to emit to both people
        socket.to(theirId).emit('chat', msg);
        io.to(myId).emit('chat', msg);
    });

    socket.on('leave lobby', function(){
        socket.leave('lobby');
    });

    socket.on('join lobby', function(){
        socket.join('lobby');
    });

    socket.on('disconnect', function(){
       delete onlineUsers[socket.username];
    });
});

http.listen(port, function(){
    console.log('listening on port:', port);
});


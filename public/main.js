
var socket = io();
var isPm = false;

$('#submit').on('click',function(e){
    e.preventDefault();
    var username = $('#username').val();
    var message = $('#message').val();
    if(isPm){
        var otherUser = $('#otherUser').val();
        socket.emit('privateMessage', {username: username, message: message, otherUser: otherUser});
    } else {
        socket.emit('message', {username: username, message: message});
    }

    $('#message').val("");
});

socket.on('chat', function(msg){
    var str = msg.username+": "+ msg.message;
    $('.messages').append($('<li>').text(str))

});

$('#PM').on('click', function(e){
    e.preventDefault();
    isPm = !isPm;
    $('.messages').empty();
    if(isPm){
        $('#PM').text('Leave Private Chat');
        socket.emit('leave lobby');
    } else{
        $('#PM').text('Private Message');
        socket.emit('join lobby');
    }
});
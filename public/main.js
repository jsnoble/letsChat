
var socket = io();
var isPm = false;
//caching messages to help look up times
var messageBox=   $('.messages');

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
   // var str = msg.username+": "+ msg.message;
    messageBox.prepend($('<li>').text(msg.username+": "+ msg.message));
   // messageBox.scrollTop(messageBox[0].scrollHeight);

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

var socket = io();

$('#submit').on('click',function(e){
    e.preventDefault();
    var username = $('#username').val();
    var message = $('#message').val();
    //console.log(username, message);
    socket.emit('message', {username: username, message: message});
    $('#message').val("");
});

socket.on('chat', function(msg){
    var str = msg.username+": "+ msg.message;
    $('.messages').append($('<li>').text(str))

});
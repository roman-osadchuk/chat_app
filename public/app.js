  
const socket = io.connect();
let $messageForm = $('#messageForm');
let $message = $('#message');
let $chat = $('#chat');
let $userForm = $('#userForm');
let $messageArea = $('#messageArea');
let $userFormArea = $('#userFormArea');
let $users = $('#users');
let $username = $('#userName');

$messageForm.submit((e) => {
    e.preventDefault();
    
    socket.emit('send message', $message.val(), (data) => {
        $chat.append('<div class="well"><span class="erroMsg">' + data + '</span></div>');
    });
    
    $message.val('');
});

socket.on('new message', (data) => {
    
    $('.typing').remove();
    
    $chat.append('<div class="well"><b>'+ data.user + ' : </b>' + data.msg + '</div>');
});

$userForm.submit( (e) => {
    e.preventDefault();
    
    socket.emit('new user', $username.val(), (data) => {
        
        if (data) {
            $userFormArea.hide();
            $messageArea.show();
        }
    });
    
    $username.val('');
});

socket.on('get users', (data) => {
    
    let users_list = '';

    for (let i = 0; i < data.length; i++) {
        users_list += '<li class="list-group-item">' + data[i] + '</li>';
    }
    
    $users.html(users_list);
});

socket.on('private message', (data) => {
    
    $('.typing').remove();
    
    $chat.append('<div class="well"><b><span class="privateMsg">Private messsage from </span>' + data.user + ' : </b>' + data.msg + '</div>');
});

document.getElementById('message').addEventListener('click', () => {
    socket.emit('typing', $username.val());
}); 

socket.on('typing', (data) => {
    $chat.append('<div class="typing"><i> ' + data.user + ' is typing a message...</i></div><br>');
});
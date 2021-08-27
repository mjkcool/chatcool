"use strict"

let mySocketClientId;

const disconnectBtn = document.querySelector("#disconnectBtn");
if(disconnectBtn) disconnectBtn.addEventListener("click", goHome);

let myNameView = document.querySelector("#myName");

function goHome(){
  location.href = '/';
}


const getCookie = function(name) {
  var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return value? value[2] : null;
};
$('#myName').append("(You)"+decodeURIComponent(getCookie('nickname')));

console.log(location.port);

const socket = io.connect(`http://localhost:${location.port}/`, { transports: ['websocket'] });

socket.emit("joinRoom", {roomName: 'mainroom'});


socket.on("joinClientNotice", data => {
    $('#message-container').append(`<h5 class="ui header" style='text-align: center; padding: 0; margin-bottom: 1em;'>[server] ${data} 님이 입장했습니다</div>`);
});

socket.on("quitClientNotice", data => {
  $('#message-container').append(`<h5 class="ui header" style='text-align: center; padding: 0; margin-bottom: 1em;'>[server] ${data} 님이 나갔습니다</div>`);
});

socket.on("recMsg", data => {
  console.log(data.comment);
  $('#message-container').append(`
    <div class="field message others">
        <span class="ui namelabel">${data.name}</span>
        <div class="ui left pointing large label">
        ${data.comment}
        </div>
    </div>
    `);
});

const sendBtn = document.querySelector("#send-message");
sendBtn.addEventListener("click", sendMessageToServer)

function sendMessageToServer(){
  socket.emit("reqMsg", {comment: $('#message-input').val()});
  $('#message-input').val('');
}
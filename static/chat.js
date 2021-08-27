"use strict"

let mySocketClientId;

let disconnectBtn = document.querySelector("#disconnectBtn");
disconnectBtn.addEventListener("click", goHome);
// disconnectBtn.addEventListener("click", goHome);

let myNameView = document.querySelector("#myName");

function goHome(){
  location.href = 'http://localhost:5001/';
}

$("#roomport").append(location.port);


const getCookie = function(name) {
  var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return value? value[2] : null;
};
$('#myName').append("(You)"+decodeURIComponent(getCookie('nickname')));

const socket = io.connect(`http://localhost:${location.port}/`, { transports: ['websocket'] });

socket.emit("joinRoom", {roomName: 'main'});

console.log(socket);

socket.on("joinClientNotice", data => {
    let message = data.isOwner ? `${data.name} 님이 방을 생성했습니다` : `${data.name} 님이 입장했습니다`;
    if(data.isOwner) {
      $('#myName').append(" :방장");
      document.querySelector('#disconnectBtn').innerHTML = '채팅 종료';
      // document.querySelector("#menupane").innerHTML += '<div class="item">방장(SERVER)</div>';
    }
    $('#message-container').append(`<h5 class="ui header" style='text-align: center; padding: 0; margin-bottom: 1em;'>${message}</h5>`);
});

socket.on("quitClientNotice", data => {
  let message = data.isOwner ? `방장이 채팅을 종료하였습니다` : `${data.name} 님이 나갔습니다`;
  $('#message-container').append(`<h5 class="ui header" style='text-align: center; padding: 0; margin-bottom: 1em;'>${message}</h5>`);
});

// socket.on("closeRoom", data => {
//   location.href = `${data.protocol}://${data.HOST}:${data.port}/`;
// });

socket.on("recMsg", data => {
  let viewname = data.isOwner ? `<div class="ui teal label" style="padding: 5px 5px;">방장</div>`+data.name : data.name;
  $('#message-container').append(`
    <div class="field message others">
        ${viewname}
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
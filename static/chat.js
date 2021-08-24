"use strict"

const socket = io.connect('http://localhost:5001/', { transports: ['websocket'] });

console.log(socket);

socket.emit("joinRoom", {roomName: 'mainroom'});

socket.on("joinClientNotice", data => {
    $('#message-container').append(`<h5 class="ui header" style='text-align: center; padding: 0; margin: 0;'>${data}</div>`);
});

socket.on("recMsg", data => {
  console.log(data.comment);
  $('#message-container').append(`
    <div class="field message others">
        ${data.name}
        <div class="ui left pointing large label">
        ${data.comment}
        </div>
    </div>
    `);
})

const sendBtn = document.querySelector("#send-message");
sendBtn.addEventListener("click", sendMessageToServer)

function sendMessageToServer(){
  socket.emit("reqMsg", {comment: $('#message-input').val()})
  $('#message-input').val('');
}
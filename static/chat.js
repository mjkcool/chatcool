"use strict"

const socket = io();//connect("http://127.0.0.1:5001");

socket.emit("main", "프론트 입장");

socket.on("main", data => {
    console.log(data);
})

console.log(socket);
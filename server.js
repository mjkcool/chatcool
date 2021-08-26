require('dotenv').config();
const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
const Router = require("./routes/route");
const cookieParser = require('cookie-parser');
const cookie = require("cookie");
const app = express();

let SERVER_LIST = [];

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({extended:false})); //Parse URL-encoded bodies
app.use(express.static(path.join(__dirname, 'static')));
app.use(cookieParser());

app.use('/', Router);

const PORT = process.env.PORT;
const protocol = process.env.protocol;
const HOST = process.env.HOST;

const httpServer = http.createServer(app).listen(PORT, HOST, () => {
    console.log(`server is running at ${protocol}://${HOST}:${PORT}`)
    
});



const io = socketIO(httpServer);
let roomName;
let Names = {};
io.on("connection", client => {
    let clientId = client.id;
    let cookies = cookie.parse(client.handshake.headers.cookie);
    let clientName = cookies.nickname;
    Names[clientId] = clientName;

    client.on("joinRoom", data => {
        console.log(data);
        client.join(data.roomName); // 특정 룸에 입장
        roomName = data.roomName;
        io.sockets.in(roomName).emit("joinClientNotice", Names[clientId]);
    });

    client.on('reqMsg', data => {
        //특정 룸으로 데이터 전송
        io.sockets.in(roomName).emit('recMsg', {name: Names[clientId], comment: data.comment});
    });

    client.on("disconnect", () => {
        io.sockets.in(roomName).emit("joinClientNotice", `[server] ${Names[clientId]} 님이 나갔습니다`);
        delete Names.clientId;
    });
});
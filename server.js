const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
const Router = require("./routes/route");
const app = express();

let SERVER_LIST = [];

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({extended:false})); //Parse URL-encoded bodies
app.use(express.static(path.join(__dirname, 'static')));

app.use('/', Router);

const PORT = process.env.PORT || 5001;

const httpServer = http.createServer(app).listen(PORT, () => {
    console.log(`server is running at ${PORT}`);
});

const io = socketIO(httpServer);
let roomName;
io.on("connection", client => {
    let clientId = client.id;
    client.on("joinRoom", data => {
        console.log(data);
        client.join(data.roomName); // 특정 룸에 입장
        roomName = data.roomName;
        io.sockets.in(roomName).emit("joinClientNotice", `[server] ${clientId} 님이 접속했습니다`);
    });

    client.on('reqMsg', data => {
        console.log(data);
        //특정 룸으로 데이터 전송
        io.sockets.in(roomName).emit('recMsg', {name: clientId, comment: data.comment});
    });
});
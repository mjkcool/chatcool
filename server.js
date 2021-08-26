require('dotenv').config();

const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
// const Router = require("./routes/route");
const router = express.Router();
const cookieParser = require('cookie-parser');
const cookie = require("cookie");
const app = express();
const Controller = require('./controllers/controller');


let SERVER_LIST = [];

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({extended:false})); //Parse URL-encoded bodies
app.use(express.static(path.join(__dirname, 'static')));
app.use(cookieParser());

app.use('/', router);
router.route('/').get(Controller.index);

router.route('/createchat').get(Controller.createChat);
router.route('/chat').get(Controller.chat);

const PORT = process.env.PORT;
const protocol = process.env.protocol;
const HOST = process.env.HOST;

let httpServerList = {}; //key: port, value: server object
let socketServerList = {};

//Main web server
const httpMainServer = http.createServer(app).listen(PORT, HOST, () => {
    console.log(`server is running at ${protocol}://${HOST}:${PORT}`)
});


let createChatServerInstance = (port) => {
    const httpServerInstance = http.createServer(app).listen(port, HOST, () => {
        console.log(`server is running at ${protocol}://${HOST}:${port}`)
    });

    httpServerList[port] = httpServerInstance;

    const io = socketIO(httpServerInstance);
    io.on("connection", client => {
        let roomName;
        let Names = {};
        let clientId = client.id;
        console.log(client.handshake.headers, clientId);
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
            io.sockets.in(roomName).emit("quitClientNotice", Names[clientId]);
            delete Names.clientId;
        });
    });

    socketServerList[port] = io;
}

createChatServerInstance(5002);


// module.exports = { createChatServerInstance }
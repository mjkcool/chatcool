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
//const Controller = require('./controllers/controller');

const PORT = process.env.PORT;
const protocol = process.env.protocol;
const HOST = process.env.HOST;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded({extended:false})); //Parse URL-encoded bodies
app.use(express.static(path.join(__dirname, 'static')));
app.use(cookieParser());


//Controller
const index = (req, res) => {
    //let ip = getIPAddress();
    res.clearCookie("nickname");
    res.clearCookie("isHost");
    res.render('index');
}

const createChat = (req, res) => {
    res.cookie('nickname', req.query.nickname);
    createChatServerInstance(Number(req.query.port));
    res.redirect(`${process.env.protocol}://${process.env.HOST}:${req.query.port}/chat`);
}

const joinChat = (req, res) => {
    res.cookie('nickname', req.query.nickname);
    res.redirect(`${process.env.protocol}://${process.env.HOST}:${req.query.port}/chat`);
}

const chat = (req, res) => {
    res.render('chat');
}


//Route
app.use('/', router);
router.route('/').get(index);
router.route('/createchat').get(createChat);
router.route('/joinchat').get(joinChat);
router.route('/chat').get(chat);


let httpServerList = {}; //key: port, value: server object
let socketServerList = {};
let ownerList = {};


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
        let ClientList = {};
        let clientId = client.id;
        let cookies = cookie.parse(client.handshake.headers.cookie);
        let clientName = cookies.nickname;

        ClientList[clientId] = clientName;
        if(ownerList[port] === undefined){
            ownerList[port] = clientId;
        }
        
    
        client.on("joinRoom", data => {
            console.log("서버에서받은 아이디: "+clientId);
            client.join(data.roomName); // 특정 룸에 입장
            roomName = data.roomName;
            io.sockets.in(roomName).emit("joinClientNotice", {isOwner: ownerList[port] == clientId ? true : false, name: ClientList[clientId]});
            
        });
    
        client.on('reqMsg', data => {
            //특정 룸으로 데이터 전송
            io.sockets.in(roomName).emit('recMsg', {isOwner: ownerList[port] == clientId ? true : false, name: ClientList[clientId], comment: data.comment});
        });
    
        client.on("disconnect", () => {
            io.sockets.in(roomName).emit("quitClientNotice", {isOwner: ownerList[port] == clientId ? true : false, name: ClientList[clientId]});
            if(ownerList[port] == clientId){ //방장일 경우
                //서버 삭제
                //httpServerList[port].close(() => {console.log('http서버 삭제')});
                httpServerInstance.close();
                io.close();
                delete httpServerList[port];
                delete socketServerList[port];
            }else{
                delete ClientList.clientId;
            }   
        });
    });

    socketServerList[port] = io;
}
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

const socketIoServer = socketIO(httpServer);
socketIoServer.on("connection", socket => {
    console.log("socket io connected");
    socket.on("main", (data) => {
        console.log(data);
    });
});
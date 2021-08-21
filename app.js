const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const socketIO = require("socket.io");
const src = path.join(__dirname, "src");

let SERVER_LIST = [];
app.use(express.json()); //Used to parse JSON bodies
app.use(express.urlencoded()); //Parse URL-encoded bodies

app.use(express.static(src));

// app.get('/create', (req, res) => {
//     res.sendFile(path.join(src, "/create_server.html"));
// });

app.post('/chat', (req, res) => {
    console.log(req.body);
    res.json(req.body);
});

const PORT = process.env.PORT || 5001;
const httpServer = http.createServer(app).listen(PORT, () => {
    console.log(`server is running at ${PORT}`);
});

const socketIoServer = socketIO(httpServer);
socketIoServer.on("connection", socket => {
    console.log("socket io connected");
});
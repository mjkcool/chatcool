const express = require("express");
const http = require("http");
const app = express();
const path = require("path");
const router = express.Router();
const server = http.createServer(app);
const socketIO = require("socket.io");
const io = socketIO(server);
const src = path.join(__dirname, "src");

app.use(express.static(src));

app.get('/create', (req, res) => {
    res.sendFile(path.join(src, "/create_server.html"));
});

const PORT = process.env.PORT || 5001;

io.on("connection", (socket) => {
    
});

server.listen(PORT, () => {
    console.log(`server is running at ${PORT}`);
})
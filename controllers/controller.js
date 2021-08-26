const index = (req, res) => {
    //let ip = getIPAddress();
    // res.clearCookie("nickname");
    res.render('index', {host: ""});
}

const createChat = (req, res) => {
    console.log(req.body);
    /*res.send({
        success: true, 
        port: req.body.port, 
        url: "create_server"});*/
    res.cookie('nickname', req.body.nickname);
    res.send({protocol: process.env.protocol, ip: process.env.HOST, port: req.body.port, isHost: true});
}

const chat = (req, res) => {
    res.render('chat');
}

module.exports = { index, createChat, chat }
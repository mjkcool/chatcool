// const ServerController = require('./../server');

const index = (req, res) => {
    //let ip = getIPAddress();
    // res.clearCookie("nickname");
    res.render('index', {host: ""});
}

const createChat = (req, res) => {
    res.cookie('nickname', req.query.nickname);
    // ServerController.createChatServerInstance(Number(req.body.port));
    res.redirect(`${process.env.protocol}://${process.env.HOST}:${req.query.port}/chat`);
}

const chat = (req, res) => {
    res.render('chat');
}

module.exports = { index, createChat, chat }
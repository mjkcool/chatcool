const index = (req, res) => {
    //let ip = getIPAddress();
    res.render('index', {host: ""});
}

const createChat = (req, res) => {
    console.log(req.body);

    //res.json({url: 'chat'});
}

const chat = (req, res) => {
    res.render('chat');
}

module.exports = { index, createChat, chat }
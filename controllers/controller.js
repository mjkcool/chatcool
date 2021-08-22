const index = (req, res) => {
    //let ip = getIPAddress();
    res.render('index', {host: ""});
}

const createChat = (req, res) => {
    console.log(req.body);
    /*res.send({
        success: true, 
        port: req.body.port, 
        url: "create_server"});*/
    res.render('chat');
}

const chat = (req, res) => {
    res.render('chat');
}

module.exports = { index, createChat, chat }
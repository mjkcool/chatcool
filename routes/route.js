const express = require('express');
const router = express.Router();
const Controller = require('./../controllers/controller');

router.route('/').get(Controller.index);

router.route('/createchat').post(Controller.createChat);
router.route('/chat').get(Controller.chat)

module.exports = router;
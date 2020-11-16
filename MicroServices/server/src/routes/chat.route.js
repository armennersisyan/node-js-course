const express = require('express');
const router = express.Router();

const { getChatByRoomId } = require('../controllers/chat');

router.get('/chat/:roomId', function (req, res) {
  getChatByRoomId(req, res)
})

module.exports = router

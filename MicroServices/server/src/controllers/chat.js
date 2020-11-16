const ChatModel = require('../models/chat');

class Chat {
  getChatByRoomId = async (req, res) => {
    const { roomId } = req.params
    const message = await ChatModel.find({ roomId });
    console.log('message', message)
    res.status(200).json({
      data: message
    })
    try {

    }
    catch (err) {
      throw err;
    }
  }
}

module.exports = new Chat();


// Temporary
const ChatModel = require('../../../server/src/models/chat');
const mongoose = require('mongoose');
//

class Message {
  send = (data) => {
    const message = new ChatModel({
      _id: mongoose.Types.ObjectId(),
      roomId: data.roomId,
      message: data.text,
    })
    message.save().then(res => {
      console.log('res', res)
    })
  }
}

module.exports = new Message()

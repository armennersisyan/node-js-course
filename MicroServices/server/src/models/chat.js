const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  _id:  mongoose.Types.ObjectId,
  roomId: {
    type: String,
    required: true,
    maxlength: 255
  },
  message: {
    type: String,
    required: true,
    maxlength: 255
  },
});

module.exports = mongoose.model('ChatModel', ChatSchema);

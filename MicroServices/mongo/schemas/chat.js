const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
  _id:  mongoose.Types.ObjectId,
  roomId: {
    type: String,
    required: true,
    maxlength: 255
  },
  text: {
    type: String,
    required: true,
  },
  sender: {
    ref: 'AuthModel',
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ChatModel', ChatSchema);

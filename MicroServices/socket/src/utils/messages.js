// Temporary
const { ChatSchema } = require('../../../mongo/schemas');
const mongoose = require('mongoose');
//

class Message {
  sendMessage = async (data) => {
    try {
      const message = new ChatSchema({
        _id: mongoose.Types.ObjectId(),
        ...data,
      })
      const sent = await message.save();
      return await ChatSchema.findById(sent._id).populate('sender');
    } catch (err) {
      console.log(err)
    }
  };
  getMessages = async (roomId) => {
    try {
      return await ChatSchema.find({ roomId }).populate('sender');
    }
    catch(err){
      console.log(err);
    }
  };
}

module.exports = new Message

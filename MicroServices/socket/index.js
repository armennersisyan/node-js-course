require('dotenv').config();

const server = require('http').createServer();
const io = require('socket.io')(server);
const Mongo = require('../mongo/index');
const { sendMessage, getMessages } = require('./src/utils/messages');
const { NEW_CHAT_MESSAGE_EVENT, ALL_CHAT_MESSAGES_EVENT } = require('./src/events');

const MONGO = process.env.MONGO;
const PORT = process.env.PORT || 3002;

io.on('connection', async (socket) => {
  Mongo.connect(MONGO);

  // Join a conversation
  const { roomId } = socket.handshake.query;
  socket.join(roomId);

  socket.emit(ALL_CHAT_MESSAGES_EVENT, await getMessages(roomId));

  // Listen for new messages
  socket.on(NEW_CHAT_MESSAGE_EVENT, async (data) => {
    try {
      const message = {
        roomId,
        text: data.body,
        sender: data.sender,
      }
      const msg = await sendMessage(message);
      io.in(roomId).emit(NEW_CHAT_MESSAGE_EVENT, msg);
    } catch (e) {
      console.log(e)
    }
  });

  // Leave the room if the user closes the socket
  socket.on('disconnect', () => {
    socket.leave(roomId);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

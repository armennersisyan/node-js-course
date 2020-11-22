import { useEffect, useRef, useState } from 'react';
import socketIOClient from 'socket.io-client';
import { useSelector } from 'react-redux';

const NEW_CHAT_MESSAGE_EVENT = 'newChatMessage';
const ALL_CHAT_MESSAGES_EVENT = 'allChatMessages';
const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET || 3002;

const useChat = (roomId) => {
  const user = useSelector((state) => state.auth && state.auth.user);
  const [isLoading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]); // Sent and received messages
  const socketRef = useRef();

  useEffect(() => {
    if (!user) return;

    setMessages([]);

    // Creates a WebSocket connection
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { roomId },
    });

    socketRef.current.emit(ALL_CHAT_MESSAGES_EVENT)

    // Listens for room messages load
    setLoading(true);
    socketRef.current.on(ALL_CHAT_MESSAGES_EVENT, (allMessages) => {
      setMessages(allMessages);
      setLoading(false);
    });

    // Listens for incoming messages
    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
      const incomingMessage = { ...message };
      setMessages((messages) => [...messages, incomingMessage]);
    });

    // Destroys the socket reference
    // when the connection is closed
    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId, user]);

  // Sends a message to the server that
  // forwards it to all users in the same room
  const sendMessage = (messageBody) => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
      sender: user?._id,
    });
  };

  return { isLoading, messages, sendMessage };
};

export default useChat;

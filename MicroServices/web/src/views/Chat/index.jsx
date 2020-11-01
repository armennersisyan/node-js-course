import React from 'react';
import useChat from '../../hooks/useChat';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers';

import * as yup from 'yup';

const schema = yup.object().shape({
  message: yup
    .string()
    .required('message field is required'),
});

function Chat () {
  const { register, getValues, setValue } = useForm({
    resolver: yupResolver(schema)
  });
  const { roomId } = useParams(); // Gets roomId from URL
  const { messages, sendMessage } = useChat(roomId); // Creates a websocket and manages messaging

  const handleEmit = () => {
    const msg = getValues('message');
    if (!msg) return;
    sendMessage(msg);
    setValue('message', undefined);
  }

  return (
    <div>
      <h1>Chat - Room {roomId}</h1>
      <ul>
        { messages && messages.map((message, i) => {
            return (
              <li key={i}>
                <strong>{message.ownedByCurrentUser ? 'Me:' : `Sender ID ${message.senderId}`}</strong>
                <p>{message.body}</p>
              </li>
            )
          })
        }
      </ul>
      <textarea
        name="message"
        id="message"
        cols="30"
        rows="10"
        ref={register}
      />
      <button onClick={() => handleEmit()}>Send</button>
    </div>
  );
}

export default Chat;

import React, { useEffect, useRef } from 'react';

import moment from 'moment';
import useChat from '../../hooks/useChat';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import Loader from '../../components/UI/Loader';
import { yupResolver } from '@hookform/resolvers';

import * as yup from 'yup';
import { useSelector } from 'react-redux';

import classes from './index.module.scss';

const schema = yup.object().shape({
  message: yup
    .string()
    .required('message field is required'),
});

function Chat () {
  const user = useSelector((state) => state.auth && state.auth.user);

  const wrapperEl = useRef(null);

  const { register, getValues, setValue } = useForm({
    resolver: yupResolver(schema)
  });
  const { roomId } = useParams(); // Gets roomId from URL
  const { isLoading, messages, sendMessage } = useChat(roomId); // Creates a websocket and manages messaging

  useEffect(() => {
    scrollBottom()
  }, [messages])

  const handleEmit = () => {
    const msg = getValues('message');
    if (!msg) return;
    sendMessage(msg);
    setValue('message', undefined);
  }

  const handleEnterPress = (event) => {
    const key = event.which || event.keyCode;
    if (key === 13) {
      handleEmit()
    }
  }

  const scrollBottom = () => {
    const objDiv = wrapperEl.current;
    objDiv.scrollTop = objDiv.scrollHeight;
  }

  return (
    <div>
      <h1>Chat - Room {roomId}</h1>
      {isLoading && <Loader />}
      <div
        ref={wrapperEl}
        className={classes['msger-chat']}
      >
        {messages && messages.map((message, i) => {
          return (
            <div
              key={message._id}
              className={`${classes['msg']} ${message.sender._id !== user._id ? classes['left-msg'] : classes['right-msg'] }`}
            >
              <div
                className={classes['msg-img']}
                style={{backgroundImage: 'url(https://image.flaticon.com/icons/svg/327/327779.svg)'}}
              />

              <div className={classes['msg-bubble']}>
                <div className={classes['msg-info']}>
                  <div className={classes['msg-info-name']}>{message.sender._id === user._id ? 'Me' : message.sender.firstName}: </div>
                  <div className={classes['msg-info-time']}>{moment(message.created_at).format("MMM D, hh:mm")}</div>
                </div>

                <div className={classes['msg-text']}>
                  {message.text}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className={classes['msger-inputarea']}>
        <input
          type="text"
          ref={register}
          name="message"
          className={classes['msger-input']}
          onKeyPress={handleEnterPress}
          placeholder="Enter your message..."
        />
        <button
          type="submit"
          onClick={() => handleEmit()}
          className={classes['msger-send-btn']}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;

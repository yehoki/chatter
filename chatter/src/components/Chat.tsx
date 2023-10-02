import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import '../App.css';
import SingleMessage from './SingleMessage';

type MessageData = {
  room: string;
  username: string;
  message: string;
  currentTime: string;
};

type ChatMessage = {
  message: string;
  username: string;
  timeAt: string;
};

function Chat({
  socket,
  username,
  room,
}: {
  socket: Socket;
  username: string;
  room: string;
}) {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const messageBoxRef = useRef<HTMLUListElement>(null);
  const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (room === '' || username === '') {
      return;
    }
    if (message !== '') {
      const currentTime = new Date().toUTCString();
      const messageData: MessageData = {
        room: room,
        username: username,
        message: message,
        currentTime: new Date().toUTCString(),
      };
      await socket.emit('send_message', messageData);
      setChatMessages((prev) => [
        ...prev,
        { username: username, message: message, timeAt: currentTime },
      ]);
      const scrollTimer = setTimeout(() => {
        if (messageBoxRef.current) {
          messageBoxRef.current.scrollTo({
            left: 0,
            top: messageBoxRef.current.scrollHeight,
            behavior: 'smooth',
          });
        }
      }, 5);
      setMessage('');
      return () => clearTimeout(scrollTimer);
    }
  };

  useEffect(() => {
    socket.on('receive_message', (data) => {
      console.log(data);
      setChatMessages((prev) => [
        ...prev,
        {
          message: data.message,
          username: data.username,
          timeAt: data.currentTime,
        },
      ]);
      const scrollTimer = setTimeout(() => {
        if (messageBoxRef.current) {
          messageBoxRef.current.scrollTo({
            left: 0,
            top: messageBoxRef.current.scrollHeight,
            behavior: 'smooth',
          });
        }
      }, 5);
      return () => clearTimeout(scrollTimer);
    });
  }, [socket]);

  return (
    <div className="chat-container">
      <ul className="chat-body" ref={messageBoxRef}>
        {chatMessages.map((chatMessage, index) => (
          <SingleMessage
            key={index}
            message={chatMessage.message}
            username={chatMessage.username}
            time={chatMessage.timeAt}
            currentUsername={username}
          />
        ))}
      </ul>
      <div className="chat-footer">
        <form onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Chat..."
            value={message}
            onChange={(e) => setMessage(e.currentTarget.value)}
          />
          <button type="submit">&#9658;</button>
        </form>
      </div>
    </div>
  );
}
export default Chat;

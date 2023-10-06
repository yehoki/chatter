import React, { FormEvent, useEffect, useRef, useState } from 'react';
import './Chat.css';
import { Socket } from 'socket.io-client';
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

export type User = {
  id: string;
  username: string;
};

function Chat({
  socket,
  username,
  room,
  currentUsers,
}: {
  socket: Socket;
  username: string;
  room: string;
  currentUsers: User[];
}) {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [users, setUsers] = useState<User[]>(currentUsers);
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

    socket.on('new_users', (data) => {
      setUsers([...data.currentRoomUsers]);
    });
  }, [socket]);

  return (
    <div className="chat-container">
      <aside className="chat-sidebar">
        <ul className="user-list">
          {users.map((user) => (
            <li className="single-user" key={user.id}>
              {user.username}
            </li>
          ))}
        </ul>
      </aside>
      <div className="chat-main">
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
              className="chat-message"
              type="text"
              placeholder="Chat..."
              value={message}
              onChange={(e) => setMessage(e.currentTarget.value)}
            />
            <button className="chat-message-submit" type="submit">
              &#9658;
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
export default Chat;

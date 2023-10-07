import React, {
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import './Chat.css';
import { Socket } from 'socket.io-client';
import SingleMessage from './SingleMessage';
import TypingActivity from './TypingActivity';

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

let typingTimer: NodeJS.Timeout;

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
  const [isTyping, setIsTyping] = useState(false);
  const [usersTyping, setUsersTyping] = useState<string[]>([]);
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
      socket.emit('send_message', messageData);
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

  // Emit typing at the start of typing then a 2s period between no change indicates it stopped typing which emits a stop-typing event

  const handleTyping = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (message === '' && e.key === 'Backspace') {
        return;
      }
      if (message === '' && isTyping) {
        setIsTyping(false);
        socket.emit('stop-typing', { username, room });
        return;
      }
      if (isTyping) {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
          setIsTyping(false);
          socket.emit('stop-typing', { username, room });
        }, 1000);
        return () => clearTimeout(typingTimer);
      } else {
        setIsTyping(true);
        socket.emit('user-typing', { username, room });
        typingTimer = setTimeout(() => {
          setIsTyping(false);
          socket.emit('stop-typing', { username, room });
        }, 1000);
        return () => clearTimeout(typingTimer);
      }
    },
    [isTyping, socket, message, room, username]
  );

  useEffect(() => {
    socket.on('receive_message', (data) => {
      console.log(data);
      const newMessages = [
        ...chatMessages,
        {
          message: data.message,
          username: data.username,
          timeAt: data.currentTime,
        },
      ];
      setChatMessages(newMessages);
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

    socket.on('user-typing', (data: { username: string }) => {
      if (!usersTyping.find((user) => user === data.username)) {
        const usersTypingCopy = [...usersTyping, data.username];
        setUsersTyping(usersTypingCopy);
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
      }
    });

    socket.on('stop-typing', (data: { username: string }) => {
      if (usersTyping.find((user) => user === data.username)) {
        setUsersTyping((prev) => prev.filter((user) => user !== data.username));
      }
    });
  }, [socket, usersTyping]);

  return (
    <div className="chat-container">
      <aside className="chat-sidebar">
        <h3 className="user-list-heading">Current users</h3>
        <ul className="user-list">
          {users.map((user) => (
            <li className="single-user" key={user.id}>
              {user.username}
            </li>
          ))}
        </ul>
      </aside>
      <div className="chat-main">
        <div className="chat-header">
          <h2 className="chat-header-heading">{room}</h2>
        </div>
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
          <TypingActivity usernames={usersTyping} />
        </ul>
        <div className="chat-footer">
          <form onSubmit={sendMessage}>
            <input
              className="chat-message"
              type="text"
              placeholder="Chat..."
              value={message}
              onKeyUp={handleTyping}
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

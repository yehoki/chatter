import { MouseEvent, useEffect, useState } from 'react';
import './App.css';
import { io } from 'socket.io-client';

import { User } from './components/Chat/Chat';
import Home from './components/Home/Home';
import { Route, Routes } from 'react-router-dom';

const socket = io('ws://localhost:3500');

function App() {
  const [room, setRoom] = useState('');
  const [username, setUsername] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to ws');
    });
  }, []);

  useEffect(() => {
    socket.on(
      'enter_room',
      (data: {
        username: string;
        room: string;
        currentRoomUsers: {
          username: string;
          id: string;
          room: string;
        }[];
      }) => {
        setUsers(data.currentRoomUsers);
        setShowChat(true);
      }
    );
  }, []);

  useEffect(() => {
    socket.on('verify_password', (data) => {
      setShowPassword(true);
    });
  });

  const handleJoinRoom = (e: MouseEvent<HTMLButtonElement>) => {
    if (username !== '' && room !== '') {
      // setShowChat(true);
      socket.emit('join_room', {
        room,
        username,
      });
    }
  };

  return (
    <Routes>
      <Route path="/" element={<Home socket={socket} />} />
    </Routes>
  );
}

{
  /* <main className="App">
        {!showChat ? (
          <div className="home-inputs">
            {!showPassword ? (
              <>
                <h2>Join a chat room</h2>
                <input
                  onChange={(e) => setUsername(e.currentTarget.value)}
                  className="home-input"
                  type="text"
                  placeholder="Username"
                />
                <input
                  onChange={(e) => setRoom(e.currentTarget.value)}
                  className="home-input"
                  type="text"
                  placeholder="Room"
                />
                <button onClick={handleJoinRoom}>Join</button>
              </>
            ) : (
              <>
                <h2>Enter the password to join room {room}</h2>
                <p>Username: {username}</p>
                <p>Room: {room}</p>
                <input type="password" placeholder="Password" />
                <button>Join</button>
              </>
            )}
          </div>
        ) : (
          <Chat
            socket={socket}
            username={username}
            room={room}
            currentUsers={users}
          />
        )}
      </main> */
}

export default App;

import { MouseEvent, useEffect, useState } from 'react';
import './App.css';
import { io } from 'socket.io-client';
import MainLayout from './components/Layout/MainLayout';
import Chat, { User } from './components/Chat';

const socket = io('ws://localhost:3500');

function App() {
  const [room, setRoom] = useState('');
  const [username, setUsername] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

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
    <MainLayout>
      <main className="App">
        {!showChat ? (
          <div className="home-inputs">
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
          </div>
        ) : (
          <Chat
            socket={socket}
            username={username}
            room={room}
            currentUsers={users}
          />
        )}
      </main>
    </MainLayout>
  );
}

export default App;

import { MouseEvent, useCallback, useEffect, useState } from 'react';
import './App.css';
import { io } from 'socket.io-client';
import MainLayout from './components/Layout/MainLayout';
import Chat from './components/Chat';

const socket = io('ws://localhost:3500');

function App() {
  const [room, setRoom] = useState('');
  const [username, setUsername] = useState('');
  const [showChat, setShowChat] = useState(false);
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to ws');
    });
  }, []);

  const handleJoinRoom = (e: MouseEvent<HTMLButtonElement>) => {
    if (username !== '' && room !== '') {
      socket.emit('join_room', {
        room,
        username,
      });
      setShowChat(true);
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
          <Chat />
        )}
      </main>
    </MainLayout>
  );
}

export default App;

import React, { useState } from 'react';
import MainLayout from '../Layout/MainLayout';
import RoomChoice from './RoomChoice';
import '../../App.css';
import { Socket } from 'socket.io-client';
import Chat, { User } from '../Chat/Chat';

type HomeProps = {
  socket: Socket;
};

const Home: React.FC<HomeProps> = ({ socket }) => {
  const [showChat, setShowChat] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [username, setUsername] = useState('');
  const [currentUsers, setCurrentUsers] = useState<User[]>([]);
  return (
    <MainLayout>
      <main className="App">
        {showChat ? (
          <Chat
            socket={socket}
            username={username}
            room={roomName}
            currentUsers={currentUsers}
          />
        ) : (
          <RoomChoice
            socket={socket}
            username={username}
            roomName={roomName}
            currentUsers={currentUsers}
            setCurrentUsers={setCurrentUsers}
            setRoomName={setRoomName}
            setUsername={setUsername}
            showChat={showChat}
            setShowChat={setShowChat}
          />
        )}

        {/* {!showChat ? (
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
    )} */}
      </main>
    </MainLayout>
  );
};

export default Home;

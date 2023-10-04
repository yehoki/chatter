import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    socket.on('enter_room', (data) => {
      setCurrentUsers(data.currentRoomUsers);
      setShowChat(true);
    });
  }, []);

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
            setShowChat={setShowChat}
          />
        )}
      </main>
    </MainLayout>
  );
};

export default Home;

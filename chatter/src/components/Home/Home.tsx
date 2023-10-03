import React from 'react';
import MainLayout from '../Layout/MainLayout';
import RoomChoice from './RoomChoice';
import '../../App.css';

type Props = {};

const Home = (props: Props) => {
  return (
    <MainLayout>
      <main className="App">
        <RoomChoice />
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

import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Socket } from 'socket.io-client';
import { User } from '../Chat/Chat';
import HomeButton from './HomeButton';
import HomeInput from './HomeInput';

type JoinRoomProps = {
  socket: Socket;
  username: string;
  roomName: string;
  currentUsers: User[];
  setRoomName: Dispatch<SetStateAction<string>>;
  setUsername: Dispatch<SetStateAction<string>>;
  setCurrentUsers: Dispatch<SetStateAction<User[]>>;
  setShowChat: Dispatch<SetStateAction<boolean>>;
};

const JoinRoom: React.FC<JoinRoomProps> = ({
  socket,
  username,
  setUsername,
  setRoomName,
  setCurrentUsers,
  roomName,
  currentUsers,
  setShowChat,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const handleJoinRoom = useCallback(() => {
    socket.emit('join_room', { username, room: roomName });
    console.log(username, roomName);
  }, [username, roomName, socket]);

  const handleCheckPassword = useCallback(() => {
    socket.emit('check_password', { username, room: roomName, password });
  }, [username, roomName, password, socket]);

  useEffect(() => {
    socket.on('verify_password', (data) => {
      setShowPassword(true);
      console.log('check password');
    });
  }, []);

  return (
    <>
      {!showPassword ? (
        <>
          <h2>Join a room</h2>
          <div className="join-room-inputs">
            <HomeInput
              type="text"
              placeholder="Room"
              required
              value={roomName}
              onChange={setRoomName}
            />
            <HomeInput
              type="text"
              placeholder="Username"
              required
              value={username}
              onChange={setUsername}
            />
            <HomeButton onClick={handleJoinRoom} label="Join" />
          </div>
        </>
      ) : (
        <>
          <h2>Enter the password to join "{roomName}"</h2>
          <div className="join-room-password-verify">
            <p>Username: {username}</p>
            <p>Room: {roomName}</p>
            <div>
              <HomeInput
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={setPassword}
              />

              <HomeButton label="Join" onClick={handleCheckPassword} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default JoinRoom;

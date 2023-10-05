import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Socket } from 'socket.io-client';
import { User } from '../Chat/Chat';
import HomeInput from './HomeInput';
import HomeButton from './HomeButton';

type CreatRoomProps = {
  socket: Socket;
  username: string;
  roomName: string;
  currentUsers: User[];
  setRoomName: Dispatch<SetStateAction<string>>;
  setUsername: Dispatch<SetStateAction<string>>;
  setCurrentUsers: Dispatch<SetStateAction<User[]>>;
  setShowChat: Dispatch<SetStateAction<boolean>>;
};

const CreateRoom: React.FC<CreatRoomProps> = ({
  socket,
  username,
  setUsername,
  setRoomName,
  setCurrentUsers,
  roomName,
  currentUsers,
  setShowChat,
}) => {
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  const [password, setPassword] = useState('');

  const handleCreateRoom = useCallback(() => {
    console.log(roomName, username, password, isPasswordRequired);
    console.log(roomName, 'ROOM');
    if (roomName !== '' && username !== '') {
      if (isPasswordRequired && password !== '') {
        socket.emit('create_room', {
          room: roomName,
          username: username,
          password: password,
        });
      } else if (!isPasswordRequired) {
        socket.emit('create_room', {
          room: roomName,
          username: username,
        });
      }
    }
  }, [roomName, username, isPasswordRequired, password, socket]);

  useEffect(() => {
    socket.on('enter_room', (data) => {
      console.log(data);
      setShowChat(true);
      return;
    });
    socket.on('room_exists', (data) => {
      console.log(data);
      console.log('ROOM EXISTS');
    });
  }, []);

  return (
    <>
      <h2>Create a room</h2>
      <div className="create-room-inputs">
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
        <div className="password-option">
          <HomeInput
            checked={isPasswordRequired}
            onChange={() => setIsPasswordRequired((prev) => !prev)}
            required={false}
            type="checkbox"
            name="password-required"
            id="password-required"
          />
          <label htmlFor="password-required">Password?</label>
        </div>
        {isPasswordRequired && (
          <HomeInput
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={setPassword}
          />
        )}
        <HomeButton onClick={handleCreateRoom} label="Create" />
      </div>
    </>
  );
};

export default CreateRoom;

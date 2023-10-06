import React, { Dispatch, SetStateAction, useState } from 'react';
import './Home.css';
import CreateRoom from './CreateRoom';
import JoinRoom from './JoinRoom';

import { Socket } from 'socket.io-client';
import { User } from '../Chat/Chat';
import HomeButton from './HomeButton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import {
  RoomChoiceOption,
  setPageChoice,
} from '../../features/pageChoiceSlice';
type RoomChoiceProps = {
  socket: Socket;
  username: string;
  roomName: string;
  currentUsers: User[];
  setRoomName: Dispatch<SetStateAction<string>>;
  setUsername: Dispatch<SetStateAction<string>>;
  setCurrentUsers: Dispatch<SetStateAction<User[]>>;
  setShowChat: Dispatch<SetStateAction<boolean>>;
};

const RoomChoice: React.FC<RoomChoiceProps> = ({
  socket,
  username,
  setUsername,
  setRoomName,
  setCurrentUsers,
  roomName,
  currentUsers,
  setShowChat,
}) => {
  const dispatch = useDispatch();
  const roomOption = useSelector(
    (state: RootState) => state.pageChoice.pageChoice
  );

  const handleRoomChoice = (choice: RoomChoiceOption) => {
    dispatch(setPageChoice(choice));
  };

  return (
    <section className="room-choice">
      {roomOption === RoomChoiceOption.NONE && (
        <>
          <h2 className="">Welcome to Chatter</h2>
          <div className="room-choice-buttons">
            <HomeButton
              label="Create a room"
              onClick={() => handleRoomChoice(RoomChoiceOption.CREATE)}
            />
            <HomeButton
              label="Join a room"
              onClick={() => handleRoomChoice(RoomChoiceOption.JOIN)}
            />
          </div>
        </>
      )}
      {roomOption === RoomChoiceOption.CREATE && (
        <CreateRoom
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
      {roomOption === RoomChoiceOption.JOIN && (
        <JoinRoom
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
    </section>
  );
};

export default RoomChoice;

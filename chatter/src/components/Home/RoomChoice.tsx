import React, { useState } from 'react';
import './Home.css';
import CreateRoom from './CreateRoom';
import JoinRoom from './JoinRoom';
type Props = {};

enum RoomChoiceOption {
  CREATE,
  JOIN,
  NONE,
}

const RoomChoice = (props: Props) => {
  const [roomOption, setRoomOption] = useState<RoomChoiceOption>(
    RoomChoiceOption.NONE
  );

  const handleRoomChoice = (choice: RoomChoiceOption) => {
    setRoomOption(choice);
  };

  return (
    <section className="room-choice">
      {roomOption === RoomChoiceOption.NONE && (
        <>
          <h2 className="">Welcome to Chatter</h2>
          <div className="room-choice-buttons">
            <button onClick={() => handleRoomChoice(RoomChoiceOption.CREATE)}>
              Create a room
            </button>
            <button onClick={() => handleRoomChoice(RoomChoiceOption.JOIN)}>
              Join a room
            </button>
          </div>
        </>
      )}
      {roomOption === RoomChoiceOption.CREATE && <CreateRoom />}
      {roomOption === RoomChoiceOption.JOIN && <JoinRoom />}
    </section>
  );
};

export default RoomChoice;

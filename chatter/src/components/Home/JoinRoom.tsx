import React from 'react';

type Props = {};

const JoinRoom = (props: Props) => {
  return (
    <>
      <h2>Join a room</h2>
      <div className="room-choice-buttons">
        <button>Create a room</button>
        <button>Join a room</button>
      </div>
    </>
  );
};

export default JoinRoom;

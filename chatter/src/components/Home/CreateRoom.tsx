import React, { useState } from 'react';

type Props = {};

const CreateRoom = (props: Props) => {
  const [isPasswordRequired, setIsPasswordRequired] = useState(false);
  return (
    <>
      <h2>Create a room</h2>
      <div className="create-room-inputs">
        <input type="text" placeholder="Room" required />
        <input type="text" placeholder="Username" required />
        <div className="password-option">
          <input
            checked={isPasswordRequired}
            onChange={() => setIsPasswordRequired((prev) => !prev)}
            type="checkbox"
            name="password-required"
            id="password-required"
          />
          <label htmlFor="password-required">Password?</label>
        </div>
        {isPasswordRequired && <input type="password" placeholder="Password" />}
      </div>
    </>
  );
};

export default CreateRoom;

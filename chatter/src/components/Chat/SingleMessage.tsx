import React from 'react';
import '../../App.css';
type SingleMessageProps = {
  message: string;
  username: string;
  time: string;
  currentUsername: string;
};

const SingleMessage: React.FC<SingleMessageProps> = ({
  message,
  username,
  time,
  currentUsername,
}) => {
  return (
    <li
      className={`message-box ${
        username === currentUsername ? 'current-user' : 'other-user'
      }`}
    >
      <div className={`single-message `}>
        <p>{message}</p>
        <p>
          {username}: {new Date(time).toLocaleTimeString('en-gb')}
        </p>
      </div>
    </li>
  );
};

export default SingleMessage;

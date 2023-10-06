import React from 'react';
import './Chat.css';
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
      className={`single-message ${
        username === currentUsername ? 'current-user' : 'other-user'
      }`}
    >
      <p className="single-message-info">
        <span style={{ fontWeight: 700 }}>{username} </span>
        {new Date(time).toLocaleTimeString('en-gb')}
      </p>
      <p className="single-message-content">{message}</p>
    </li>
  );
};

export default SingleMessage;

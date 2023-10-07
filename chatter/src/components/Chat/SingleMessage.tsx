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
        username === currentUsername ? 'current-user' : ''
      }`}
    >
      {/* <p className="single-message-date">
        {new Date(time).toLocaleTimeString('en-gb')}
      </p> */}

      <div className="single-message-box">
        <p
          className={`single-message-info
        ${username === currentUsername ? 'current-user-info' : ''}
        `}
        >
          <span className="single-message-user" style={{ fontWeight: 700 }}>
            {username}{' '}
          </span>
          {new Date(time).toLocaleTimeString('en-gb')}
        </p>
        <p className="single-message-content">{message}</p>
      </div>
    </li>
  );
};

export default SingleMessage;

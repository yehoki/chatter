import React, { useMemo } from 'react';
import './Chat.css';
type TypingActivityProps = {
  usernames: string[];
};

const TypingActivity: React.FC<TypingActivityProps> = ({ usernames }) => {
  const typingOutput = useMemo(() => {
    if (usernames.length === 1) {
      return `${usernames[0]} is typing...`;
    } else if (usernames.length === 2) {
      return `${usernames[0]} and ${usernames[1]} are typing...`;
    } else if (usernames.length > 2) {
      return `${usernames[0]}, ${usernames[1]} and ${
        usernames.length - 2
      } more are typing...`;
    } else {
      return '';
    }
  }, [usernames]);

  if (usernames.length === 0) {
    return <></>;
  }
  return (
    <li className="single-message">
      <div className="single-message-box">
        <p className="single-message-content">{typingOutput}</p>
      </div>
    </li>
  );
};

export default TypingActivity;

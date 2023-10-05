import React from 'react';

type HomeButtonProps = {
  label: string;
  onClick?: () => void;
};

const HomeButton = ({ label, onClick }: HomeButtonProps) => {
  return (
    <button className="home-button" onClick={onClick}>
      {label}
    </button>
  );
};

export default HomeButton;

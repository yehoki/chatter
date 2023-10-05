import React from 'react';
import '../../App.css';
import { Link, Route, Routes } from 'react-router-dom';

type Props = {};

const Header = (props: Props) => {
  return (
    <header>
      <div className="header-container">
        <h1>
          <Link to={'/'}>Chatter</Link>
        </h1>
      </div>
    </header>
  );
};

export default Header;

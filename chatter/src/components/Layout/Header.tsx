import React from 'react';
import '../../App.css';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  RoomChoiceOption,
  setPageChoice,
} from '../../features/pageChoiceSlice';

const Header = () => {
  const dispatch = useDispatch();

  return (
    <header>
      <div className="header-container">
        <h1>
          <Link
            onClick={() => dispatch(setPageChoice(RoomChoiceOption.NONE))}
            to={'/'}
          >
            Chatter
          </Link>
        </h1>
      </div>
    </header>
  );
};

export default Header;

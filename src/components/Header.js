import React from 'react';
import { Link } from 'react-router-dom';
import logoPath from '../images/logo.svg'

function Header({ linkTo, linkDescription, onLogout, email, loggedIn }) {
  return (
  <>
    <header className='header'>
      <img className='header__logo' src={logoPath} alt='Around the U.S.' />
      <p className='header__email'>{loggedIn ? email : ''}</p>
      {!loggedIn ? (
        <Link to={linkTo} className='header__link'>
          {linkDescription}
        </Link>  
      ) : <Link to={linkTo} className='header__link' onClick={onLogout}>
        Log out
  </Link>}
    </header>
  </>
  );
}
  
export default Header;

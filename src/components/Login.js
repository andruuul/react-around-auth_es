import React from 'react';
import { Link } from 'react-router-dom';

function Login({
    email,
    password,
    setPassword,
    handleLoginSubmit,
    setEmail,
  }) 
  {
  return (
    <>
      <div className='auth__container'>
        <h2 className='auth__title'>Log in</h2>
        <form
          action='#'
          className='auth'
          title='Log in'
          onSubmit={handleLoginSubmit}
          to='/main'
        >
          <input
            className='form__input_dark'
            placeholder='Email'
            type='email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className='form__input_dark'
            placeholder='Password'
            type='password'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type='submit'
            className='form__submit-button_dark'
            onClick={handleLoginSubmit}
          >
            Log in
          </button>
        </form>
        <Link className='auth__link' to='/signup'>
          Not a member yet? Sign up here!
        </Link>
      </div>
    </>
  );
}
export default Login; 
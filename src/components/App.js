import React, { useState } from 'react';
import { Route, Switch, Redirect, useHistory, withRouter } from 'react-router-dom';
import '../index.css'
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm'
import ImagePopup from './ImagePopup';
import Login from './Login';
import Register from './Register';
//import { CurrentUserContext } from '../contexts/CurrentUserContext';
import * as auth from '../utils/auth'


  
function App() {

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  
  const [selectedCard, setSelectedCard] = React.useState(null);
//  const [currentUser, setCurrentUser] = useState({});
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const history = useHistory();

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
  }

  function handleLogin() {
    setLoggedIn(true);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setLoggedIn(false);
    history.push('/signin');
    window.location.reload(true);
  }

  function handleRegisterSubmit(e) {
    e.preventDefault();
    auth
      .register(email, password)
      .then((res) => {
        if (res) {
          console.log(res) //fine
          history.push('/signin');
        } else {
          console.log('Something went wrong.');
        }
      })
      .catch((err) => console.log(`erroooooor ${err}`))
  };

  function handleLoginSubmit(e) {
    e.preventDefault();
    auth
      .authorize(email, password)
      .then((data) => {
        if (data && data.token) {
          handleLogin();
        } else {
          if (!email || !password) {
            throw new Error(
              '400 - no se ha proporcionado uno o más campos'
            );
          }
          if (!data) {
            throw new Error(
              '401 - no se ha encontrado al usuario con el correo electrónico especificado'
            );
          }
        }
      })
      .then(() => {
        console.log("ACCESOOO")
        history.push('/main')})
      .catch((err) => console.log(err));
  };

  return (
    (
//      <CurrentUserContext.Provider value={currentUser}>
        <div className="page">
          <Switch>
            <Route exact path='/signin'>
              <Header
                email={email}
                loggedIn={loggedIn}
                onLogout={handleLogout}
                linkDescription={'Sign in'}
                linkTo={'/signup'}
              />
              <Login
                loggedIn={loggedIn}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleLogin={handleLogin}
                onLogout={handleLogout}
                handleLoginSubmit={handleLoginSubmit}
              />
            </Route>

            <Route exact path='/signup'>
              <Header
                email={email}
                loggedIn={loggedIn}
                linkDescription={'Log in'}
                linkTo={'/signin'}
              />
              <Register
                history={history}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleRegisterSubmit={handleRegisterSubmit}
              />
            </Route>

            <Route exact path='/'>
              {loggedIn ? <Redirect to='/main' /> : <Redirect to='/signin' />}
            </Route>

            <Main 
              onEditAvatarClick={handleEditAvatarClick}
              onAddPlaceClick={handleAddPlaceClick}
              onEditProfileClick={handleEditProfileClick}
              onCardClick={handleCardClick}
            />
            <Footer />
            <PopupWithForm title="Edit Profile" name="profile" buttonText="Save"
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}>
              <input className="popup__input" type="text" placeholder="Title" required minLength={2} maxLength={30} name="name" />
              <span className="popup__input-error inputNewPlaceTitle-input-error"></span>
              <input className="popup__input" type="url" placeholder="Image's URL" required name="link" />
              <span className="popup__input-error popup__input-error-lower inputNewPlaceURL-input-error"></span>
            </PopupWithForm>
    
            <PopupWithForm title="New Place" name="new-place" buttonText="Add"
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}>
              <input className="popup__input" type="text" placeholder="Title" required minLength={2} maxLength={30} name="name" />
              <span className="popup__input-error inputNewPlaceTitle-input-error"></span>
              <input className="popup__input" type="url" placeholder="Image's URL" required name="link" />
              <span className="popup__input-error popup__input-error-lower inputNewPlaceURL-input-error"></span>
            </PopupWithForm>
    
            <PopupWithForm title="Change profile picture" name="avatar" buttonText="Change"
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}>
              <input className="popup__input" type="url" placeholder="Image's URL" required name="link" />
              <span className="popup__input-error inputAvatar-input-error"></span>
            </PopupWithForm>
    
            <PopupWithForm title="Are you sure?" name="confirmation" buttonText="Yes"
            /*isOpen=""*/
            onClose={closeAllPopups}/>
    
            <ImagePopup selectedCard={selectedCard} onClose={closeAllPopups} />
          </Switch>
        </div>
      //</CurrentUserContext.Provider>
    )
  );  
}

export default withRouter(App);
import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, useHistory, withRouter } from 'react-router-dom';
import '../index.css'
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm'
import ImagePopup from './ImagePopup';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
//import { CurrentUserContext } from '../contexts/CurrentUserContext';
import * as auth from '../utils/auth'


//Tengo dudas en la línea 164 y 171. Por favor, ayúdeme a resolverlas :( No puedo seguir avanzando sin resolverlas. El proyecto n oestá terminado aún.

  
function App() {

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  
  const [selectedCard, setSelectedCard] = useState(null);
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
        handleLogin()
        console.log("ACCESOOO")
        history.push('/main')
      }
        )
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      auth
        .getContent(token)
        .then((res) => {
          setLoggedIn(true)
          setEmail(res.data.email);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("no token")
      setLoggedIn(false);
    }
  }, [loggedIn]);

  return (
    (
//      <CurrentUserContext.Provider value={currentUser}>
        <div className="page">
          <Header
            email={email}
            loggedIn={loggedIn}
            onLogout={handleLogout}
            linkDescription={window.location.pathname === '/signup' ? 'Log in' : 'Sign in'}
            linkTo={window.location.pathname === '/signup' ? '/signin' : '/signup'}
          />
          <Switch loggedIn={loggedIn}>
            <Route exact path='/signin'>
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
              <Register
                history={history}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleRegisterSubmit={handleRegisterSubmit}
              />
            </Route>

            <Route exact path='/' /*En la línea de abajo ,tampoco me permite acceder al valor de loggedIn y siempre lo registra como falso. ¿Podría ayudarme a solucionar esto?*/ > 
              {loggedIn ? <Redirect to='/main' /> : <Redirect to='/ee' />}
            </Route>

            <ProtectedRoute 
              path='/main' 
              component={Main}
              loggedIn={loggedIn} //No sé por qué aquí no me permite pasar el loggedIn, como si fuera "false"
              onEditAvatarClick={handleEditAvatarClick}
              onAddPlaceClick={handleAddPlaceClick}
              onEditProfileClick={handleEditProfileClick}
              onCardClick={handleCardClick}
            />
          </Switch>

          <Footer />

          <PopupWithForm 
            title="Edit Profile" 
            name="profile" 
            buttonText="Save"
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}>
              <input className="popup__input" type="text" placeholder="Title" required minLength={2} maxLength={30} name="name" />
              <span className="popup__input-error inputNewPlaceTitle-input-error"></span>
              <input className="popup__input" type="url" placeholder="Image's URL" required name="link" />
              <span className="popup__input-error popup__input-error-lower inputNewPlaceURL-input-error"></span>
          </PopupWithForm>
  
          <PopupWithForm 
            title="New Place" 
            name="new-place" 
            buttonText="Add"
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}>
              <input className="popup__input" type="text" placeholder="Title" required minLength={2} maxLength={30} name="name" />
              <span className="popup__input-error inputNewPlaceTitle-input-error"></span>
              <input className="popup__input" type="url" placeholder="Image's URL" required name="link" />
              <span className="popup__input-error popup__input-error-lower inputNewPlaceURL-input-error"></span>
          </PopupWithForm>
  
          <PopupWithForm 
            title="Change profile picture" 
            name="avatar" 
            buttonText="Change"
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}>
              <input className="popup__input" type="url" placeholder="Image's URL" required name="link" />
              <span className="popup__input-error inputAvatar-input-error"></span>
          </PopupWithForm>
  
          <PopupWithForm 
            title="Are you sure?" 
            name="confirmation" 
            buttonText="Yes"
            /*isOpen=""*/
            onClose={closeAllPopups}
          />
  
          <ImagePopup 
            selectedCard={selectedCard} 
            onClose={closeAllPopups} 
          />

        </div>
      //</CurrentUserContext.Provider>
    )
  );  
}

export default withRouter(App);
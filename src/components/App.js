import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, useHistory, withRouter, useLocation } from 'react-router-dom';
import '../index.css'
import Header from './Header';
import Register from './Register';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import Main from './Main';
import Footer from './Footer';
import PopupWithForm from './PopupWithForm'
import ImagePopup from './ImagePopup'; 
import InfoToolTip from './InfoToolTip';
import api from '../utils/api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { EditProfilePopup } from './EditProfilePopup';
import { EditAvatarPopup } from './EditAvatarPopup';
import { AddPlacePopup } from './AddPlacePopup';
import * as auth from '../utils/auth'
  
function App() {

  const history = useHistory()
  const location = useLocation()

  const [currentUser, setCurrentUser] = useState({})
  useEffect(() => {
    api
      .getProfileInfo()
      .then(res => setCurrentUser(res))
      .catch(err => console.log(err));
    }, [])
  const [selectedCard, setSelectedCard] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [tooltipMode, setTooltipMode] = useState(false);


  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = useState(false);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
    setIsInfoToolTipOpen(false);
  }

  function handleToolTip(success) {
    setTooltipMode(success);
    setIsInfoToolTipOpen(true);
  }

  function handleUpdateUser({name, about}) {
    api
      .editProfile(name,about)
      .then((res)=>{setCurrentUser(res)})
      .then(closeAllPopups)
  }

  function handleUpdateAvatar({avatar}) {
    api
      .changeAvatar(avatar)
      .then((res)=>{setCurrentUser(res)})
      .then(closeAllPopups)
  }


  const [cards, setCards] = useState([])

  useEffect(() => {
    api
      .getInitialCards()
      .then(res => setCards(res))
      .catch(err => console.log(err));
  }, [])

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
  }

  function handleCardDelete(cardId) {
    api
      .deleteCard(cardId)
      .then(
        setCards((state) => state.filter((c) => c._id !== cardId))
      )
  }

  function handleAddPlaceSubmit(cardData) {
    api
      .addNewCard(cardData)
      .then(newCard => setCards([newCard, ...cards]))
      .then(closeAllPopups)
  }

  function handleRegisterSubmit(e) {
    e.preventDefault();
    auth
      .register(email, password)
      .then((res) => {
        if (!res.data) {
          handleToolTip('error');
          throw new Error(`400 - ${res.message ? res.message : res.error}`);
        }
      })
      .then((res) => {
        if (res) {
          history.push('/signin');
          history.go();
        } else {
          console.log('Something went wrong.');
        }
      })
      .then((res) => {
        handleToolTip('success');
        return res;
      })
      .catch((err) => console.log(`erroooooor ${err}`))
  };

  function handleLogin() {
    setLoggedIn(true);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setLoggedIn(false);
    history.push('/signin');
    history.go();
  }

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
        history.push('/main');
        history.go()
      })
      .catch((err) => console.log(err));
  };
  
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      auth
        .getContent(token)
        .then((res) => {
          handleLogin();
          setEmail(res.data.email);
        })
        .catch((err) => {console.log(err);});
    } else {
      setLoggedIn(false);
    }
  }, [loggedIn, email]);

  //function handleLinkClick() {
  //  window.location.reload()
  //}

  return (
    (
    <div className="page">
      <Header
        email={email}
        loggedIn={loggedIn}
        onLogout={handleLogout}
        linkDescription={location.pathname === '/signup' ? 'Log in' : 'Sign in'}
        linkTo={location.pathname === '/signup' ? '/signin' : '/signup'}
      />
        <CurrentUserContext.Provider value={currentUser}>  {/*Gracias por la nota, pero prefiero dejarlo así porque en la plataforma y las instrucciones del proyecto así lo piden. Definitivamente lo tnedré en cuenta para el futuro!! Mil gracias!!  */}
          <Switch>
            <ProtectedRoute path='/main' loggedIn={loggedIn} component={Main} onEditAvatarClick={handleEditAvatarClick} onAddPlaceClick={handleAddPlaceClick} onEditProfileClick={handleEditProfileClick} onCardClick={handleCardClick} cards={cards} onCardLike={handleCardLike} onCardDelete={handleCardDelete} />
            <Route exact path='/signup'>
              <h1 onClick={handleRegisterSubmit}>hola</h1>
                <Register
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  handleRegisterSubmit={handleRegisterSubmit}
                />
            </Route>
            <Route exact path='/signin'>
              <Login
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleLoginSubmit={handleLoginSubmit}
              />
            </Route>
            <Route exact path='/' loggedIn={loggedIn}>
              {loggedIn ? <Redirect to='/main' /> : <Redirect to='/signin' />}
            </Route>
            <Redirect from='*' to='/main' />
          </Switch>
        </CurrentUserContext.Provider>
        
      

      <Footer />

      <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} currentUser={currentUser}/>
      
      <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />

      <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlaceSubmit={handleAddPlaceSubmit} />

      <InfoToolTip
            isOpen={isInfoToolTipOpen}
            success={tooltipMode}
            onClose={closeAllPopups}
            loggedIn={loggedIn}
          />

      <PopupWithForm title="Are you sure?" name="confirmation" buttonText="Yes"
      /*isOpen=""*/
      onClose={closeAllPopups}/>

      <ImagePopup selectedCard={selectedCard} onClose={closeAllPopups} />
    </div>
    )
  );
}

export default withRouter(App);
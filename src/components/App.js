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

  function resetForm() {
    setEmail('');
    setPassword('');
  };

  function handleRegisterSubmit(e) {
    e.preventDefault();
    auth
      .register(email, password)
      .then((res) => {
        if (res) {
          handleToolTip('success');
          setTimeout(() => {
            history.push('/signin');
            history.go()
          }, "1500")
        } else if (!res.data) {
          throw new Error(`400 - ${res.message ? res.message : res.error}`)
        }
      })
      .catch((err) => {
        handleToolTip('error'); 
        console.log(err)
        resetForm()
      })
  };


  useEffect(() => {
    const token = localStorage.getItem('token')
    if(token) {
      auth
        .checkToken(token)
        .then((data) => {
          setEmail(data.data.email);
          setLoggedIn(true);
          history.push("/main");
        })
        .catch((err) => {
          if (err === 401) {
            return console.log("Wrong token");
          }
        });
      api
        .getProfileInfo()
        .then(res => setCurrentUser(res))
        .catch(err => console.log(err));}
    }, [loggedIn, history])

  function handleLogin() {
    setLoggedIn(true);
  }

  function handleLogout() {
    localStorage.removeItem('token');
    setLoggedIn(false);
    history.push('/signin'); 
    history.go()
  }

  function handleLoginSubmit(e) {
    e.preventDefault();
    auth
      .authorize(email, password)
      .then((user) => {
        if (user && user.token) {
          handleLogin();
        } else {
          if (!email || !password) {
            throw new Error(
              '400 - no se ha proporcionado uno o más campos'
            );
          }
          if (!user) {
            throw new Error(
              '401 - no se ha encontrado al usuario con el correo electrónico especificado'
            );
          }
        }
      })
      .then(() => {history.push('/main'); history.go()})
      .catch((err) => console.log(err));
  };

  function redirect() {
    if(localStorage.getItem('token')) {
      history.push('/main');
    } else { 
      history.push('/signin');  
    }
  } 

  return (
    (
    <CurrentUserContext.Provider value={currentUser}>
    <div className="page">
      <Header
        email={email}
        onLogout={handleLogout}
        linkDescription={location.pathname === '/signup' ? 'Log in' : 'Sign up'}
        linkTo={location.pathname === '/signup' ? '/signin' : '/signup'}
        history={history}
      />
      <Switch>
        <ProtectedRoute exact path='/main' component={Main} onEditAvatarClick={handleEditAvatarClick} onAddPlaceClick={handleAddPlaceClick} onEditProfileClick={handleEditProfileClick} onCardClick={handleCardClick} cards={cards} onCardLike={handleCardLike} onCardDelete={handleCardDelete} />       
        <Route
          exact
          path='/signup'
          render={() =>
            localStorage.getItem('token') ? (
              <Redirect to='/main' />
            ) : (
              <Register
                email={email}
                password={password}
                setPassword={setPassword}
                handleRegisterSubmit={handleRegisterSubmit}
                setEmail={setEmail}
              />
            )
          }
        />
        <Route
          exact
          path='/signin'
          render={() =>
            localStorage.getItem('token') ? (
              <Redirect to='/main' />
            ) : (
              <Login
                loggedIn={loggedIn}
                email={email}
                password={password}
                setPassword={setPassword}
                handleLoginSubmit={handleLoginSubmit}
                setEmail={setEmail} 
              />
            )
          }
        />
        <Route exact path='/' render={redirect} />
        <Route path='*' render={redirect} />
      </Switch>

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
    </CurrentUserContext.Provider>
    )
  );
}

export default withRouter(App);
import React from 'react';
import editProfilePicturePath from '../images/profile-edit-button.svg';
import { api } from '../utils/api';
import Card from './Card';


function Main({onEditAvatarClick, onAddPlaceClick, onEditProfileClick, onCardClick}) {

  const [userInfo, setUserInfo] = React.useState({
    userName: "",
    userDescription: "",
    userAvatar: "",
    userId: ""
  })

  const [cards, setCards] = React.useState([])

//Solo 1 vez
  React.useEffect(() => {
    api
      .getProfileInfo()
      .then(res => setUserInfo({
        userName: res.name,
        userDescription: res.about,
        userAvatar: res.avatar,
        userId: res._id,
      }))
      .catch(err => console.log(err));

    api
      .getInitialCards()
      .then(res => setCards(res))
      .catch(err => console.log(err));
  }, [])

  return (
    <main className="content">
      <section className="profile-grid">
        <div className="profile-grid__avatar-box">
          <img className="profile-grid__avatar-edit" src={editProfilePicturePath} onClick={onEditAvatarClick} alt="Edit profile btn" />
          <img className="profile-grid__avatar" src={userInfo.userAvatar} alt="Profile" />
        </div>
        <div className="profile-grid__information">
          <p className="profile-grid__username">{userInfo.userName}</p>
          <button className="profile-grid__edit-button" onClick={onEditProfileClick}></button>
          <p className="profile-grid__subtitle">{userInfo.userDescription}</p>
        </div>
        <button className="profile-grid__add-button" onClick={onAddPlaceClick}></button>
      </section>

      <section className="elements-grid">
        {cards.map(card => {
          return (
            <Card card={card} key={card._id} link={card.link} name={card.name} likes={card.likes} onCardClick={onCardClick} />
  );})}
      </section>
     </main>
  );
}

export default Main;
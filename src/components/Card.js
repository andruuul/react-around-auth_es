import React from 'react';

function Card({card, onCardClick, link, name, likes}) {

  function handleClick() {//tal vez esto no va aquí
    onCardClick(card)
  }

  return ( 
    <div className="elements-grid__card">
      <img className="elements-grid__photo" alt={name} src={link} onClick={handleClick} />
      <button className="elements-grid__delete-button"></button>
      <div className="elements-grid__description">
        <p className="elements-grid__place-name">{name}</p>
        <div className="elements-grid__like-section">
          <button className="elements-grid__like-button"></button>
          <p className="elements-grid__likes">{likes.length}</p>
        </div>
      </div>
    </div>
  );
}


export default Card;
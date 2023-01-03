import React from 'react';

function ImagePopup({selectedCard, onClose}) {

  if (selectedCard) { //Tuve que hacer esto o se rompía la página porque deovlvía undefined

  return (
    <>
      <div className={`popup popup-image ${selectedCard ? 'popup_is-opened' : ''}`}>
        <button className="popup__close-button popup-image__close-button" onClick={onClose}></button>
        <img src={selectedCard.link} className="popup-image__image" alt={selectedCard.name} />
        <p className="popup-image__text">{selectedCard.name}</p>
      </div>
      <div className={`overlay_hidden ${selectedCard ? 'overlay_active' : ''}`} onClick={onClose}>
      </div>
    </>
  );
  }
}

export default ImagePopup;

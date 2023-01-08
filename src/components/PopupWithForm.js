import React from 'react';

function PopupWithForm({isOpen, onClose, name, title, buttonText, children, onSubmit}) { 
  //En serio gracias, aprendo más de ti que de nadie jajaja te agradezco porque me haces sentir que puedo y que estoy avanzando!!!
  return (
    <>
      <div className={`popup ${name}-popup ${isOpen ? 'popup_is-opened' : ''}`}>
        <div className="popup__title-and-button">
          <button className="popup__close-button" onClick={onClose}></button>
          <p className="popup__title">{title}</p>
        </div>
        <form className="popup__form" onSubmit={onSubmit} name={`${name}-form`}>
          {children}
          <button className="popup__save-button" type="submit">{buttonText}</button>
        </form>
      </div>
      <div className={`overlay_hidden ${isOpen ? 'overlay_active' : ''}`} onClick={onClose}>
      </div>
    </>
  );
}


export default PopupWithForm;
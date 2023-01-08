import React from 'react'
import PopupWithForm from './PopupWithForm'

export function AddPlacePopup({isOpen, onClose, onAddPlaceSubmit}) {

  const [title, setTitle] = React.useState('');
  const [link, setLink] = React.useState('');

  function handleTitleChange(e) {
    setTitle(e.target.value);
  }
  
  function handleLinkChange(e) {
    setLink(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onAddPlaceSubmit({
      name: title,
      link: link,
    });
  }

  return(
    <PopupWithForm title="New Place" name="new-place" buttonText="Add"
    isOpen={isOpen}
    onClose={onClose}
    onSubmit={handleSubmit}>
      <input className="popup__input" onChange={handleTitleChange} type="text" placeholder="Title" required minLength={2} maxLength={30} name="name" />
      <span className="popup__input-error inputNewPlaceTitle-input-error"></span>
      <input className="popup__input" onChange={handleLinkChange} type="url" placeholder="Image's URL" required name="link" />
      <span className="popup__input-error popup__input-error-lower inputNewPlaceURL-input-error"></span>
    </PopupWithForm>)
    
}
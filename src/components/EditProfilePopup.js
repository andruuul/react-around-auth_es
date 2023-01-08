import React from 'react'
import PopupWithForm from './PopupWithForm'

export function EditProfilePopup({isOpen, onClose, onUpdateUser, currentUser}) {

  const [name, setName] = React.useState('')
  const [description, setDescription] = React.useState('')
  
  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser]);

  function handleNameChange(e){
    setName(e.target.value)
  }

  function handleDescriptionChange(e){
    setDescription(e.target.value)
  }

  function handleSubmit(e) {
    // Evita que el navegador navegue hacia la dirección del formulario
    e.preventDefault();
  
    // Pasa los valores de los componentes gestionados al controlador externo
    onUpdateUser({
      name: name,
      about: description,
    });
  }



  return(
    <PopupWithForm title="Edit Profile" name="profile" buttonText="Save"
    isOpen={isOpen}
    onClose={onClose}
    onSubmit={handleSubmit}>
      <input className="popup__input" onChange={handleNameChange} type="text" placeholder="Name" required minLength={2} maxLength={40} name="name" />
      <span className="popup__input-error inputUsername-input-error"></span>
      <input className="popup__input" onChange={handleDescriptionChange} type="text" placeholder="About me" required minLength={2} maxLength={200} name="about" />  
      <span className="popup__input-error popup__input-error-lower inputSubtitle-input-error"></span>
    </PopupWithForm>
  )
}  

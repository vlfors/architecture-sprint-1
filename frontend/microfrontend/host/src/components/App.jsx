import React, { lazy, Suspense, useState, useEffect }  from "react";


import "../index.css";
import Main from "./Main";
import Footer from "./Footer";
import Header from "./Header";
import ProtectedRoute from "./ProtectedRoute";
import EditProfilePopup from "./EditProfilePopup.js";
import PopupWithForm from "./PopupWithForm.js";
import EditAvatarPopup from "./EditAvatarPopup.js";
import ImagePopup from "./ImagePopup.js";
import InfoTooltip from "./InfoTooltip.js";
import api from "../utils/api.js";
import * as auth from "../utils/auth.js";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import AddPlacePopup from "./AddPlacePopup.js";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from 'react-router-dom';

const Login = lazy(() => import('auth/Login').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
 })
 ); 

 const Register = lazy(() => import('auth/Register').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
 })
 ); 

 const Card = lazy(() => import('card/Card').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
 })
 ); 


const App = () => {
  const [jwt, setJwt] = useState('');
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
  React.useState(false);
const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
  React.useState(false);
const [selectedCard, setSelectedCard] = React.useState(null);
const [cards, setCards] = React.useState([]);

// В корневом компоненте App создана стейт-переменная currentUser. Она используется в качестве значения для провайдера контекста.
const [currentUser, setCurrentUser] = React.useState({});

const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false);
const [tooltipStatus, setTooltipStatus] = React.useState("");

const [isLoggedIn, setIsLoggedIn] = React.useState(false);
//В компоненты добавлены новые стейт-переменные: email — в компонент App
const [email, setEmail] = React.useState("");


const history = useHistory();

useEffect(() => {
  addEventListener("jwt-change", handleJwtsign); // Этот код добавляет подписку на нотификации о событиях изменения localStorage
  return () => removeEventListener("jwt-change", handleJwtsign) // Этот код удаляет подписку на нотификации о событиях изменения localStorage, когда в ней пропадает необходимость
}, []);

useEffect(() => {
  addEventListener("card-change", handleCardChange); // Этот код добавляет подписку на нотификации о событиях изменения localStorage
  return () => removeEventListener("card-change", handleCardChange) // Этот код удаляет подписку на нотификации о событиях изменения localStorage, когда в ней пропадает необходимость
}, []);

useEffect(() => {
  addEventListener("user-register", handleUserRegister); // Этот код добавляет подписку на нотификации о событиях изменения localStorage
  return () => removeEventListener("user-register", handleUserRegister) // Этот код удаляет подписку на нотификации о событиях изменения localStorage, когда в ней пропадает необходимость
}, []);

const handleUserRegister = event => { 
  setJwt(event.detail.jwt);
  if(event.detail === "success") {

    setTooltipStatus("success");
    setIsInfoToolTipOpen(true);
    history.push("/signin");
  } else {
    dispatchEvent(new CustomEvent("user-register", {"detail": "fail"}));
    setTooltipStatus("fail");
    setIsInfoToolTipOpen(true);
  }
}

function handleEditProfileClick() {
  setIsEditProfilePopupOpen(true);
}
function handleUpdateAvatar(avatarUpdate) {
  api
    .setUserAvatar(avatarUpdate)
    .then((newUserData) => {
      setCurrentUser(newUserData);
      closeAllPopups();
    })
    .catch((err) => console.log(err));
}

function handleUpdateUser(userUpdate) {
  api
    .setUserInfo(userUpdate)
    .then((newUserData) => {
      setCurrentUser(newUserData);
      closeAllPopups();
    })
    .catch((err) => console.log(err));
}


function onSignOut() {
  // при вызове обработчика onSignOut происходит удаление jwt
  localStorage.removeItem("jwt");
  setIsLoggedIn(false);
  // После успешного вызова обработчика onSignOut происходит редирект на /signin
  history.push("/signin");
}

function handleCardClick(card) {
  setSelectedCard(card);
}

function handleCardLike(card) {
  const isLiked = card.likes.some((i) => i._id === currentUser._id);
  api
    .changeLikeCardStatus(card._id, !isLiked)
    .then((newCard) => {
      setCards((cards) =>
        cards.map((c) => (c._id === card._id ? newCard : c))
      );
    })
    .catch((err) => console.log(err));
}

function handleAddPlaceClick() {
  setIsAddPlacePopupOpen(true);
}

function handleCardDelete(card) {
  api
    .removeCard(card._id)
    .then(() => {
      setCards((cards) => cards.filter((c) => c._id !== card._id));
    })
    .catch((err) => console.log(err));
}

function handleAddPlaceSubmit(newCard) {
  api
    .addCard(newCard)
    .then((newCardFull) => {
      setCards([newCardFull, ...cards]);
      closeAllPopups();
    })
    .catch((err) => console.log(err));
}

const handleCardChange = event => { // Эта функция получает нотификации о событиях изменения jwt
  //  setJwt(event.detail);
  switch (event.detail.action) {
    case 'click':
      handleCardClick(event.detail);
      break;
    case 'like':
      handleCardLike(event.detail);
      break;
    case 'delete':
      handleCardDelete(event.detail);
      break;
    case 'add':
      handleAddPlaceSubmit(event.detail);
      break;
    default:
      break;
  }   


};

function closeAllPopups() {
  setIsEditProfilePopupOpen(false);
  setIsAddPlacePopupOpen(false);
  setIsEditAvatarPopupOpen(false);
  setIsInfoToolTipOpen(false);
  setSelectedCard(null);
}

function handleEditProfileClick() {
  setIsEditProfilePopupOpen(true);
}

function handleAddPlaceClick() {
  setIsAddPlacePopupOpen(true);
}

function handleEditAvatarClick() {
  setIsEditAvatarPopupOpen(true);
}
const handleJwtsign = event => { // Эта функция получает нотификации о событиях изменения jwt
  // setJwt(event.detail);
  const user = event.detail.user;
  event.detail.result.then((res) => {
    setIsLoggedIn(true);
    setEmail(user);
    history.push("/");
  })
  .catch((err) => {
    setTooltipStatus("fail");
    setIsInfoToolTipOpen(true);
  })};

  React.useEffect(() => {
    api
      .getAppInfo()
      .then(([cardData, userData]) => {
        setCurrentUser(userData);
        setCards(cardData);
      })
      .catch((err) => console.log(err));
  }, []);


  React.useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          setEmail(res.data.email);
          setIsLoggedIn(true);
          history.push("/");
        })
        .catch((err) => {
          localStorage.removeItem("jwt");
          console.log(err);
        });
    }
  }, [history]);
  

  return (
   
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page__content">
      <Header email={email} 
         onSignOut={onSignOut}  
    /> 
              <Switch>
      
          <ProtectedRoute
            exact
            path="/"
            component={Main}
            cards={cards}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}

            loggedIn={isLoggedIn}
          />
  
                    <Route path="/signup">
                    <Suspense>
            <Register 
            // onRegister={onRegister} 
            />
               </Suspense>
          </Route>
          <Route path="/signin">
          <Suspense>
            <Login 
            // onLogin={onLogin}
             />
                </Suspense>
          </Route>
          <Route path="/test">
          <Suspense>
            <Login 
            // onLogin={onLogin}
             />
                </Suspense>
          </Route>
         
        </Switch>
        <Footer />
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onUpdateUser={handleUpdateUser}
          onClose={closeAllPopups}
        />
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onAddPlace={handleAddPlaceSubmit}
          onClose={closeAllPopups}
        />
        <PopupWithForm title="Вы уверены?" name="remove-card" buttonText="Да" />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onUpdateAvatar={handleUpdateAvatar}
          onClose={closeAllPopups}
        />
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <InfoTooltip
          isOpen={isInfoToolTipOpen}
          onClose={closeAllPopups}
          status={tooltipStatus}
        />
      </div>
      </CurrentUserContext.Provider>
  );
};
// const rootElement = document.getElementById("app")
// if (!rootElement) throw new Error("Failed to find the root element")

// const root = ReactDOM.createRoot(rootElement)

// root.render(<App />)
export default App;
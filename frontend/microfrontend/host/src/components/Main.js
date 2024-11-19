import React, { lazy, Suspense, useState, useEffect }  from "react";

import { CurrentUserContext } from '../contexts/CurrentUserContext';
const Card = lazy(() => import('card/Card').catch(() => {
  return { default: () => <div className='error'>Component is not available!</div> };
 })
 ); 
function Main({ cards, onEditProfile, onAddPlace, onEditAvatar }) {
  const currentUser = React.useContext(CurrentUserContext);

  const imageStyle = { backgroundImage: `url(${currentUser.avatar})` };

  return (
    <main className="content">
      <section className="profile page__section">
        <div className="profile__image" onClick={onEditAvatar} style={imageStyle}></div>
        <div className="profile__info">
          <h1 className="profile__title">{currentUser.name}</h1>
          <button className="profile__edit-button" type="button" onClick={onEditProfile}></button>
          <p className="profile__description">{currentUser.about}</p>
        </div>
        <button className="profile__add-button" type="button" onClick={onAddPlace}></button>
      </section>
      <section className="places page__section">
        <ul className="places__list">
          {cards.map((card) => (
            <Suspense fallback={<div>Loading...</div>} key={card._id}>
            <Card
              key={card._id}
              card={card}
              currentUser={currentUser}
            />
            </Suspense>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Main;

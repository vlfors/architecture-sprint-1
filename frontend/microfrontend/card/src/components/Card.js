import React from 'react';
// import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Card({ card, currentUser }) {
  const cardStyle = { backgroundImage: `url(${card.link})` };

  function handleClick() {
    // onCardClick(card);
    createAction('click');
  }

  function handleLikeClick() {
    // onCardLike(card);
    createAction('like');
  }

  function handleDeleteClick() {
    // onCardDelete(card);
    createAction('delete');
  }

  const createAction = (action) => {

    card.action = action;
    dispatchEvent(new CustomEvent("card-change", {
      detail: card  })
    );


  }



  // const currentUser = React.useContext(CurrentUserContext);

  const isLiked = card.likes.some(i => i._id === currentUser._id);
  const cardLikeButtonClassName = `card__like-button ${isLiked && 'card__like-button_is-active'}`;

  const isOwn = card.owner._id === currentUser._id;
  const cardDeleteButtonClassName = (
    `card__delete-button ${isOwn ? 'card__delete-button_visible' : 'card__delete-button_hidden'}`
  );

  return (
    <li className="places__item card">
      <div className="card__image" style={cardStyle} onClick={handleClick}>
      </div>
      <button type="button" className={cardDeleteButtonClassName} onClick={handleDeleteClick}></button>
      <div className="card__description">
        <h2 className="card__title">
          {card.name}
        </h2>
        <div className="card__likes">
          <button type="button" className={cardLikeButtonClassName} onClick={handleLikeClick}></button>
          <p className="card__like-count">{card.likes.length}</p>
        </div>
      </div>
    </li>
  );
}

export default Card;

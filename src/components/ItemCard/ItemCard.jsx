import "./ItemCard.css";
import dislikeHeart from "../../assets/State=Default.svg";
import likeHeart from "../../assets/State=Liked.svg";
import CurrentUserContext from "../../contexts/CurrentUserContext";

import { useContext } from "react";

function ItemCard({ item, onCardClick, onCardLike, isLoggedIn }) {
  const currentUser = useContext(CurrentUserContext);
  const isLiked = item.likes?.some((id) => id === currentUser?._id);

  const itemLikeButtonClassName = `card__like-btn ${
    isLiked ? "card__like-btn_active" : ""
  }`;

  const handleLike = () => {
    if (!isLoggedIn) return;
    onCardLike({ id: item._id, isLiked, user: currentUser });
  };

  const handleCardClick = () => {
    onCardClick(item);
  };

  return (
    <li className="card">
      <div className="card__name-container">
        <h2 className="card__name">{item.name}</h2>
        {isLoggedIn && (
          <button
            className={itemLikeButtonClassName}
            type="button"
            onClick={handleLike}
            aria-pressed={isLiked}
          >
            <img
              src={isLiked ? likeHeart : dislikeHeart}
              alt={isLiked ? "Unlike item" : "Like item"}
              className="card__like-icon"
            />
          </button>
        )}
      </div>
      <img
        onClick={handleCardClick}
        className="card__image"
        src={item.imageUrl}
        alt={item.name}
      />
    </li>
  );
}

export default ItemCard;

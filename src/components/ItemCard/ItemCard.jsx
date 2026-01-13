import "./ItemCard.css";
import dislikeHeart from "../../assets/State=Default.svg";
import likeHeart from "../../assets/State=Liked.svg";
import { useContext } from "react";
import CurrentUserContext from "../../contexts/CurrentUserContext";

function ItemCard({ item, onCardClick, onCardLike }) {
  const currentUser = useContext(CurrentUserContext);

  const isLiked = item.likes?.some((id) => id === currentUser?._id);

  const itemLikeButtonClassName = `like-button ${
    isLiked ? "like-button_active" : "like-button"
  }`;

  const handleLike = (e) => {
    e.stopPropagation();
    onCardLike({ id: item._id, isLiked });
  };

  const handleCardClick = () => {
    onCardClick(item);
  };

  return (
    <li className="card">
      <div className="card__name-container">
        <h2 className="card__name">{item.name}</h2>
        {currentUser && (
          <button className="card__like-btn" type="button" onClick={handleLike}>
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

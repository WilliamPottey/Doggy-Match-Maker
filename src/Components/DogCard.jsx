import { React, useEffect } from "react";
import "./DogCard.css";
import { FaHeart } from "react-icons/fa";

function DogCard(props) {
  // Adds dog id to favorites list when user selects the heart
  const selectHeart = () => {
    props.addFavorite(props.dogData.id);
  };

  // Removes the dog id from the list when the user unselects the heart
  const unSelectHeart = () => {
    props.removeFavorite(props.dogData.id);
  };

  // checks if dog is favorited to determine which heart to display
  const isDogFavorited = (list, value) => {
    if (list === null) {
      return;
    }
    const favorited = list.includes(value);
    return favorited;
  };

  return (
    <>
      <div className="box">
        <div>
          <img src={props.dogData.img} />
        </div>
        <div className="left-gap">
          <div>Name: {props.dogData.name}</div>
          <div>Age: {props.dogData.age}</div>
          <div>Breed: {props.dogData.breed}</div>
          <div>ZIP Code: {props.dogData.zip_code}</div>
          <div className="center">
            {isDogFavorited(props.favoritesList, props.dogData.id) ? (
              <div>
                <FaHeart
                  className="heart-selected"
                  onClick={() => unSelectHeart()}
                  title="Remove Favorite"
                />
              </div>
            ) : (
              <div>
                <FaHeart
                  className="heart-unselected"
                  onClick={() => selectHeart()}
                  title="Add Favorite"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default DogCard;

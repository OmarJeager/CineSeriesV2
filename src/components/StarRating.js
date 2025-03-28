import React, { useState } from "react";
import "./StarRating.css";

const StarRating = ({ onRate, initialRating = 0 }) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(initialRating);

  const handleMouseEnter = (rating) => {
    setHoveredRating(rating);
  };

  const handleMouseLeave = () => {
    setHoveredRating(0);
  };

  const handleClick = (rating) => {
    setSelectedRating(rating);
    onRate(rating); // Pass the selected rating to the parent
  };

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${
            hoveredRating >= star || selectedRating >= star ? "filled" : ""
          }`}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(star)}
        >
          ★
        </span>
      ))}
      {selectedRating > 0 && (
        <div className="rating-feedback">
          You rated this {selectedRating} star{selectedRating > 1 ? "s" : ""}!
        </div>
      )}
    </div>
  );
};

export default StarRating;
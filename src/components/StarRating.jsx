import React, { useState } from 'react';
import './StarRating.css';

const StarRating = () => {
  const [rating, setRating] = useState(0);

  const handleRating = (rate) => {
    setRating(rate);
  };

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= rating ? 'filled' : ''}`}
          onClick={() => handleRating(star)}
        >
          ★
        </span>
      ))}
      <span className="rating-number">{rating > 0 ? rating : ''}</span>
    </div>
  );
};

export default StarRating;
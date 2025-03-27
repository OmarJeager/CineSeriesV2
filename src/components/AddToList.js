import React from "react";
import { useNavigate } from "react-router-dom";
import "./AddToList.css";

const AddToList = ({ addToList, setAddToList }) => {
  const navigate = useNavigate();

  const handleRemove = (id) => {
    setAddToList((prevList) => prevList.filter((item) => item.id !== id));
  };

  return (
    <div className="add-to-list-container">
      <h1>Your List</h1>
      {addToList.length > 0 ? (
        <div className="results-grid">
          {addToList.map((item) => (
            <div
              key={item.id}
              className="result-card"
              onClick={() => navigate(`/details/${item.media_type}/${item.id}`)}
            >
              <img
                src={
                  item.poster_path
                    ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                    : "/placeholder.jpg"
                }
                alt={item.title || item.name}
              />
              <div className="result-info">
                <h3>{item.title || item.name}</h3>
                <button
                  className="remove-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove(item.id);
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No items in your list.</p>
      )}
    </div>
  );
};

export default AddToList;
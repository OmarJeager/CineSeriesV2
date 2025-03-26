import React from "react";
import { useNavigate } from "react-router-dom";
import "./Watchlist.css";

const Watchlist = ({ watchlist }) => {
  const navigate = useNavigate();

  return (
    <div className="watchlist-container">
      <h1>Your Watchlist</h1>
      {watchlist.length > 0 ? (
        <div className="results-grid">
          {watchlist.map((item) => (
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
                <p>{item.media_type === "movie" ? "Movie" : "TV Show"}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No items in your watchlist.</p>
      )}
    </div>
  );
};

export default Watchlist;
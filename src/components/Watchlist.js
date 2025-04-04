import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaTrashAlt } from "react-icons/fa";
import "./Watchlist.css";

const Watchlist = ({ watchlist, setWatchlist }) => {
  const [message, setMessage] = useState(""); // Example state
  const navigate = useNavigate();
  const [data, setData] = useState(null); // Declare hooks at the top level
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [internalWatchlist, setInternalWatchlist] = useState(watchlist);

  // Use the provided setWatchlist if available, otherwise use internal state
  const actualSetWatchlist = setWatchlist || setInternalWatchlist;
  const actualWatchlist = setWatchlist ? watchlist : internalWatchlist;

  useEffect(() => {
    if (!data) {
      // Perform side effect conditionally
      fetchData();
    }
  }, [data]);

  const fetchData = async () => {
    try {
      const response = await fetch("https://api.example.com/watchlist");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (watchlist.length === 0) {
      setMessage("Your watchlist is empty.");
    } else {
      setMessage("");
    }
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!watchlist || watchlist.length === 0) {
    return <div>{message}</div>;
  }

  // Filter watchlist based on search term
  const filteredWatchlist = actualWatchlist.filter((item) =>
    (item.title || item.name).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Separate items by category
  const movies = filteredWatchlist.filter((item) => item.media_type === "movie");
  const series = filteredWatchlist.filter((item) => item.media_type === "tv");
  const anime = filteredWatchlist.filter((item) => item.media_type === "anime");

  // Remove item from watchlist
  const handleRemove = (id, e) => {
    e.stopPropagation();

    // Add 'removing' class to the item
    const itemElement = document.getElementById(`watchlist-item-${id}`);
    if (itemElement) {
      itemElement.classList.add("removing");
    }

    // Wait for animation to complete before removing the item
    setTimeout(() => {
      actualSetWatchlist((prev) => prev.filter((item) => item.id !== id));
    }, 300); // Match the animation duration in CSS
  };

  // Handle card click
  const handleCardClick = (item) => {
    navigate(`/details/${item.media_type}/${item.id}`);
  };

  // Render category section
  const renderCategory = (items, title) => {
    if (items.length === 0) return null;

    return (
      <div className="category">
        <h2>{title}</h2>
        <div className="results-grid">
          {items.map((item) => (
            <div
              id={`watchlist-item-${item.id}`} // Add unique ID for each item
              key={item.id}
              className="result-card"
              onClick={() => handleCardClick(item)}
            >
              <div
                className="remove-icon"
                onClick={(e) => handleRemove(item.id, e)}
                aria-label={`Remove ${item.title || item.name} from watchlist`}
              >
                <FaTrashAlt />
              </div>
              <img
                src={
                  item.poster_path
                    ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                    : "/placeholder.jpg"
                }
                alt={item.title || item.name}
                onError={(e) => {
                  e.target.src = "/placeholder.jpg";
                }}
              />
              <div className="result-info">
                <h3>{item.title || item.name}</h3>
                {item.release_date && (
                  <p>{new Date(item.release_date).getFullYear()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="watchlist-container">
      <h1>Your Watchlist</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search in watchlist..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="watchlist-search"
        />
      </div>

      {/* Display all watchlist items */}
      <div className="all-watchlist-items">
        <h2>All Items</h2>
        <div className="results-grid">
          {actualWatchlist.map((item) => (
            <div
              id={`watchlist-item-${item.id}`} // Add unique ID for each item
              key={item.id}
              className="result-card"
              onClick={() => handleCardClick(item)}
            >
              <div
                className="remove-icon"
                onClick={(e) => handleRemove(item.id, e)}
                aria-label={`Remove ${item.title || item.name} from watchlist`}
              >
                <FaTrashAlt />
              </div>
              <img
                src={
                  item.poster_path
                    ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                    : "/placeholder.jpg"
                }
                alt={item.title || item.name}
                onError={(e) => {
                  e.target.src = "/placeholder.jpg";
                }}
              />
              <div className="result-info">
                <h3>{item.title || item.name}</h3>
                {item.release_date && (
                  <p>{new Date(item.release_date).getFullYear()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredWatchlist.length > 0 ? (
        <>
          {renderCategory(movies, "Movies")}
          {renderCategory(series, "TV Series")}
          {renderCategory(anime, "Anime")}
        </>
      ) : (
        <div className="empty-watchlist">
          <p>No items in your watchlist.</p>
          <button
            className="browse-button"
            onClick={() => navigate("/browse")}
          >
            Browse Content
          </button>
        </div>
      )}
    </div>
  );
};

export default Watchlist;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Icon for profile
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase auth import
import "./Home.css"; // Import the CSS file for styling

const Home = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [userEmail, setUserEmail] = useState(null); // State to store user email
  const navigate = useNavigate();

  const API_KEY = "0b5b088bab00665e8e996c070b4e5991"; // Replace with your actual API key

  // Check if the user is authenticated and set the email
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email); // Set user email on successful authentication
      } else {
        navigate("/login"); // Redirect to login if user is not authenticated
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Debounced search function
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query) {
        searchSeries();
      } else {
        setSuggestions([]);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const searchSeries = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&query=${query}`
      );
      setSuggestions(response.data.results);
    } catch (error) {
      console.error("Error fetching series:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (show) => {
    navigate(`/series/${show.id}`);
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
  };

  return (
    <div className="home-container">
      {/* Top Center Search Input */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for series"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        {query && (
          <div className="suggestions-dropdown">
            {isLoading ? (
              <div className="loading-message">Loading...</div>
            ) : suggestions.length > 0 ? (
              suggestions.map((show) => (
                <div
                  key={show.id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(show)}
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w200${show.poster_path}`}
                    alt={show.name}
                    className="suggestion-image"
                  />
                  <span className="suggestion-title">{show.name}</span>
                </div>
              ))
            ) : (
              <div className="no-data-message">No data found</div>
            )}
          </div>
        )}
      </div>

      {/* Profile Icon */}
      <div className="profile-icon" onClick={toggleProfile}>
        <FaUserCircle size={32} />
        {showProfile && (
          <div className="profile-dropdown">
            {userEmail ? (
              <p>Email: {userEmail}</p>
            ) : (
              <p>Loading...</p> // Show loading until the email is fetched
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

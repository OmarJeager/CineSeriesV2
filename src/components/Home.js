import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaSearch, FaBookmark, FaPlusCircle } from "react-icons/fa";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./Home.css";

const Home = ({ watchlist, setWatchlist, addToList, setAddToList }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularTVShows, setPopularTVShows] = useState([]);
  const [randomMovies, setRandomMovies] = useState([]);
  const [randomTVShows, setRandomTVShows] = useState([]);
  const [randomAnime, setRandomAnime] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);
  const [recentTVShows, setRecentTVShows] = useState([]);
  const [recentPeople, setRecentPeople] = useState([]);
  const navigate = useNavigate();
  const API_KEY = "0b5b088bab00665e8e996c070b4e5991";

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const searchData = async (searchQuery) => {
    if (!searchQuery) {
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}&query=${searchQuery}`
      );
      setSuggestions(response.data.results.filter(
        item => item.media_type === "movie" || item.media_type === "tv"
      ));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      searchData(query);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  useEffect(() => {
    const fetchPopularContent = async () => {
      try {
        const [moviesResponse, tvResponse] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`),
          axios.get(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}`)
        ]);
        setPopularMovies(moviesResponse.data.results);
        setPopularTVShows(tvResponse.data.results);
      } catch (error) {
        console.error("Error fetching popular content:", error);
      }
    };

    fetchPopularContent();
  }, []);

  useEffect(() => {
    const fetchRandomContent = async () => {
      try {
        const [moviesResponse, tvResponse, animeResponse] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&sort_by=popularity.desc&page=${Math.floor(Math.random() * 500) + 1}`),
          axios.get(`https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&sort_by=popularity.desc&page=${Math.floor(Math.random() * 500) + 1}`),
          axios.get(`https://api.jikan.moe/v4/anime?page=${Math.floor(Math.random() * 100) + 1}`)
        ]);
        setRandomMovies(moviesResponse.data.results.slice(0, 5));
        setRandomTVShows(tvResponse.data.results.slice(0, 5));
        setRandomAnime(animeResponse.data.data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching random content:", error);
      }
    };

    fetchRandomContent();
    
  }, []);
  useEffect(() => {
    const fetchRecentContent = async () => {
      try {
        const [moviesResponse, tvResponse, peopleResponse] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`),
          axios.get(`https://api.themoviedb.org/3/tv/airing_today?api_key=${API_KEY}`),
          axios.get(`https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}`),
        ]);
        setRecentMovies(moviesResponse.data.results.slice(0, 5));
        setRecentTVShows(tvResponse.data.results.slice(0, 5));
        setRecentPeople(peopleResponse.data.results.slice(0, 5));
      } catch (error) {
        console.error("Error fetching recent content:", error);
      }
    };

    fetchRecentContent();
  }, []);

  const addToWatchlist = (item) => {
    setWatchlist((prevWatchlist) => {
      // Avoid duplicates
      if (prevWatchlist.some((watchlistItem) => watchlistItem.id === item.id)) {
        setSuccessMessage("Item is already in the Watchlist!");
        return prevWatchlist;
      }
      setSuccessMessage("Saved to Watchlist!");
      return [...prevWatchlist, item];
    });

    // Hide the success message after 3 seconds
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Add a helper function to check if an item is in the watchlist
  const isInWatchlist = (item) => {
    return watchlist.some((watchlistItem) => watchlistItem.id === item.id);
  };

  const addToCustomList = (item) => {
    setAddToList((prevList) => {
      if (prevList.some((listItem) => listItem.id === item.id)) {
        setSuccessMessage("Item is already in the list!");
        return prevList;
      }
      setSuccessMessage("Added to List!");
      return [...prevList, item];
    });

    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const isInCustomList = (item) => {
    return addToList.some((listItem) => listItem.id === item.id);
  };

  return (
    <div className="home-container">
      {/* Success Message */}
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo" onClick={() => navigate("/")}>
          CineVerse
          </div>
          
          <div className="nav-links">
            <div className="nav-item">
              <button onClick={() => navigate("/movies")}>Movies</button>
              <div className="dropdown">
                {recentMovies.map((movie) => (
                  <div
                    key={movie.id}
                    className="dropdown-item"
                    onClick={() => navigate(`/details/movie/${movie.id}`)}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                      alt={movie.title}
                    />
                    <p>{movie.title}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="nav-item">
              <button onClick={() => navigate("/tv-shows")}>TV Shows</button>
              <div className="dropdown">
                {recentTVShows.map((tv) => (
                  <div
                    key={tv.id}
                    className="dropdown-item"
                    onClick={() => navigate(`/details/tv/${tv.id}`)}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w200${tv.poster_path}`}
                      alt={tv.name}
                    />
                    <p>{tv.name}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="nav-item">
              <button onClick={() => navigate("/people")}>People</button>
              <div className="dropdown">
                {recentPeople.map((person) => (
                  <div
                    key={person.id}
                    className="dropdown-item"
                    onClick={() => navigate(`/details/person/${person.id}`)}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w200${person.profile_path}`}
                      alt={person.name}
                    />
                    <p>{person.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search for movies, TV shows, people..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div className="watchlist-icon" onClick={() => navigate("/watchlist")}>
            <FaBookmark size={28} title="Watchlist" />
          </div>

          <div className="add-to-list-icon" onClick={() => navigate("/add-to-list")}>
            <FaPlusCircle size={28} title="Add to List" />
          </div>

          <div className="profile-section" onClick={() => setShowProfile(!showProfile)}>
            <FaUserCircle size={28} />
            {showProfile && (
              <div className="profile-dropdown">
                <p>{userEmail}</p>
                <button onClick={() => getAuth().signOut()}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="main-content">
        {query && (
          <div className="search-results">
            {isLoading ? (
              <div className="loading">Loading...</div>
            ) : suggestions.length > 0 ? (
              <div className="results-grid">
                {suggestions.map((item) => (
                  <div
                    key={item.id}
                    className="result-card"
                    onClick={() => navigate(`/details/${item.media_type}/${item.id}`)}
                  >
                    <div className="image-container">
                      <img
                        src={
                          item.poster_path
                            ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
                            : "/placeholder.jpg"
                        }
                        alt={item.title || item.name}
                      />
                      {/* Add Watchlist Icon */}
                      <button
                        className={`watchlist-icon ${isInWatchlist(item) ? "in-watchlist" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent navigation
                          addToWatchlist(item);
                        }}
                      >
                        <FaBookmark title={isInWatchlist(item) ? "In Watchlist" : "Add to Watchlist"} />
                      </button>
                      {/* Add to List Icon */}
                      <button
                        className={`add-to-list-icon ${isInCustomList(item) ? "in-list" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCustomList(item);
                        }}
                      >
                        <FaPlusCircle title={isInCustomList(item) ? "In List" : "Add to List"} />
                      </button>
                    </div>
                    <div className="result-info">
                      <h3>{item.title || item.name}</h3>
                      <p>
                        {item.media_type === "movie" ? "Movie" : "TV Show"} •{" "}
                        {item.release_date?.substring(0, 4) || item.first_air_date?.substring(0, 4)}
                      </p>
                      <span className="rating">★ {item.vote_average?.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <h2>No results found for "{query}"</h2>
                <p>Please try a different search term.</p>
              </div>
            )}
          </div>
        )}

        {!query && (
          <>
            <div className="hero-section">
              <h1>Welcome to CineVerse</h1>
              <p>Millions of movies, TV shows, and people to discover. Explore now.</p>
            </div>

            <div className="explore-section">
              <h2>Explore Movies</h2>
              <div className="results-grid">
                {popularMovies.map((movie) => (
                  <div
                    key={movie.id}
                    className="result-card"
                    onClick={() => navigate(`/details/movie/${movie.id}`)}
                  >
                    <div className="image-container">
                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                            : "/placeholder.jpg"
                        }
                        alt={movie.title}
                      />
                      {/* Add Watchlist Icon */}
                      <button
                        className={`watchlist-icon ${isInWatchlist(movie) ? "in-watchlist" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent navigation
                          addToWatchlist(movie);
                        }}
                      >
                        <FaBookmark title={isInWatchlist(movie) ? "In Watchlist" : "Add to Watchlist"} />
                      </button>
                      {/* Add to List Icon */}
                      <button
                        className={`add-to-list-icon ${isInCustomList(movie) ? "in-list" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCustomList(movie);
                        }}
                      >
                        <FaPlusCircle title={isInCustomList(movie) ? "In List" : "Add to List"} />
                      </button>
                    </div>
                    <div className="result-info">
                      <h3>{movie.title}</h3>
                      <p>Release Year: {movie.release_date?.substring(0, 4)}</p>
                      <span className="rating">★ {movie.vote_average?.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <h2>Explore TV Shows</h2>
              <div className="results-grid">
                {popularTVShows.map((tv) => (
                  <div
                    key={tv.id}
                    className="result-card"
                    onClick={() => navigate(`/details/tv/${tv.id}`)}
                  >
                    <div className="image-container">
                      <img
                        src={
                          tv.poster_path
                            ? `https://image.tmdb.org/t/p/w300${tv.poster_path}`
                            : "/placeholder.jpg"
                        }
                        alt={tv.name}
                      />
                      {/* Add Watchlist Icon */}
                      <button
                        className={`watchlist-icon ${isInWatchlist(tv) ? "in-watchlist" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent navigation
                          addToWatchlist(tv);
                        }}
                      >
                        <FaBookmark title={isInWatchlist(tv) ? "In Watchlist" : "Add to Watchlist"} />
                      </button>
                      {/* Add to List Icon */}
                      <button
                        className={`add-to-list-icon ${isInCustomList(tv) ? "in-list" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCustomList(tv);
                        }}
                      >
                        <FaPlusCircle title={isInCustomList(tv) ? "In List" : "Add to List"} />
                      </button>
                    </div>
                    <div className="result-info">
                      <h3>{tv.name}</h3>
                      <p>First Air Year: {tv.first_air_date?.substring(0, 4)}</p>
                      <span className="rating">★ {tv.vote_average?.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="random-section">
              <h2>Random Movies</h2>
              <div className="results-grid">
                {randomMovies.map((movie) => (
                  <div
                    key={movie.id}
                    className="result-card"
                    onClick={() => navigate(`/details/movie/${movie.id}`)}
                  >
                    <img
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                          : "/placeholder.jpg"
                      }
                      alt={movie.title}
                    />
                    <div className="result-info">
                      <h3>{movie.title}</h3>
                      <p>Release Year: {movie.release_date?.substring(0, 4)}</p>
                      <span className="rating">★ {movie.vote_average?.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <h2>Random TV Shows</h2>
              <div className="results-grid">
                {randomTVShows.map((tv) => (
                  <div
                    key={tv.id}
                    className="result-card"
                    onClick={() => navigate(`/details/tv/${tv.id}`)}
                  >
                    <img
                      src={
                        tv.poster_path
                          ? `https://image.tmdb.org/t/p/w300${tv.poster_path}`
                          : "/placeholder.jpg"
                      }
                      alt={tv.name}
                    />
                    <div className="result-info">
                      <h3>{tv.name}</h3>
                      <p>First Air Year: {tv.first_air_date?.substring(0, 4)}</p>
                      <span className="rating">★ {tv.vote_average?.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <h2>Random Anime</h2>
              <div className="results-grid">
                {randomAnime.map((anime) => (
                  <div
                    key={anime.mal_id}
                    className="result-card"
                    onClick={() => window.open(anime.url, "_blank")}
                  >
                    <div className="image-container">
                      <img
                        src={anime.images.jpg.image_url || "/placeholder.jpg"}
                        alt={anime.title}
                      />
                      {/* Add Watchlist Icon */}
                      <button
                        className={`watchlist-icon ${isInWatchlist(anime) ? "in-watchlist" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent navigation
                          addToWatchlist(anime);
                        }}
                      >
                        <FaBookmark title={isInWatchlist(anime) ? "In Watchlist" : "Add to Watchlist"} />
                      </button>
                      {/* Add to List Icon */}
                      <button
                        className={`add-to-list-icon ${isInCustomList(anime) ? "in-list" : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCustomList(anime);
                        }}
                      >
                        <FaPlusCircle title={isInCustomList(anime) ? "In List" : "Add to List"} />
                      </button>
                    </div>
                    <div className="result-info">
                      <h3>{anime.title}</h3>
                      <p>Episodes: {anime.episodes || "N/A"}</p>
                      <span className="rating">★ {anime.score?.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
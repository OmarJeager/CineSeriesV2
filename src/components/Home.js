import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaSearch } from "react-icons/fa";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./Home.css";

const Home = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularTVShows, setPopularTVShows] = useState([]);
  const [randomMovies, setRandomMovies] = useState([]);
  const [randomTVShows, setRandomTVShows] = useState([]);
  const [randomAnime, setRandomAnime] = useState([]);
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

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo" onClick={() => navigate("/")}>
          CineVerse
          </div>
          
          <div className="nav-links">
            <button onClick={() => navigate("/movies")}>Movies</button>
            <button onClick={() => navigate("/tv-shows")}>TV Shows</button>
            <button onClick={() => navigate("/people")}>People</button>
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
                      <p
                        className="overview"
                        onClick={() => navigate(`/details/${item.media_type}/${item.id}`)}
                        style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                      >
                        Overview: {item.overview ? item.overview.substring(0, 100) + "..." : "No overview available"}
                      </p>
                      <p>
                        {item.media_type === "movie" ? "Movie" : "TV Show"} •{" "}
                        {item.release_date?.substring(0,4) || item.first_air_date?.substring(0,4)}
                      </p>
                      <span className="rating">
                        ★ {item.vote_average?.toFixed(1)}
                      </span>
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

              <h2>Explore TV Shows</h2>
              <div className="results-grid">
                {popularTVShows.map((tv) => (
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
                    <img
                      src={anime.images.jpg.image_url || "/placeholder.jpg"}
                      alt={anime.title}
                    />
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
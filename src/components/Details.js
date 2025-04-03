import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactPlayer from "react-player";
import { motion, AnimatePresence } from "framer-motion";
import "./Details.css";

const Details = () => {
  const { mediaType, id } = useParams();
  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState([]);
  const [videos, setVideos] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [seasonDetails, setSeasonDetails] = useState(null);
  const [loadingSeason, setLoadingSeason] = useState(false);
  const [expandedOverview, setExpandedOverview] = useState(false);
  const navigate = useNavigate();
  const API_KEY = "0b5b088bab00665e8e996c070b4e5991";

  useEffect(() => {
    const fetchData = async () => {
      try {
        setDetails(null);
        setSeasonDetails(null);
        
        const detailsResponse = await axios.get(
          `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${API_KEY}`
        );

        const creditsResponse = await axios.get(
          `https://api.themoviedb.org/3/${mediaType}/${id}/credits?api_key=${API_KEY}`
        );

        const videosResponse = await axios.get(
          `https://api.themoviedb.org/3/${mediaType}/${id}/videos?api_key=${API_KEY}`
        );

        const similarResponse = await axios.get(
          `https://api.themoviedb.org/3/${mediaType}/${id}/similar?api_key=${API_KEY}`
        );

        setDetails(detailsResponse.data);
        setCredits(creditsResponse.data.cast);
        setVideos(videosResponse.data.results);
        setSimilar(similarResponse.data.results);

        // For TV shows, fetch seasons data
        if (mediaType === "tv") {
          setSeasons(detailsResponse.data.seasons);
          // Load first season details by default
          if (detailsResponse.data.seasons.length > 0) {
            fetchSeasonDetails(detailsResponse.data.seasons[0].season_number);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        navigate("/");
      }
    };

    fetchData();
  }, [id, mediaType, navigate]);

  const fetchSeasonDetails = async (seasonNumber) => {
    try {
      setLoadingSeason(true);
      const response = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${API_KEY}`
      );
      setSeasonDetails(response.data);
      setLoadingSeason(false);
    } catch (error) {
      console.error("Error fetching season details:", error);
      setLoadingSeason(false);
    }
  };

  const handleSeasonChange = (seasonNumber) => {
    setSelectedSeason(seasonNumber);
    fetchSeasonDetails(seasonNumber);
  };

  const toggleWatchlist = () => {
    if (watchlist.some(item => item.id === details.id)) {
      setWatchlist(watchlist.filter(item => item.id !== details.id));
    } else {
      setWatchlist([...watchlist, details]);
    }
  };

  const toggleOverview = () => {
    setExpandedOverview(!expandedOverview);
  };

  if (!details) return (
    <motion.div 
      className="loading"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="spinner"></div>
      Loading...
    </motion.div>
  );

  return (
    <motion.div 
      className="details-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <motion.div
        className="hero-section"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${details.backdrop_path})`,
        }}
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <motion.img
            src={`https://image.tmdb.org/t/p/w300${details.poster_path}`}
            alt={details.title || details.name}
            className="poster"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          />
          <motion.div 
            className="hero-info"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <h1>{details.title || details.name}</h1>
            <div className="meta-info">
              <span>{new Date(details.release_date || details.first_air_date).getFullYear()}</span>
              {details.genres?.map((genre) => (
                <motion.span 
                  key={genre.id}
                  whileHover={{ scale: 1.05 }}
                >
                  {genre.name}
                </motion.span>
              ))}
              {details.runtime && (
                <span>
                  {Math.floor(details.runtime / 60)}h {details.runtime % 60}m
                </span>
              )}
              {mediaType === "tv" && (
                <span>
                  {details.number_of_seasons} Season{details.number_of_seasons !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <div className="rating">
              <motion.div 
                className="rating-circle"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                {details.vote_average?.toFixed(1)}
              </motion.div>
              <span>/ 10</span>
            </div>
            <h3>Overview</h3>
            <motion.p 
              className={`overview ${expandedOverview ? "expanded" : ""}`}
              onClick={() => setExpandedOverview(!expandedOverview)} // Only toggle expanded state
              whileHover={{ color: "#f5f5f5" }}
            >
              {details.overview}
              {!expandedOverview && details.overview.length > 200 && (
                <span 
                  className="read-more" 
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent toggling
                    navigate(`/details/${mediaType}/${id}`); // Navigate to details
                  }}
                >
                  ... Read More
                </span>
              )}
            </motion.p>
            <motion.button
              className={`watchlist-btn ${
                watchlist.some(item => item.id === details.id) ? "added" : ""
              }`}
              onClick={toggleWatchlist}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {watchlist.some(item => item.id === details.id)
                ? "Remove from Watchlist"
                : "Add to Watchlist"}
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Seasons Selector for TV Shows */}
      {mediaType === "tv" && seasons.length > 0 && (
        <motion.div 
          className="seasons-section"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2>Seasons</h2>
          <div className="season-selector">
            {seasons.map((season) => (
              <motion.div
                key={season.id}
                className={`season-tab ${selectedSeason === season.season_number ? "active" : ""}`}
                onClick={() => handleSeasonChange(season.season_number)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {season.season_number === 0 ? "Specials" : `Season ${season.season_number}`}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Season Details Section */}
      {mediaType === "tv" && seasonDetails && (
        <motion.div 
          className="season-details-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {loadingSeason ? (
            <div className="loading-season">
              <div className="spinner"></div>
              Loading season details...
            </div>
          ) : (
            <>
              <div className="season-header">
                <h3>
                  {seasonDetails.name} ({new Date(seasonDetails.air_date).getFullYear()})
                </h3>
                <p>{seasonDetails.overview}</p>
                <div className="season-meta">
                  <span>{seasonDetails.episodes.length} Episodes</span>
                </div>
              </div>

              <div className="episodes-grid">
                {seasonDetails.episodes.map((episode) => (
                  <motion.div 
                    key={episode.id}
                    className="episode-card"
                    whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="episode-image">
                      {episode.still_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
                          alt={episode.name}
                        />
                      ) : (
                        <div className="episode-placeholder">No Image</div>
                      )}
                      <div className="episode-number">Episode {episode.episode_number}</div>
                    </div>
                    <div className="episode-info">
                      <h4>{episode.name}</h4>
                      <div className="episode-meta">
                        <span>Rating: {episode.vote_average?.toFixed(1)}</span>
                        <span>Runtime: {episode.runtime || 'N/A'} min</span>
                      </div>
                      <p className="episode-overview">
                        {episode.overview || "No overview available."}
                      </p>
                      <div className="air-date">
                        Aired: {new Date(episode.air_date).toLocaleDateString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Cast Section */}
      <motion.div 
        className="cast-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
      >
        <h2>Cast</h2>
        <div className="cast-scroll">
          {credits.slice(0, 10).map((cast) => (
            <motion.div 
              key={cast.id}
              className="cast-card"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={
                  cast.profile_path
                    ? `https://image.tmdb.org/t/p/w200${cast.profile_path}`
                    : "/placeholder.jpg"
                }
                alt={cast.name}
              />
              <p>{cast.name}</p>
              <p className="character">{cast.character}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Videos Section */}
      {videos.length > 0 && (
        <motion.div 
          className="videos-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <h2>Videos</h2>
          <div className="videos-grid">
            {videos
              .filter((video) => video.site === "YouTube")
              .map((video) => (
                <motion.div 
                  key={video.id}
                  className="video-card"
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ReactPlayer
                    url={`https://www.youtube.com/watch?v=${video.key}`}
                    width="100%"
                    height="100%"
                    controls
                    light={`https://img.youtube.com/vi/${video.key}/hqdefault.jpg`}
                  />
                  <p className="video-title">{video.name}</p>
                </motion.div>
              ))}
          </div>
        </motion.div>
      )}

      {/* Similar Section */}
      <motion.div 
        className="similar-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <h2>More Like This</h2>
        <div className="similar-scroll">
          {similar.map((item) => (
            <motion.div
              key={item.id}
              className="similar-card"
              onClick={() => navigate(`/details/${mediaType}/${item.id}`)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={
                  item.poster_path
                    ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                    : "/placeholder.jpg"
                }
                alt={item.title || item.name}
              />
              <p>{item.title || item.name}</p>
              <div className="similar-meta">
                <span>
                  {item.release_date || item.first_air_date
                    ? new Date(item.release_date || item.first_air_date).getFullYear()
                    : "N/A"}
                </span>
                <span>★ {item.vote_average?.toFixed(1)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Details;
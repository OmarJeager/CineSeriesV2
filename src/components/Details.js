import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Details.css";

const API_KEY = "0b5b088bab00665e8e996c070b4e5991";

const Details = () => {
  const { mediaType, id } = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [seasonDetails, setSeasonDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVibe, setSelectedVibe] = useState([]);
  const [userRating, setUserRating] = useState(null);
  const [showRatingModal, setShowRatingModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [detailsRes, creditsRes, recRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${API_KEY}`),
          axios.get(`https://api.themoviedb.org/3/${mediaType}/${id}/credits?api_key=${API_KEY}`),
          axios.get(`https://api.themoviedb.org/3/${mediaType}/${id}/recommendations?api_key=${API_KEY}`),
        ]);

        setDetails(detailsRes.data);
        setCredits(creditsRes.data);
        setRecommendations(recRes.data.results);

        if (mediaType === "tv") {
          setSeasons(detailsRes.data.seasons);
          const seasonRes = await axios.get(
            `https://api.themoviedb.org/3/tv/${id}/season/${selectedSeason}?api_key=${API_KEY}`
          );
          setSeasonDetails(seasonRes.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [mediaType, id, selectedSeason]);

  const handleVibeSelect = (emoji) => {
    setSelectedVibe((prev) =>
      prev.includes(emoji) ? prev.filter((e) => e !== emoji) : [...prev, emoji]
    );
  };

  const handleRating = (rating) => {
    setUserRating(rating);
    setShowRatingModal(false);
    // Add API call to submit rating here
  };

  if (isLoading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!details) return <div className="error">No details found.</div>;

  return (
    <div className="details-container" style={{
      background: details.backdrop_path
        ? `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), 
           url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${details.backdrop_path})`
        : "#0d253f",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
      <button onClick={() => navigate(-1)} className="back-button">
        &larr; Back
      </button>

      <div className="series-header">
        <h1>
          {details.name || details.title}
          <span className="release-year">
            ({new Date(details.first_air_date || details.release_date).getFullYear()})
          </span>
        </h1>
        <div className="series-meta">
          <span className="certification">{details.content_rating || "TV-MA"}</span>
          <span className="runtime">{details.episode_run_time?.[0] || details.runtime}m</span>
          {mediaType === "tv" && (
            <>
              <span className="seasons">{details.number_of_seasons} Seasons</span>
              <span className="episodes">{details.number_of_episodes} Episodes</span>
            </>
          )}
        </div>
        <div className="genres">
          {details.genres?.map((genre) => (
            <span key={genre.id} className="genre">
              {genre.name}
            </span>
          ))}
        </div>
      </div>

      <div className="details-content">
        <div className="poster-section">
          <img
            src={
              details.poster_path
                ? `https://image.tmdb.org/t/p/w300${details.poster_path}`
                : "/placeholder.jpg"
            }
            alt={details.title || details.name}
            className="poster-image"
          />
        </div>

        <div className="info-section">
          <div className="content-score-section">
            <div className="score-circle">
              <div className="score-percent">
                {Math.round(details.vote_average * 10)}%
              </div>
            </div>
            <h3>User Score</h3>
            <button
              className="rate-button"
              onClick={() => setShowRatingModal(true)}
            >
              {userRating ? `Your Rating: ${userRating}` : "Rate This"}
            </button>
          </div>

          {showRatingModal && (
            <div className="rating-modal-overlay">
              <div className="rating-modal">
                <h3>What did you think of {details.name || details.title}?</h3>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                    <button
                      key={star}
                      className={`star ${userRating >= star ? "active" : ""}`}
                      onClick={() => handleRating(star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <button
                  className="clear-rating"
                  onClick={() => setUserRating(null)}
                >
                  Clear Rating
                </button>
              </div>
            </div>
          )}

          <section className="vibe-section">
            <h2>How did {details.name || details.title} make you feel?</h2>
            <div className="vibe-emojis">
              {["😊", "🤩", "😲", "😢", "🤢", "😨", "😠"].map((emoji) => (
                <button
                  key={emoji}
                  className={`vibe-emoji ${selectedVibe.includes(emoji) ? "selected" : ""}`}
                  onClick={() => handleVibeSelect(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </section>

          <div className="overview-section">
            <h3>Overview</h3>
            <p>{details.overview}</p>
          </div>

          {mediaType === "tv" && (
            <div className="season-selector-container">
              <div className="season-header">
                <h2>Seasons</h2>
                <div className="season-controls">
                  <select
                    className="season-dropdown"
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(e.target.value)}
                  >
                    {seasons.map((season) => (
                      <option
                        key={season.season_number}
                        value={season.season_number}
                      >
                        Season {season.season_number}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {seasonDetails && (
                <div className="episode-grid">
                  {seasonDetails.episodes.map((episode) => (
                    <div key={episode.id} className="episode-card">
                      <div className="episode-image">
                        <img
                          src={
                            episode.still_path
                              ? `https://image.tmdb.org/t/p/w400${episode.still_path}`
                              : "/placeholder.jpg"
                          }
                          alt={episode.name}
                        />
                        <span className="episode-number">
                          Episode {episode.episode_number}
                        </span>
                      </div>
                      <div className="episode-info">
                        <h3>{episode.name}</h3>
                        <p className="air-date">
                          Aired {new Date(episode.air_date).toLocaleDateString()}
                        </p>
                        <p className="overview">{episode.overview}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="sidebar">
          <div className="creator-section">
            <h3>Creator</h3>
            <p>{credits?.crew.find((member) => member.job === "Creator")?.name || "N/A"}</p>
          </div>

          <div className="series-cast">
            <h3>Series Cast</h3>
            <div className="cast-list">
              {credits?.cast.slice(0, 5).map((member) => (
                <div key={member.id} className="cast-member">
                  <img
                    src={
                      member.profile_path
                        ? `https://image.tmdb.org/t/p/w138_and_h175_face${member.profile_path}`
                        : "/placeholder.jpg"
                    }
                    alt={member.name}
                  />
                  <p className="cast-name">{member.name}</p>
                  <p className="cast-character">{member.character}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="keywords-section">
            <h3>Keywords</h3>
            <div className="keywords-list">
              {details.keywords?.keywords?.map((keyword) => (
                <span key={keyword.id} className="keyword">
                  {keyword.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
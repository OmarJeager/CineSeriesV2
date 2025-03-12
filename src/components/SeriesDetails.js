import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // Import the auth instance
import "./SeriesDetails.css"; // Import the CSS file for styling

const SeriesDetails = () => {
  const { id } = useParams(); // Get the series ID from the URL
  const [series, setSeries] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [filteredEpisodes, setFilteredEpisodes] = useState([]);
  const [seasonSearch, setSeasonSearch] = useState(""); // State for season search
  const [episodeSearch, setEpisodeSearch] = useState(""); // State for episode search
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is authenticated
    const user = auth.currentUser;
    if (!user) {
      // If not authenticated, redirect to the signup page
      navigate("/signup", {
        state: { error: "You must sign up to access this page." },
      });
      return; // Prevent further execution if not authenticated
    }

    const fetchSeriesDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}?api_key=0b5b088bab00665e8e996c070b4e5991`
        );
        setSeries(response.data);
      } catch (error) {
        console.error("Error fetching series details:", error);
      }
    };

    fetchSeriesDetails();
  }, [id, navigate]);

  const handleSeasonSelect = async (seasonNumber) => {
    // Fetch the selected season's episodes
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=0b5b088bab00665e8e996c070b4e5991`
      );
      setEpisodes(response.data.episodes); // Store episodes of the selected season
      setSelectedSeason(seasonNumber); // Update the selected season
      setFilteredEpisodes(response.data.episodes); // Initialize with all episodes
    } catch (error) {
      console.error("Error fetching season details:", error);
    }
  };

  const handleSeasonSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSeasonSearch(searchValue);
  };

  const handleEpisodeSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setEpisodeSearch(searchValue);

    // Filter episodes based on search
    const filtered = episodes.filter(
      (episode) =>
        episode.name.toLowerCase().includes(searchValue) ||
        (episode.overview && episode.overview.toLowerCase().includes(searchValue))
    );
    setFilteredEpisodes(filtered);
  };

  if (!series) return <div className="loading">Loading...</div>;

  return (
    <div className="series-details-container">
      {/* Poster Image (Animated from left) */}
      <div className="poster-container">
        <img
          src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
          alt={series.name}
          className="poster-image"
        />
      </div>

      {/* Text Content (Animated from right) */}
      <div className="content-container">
        <h1 className="series-title">{series.name}</h1>
        <p className="series-overview">{series.overview}</p>

        {/* Number of Seasons and Episodes */}
        <div className="series-stats">
          <div className="season-count">
            <strong>Number of Seasons: </strong>
            {series.number_of_seasons || "N/A"}
          </div>
          <div className="episode-count">
            <strong>Number of Episodes: </strong>
            {series.number_of_episodes || "N/A"}
          </div>
        </div>

        {/* Search for Seasons */}
        <div className="search-group">
          <div className="season-search">
            <label htmlFor="season-search">Search Seasons: </label>
            <input
              type="text"
              id="season-search"
              value={seasonSearch}
              onChange={handleSeasonSearch}
              placeholder="Search for a season..."
              className="search-input"
            />
          </div>

          {/* Seasons Dropdown */}
          <div className="season-select">
            <label htmlFor="season-select">Select Season: </label>
            <select
              id="season-select"
              onChange={(e) => handleSeasonSelect(e.target.value)}
              defaultValue=""
              className="search-select"
            >
              <option value="" disabled>
                Select a season
              </option>
              {series.seasons &&
                series.seasons
                  .filter((season) =>
                    season.name.toLowerCase().includes(seasonSearch.toLowerCase())
                  )
                  .map((season) => (
                    <option key={season.id} value={season.season_number}>
                      Season {season.season_number + 1} {/* Adjust to start from 1 */}
                    </option>
                  ))}
            </select>
          </div>
        </div>

        {/* Search for Episodes */}
        <div className="search-group">
          <div className="episode-search">
            <label htmlFor="episode-search">Search Episodes: </label>
            <input
              type="text"
              id="episode-search"
              value={episodeSearch}
              onChange={handleEpisodeSearch}
              placeholder="Search for an episode..."
              className="search-input"
            />
          </div>
        </div>

        {/* Episodes for the selected season */}
        {selectedSeason !== null && filteredEpisodes.length > 0 && (
          <div className="episodes-list">
            <h3>Episodes in Season {selectedSeason + 1}:</h3>
            <ul>
              {filteredEpisodes.map((episode) => (
                <li key={episode.id} className="episode-item">
                  <strong>Episode {episode.episode_number}: </strong>
                  {episode.name} - {episode.overview || "No description available."}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeriesDetails;
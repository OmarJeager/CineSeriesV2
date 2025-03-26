import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ReactPlayer from "react-player";
import "./Details.css";

const Details = () => {
  const { mediaType, id } = useParams();
  const [details, setDetails] = useState(null);
  const [credits, setCredits] = useState([]);
  const [videos, setVideos] = useState([]);
  const [similar, setSimilar] = useState([]);
  const navigate = useNavigate();
  const API_KEY = "0b5b088bab00665e8e996c070b4e5991";

  useEffect(() => {
    const fetchData = async () => {
      try {
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
      } catch (error) {
        console.error("Error fetching data:", error);
        navigate("/");
      }
    };

    fetchData();
  }, [id, mediaType, navigate]);

  if (!details) return <div className="loading">Loading...</div>;

  return (
    <div className="details-container">
      {/* Hero Section */}
      <div className="hero-section" style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${details.backdrop_path})`
      }}>
        <div className="hero-content">
          <img
            src={`https://image.tmdb.org/t/p/w300${details.poster_path}`}
            alt={details.title || details.name}
            className="poster"
          />
          <div className="hero-info">
            <h1>{details.title || details.name}</h1>
            <div className="meta-info">
              <span>{new Date(details.release_date || details.first_air_date).getFullYear()}</span>
              {details.genres?.map(genre => (
                <span key={genre.id}>{genre.name}</span>
              ))}
              {details.runtime && <span>{Math.floor(details.runtime / 60)}h {details.runtime % 60}m</span>}
            </div>
            <div className="rating">
              ★ {details.vote_average?.toFixed(1)} / 10
            </div>
            <h3>Overview</h3>
            <p className="overview">{details.overview}</p>
          </div>
        </div>
      </div>

      {/* Cast Section */}
      <div className="cast-section">
        <h2>Cast</h2>
        <div className="cast-scroll">
          {credits.slice(0, 10).map(cast => (
            <div key={cast.id} className="cast-card">
              <img
                src={cast.profile_path ? `https://image.tmdb.org/t/p/w200${cast.profile_path}` : "/placeholder.jpg"}
                alt={cast.name}
              />
              <p>{cast.name}</p>
              <p className="character">{cast.character}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Videos Section */}
      {videos.length > 0 && (
        <div className="videos-section">
          <h2>Videos</h2>
          <div className="videos-grid">
            {videos.filter(video => video.site === "YouTube").map(video => (
              <div key={video.id} className="video-card">
                <ReactPlayer
                  url={`https://www.youtube.com/watch?v=${video.key}`}
                  width="100%"
                  height="100%"
                  controls
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Similar Section */}
      <div className="similar-section">
        <h2>More Like This</h2>
        <div className="similar-scroll">
          {similar.map(item => (
            <div
              key={item.id}
              className="similar-card"
              onClick={() => navigate(`/details/${mediaType}/${item.id}`)}
            >
              <img
                src={item.poster_path ? `https://image.tmdb.org/t/p/w200${item.poster_path}` : "/placeholder.jpg"}
                alt={item.title || item.name}
              />
              <p>{item.title || item.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Details;
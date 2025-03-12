import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // Import the auth instance
import "./SeriesDetails.css"; // Import the CSS file for styling

const SeriesDetails = () => {
  const { id } = useParams(); // Get the series ID from the URL
  const [series, setSeries] = useState(null);
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
  }, [id, navigate]); // Add navigate to dependencies

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
      </div>
    </div>
  );
};

export default SeriesDetails;
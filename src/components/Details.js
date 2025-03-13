import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./Details.css";

const Details = () => {
  const { mediaType, id } = useParams();
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const API_KEY = "0b5b088bab00665e8e996c070b4e5991";

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/${mediaType}/${id}?api_key=${API_KEY}`
        );
        setDetails(response.data);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [mediaType, id]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (!details) {
    return <div className="error">No details found.</div>;
  }

  return (
    <div className="details-container">
      <div className="details-content">
        <img
          src={`https://image.tmdb.org/t/p/w500${details.poster_path || details.profile_path}`}
          alt={details.title || details.name}
        />
        <div className="details-info">
          <h1>{details.title || details.name}</h1>
          <p>{details.overview || details.biography}</p>
          <p>
            <strong>Release Date:</strong>{" "}
            {details.release_date || details.first_air_date}
          </p>
          <p>
            <strong>Rating:</strong> {details.vote_average?.toFixed(1)}/10
          </p>
        </div>
      </div>
    </div>
  );
};

export default Details;
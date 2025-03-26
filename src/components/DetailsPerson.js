import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./DetailsPerson.css";

const DetailsPerson = () => {
  const { id } = useParams(); // Get the person ID from the URL
  const [person, setPerson] = useState(null);
  const [credits, setCredits] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const API_KEY = "0b5b088bab00665e8e996c070b4e5991";

  useEffect(() => {
    const fetchPersonDetails = async () => {
      try {
        const [personResponse, creditsResponse] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}`),
          axios.get(`https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${API_KEY}`)
        ]);
        setPerson(personResponse.data);
        setCredits(creditsResponse.data);
      } catch (error) {
        console.error("Error fetching person details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPersonDetails();
  }, [id]);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (!person) {
    return <div className="error">Person not found.</div>;
  }

  return (
    <div className="details-person">
      <div className="person-header">
        <img
          src={
            person.profile_path
              ? `https://image.tmdb.org/t/p/w300${person.profile_path}`
              : "/placeholder.jpg"
          }
          alt={person.name}
          className="person-image"
        />
        <div className="person-info">
          <h1>{person.name}</h1>
          <p><strong>Known For:</strong> {person.known_for_department}</p>
          <p><strong>Birthday:</strong> {person.birthday || "N/A"}</p>
          <p><strong>Place of Birth:</strong> {person.place_of_birth || "N/A"}</p>
          <p><strong>Biography:</strong> {person.biography || "No biography available."}</p>
        </div>
      </div>

      {credits && (
        <div className="person-credits">
          <h2>Movies & TV Shows</h2>
          <div className="credits-grid">
            {credits.cast.map((item) => (
              <div
                key={item.id}
                className="credit-card"
                onClick={() => window.open(`/details/${item.media_type}/${item.id}`, "_blank")}
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
                <p className="character">as {item.character || "N/A"}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsPerson;
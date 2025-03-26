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

  const scrollHorizontally = (direction, containerRef) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  const moviesRef = React.useRef(null);
  const tvShowsRef = React.useRef(null);

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

  // Separate movies and TV shows
  const movies = credits.cast.filter((item) => item.media_type === "movie");
  const tvShows = credits.cast.filter((item) => item.media_type === "tv");

  return (
    <div className="details-person">
      <div className="person-frame">
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

        {/* Movies Section */}
        {movies.length > 0 && (
          <div className="person-movies">
            <h2>Movies</h2>
            <button onClick={() => scrollHorizontally("left", moviesRef)}>←</button>
            <div className="credits-grid" ref={moviesRef}>
              {movies.map((movie) => (
                <div
                  key={movie.id}
                  className="credit-card"
                  onClick={() => window.open(`/details/movie/${movie.id}`, "_blank")}
                >
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                        : "/placeholder.jpg"
                    }
                    alt={movie.title}
                  />
                  <p>{movie.title}</p>
                  <p className="character">as {movie.character || "N/A"}</p>
                </div>
              ))}
            </div>
            <button onClick={() => scrollHorizontally("right", moviesRef)}>→</button>
          </div>
        )}

        {/* TV Shows Section */}
        {tvShows.length > 0 && (
          <div className="person-tvshows">
            <h2>TV Shows</h2>
            <button onClick={() => scrollHorizontally("left", tvShowsRef)}>←</button>
            <div className="credits-grid" ref={tvShowsRef}>
              {tvShows.map((tv) => (
                <div
                  key={tv.id}
                  className="credit-card"
                  onClick={() => window.open(`/details/tv/${tv.id}`, "_blank")}
                >
                  <img
                    src={
                      tv.poster_path
                        ? `https://image.tmdb.org/t/p/w200${tv.poster_path}`
                        : "/placeholder.jpg"
                    }
                    alt={tv.name}
                  />
                  <p>{tv.name}</p>
                  <p className="character">as {tv.character || "N/A"}</p>
                </div>
              ))}
            </div>
            <button onClick={() => scrollHorizontally("right", tvShowsRef)}>→</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailsPerson;
import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { FaMoon, FaSun, FaFilm, FaStar, FaUserCircle, FaTicketAlt } from "react-icons/fa";
import "./Login.css";

const API_KEY = "0b5b088bab00665e8e996c070b4e5991";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [caption, setCaption] = useState("");
  const [formPosition, setFormPosition] = useState("default");
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedPassword", password);
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword");
      }
      navigate("/home");
    } catch (error) {
      setError(error.message);
      console.error(error);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleMoveForm = (position) => {
    setFormPosition(position);
  };

  useEffect(() => {
    const fetchBackground = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`
        );
        const data = await response.json();
        const randomMovie =
          data.results[Math.floor(Math.random() * data.results.length)];
        const imageUrl = `https://image.tmdb.org/t/p/original${randomMovie.backdrop_path}`;
        const movieCaption = `🎬 ${randomMovie.title || randomMovie.name}: ${(randomMovie.overview || "No description available.").slice(0, 100)}...`;
        setBackgroundImage(imageUrl);
        setCaption(movieCaption);
      } catch (error) {
        console.error("Error fetching background image:", error);
      }
    };

    fetchBackground();
    const interval = setInterval(() => {
      fetchBackground();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`login-container ${isDarkMode ? "dark-mode" : ""}`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="dark-mode-toggle" onClick={toggleDarkMode}>
        {isDarkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
      </div>

      <div className={`form-wrapper ${formPosition}`}>
        <div className="movie-header">
          <FaFilm className="icon" /> <h1 className="login-title">CineVerse Login</h1> <FaStar className="icon" />
        </div>

        <div className="user-icon"><FaUserCircle size={40} /></div>

        <div className="cinema-intro">
          <FaTicketAlt className="icon bouncing" />
          <p>Stream your favorite movies, series, anime & more!</p>
        </div>

        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
          <div className="remember-me">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)} 
            />
            <label htmlFor="rememberMe">Remember Me</label>
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <div className="form-buttons">
          <button onClick={() => handleMoveForm("left")} className="move-button">Left</button>
          <button onClick={() => handleMoveForm("default")} className="move-button">Default</button>
          <button onClick={() => handleMoveForm("right")} className="move-button">Right</button>
        </div>
        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>

      <div className="caption small-caption">
        {caption}
      </div>
    </div>
  );
};

export default Login;

import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Correct import path
import { useNavigate, Link } from "react-router-dom"; // Use Link for navigation
import { FaMoon, FaSun } from "react-icons/fa"; // Icons for dark mode toggle
import "./Login.css"; // Import the CSS file for styling

const API_KEY = "0b5b088bab00665e8e996c070b4e5991";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // State for "Remember Me"
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode
  const [backgroundImage, setBackgroundImage] = useState(""); // State for background image
  const [caption, setCaption] = useState(""); // State for caption
  const navigate = useNavigate();

  // Load email and password from localStorage if "Remember Me" was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    const savedPassword = localStorage.getItem("rememberedPassword"); // Retrieve saved password
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Save email and password to localStorage if "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedPassword", password); // Save password
      } else {
        localStorage.removeItem("rememberedEmail");
        localStorage.removeItem("rememberedPassword"); // Remove password
      }

      navigate("/home"); // Redirect to home page after successful login
    } catch (error) {
      setError(error.message); // Display error message
      console.error(error);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Fetch background image and caption from TMDB API
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
        const movieCaption = `${randomMovie.title || randomMovie.name}: ${
          randomMovie.overview || "No description available."
        }`;
        setBackgroundImage(imageUrl);
        setCaption(movieCaption);
      } catch (error) {
        console.error("Error fetching background image:", error);
      }
    };

    fetchBackground();

    const interval = setInterval(() => {
      fetchBackground();
    }, 10000); // Change every 10 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
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
      <div className="form-wrapper">
        <h1 className="login-title">Login</h1>
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
        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
      <div className="caption">
        <h2>{caption}</h2>
      </div>
    </div>
  );
};

export default Login;
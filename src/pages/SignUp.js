import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { FaFilm, FaStar } from "react-icons/fa";
import { FaUserCircle, FaTicketAlt } from "react-icons/fa";
import "./SignUp.css";

const API_KEY = "0b5b088bab00665e8e996c070b4e5991";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [caption, setCaption] = useState("");
  const [formPosition, setFormPosition] = useState("default");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/home"); // Redirect to home page after signup
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("Google Sign-In successful:", user);
      navigate("/home"); // Redirect to home page after successful sign-up
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
      if (error.code === "auth/popup-closed-by-user") {
        console.error("The popup was closed before completing the sign-in.");
      } else if (error.code === "auth/cancelled-popup-request") {
        console.error("Popup request was canceled.");
      } else {
        console.error("Unexpected error:", error.message);
      }
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleMoveForm = (position) => {
    setFormPosition(position);
  };

  const fetchBackground = async () => {
    if (!navigator.onLine) {
      console.error("No internet connection.");
      setBackgroundImage(""); // Reset background image
      setCaption("⚠️ Check your internet connection.");
      document.body.style.backgroundColor = "#f5f5f5"; // Fallback background color
      return;
    }
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch background image");
      }
      const data = await response.json();
      const randomMovie =
        data.results[Math.floor(Math.random() * data.results.length)];
      const imageUrl = `https://image.tmdb.org/t/p/original${randomMovie.backdrop_path}`;
      const movieCaption = `🎬 ${randomMovie.title || randomMovie.name}: ${(randomMovie.overview || "No description available.").slice(0, 100)}...`;
      setBackgroundImage(imageUrl);
      setCaption(movieCaption);
    } catch (error) {
      console.error("Error fetching background image:", error);
      setBackgroundImage(""); // Reset background image
      setCaption("⚠️ Check your internet connection.");
      document.body.style.backgroundColor = "#f5f5f5"; // Fallback background color
    }
  };

  useEffect(() => {
    fetchBackground();
    const interval = setInterval(() => {
      fetchBackground();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`signup-container ${isDarkMode ? "dark-mode" : ""}`}
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
        <h1>Sign Up</h1>
        <form onSubmit={handleSignUp} className="signup-form">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="signup-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="signup-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="signup-input"
          />
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        <button onClick={handleGoogleSignUp} className="google-signup-button">
          Sign Up with Google
        </button>
        <p className="already-have-account">
          You already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>

      <div className="form-buttons">
        <button onClick={() => handleMoveForm("left")} className="move-button">Left</button>
        <button onClick={() => handleMoveForm("default")} className="move-button">Default</button>
        <button onClick={() => handleMoveForm("right")} className="move-button">Right</button>
      </div>

      <div className="caption small-caption">
        {caption}
      </div>
    </div>
  );
};

export default SignUp;

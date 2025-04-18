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
  const [isFading, setIsFading] = useState(false); // State to handle fade animations
  const [isFadingOut, setIsFadingOut] = useState(false); // State to handle fade-out animation
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false); // State to toggle caption expansion
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

  const toggleCaption = () => {
    setIsCaptionExpanded(!isCaptionExpanded);
  };

  const fetchBackground = async () => {
    if (!navigator.onLine) {
      console.error("No internet connection.");
      setBackgroundImage(""); // Reset background image
      setCaption("⚠️ Check your internet connection.");
      document.body.style.backgroundColor = "#f5f5f5"; // Fallback background color
      return;
    }

    const categories = [
      { type: "movie", url: `https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}` },
      { type: "tv", url: `https://api.themoviedb.org/3/trending/tv/day?api_key=${API_KEY}` },
      { type: "anime", url: `https://api.jikan.moe/v4/top/anime` }, // Example anime API
    ];

    const randomCategory = categories[Math.floor(Math.random() * categories.length)];

    try {
      const response = await fetch(randomCategory.url);
      if (!response.ok) {
        throw new Error("Failed to fetch background image");
      }

      const data = await response.json();
      let randomItem, imageUrl, captionText;

      if (randomCategory.type === "anime") {
        randomItem = data.data[Math.floor(Math.random() * data.data.length)];
        imageUrl = randomItem.images.jpg.large_image_url;
        captionText = `🎥 ${randomItem.title}: ${(randomItem.synopsis || "No description available.").slice(0, 100)}...`;
      } else {
        randomItem = data.results[Math.floor(Math.random() * data.results.length)];
        imageUrl = `https://image.tmdb.org/t/p/original${randomItem.backdrop_path}`;
        captionText = `🎬 ${randomItem.title || randomItem.name}: ${(randomItem.overview || "No description available.").slice(0, 100)}...`;
      }

      // Trigger fade-out animation
      setIsFadingOut(true);
      setTimeout(() => {
        setBackgroundImage(imageUrl); // Update the background image
        setCaption(captionText); // Update the caption
        setIsFadingOut(false); // Trigger fade-in animation
      }, 500); // Match this duration with the CSS fade-out animation
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
      className={`signup-container ${isDarkMode ? "dark-mode" : ""} ${isFadingOut ? "fading-out" : "fading-in"}`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
      }}
    >
      <div className="dark-mode-toggle" onClick={toggleDarkMode}>
        {isDarkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
      </div>

      {/* Wrap form and buttons in a single container */}
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

        {/* Buttons for moving the form */}
        <div className="form-buttons">
          <button onClick={() => handleMoveForm("left")} className="move-button">
            Left
          </button>
          <button onClick={() => handleMoveForm("default")} className="move-button">
            Default
          </button>
          <button onClick={() => handleMoveForm("right")} className="move-button">
            Right
          </button>
        </div>
      </div>

      <div className="caption small-caption">
        {isCaptionExpanded ? caption : `${caption.slice(0, 100)}`}
        {caption.length > 100 && (
          <span
            className="read-more"
            onClick={toggleCaption}
            style={{ color: "blue", cursor: "pointer", marginLeft: "10px" }} // Adjusted margin for spacing
          >
            {isCaptionExpanded ? "Read Less" : "Read More"}
          </span>
        )}
      </div>
    </div>
  );
};

export default SignUp;
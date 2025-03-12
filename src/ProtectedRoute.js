// src/ProtectedRoute.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase"; // Import the auth instance

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        setErrorMessage("You must sign up to access this page.");
        navigate("/signup", {
          state: { error: "You must sign up to access this page." }, // Pass the error message in state
        });
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, [navigate]);

  // If there's an error, prevent rendering protected content
  return errorMessage ? null : children;
};

export default ProtectedRoute;

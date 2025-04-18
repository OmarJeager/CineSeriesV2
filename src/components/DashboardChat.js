import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const DashboardChat = () => {
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setErrorMessage("You must be logged in to access the Dashboard Chat.");
        setTimeout(() => navigate("/login"), 3000); // Redirect to login after 3 seconds
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="dashboard-chat-container">
      {errorMessage ? (
        <h1>{errorMessage}</h1>
      ) : (
        <h1>Welcome to Dashboard Chat !</h1>
      )}
    </div>
  );
};

export default DashboardChat;
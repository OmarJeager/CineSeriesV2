import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Details from "./components/Details"; // Series Details component
import DetailsPerson from "./components/DetailsPerson"; // Person Details component
import ProtectedRoute from "./ProtectedRoute"; // ProtectedRoute component
import { auth } from "./firebase";
import { useEffect, useState } from "react";
import Watchlist from "./components/Watchlist";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user); // Set authentication status based on user
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log("Watchlist updated:", watchlist); // Debugging
  }, [watchlist]);

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Route for Home */}
        <Route
          path="/home"
          element={
            isAuthenticated ? (
              <ProtectedRoute>
                <Home watchlist={watchlist} setWatchlist={setWatchlist} />
              </ProtectedRoute>
            ) : (
              <Navigate
                to="/signup"
                state={{ error: "You must sign up to access this page." }}
              />
            )
          }
        />

        {/* Series Details route */}
        <Route path="/details/:mediaType/:id" element={<Details />} />

        {/* Person Details route */}
        <Route path="/details/person/:id" element={<DetailsPerson />} />

        {/* Watchlist route */}
        <Route path="/watchlist" element={<Watchlist watchlist={watchlist} />} />

        {/* Redirect if the user is not authenticated */}
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <Navigate to="/home" />
            ) : (
              <Navigate
                to="/signup"
                state={{ error: "You must sign up to access this page." }}
              />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Details from "./components/Details"; // Series Details component
import DetailsPerson from "./components/DetailsPerson"; // Person Details component
import ProtectedRoute from "./ProtectedRoute"; // ProtectedRoute component
import { auth } from "./firebase";
import { useEffect, useState } from "react";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user); // Set authentication status based on user
    });

    return () => unsubscribe();
  }, []);

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
                <Home />
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

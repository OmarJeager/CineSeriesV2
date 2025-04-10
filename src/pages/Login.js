import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { motion } from "framer-motion"; // Import Framer Motion for animations
import styled from "styled-components"; // Import styled-components for styling

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${(props) => (props.isDarkMode ? "#121212" : "#f9f9f9")};
  color: ${(props) => (props.isDarkMode ? "#ffffff" : "#000000")};
  transition: background-color 0.5s ease, color 0.5s ease;
`;

const FormWrapper = styled(motion.div)`
  background: ${(props) => (props.isDarkMode ? "#1e1e1e" : "#ffffff")};
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const LoginTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const Input = styled(motion.input)`
  width: 100%;
  padding: 0.8rem;
  margin: 0.5rem 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: ${(props) => (props.isDarkMode ? "#bb86fc" : "#6200ea")};
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  padding: 0.8rem;
  margin-top: 1rem;
  background-color: ${(props) => (props.isDarkMode ? "#bb86fc" : "#6200ea")};
  color: #ffffff;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.isDarkMode ? "#9a67ea" : "#3700b3")};
  }
`;

const DarkModeToggle = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
`;

const ErrorMessage = styled(motion.p)`
  color: red;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const SignupLink = styled.p`
  margin-top: 1rem;
  font-size: 0.9rem;

  a {
    color: ${(props) => (props.isDarkMode ? "#bb86fc" : "#6200ea")};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
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

  return (
    <LoginContainer isDarkMode={isDarkMode}>
      <DarkModeToggle onClick={toggleDarkMode}>
        {isDarkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
      </DarkModeToggle>
      <FormWrapper
        isDarkMode={isDarkMode}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LoginTitle>Login</LoginTitle>
        {error && (
          <ErrorMessage
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </ErrorMessage>
        )}
        <form onSubmit={handleLogin}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            isDarkMode={isDarkMode}
            required
            whileFocus={{ scale: 1.05 }}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            isDarkMode={isDarkMode}
            required
            whileFocus={{ scale: 1.05 }}
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
          <Button
            type="submit"
            isDarkMode={isDarkMode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </Button>
        </form>
        <SignupLink isDarkMode={isDarkMode}>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </SignupLink>
      </FormWrapper>
    </LoginContainer>
  );
};

export default Login;
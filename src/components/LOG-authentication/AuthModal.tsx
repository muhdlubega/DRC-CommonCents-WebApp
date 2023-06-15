import React, { useState } from "react";
import "../../styles/main.scss";
import Signin from "./Signin";
import Signup from "./Signup";
import { Route, Routes } from 'react-router-dom';
import { AuthContextProvider } from '../account/AuthContext';
import ProtectedRoute from '../account/ProtectedRoute';
import AuthDetails from "./AuthDetails";

// Define types for props
interface LoginProps {
  handleClose: () => void;
}

interface RegisterProps {
  handleClose: () => void;
}

// Component for login form
function Login(props: LoginProps) {
  return (
    <AuthContextProvider>
      <Routes>
        <Route path='/' element={<Signin />} />
        <Route path='/genres' element={<Signin />} />
        <Route path='/about' element={<Signin />} />
        <Route path='/signup' element={<Signup handleClose={props.handleClose} />} />
      </Routes>
    </AuthContextProvider>
  );
}

// Component for register form
function Register(props: RegisterProps) {
  return (
    <AuthContextProvider>
      <Routes>
        <Route path='/' element={<Signin />} />
        <Route path='/genres' element={<Signin />} />
        <Route path='/about' element={<Signin />} />
        <Route path='/signup' element={<Signup handleClose={props.handleClose} />} />
      </Routes>
    </AuthContextProvider>
  );
}

// Main authentication modal component
export default function AuthModal() {
  // State for whether modal is open and which form is active
  const [isOpen, setIsOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Open and close modal
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  // Function to handle user login
  const handleLogin = () => {
    setIsLoggedIn(true);
    handleClose();
  };

  // Function to handle user logout
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Render the component
  return (
    <div className="auth">
      {/* Render the appropriate button based on login status */}
      {isLoggedIn ? (
        <AuthDetails handleLogout={handleLogout} />
      ) : (
        <a
          className="auth-button"
          onClick={() => {
            handleOpen();
            setActiveForm(0); // Default to login form
          }}
        >
          Login
        </a>
      )}

      {/* Modal content */}
      {isOpen && (
        <div className="auth-modal" onClick={handleClose}>
          <div className="auth-content" onClick={(e) => e.stopPropagation()}>
            {/* Render the active form */}
            <div className="auth-form">
              {activeForm === 0 && <Login handleClose={handleLogin} />}
              {activeForm === 1 && <Register handleClose={handleLogin} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

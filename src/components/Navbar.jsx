import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Airbnb Uganda
        </Link>
        <div className="navbar-right">
          {currentUser ? (
            <>
              <span className="user-email">{currentUser.email}</span>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="login-button">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 
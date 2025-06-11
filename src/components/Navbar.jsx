import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaPlus } from 'react-icons/fa';
import '../Auth.css'; // Reusing Auth.css for general styles, or could create a new App.css

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className={`navbar-item ${isActive('/') ? 'active' : ''}`}>
          <div className="navbar-icon-wrapper">
            <FaHome size={20} />
          </div>
          <span className="navbar-label">Home</span>
        </Link>
        
        <Link to="/profile" className={`navbar-item ${isActive('/profile') ? 'active' : ''}`}>
          <div className="navbar-icon-wrapper">
            <FaUser size={20} />
          </div>
          <span className="navbar-label">Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

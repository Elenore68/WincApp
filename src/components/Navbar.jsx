import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUser } from 'react-icons/fa';
import '../Auth.css'; // Reusing Auth.css for general styles, or could create a new App.css

const Navbar = () => {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-item">
        <FaHome size={24} />
        <span>Home</span>
      </Link>
      <Link to="/profile" className="navbar-item">
        <FaUser size={24} />
        <span>Profile</span>
      </Link>
    </nav>
  );
};

export default Navbar;

import React from 'react';
import Logo from '../assets/logo.png';
import '../Auth.css';

const AuthFormContainer = ({ children, title, subtitle }) => {
  return (
    <div className="auth-container">
      <div className="auth-header">
        <img src={Logo} alt="Winc Logo" className="auth-logo" />
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="auth-form-content">
        {children}
      </div>
    </div>
  );
};

export default AuthFormContainer; 
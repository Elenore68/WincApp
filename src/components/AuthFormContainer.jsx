import React from 'react';
import '../Auth.css';

const AuthFormContainer = ({ children, title, subtitle }) => {
  return (
    <div className="auth-container">
      <div className="auth-header">
        <img src="src\assets\Logo.png" alt="Winc Logo" className="auth-logo" />
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
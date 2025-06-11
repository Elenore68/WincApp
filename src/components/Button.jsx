import React from 'react';
import '../Auth.css';

const Button = ({ children, onClick, type = 'button', className = '' }) => {
  return (
    <button type={type} onClick={onClick} className={`auth-button ${className}`}>
      {children}
    </button>
  );
};

export default Button; 
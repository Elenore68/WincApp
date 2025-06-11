import React, { useState } from 'react';
import { IoEyeSharp } from 'react-icons/io5';
import '../Auth.css';

const Input = ({ label, type, placeholder, value, onChange, id, showPasswordToggle = false }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const inputType = showPasswordToggle && isPasswordVisible ? 'text' : type;

  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <div className="input-wrapper">
        <input
          type={inputType}
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="auth-input"
        />
        {showPasswordToggle && (
          <span
            className="password-toggle"
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
            style={{ color: '#715AFF' }}
          >
            <IoEyeSharp />
          </span>
        )}
      </div>
    </div>
  );
};

export default Input; 
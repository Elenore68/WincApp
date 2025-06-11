import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthFormContainer from '../components/AuthFormContainer';
import Input from '../components/Input';
import Button from '../components/Button';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100vw',
      background: 'none'
    }}>
      <AuthFormContainer 
        title="Reset Password"
        subtitle="Enter your email address used in Winc so we can send a link to reset your password."
      >
        <form onSubmit={handleResetPassword}>
          <Input
            label="Email"
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {message && <p style={{ color: 'green' }}>{message}</p>}
          {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
          <Button type="submit">Reset your password</Button>
        </form>
        <div className="auth-form-footer">
          <p>Remember your password? <Link to="/signin">Sign In</Link></p>
        </div>
      </AuthFormContainer>
    </div>
  );
};

export default ResetPassword; 
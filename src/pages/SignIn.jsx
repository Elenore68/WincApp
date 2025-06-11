import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthFormContainer from '../components/AuthFormContainer';
import Input from '../components/Input';
import Button from '../components/Button';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import { app } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

const auth = getAuth(app);

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Signed in successfully!');
      if (location.state && location.state.cardId) {
        navigate('/checkout', { state: { cardId: location.state.cardId, templateImage: location.state.templateImage } });
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      alert('Signed in with Google successfully!');
      if (location.state && location.state.cardId) {
        navigate('/checkout', { state: { cardId: location.state.cardId, templateImage: location.state.templateImage } });
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAppleSignIn = async () => {
    setError(null);
    try {
      const provider = new OAuthProvider('apple.com');
      await signInWithPopup(auth, provider);
      alert('Signed in with Apple successfully!');
      if (location.state && location.state.cardId) {
        navigate('/checkout', { state: { cardId: location.state.cardId, templateImage: location.state.templateImage } });
      } else {
        navigate('/');
      }
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
      <AuthFormContainer >
        <form onSubmit={handleSignIn}>
          <Input
            label="Email"
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Password"
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showPasswordToggle
          />
          <Link to="/reset-password" className="forgot-password-link">Forgot Password?</Link>
          {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
          <Button type="submit">Sign in</Button>
        </form>
        <div className="social-login">
          <div className="social-login-divider">or</div>
          <div className="social-buttons">
            <Button onClick={handleGoogleSignIn} className="social-button">
              <FcGoogle size={30} />
            </Button>
            <Button onClick={handleAppleSignIn} className="social-button">
              <FaApple size={30} style={{ color: '#000000' }} />
            </Button>
          </div>
        </div>
        <div className="auth-form-footer">
          <p>Don't have an account? <Link to="/signup">Create an account</Link></p>
        </div>
      </AuthFormContainer>
    </div>
  );
};

export default SignIn; 
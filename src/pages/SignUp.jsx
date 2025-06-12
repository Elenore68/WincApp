import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthFormContainer from "../components/AuthFormContainer";
import Input from "../components/Input";
import Button from "../components/Button";
import { createUserWithEmailAndPassword, signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider, OAuthProvider, updateProfile } from 'firebase/auth';
import { app } from '../firebaseConfig';
import { getAuth } from 'firebase/auth';
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

const auth = getAuth(app);

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is on mobile device
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
  };

  // Check for redirect result on component mount
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // User successfully signed up via redirect
          alert("Signed up with Google successfully!");
          if (location.state && location.state.cardId) {
            navigate("/checkout", {
              state: {
                cardId: location.state.cardId,
                templateImage: location.state.templateImage,
              },
            });
          } else {
            navigate("/");
          }
        }
      } catch (err) {
        setError(err.message);
      }
    };

    checkRedirectResult();
  }, [navigate, location.state]);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name
      });
      alert("✅ Account created successfully!");
      if (location.state && location.state.cardId) {
        navigate("/checkout", {
          state: {
            cardId: location.state.cardId,
            templateImage: location.state.templateImage,
          },
        });
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignUp = async () => {
    setError(null);
    // Google Sign-Up functionality temporarily disabled
    alert("Google Sign-Up is currently unavailable. Please use email/password sign-up.");
    return;
    
    // Commented out Google Sign-Up functionality
    /*
    try {
      const provider = new GoogleAuthProvider();
      
      if (isMobile()) {
        // Use redirect for mobile devices
        await signInWithRedirect(auth, provider);
        // Note: The redirect result will be handled in the useEffect above
      } else {
        // Use popup for desktop devices
        const result = await signInWithPopup(auth, provider);
        alert("Signed up with Google successfully!");
        if (location.state && location.state.cardId) {
          navigate("/checkout", {
            state: {
              cardId: location.state.cardId,
              templateImage: location.state.templateImage,
            },
          });
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      setError(err.message);
    }
    */
  };

  const handleAppleSignUp = async () => {
    setError(null);
    try {
      const provider = new OAuthProvider("apple.com");
      
      if (isMobile()) {
        // Use redirect for mobile devices
        await signInWithRedirect(auth, provider);
      } else {
        // Use popup for desktop devices
        const result = await signInWithPopup(auth, provider);
        alert("Signed up with Apple successfully!");
        if (location.state && location.state.cardId) {
          navigate("/checkout", {
            state: {
              cardId: location.state.cardId,
              templateImage: location.state.templateImage,
            },
          });
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100vw",
        background: "none",
      }}
    >
      <AuthFormContainer>
        <form onSubmit={handleSignUp}>
          <Input
            label="Name"
            id="name"
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showPasswordToggle
          />
          {error && (
            <p className="error-message" style={{ color: "red" }}>
              {error}
            </p>
          )}
          <Button type="submit">Sign up</Button>
        </form>
        <div className="social-login">
          <div className="social-login-divider">or</div>
          <div className="social-buttons">
            <Button onClick={handleGoogleSignUp} className="social-button">
              <FcGoogle size={30} />
            </Button>
            <Button onClick={handleAppleSignUp} className="social-button">
              <FaApple size={30} style={{ color: "#000000" }} />
            </Button>
          </div>
        </div>
        <div className="auth-form-footer">
          <p>
            Already have an account? <Link to="/signin">Sign In</Link>
          </p>
        </div>
      </AuthFormContainer>
    </div>
  );
};

export default SignUp;

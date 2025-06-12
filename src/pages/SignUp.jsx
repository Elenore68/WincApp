import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthFormContainer from "../components/AuthFormContainer";
import Input from "../components/Input";
import Button from "../components/Button";
// import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
// import { app } from '../firebaseConfig';
// import { getAuth } from 'firebase/auth';
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { signUp } from "../api/AuthApi";

// const auth = getAuth(app);

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const payload = {
        email,
        password,
        phone: "+966500000000", // TODO: Replace with user input if you want phone number input
        display_name: name,
      };

      await signUp(payload);
      alert("✅ Account created successfully! Please sign in.");
      navigate("/signin");
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
    }
  };

  // const handleGoogleSignUp = async () => {
  //   setError(null);
  //   try {
  //     const provider = new GoogleAuthProvider();
  //     await signInWithPopup(auth, provider);
  //     alert("Signed up with Google successfully!");
  //     navigate("/");
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

  // const handleAppleSignUp = async () => {
  //   setError(null);
  //   try {
  //     const provider = new OAuthProvider("apple.com");
  //     await signInWithPopup(auth, provider);
  //     alert("Signed up with Apple successfully!");
  //     navigate("/");
  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };

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
            <Button className="social-button">
              {/* <Button onClick={handleGoogleSignUp} className="social-button"> */}
              <FcGoogle size={30} />
            </Button>
            <Button className="social-button">
              {/* <Button onClick={handleAppleSignUp} className="social-button"> */}
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

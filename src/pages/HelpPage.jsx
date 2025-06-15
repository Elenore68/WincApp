import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import Input from '../components/Input';
import Button from '../components/Button';
import '../Auth.css';

const HelpPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [desc, setDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Here you would send the help request to your backend or Firestore
    alert('Your request has been submitted!');
    setSubmitting(false);
    setEmail('');
    setPhone('');
    setDesc('');
  };

  return (
    <div className="overview-page-container" style={{ 
      height: '100vh', 
      overflow: 'hidden', 
      overflowX: 'hidden',
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      <div
        className="overview-header"
        style={{ 
          display: "flex", 
          alignItems: "center", 
          padding: "20px 24px 16px 24px",
          background: "#ffffff",
          borderBottom: "1px solid #f0f0f0",
          position: "sticky",
          top: 0,
          zIndex: 10,
          flexShrink: 0
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 24,
            color: "#715AFF",
            padding: "8px",
            marginRight: "12px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "40px",
            minHeight: "40px"
          }}
          aria-label="Back"
        >
          <IoIosArrowBack />
        </button>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            flex: 1
          }}
        >
          <h2 style={{ 
            margin: 0, 
            fontWeight: 700, 
            color: "#000",
            fontSize: "24px",
            lineHeight: "1.2"
          }}>
            Help Center
          </h2>
          <span
            style={{ 
              color: "#666", 
              fontWeight: 400, 
              fontSize: "14px",
              marginTop: "2px"
            }}
          >
            How can we assist you?
          </span>
        </div>
      </div>
      
      <div style={{
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden",
        padding: window.innerWidth <= 768 ? "24px 16px" : "40px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        background: "#fafafa"
      }}>
        <div style={{ 
          width: '100%', 
          maxWidth: 450, 
          padding: window.innerWidth <= 768 ? '24px 20px' : '32px 28px',
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid #f0f0f0',
          margin: '0 16px',
          boxSizing: 'border-box'
        }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 32, color: '#333', textAlign: 'center' }}>
            Welcome to <span style={{ color: '#715AFF' }}>Winc</span> Help Center!
          </div>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <div style={{ marginBottom: '24px' }}>
              <Input
                label="Email used to register*"
                id="help-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <Input
                label="Phone Number"
                id="help-phone"
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>
            <div className="input-group" style={{ marginBottom: 32, width: '100%' }}>
              <label htmlFor="help-desc" style={{ color: '#222', fontWeight: 500, marginBottom: 6, display: 'block' }}>
                Description of the Issue *
              </label>
              <textarea
                id="help-desc"
                className="auth-input"
                style={{
                  minHeight: 90,
                  resize: 'vertical',
                  color: '#715AFF',
                  border: '1.5px solid #715AFF',
                  borderRadius: 10,
                  width: '100%',
                  fontSize: 16,
                  padding: 10,
                  boxSizing: 'border-box'
                }}
                value={desc}
                onChange={e => setDesc(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={submitting} style={{ width: '100%', marginTop: 24 }}>
              submit
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HelpPage; 
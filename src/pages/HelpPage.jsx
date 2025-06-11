import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import Input from '../components/Input';
import Button from '../components/Button';

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
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'linear-gradient(135deg, #f9f9fe 0%, #e6e6fa 100%)',
        zIndex: -1
      }} />
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ width: 350, margin: '40px auto 0 auto' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 28,
              color: '#222'
            }}
            aria-label="Back"
          >
            <IoIosArrowBack />
          </button>
          <div style={{ fontWeight: 700, fontSize: 28, color: '#222', marginBottom: 8 }}>Help center</div>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 18, color: '#222' }}>
            Welcome to <span style={{ color: '#715AFF' }}>Winc</span> Help Center!<br />
            <span style={{ fontWeight: 400, color: '#222' }}>How can we assist you?</span>
          </div>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <Input
              label="Email used to register*"
              id="help-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Input
              label="Phone Number"
              id="help-phone"
              type="text"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            <div className="input-group" style={{ marginBottom: 24, width: '100%' }}>
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
            <Button type="submit" disabled={submitting} style={{ width: '100%', marginTop: 8 }}>
              submit
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default HelpPage; 
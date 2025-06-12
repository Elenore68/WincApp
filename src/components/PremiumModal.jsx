import React from 'react';
import Logo from '../assets/logo.png';

const PremiumModal = ({ open, onClose, onJoin }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ textAlign: 'center', position: 'relative' }}>
        <button 
          className="modal-close" 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'none',
            border: 'none',
            fontSize: '2rem',
            color: '#bbb',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'color 0.2s',
            padding: 0,
            margin: 0,
            lineHeight: 1
          }}
        >
          &times;
        </button>
        <img src={Logo} alt="Winc Logo" style={{ width: 80, margin: '16px auto 16px', marginTop: 24 }} />
        <div style={{ marginBottom: 20, fontWeight: 500, fontSize: 18, color: '#222' }}>
          You must be a premium <b>Winc</b> Member<br />
          to access and share Ecards and Invites.
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          <button
            className="auth-btn"
            style={{ background: '#715AFF', color: '#fff', borderRadius: 8, padding: '10px 30px', fontWeight: 600, fontSize: 18, width: '100%' }}
            onClick={onJoin}
          >
            Sign In
          </button>
          <button
            className="auth-btn"
            style={{ background: '#fff', color: '#715AFF', border: '2px solid #715AFF', borderRadius: 8, padding: '10px 30px', fontWeight: 600, fontSize: 18, width: '100%' }}
            onClick={() => onJoin('signup')}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal; 
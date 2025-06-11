import React from 'react';
import Logo from '../assets/logo.png';

const PremiumModal = ({ open, onClose, onJoin }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ textAlign: 'center' }}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <img src={Logo} alt="Winc Logo" style={{ width: 80, margin: '0 auto 16px' }} />
        <div style={{ marginBottom: 20, fontWeight: 500, fontSize: 18, color: '#222' }}>
          You must be a premium <b>Winc</b> Member<br />
          to access and share Ecards and Invites.
        </div>
        <button
          className="auth-btn"
          style={{ background: '#715AFF', color: '#fff', borderRadius: 8, padding: '10px 30px', fontWeight: 600, fontSize: 18 }}
          onClick={onJoin}
        >
          Join Now!
        </button>
      </div>
    </div>
  );
};

export default PremiumModal; 
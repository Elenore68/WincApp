import React from 'react';

const PremiumModal = ({ open, onClose, onJoin }) => {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ textAlign: 'center' }}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <img src="src\assets\Logo.png" alt="Winc Logo" style={{ width: 80, margin: '0 auto 16px' }} />
        <div style={{ fontWeight: 600, fontSize: 22, marginBottom: 10 }}>Winc</div>
        <div style={{ marginBottom: 20 }}>
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
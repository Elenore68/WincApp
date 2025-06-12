import React, { useState } from 'react';
import { FaLink } from 'react-icons/fa6';

const ShareLinkModal = ({ open, onClose, cardLink }) => {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(cardLink);
    setCopied(true);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ textAlign: 'center', minWidth: 280, position: 'relative' }}>
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
        <div style={{ fontSize: 48, margin: '24px 0 18px 0', color: '#111' }}>
          <FaLink />
        </div>
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 16, color: '#222' }}>
          You can share your cards
        </div>
        <button
          className="auth-btn"
          style={{
            background: '#715AFF',
            color: '#fff',
            borderRadius: 8,
            padding: '10px 30px',
            fontWeight: 600,
            fontSize: 18,
            marginBottom: 16,
            cursor: 'pointer'
          }}
          onClick={handleCopy}
        >
          {copied ? 'Copied!' : 'Copy Link'}
        </button>
        <input
          type="text"
          value={cardLink}
          readOnly
          style={{
            width: '90%',
            padding: '8px',
            border: '1.5px solid #715AFF',
            borderRadius: 7,
            background: '#f9f9fe',
            color: '#715AFF',
            fontWeight: 500,
            fontSize: 14,
            textAlign: 'center',
            marginBottom: 8
          }}
        />
      </div>
    </div>
  );
};

export default ShareLinkModal; 
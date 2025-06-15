import React, { useState } from 'react';
import { FaLink } from 'react-icons/fa6';
import { IoShareOutline } from 'react-icons/io5';

const ShareLinkModal = ({ open, onClose, cardLink }) => {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(cardLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Winc Card',
          text: 'Check out this amazing card I created!',
          url: cardLink,
        });
        console.log('Shared successfully!');
      } catch (error) {
        console.log('Error sharing:', error);
        // If sharing fails or is cancelled, fall back to copy
        handleCopy();
      }
    } else {
      // Fallback to copy if Web Share API is not supported
      handleCopy();
    }
  };

  // Check if Web Share API is supported
  const isShareSupported = navigator.share && navigator.canShare && navigator.canShare({
    title: 'Winc Card',
    text: 'Check out this amazing card I created!',
    url: cardLink,
  });

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ textAlign: 'center', minWidth: 320, maxWidth: 400, position: 'relative' }}>
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
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 20, color: '#222' }}>
          Share your card
        </div>

        {/* Native Share Button */}
        <button
          onClick={handleNativeShare}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #715AFF 0%, #8B5CF6 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '16px 20px',
            fontWeight: 600,
            fontSize: 16,
            marginBottom: 12,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 4px 12px rgba(113, 90, 255, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 16px rgba(113, 90, 255, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 12px rgba(113, 90, 255, 0.3)';
          }}
        >
          <IoShareOutline size={20} />
          {isShareSupported ? 'Share' : 'Copy Link'}
        </button>

        {/* Show divider and copy button only if native share is supported */}
        {isShareSupported && (
          <>
            {/* Divider */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              margin: '16px 0',
              color: '#ccc'
            }}>
              <div style={{ flex: 1, height: '1px', background: '#e9ecef' }}></div>
              <span style={{ padding: '0 12px', fontSize: '12px', color: '#999' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: '#e9ecef' }}></div>
            </div>

            <button
              style={{
                width: '100%',
                background: copied ? '#10B981' : '#fff',
                color: copied ? '#fff' : '#715AFF',
                border: copied ? 'none' : '2px solid #715AFF',
                borderRadius: '12px',
                padding: '14px 20px',
                fontWeight: 600,
                fontSize: 16,
                marginBottom: 16,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onClick={handleCopy}
              onMouseEnter={(e) => {
                if (!copied) {
                  e.target.style.background = '#f8f9ff';
                }
              }}
              onMouseLeave={(e) => {
                if (!copied) {
                  e.target.style.background = '#fff';
                }
              }}
            >
              <FaLink size={16} />
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </>
        )}
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
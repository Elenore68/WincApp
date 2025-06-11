import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ShareLinkModal from '../components/ShareLinkModal';
import '../Auth.css';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const templateImage = location.state?.templateImage || 'https://via.placeholder.com/300x400?text=Card+Cover';
  const cardId = location.state?.cardId;
  const [showShareModal, setShowShareModal] = useState(false);
  const cardLink = cardId ? `https://card.winccards.ai/card/${cardId}` : '';

  const handlePay = () => {
    setShowShareModal(true);
  };

  const handleClose = () => {
    if (cardId) {
      navigate(`/overview/${cardId}`);
    } else {
      navigate('/');
    }
  };

  const handleShareModalClose = () => {
    setShowShareModal(false);
    navigate('/my-cards');
  };

  return (
    <div style={{
      background: '#222',
      minHeight: '100vh',
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{
        width: 350,
        margin: '40px auto',
        background: 'linear-gradient(135deg, #f9f9fe 0%, #e6e6fa 100%)',
        borderRadius: 18,
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        padding: '32px 0 32px 0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
      }}>
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            background: 'none',
            border: 'none',
            fontSize: '2rem',
            color: '#bbb',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'color 0.2s'
          }}
          aria-label="Close"
        >
          &times;
        </button>
        <img
          src={templateImage}
          alt="Card Template"
          style={{
            width: 160,
            height: 240,
            objectFit: 'cover',
            borderRadius: 18,
            marginBottom: 28,
            boxShadow: '0 2px 12px rgba(0,0,0,0.10)'
          }}
        />

        <div style={{
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          padding: '24px 24px 12px 24px',
          width: 270,
          marginBottom: 18
        }}>
          <div style={{ color: '#888', fontWeight: 600, marginBottom: 10 }}>order summary</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, color: '#222' }}>
            <span>1 creating card</span>
            <span>3.40$</span>
          </div>
          <hr />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, marginTop: 12, marginBottom: 12, color: '#222' }}>
            <span>total to pay</span>
            <span>3.40$</span>
          </div>
        </div>

        <div style={{
          background: '#fff',
          borderRadius: 14,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          padding: '16px 20px',
          width: 270,
          marginBottom: 18,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}>
          <div style={{ color: '#888', fontSize: 13, marginBottom: 8 }}>Payment method</div>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple Pay" style={{ width: 32, height: 32, marginRight: 8 }} />
            <span style={{ fontWeight: 600, fontSize: 16 }}>Pay</span>
            <span style={{ marginLeft: 'auto', color: '#715AFF', fontWeight: 500, cursor: 'pointer', fontSize: 14 }}>change</span>
          </div>
        </div>

        <button
          style={{
            width: 270,
            background: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            padding: '14px 0',
            fontWeight: 700,
            fontSize: 20,
            marginTop: 8,
            cursor: 'pointer'
          }}
          onClick={handlePay}
        >
           Pay
        </button>
      </div>
      <ShareLinkModal
        open={showShareModal}
        onClose={handleShareModalClose}
        cardLink={cardLink}
      />
    </div>
  );
};

export default CheckoutPage; 
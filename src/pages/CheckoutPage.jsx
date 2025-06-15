import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ShareLinkModal from '../components/ShareLinkModal';
import { FaApplePay } from "react-icons/fa6";
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
      padding: 'clamp(16px, 4vw, 40px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        width: 'clamp(320px, 90vw, 400px)',
        maxWidth: '95vw',
        margin: '0 auto',
        background: 'linear-gradient(135deg, #f9f9fe 0%, #e6e6fa 100%)',
        borderRadius: 'clamp(16px, 3vw, 20px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        padding: 'clamp(20px, 5vw, 32px) 0',
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
            width: 'clamp(140px, 35vw, 180px)',
            height: 'clamp(210px, 52vw, 270px)',
            objectFit: 'cover',
            borderRadius: 'clamp(14px, 3vw, 18px)',
            marginBottom: 'clamp(20px, 5vw, 28px)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.10)'
          }}
        />

        <div style={{
          background: '#fff',
          borderRadius: 'clamp(14px, 3vw, 18px)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          padding: 'clamp(16px, 4vw, 24px)',
          width: 'clamp(250px, 70vw, 300px)',
          maxWidth: '85vw',
          marginBottom: 'clamp(14px, 3vw, 18px)'
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
          borderRadius: 'clamp(12px, 2.5vw, 16px)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          padding: 'clamp(14px, 3vw, 20px)',
          width: 'clamp(250px, 70vw, 300px)',
          maxWidth: '85vw',
          marginBottom: 'clamp(14px, 3vw, 18px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start'
        }}>
          <div style={{ color: '#888', fontSize: 'clamp(12px, 2.5vw, 14px)', marginBottom: 8 }}>Payment method</div>
          <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                          <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="Apple Pay" style={{ width: 'clamp(28px, 6vw, 32px)', height: 'clamp(28px, 6vw, 32px)', marginRight: 8 }} />
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
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onClick={handlePay}
        >
          <FaApplePay size={100} />
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
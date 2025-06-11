import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import Button from '../components/Button';
import PremiumModal from '../components/PremiumModal';
import '../Auth.css';
import { FaPlay } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';

const OverviewPage = () => {
  const { cardId } = useParams();
  const [card, setCard] = useState(null);
  const [template, setTemplate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCardAndTemplate = async () => {
      if (!cardId) return;
      const docRef = doc(db, 'cards', cardId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const cardData = docSnap.data();
        setCard(cardData);

        // Fetch the template for the cover image
        if (cardData.templateId) {
          const templateRef = doc(db, 'templates', cardData.templateId);
          const templateSnap = await getDoc(templateRef);
          if (templateSnap.exists()) {
            setTemplate(templateSnap.data());
          }
        }
      }
    };
    fetchCardAndTemplate();
  }, [cardId]);

  if (!card) return <div className="main-page-container"><div style={{textAlign:'center',marginTop:60}}>Loading...</div></div>;

  // Use the template's ThumbnailUrl as the cover image
  const templateImage = template?.ThumbnailUrl || 'https://via.placeholder.com/300x400?text=Card+Cover';
  const recipientImage = card.recipientImageUrl || 'https://via.placeholder.com/60x60?text=User';

  const handleShareClick = () => {
    setShowPremiumModal(true);
  };

  const handleJoinNow = () => {
    setShowPremiumModal(false);
    navigate('/signin', { state: { cardId, templateImage: template?.ThumbnailUrl } });
  };

  return (
    <div className="main-page-container">
      <div className="overview-header" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={() => navigate('/', { state: { openEditModal: true, templateId: card.templateId, cardData: card } })}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 28, color: '#715AFF', marginRight: 8 }}
          aria-label="Back"
        >
          <IoIosArrowBack />
        </button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <h2 style={{ margin: 0, fontWeight: 700, color: '#000' }}>Overview</h2>
          <span className="overview-sub" style={{ color: '#000', fontWeight: 400, fontSize: '1em' }}>
            Click to {isOpen ? 'close' : 'open'}
          </span>
        </div>
      </div>
      <div className="overview-content">
        {!isOpen ? (
          <div className="overview-cover" onClick={() => setIsOpen(true)} style={{ width: 328, height: 583, maxWidth: '100%', maxHeight: '100%', padding: 0, margin: 0, borderRadius: 20, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
            <img src={templateImage} alt="Card Cover" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', margin: 0, padding: 0, borderRadius: 0 }} />
          </div>
        ) : (
          <div className="overview-book" style={{ width: 328, height: 583, maxWidth: '100%', maxHeight: '100%' }}>
            <button className="modal-close" onClick={() => setIsOpen(false)}>&times;</button>
            <div className="overview-book-header">
              <img src={recipientImage} alt="Recipient" className="overview-avatar" />
              <span className="overview-recipient">To:{card.recipientName}</span>
            </div>
            <div className="overview-message">{card.message}</div>
            {card.videoUrl && (
              <div className="overview-video">
                <video width="100%" controls poster={templateImage} style={{borderRadius:12, background:'#ccc'}}>
                  <source src={card.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        )}
      </div>
      <Button className="overview-share-btn" onClick={handleShareClick}>Share</Button>
      <PremiumModal
        open={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onJoin={handleJoinNow}
      />
    </div>
  );
};

export default OverviewPage; 
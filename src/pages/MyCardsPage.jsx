import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import CategoryFilter from '../components/CategoryFilter';
import ShareLinkModal from '../components/ShareLinkModal';
import { IoMdShareAlt } from 'react-icons/io';
import { MdOutlineDelete } from 'react-icons/md';
import { IoIosArrowBack } from 'react-icons/io';
import Button from '../components/Button';
import '../Auth.css';
import { CardActionMenu } from '../components/CardActionMenu';

const MyCardsPage = () => {
  const navigate = useNavigate();
  // const [user, setUser] = useState(null); // Not used, so removed to fix linter error
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showMenuFor, setShowMenuFor] = useState(null); // cardId
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCard, setEditCard] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');

  // Auth check and fetch cards
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        window.location.href = '/signin';
      } else {
        // Fetch cards for this user
        const q = query(collection(db, 'cards'), where('userId', '==', u.uid));
        const snap = await getDocs(q);
        const userCards = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCards(userCards);
        setFilteredCards(userCards);
      }
    });
    return () => unsubscribe();
  }, []);

  // Filter by category
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredCards(cards);
    } else {
      setFilteredCards(cards.filter(card => card.category === selectedCategory));
    }
  }, [selectedCategory, cards]);

  const handleEdit = (card) => {
    setEditCard(card);
    setShowEditModal(true);
    setShowMenuFor(null);
  };

  const handleDelete = async (cardId) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      await deleteDoc(doc(db, 'cards', cardId));
      setCards(cards.filter(card => card.id !== cardId));
      setShowMenuFor(null);
    }
  };

  const handleShare = (cardId) => {
    setShareLink(`https://card.winccards.ai/card/${cardId}`);
    setShowShareModal(true);
    setShowMenuFor(null);
  };

  const handleSaveEdit = async (updatedCard) => {
    await updateDoc(doc(db, 'cards', updatedCard.id), {
      senderName: updatedCard.senderName,
      receiverName: updatedCard.receiverName,
      message: updatedCard.message,
      // Add more fields as needed
    });
    setCards(cards.map(card => card.id === updatedCard.id ? { ...card, ...updatedCard } : card));
    setShowEditModal(false);
  };

  return (
    <div className="main-page-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '30px 0 10px 0' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 28,
            color: '#222',
            marginRight: 8
          }}
          aria-label="Back"
        >
          <IoIosArrowBack />
        </button>
        <div style={{ fontWeight: 700, fontSize: 22, color: '#222' }}>My Cards</div>
      </div>
      <CategoryFilter onSelectCategory={setSelectedCategory} selectedCategory={selectedCategory} />
      <div className="templates-grid">
        {filteredCards.map(card => (
          <div key={card.id} className="template-card" style={{ position: 'relative' }}
            onClick={() => setShowMenuFor(card.id)}
          >
            <img src={card.templateImageUrl || card.receiverImageUrl} alt={card.receiverName} className="template-card-image" />
            <h3 className="template-card-name">{card.receiverName}</h3>
            <p className="template-card-desc">{card.message}</p>
            {/* Card menu */}
            {showMenuFor === card.id && (
              <div style={{ position: 'absolute', top: 40, right: 10, zIndex: 10 }}>
                <CardActionMenu
                  onEdit={() => handleEdit(card)}
                  onDelete={() => handleDelete(card.id)}
                  onShare={() => handleShare(card.id)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Edit Modal */}
      {showEditModal && editCard && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowEditModal(false)}>&times;</button>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10 }}>Edit Card</div>
            <form onSubmit={e => { e.preventDefault(); handleSaveEdit(editCard); }}>
              <input
                className="auth-input"
                style={{ marginBottom: 10 }}
                value={editCard.senderName}
                onChange={e => setEditCard({ ...editCard, senderName: e.target.value })}
                placeholder="Sender Name"
              />
              <input
                className="auth-input"
                style={{ marginBottom: 10 }}
                value={editCard.receiverName}
                onChange={e => setEditCard({ ...editCard, receiverName: e.target.value })}
                placeholder="Receiver Name"
              />
              <textarea
                className="auth-input"
                style={{ marginBottom: 10, minHeight: 60 }}
                value={editCard.message}
                onChange={e => setEditCard({ ...editCard, message: e.target.value })}
                placeholder="Message"
              />
              <Button type="submit" style={{ marginTop: 10 }}>Save Changes</Button>
            </form>
          </div>
        </div>
      )}
      {/* Share Modal */}
      <ShareLinkModal open={showShareModal} onClose={() => setShowShareModal(false)} cardLink={shareLink} />
    </div>
  );
};

export default MyCardsPage; 
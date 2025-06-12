import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';
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
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import TemplateCard from '../components/TemplateCard';

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
  const [newImage, setNewImage] = useState(null);
  const [newVideo, setNewVideo] = useState(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [removeVideo, setRemoveVideo] = useState(false);
  const [templateThumbnails, setTemplateThumbnails] = useState({});

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
        // Fetch all referenced templates
        const templateIds = Array.from(new Set(userCards.map(card => card.templateId).filter(Boolean)));
        const thumbnails = {};
        await Promise.all(templateIds.map(async (tid) => {
          const tRef = doc(db, 'templates', tid);
          const tSnap = await getDoc(tRef);
          if (tSnap.exists()) thumbnails[tid] = tSnap.data().ThumbnailUrl;
        }));
        setTemplateThumbnails(thumbnails);
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
    // Reset upload states
    setNewImage(null);
    setNewVideo(null);
    setRemoveImage(false);
    setRemoveVideo(false);
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

  const handleImageChange = (e) => setNewImage(e.target.files[0]);
  const handleVideoChange = (e) => setNewVideo(e.target.files[0]);

  const handleSaveEdit = async (updatedCard) => {
    try {
      console.log('Original card data:', updatedCard);
      
      let updatedFields = {
        senderName: updatedCard.senderName || '',
        name: updatedCard.name || '',
        message: updatedCard.message || '',
        lastModified: new Date(),
      };
      
      // Remove any undefined values to prevent Firebase errors
      Object.keys(updatedFields).forEach(key => {
        if (updatedFields[key] === undefined) {
          delete updatedFields[key];
        }
      });
      
      console.log('Fields to update:', updatedFields);
      
      const storage = getStorage();
      
      // Handle image upload/removal
      if (newImage) {
        const imageRef = ref(storage, `faces/${auth.currentUser.uid}/${Date.now()}/face.jpg`);
        await uploadBytes(imageRef, newImage);
        updatedFields.recipientPhotoUrl = await getDownloadURL(imageRef);
      } else if (removeImage) {
        updatedFields.recipientPhotoUrl = null;
      }
      
      // Handle video upload/removal
      if (newVideo) {
        const videoRef = ref(storage, `videos/${auth.currentUser.uid}/${Date.now()}/video.mp4`);
        await uploadBytes(videoRef, newVideo);
        updatedFields.videoUrl = await getDownloadURL(videoRef);
      } else if (removeVideo) {
        updatedFields.videoUrl = null;
      }
      
      // Update the card in Firestore
      await updateDoc(doc(db, 'cards', updatedCard.id), updatedFields);
      
      // Update local state
      setCards(cards.map(card => 
        card.id === updatedCard.id 
          ? { ...card, ...updatedFields } 
          : card
      ));
      
      // Reset modal state
      setShowEditModal(false);
      setNewImage(null);
      setNewVideo(null);
      setRemoveImage(false);
      setRemoveVideo(false);
      
      alert('Card updated successfully!');
    } catch (error) {
      console.error('Error updating card:', error);
      alert('Failed to update card. Please try again.');
    }
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
          <div key={card.id} className="template-card" style={{ position: 'relative', width: 168, height: 210, background: 'none', boxShadow: 'none', margin: 0, padding: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              setShowMenuFor(showMenuFor === card.id ? null : card.id);
            }}
          >
            <TemplateCard template={{ ThumbnailUrl: templateThumbnails[card.templateId] || '', Name: card.receiverName }} />
            {card.message && <p className="template-card-desc">{card.message}</p>}
            {/* Video is hidden in the card grid */}
            {/* {card.videoUrl && (
              <video src={card.videoUrl} controls width={150} style={{ marginTop: 8, borderRadius: 8 }} />
            )} */}
            {/* Card menu */}
            {showMenuFor === card.id && (
              <div style={{ position: 'absolute', top: 40, right: 10, zIndex: 10 }}>
                <CardActionMenu
                  onEdit={() => handleEdit(card)}
                  onDelete={() => handleDelete(card.id)}
                  onShare={() => handleShare(card.id)}
                  onClose={() => setShowMenuFor(null)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Edit Modal */}
      {showEditModal && editCard && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ position: 'relative' }}>
            <button
              className="modal-close"
              onClick={() => setShowEditModal(false)}
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                background: 'none',
                border: 'none',
                fontSize: 28,
                color: '#888',
                cursor: 'pointer'
              }}
              aria-label="Close"
            >
              &times;
            </button>
            <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10, marginTop: 24 }}>Edit Card</div>
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
                value={editCard.name || ''}
                onChange={e => setEditCard({ ...editCard, name: e.target.value })}
                placeholder="Recipient"
              />
              <textarea
                className="auth-input"
                style={{ marginBottom: 10, minHeight: 60 }}
                value={editCard.message}
                onChange={e => setEditCard({ ...editCard, message: e.target.value })}
                placeholder="Message"
              />
              {/* Image upload */}
              <div className="upload-section">
                <Button type="button" className="upload-btn" onClick={() => imageInputRef.current.click()}>
                  Change Image
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  ref={imageInputRef}
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                {newImage ? (
                  <div className="upload-preview">
                    <div className="preview-content">
                      <img 
                        src={URL.createObjectURL(newImage)} 
                        alt="New Image" 
                        className="preview-image"
                      />
                      <div className="preview-info">
                        <span className="file-name">{newImage.name}</span>
                        <span className="file-size">{(newImage.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    </div>
                    <div className="preview-actions">
                      <button
                        type="button"
                        className="delete-icon-btn"
                        onClick={() => setNewImage(null)}
                        title="Remove new image"
                      >
                        <MdOutlineDelete size={24} style={{ color: '#EF4444' }} />
                      </button>
                    </div>
                  </div>
                ) : editCard.recipientPhotoUrl && !removeImage ? (
                  <div className="upload-preview">
                    <div className="preview-content">
                      <img 
                        src={editCard.recipientPhotoUrl} 
                        alt="Current Image" 
                        className="preview-image"
                      />
                      <div className="preview-info">
                        <span className="file-name">Current image</span>
                        <span className="file-size">From previous upload</span>
                      </div>
                    </div>
                    <div className="preview-actions">
                      <button
                        type="button"
                        className="delete-icon-btn"
                        onClick={() => setRemoveImage(true)}
                        title="Remove current image"
                      >
                        <MdOutlineDelete size={24} style={{ color: '#EF4444' }} />
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
              {/* Video upload */}
              <div className="upload-section">
                <Button type="button" className="upload-btn outline" onClick={() => videoInputRef.current.click()}>
                  Upload Video
                </Button>
                <input
                  type="file"
                  accept="video/*"
                  ref={videoInputRef}
                  style={{ display: 'none' }}
                  onChange={handleVideoChange}
                />
                {newVideo ? (
                  <div className="upload-preview">
                    <div className="preview-content">
                      <video 
                        src={URL.createObjectURL(newVideo)} 
                        className="preview-video"
                        controls
                      />
                      <div className="preview-info">
                        <span className="file-name">{newVideo.name}</span>
                        <span className="file-size">{(newVideo.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    </div>
                    <div className="preview-actions">
                      <button
                        type="button"
                        className="delete-icon-btn"
                        onClick={() => setNewVideo(null)}
                        title="Remove new video"
                      >
                        <MdOutlineDelete size={24} style={{ color: '#EF4444' }} />
                      </button>
                    </div>
                  </div>
                ) : editCard.videoUrl && !removeVideo ? (
                  <div className="upload-preview">
                    <div className="preview-content">
                      <video 
                        src={editCard.videoUrl} 
                        className="preview-video"
                        controls
                      />
                      <div className="preview-info">
                        <span className="file-name">Current video</span>
                        <span className="file-size">From previous upload</span>
                      </div>
                    </div>
                    <div className="preview-actions">
                      <button
                        type="button"
                        className="delete-icon-btn"
                        onClick={() => setRemoveVideo(true)}
                        title="Remove current video"
                      >
                        <MdOutlineDelete size={24} style={{ color: '#EF4444' }} />
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
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
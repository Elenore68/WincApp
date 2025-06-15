import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, doc, updateDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import CategoryFilter from '../components/CategoryFilter';
import ShareLinkModal from '../components/ShareLinkModal';
import { IoMdShareAlt, IoMdVolumeHigh } from 'react-icons/io';
import { MdOutlineDelete } from 'react-icons/md';
import { IoIosArrowBack } from 'react-icons/io';
import Button from '../components/Button';
import '../Auth.css';
import { CardActionMenu } from '../components/CardActionMenu';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import TemplateCard from '../components/TemplateCard';
import TextCustomizer from '../components/TextCustomizer';
import VoiceRecorder from '../components/VoiceRecorder';
import { BiEditAlt } from 'react-icons/bi';
import { FaRegShareFromSquare } from 'react-icons/fa6';

const MyCardsPage = () => {
  const navigate = useNavigate();
  // const [user, setUser] = useState(null); // Not used, so removed to fix linter error
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCard, setEditCard] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [newVideo, setNewVideo] = useState(null);
  const [newAudio, setNewAudio] = useState(null);
  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [removeVideo, setRemoveVideo] = useState(false);
  const [removeAudio, setRemoveAudio] = useState(false);
  const [templateThumbnails, setTemplateThumbnails] = useState({});
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCardDetail, setShowCardDetail] = useState(false);
  
  // Text customization state
  const [textStyles, setTextStyles] = useState({
    fontFamily: 'inherit',
    fontSize: 14,
    color: '#333'
  });
  const [showCustomizer, setShowCustomizer] = useState(false);

  // Auth check and fetch cards
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        navigate('/signin');
        return;
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

  // State for categories and templates
  const [categories, setCategories] = useState([]);
  const [templates, setTemplates] = useState([]);

  // Fetch categories and templates for filtering
  useEffect(() => {
    const fetchCategoriesAndTemplates = async () => {
      try {
        // Fetch categories
        const categoriesCollectionRef = collection(db, "categories");
        const categorySnapshot = await getDocs(categoriesCollectionRef);
        const categoryList = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCategories(categoryList);

        // Fetch templates
        const templatesCollectionRef = collection(db, "templates");
        const templateSnapshot = await getDocs(templatesCollectionRef);
        const templateList = templateSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTemplates(templateList);
      } catch (error) {
        console.error('Error fetching categories and templates:', error);
      }
    };

    fetchCategoriesAndTemplates();
  }, []);

  // Filter by category and sort by creation date
  useEffect(() => {
    let cardsToFilter = [...cards];
    
    if (selectedCategory === 'All') {
      cardsToFilter = cards;
    } else if (categories.length > 0 && templates.length > 0) {
      // Find the selected category object by name
      const selectedCategoryObj = categories.find(
        (cat) => cat.Name === selectedCategory
      );
      
      if (selectedCategoryObj) {
        // Filter cards by their template's category
        cardsToFilter = cards.filter(card => {
          const cardTemplate = templates.find(template => template.id === card.templateId);
          return cardTemplate && cardTemplate.CategoryId === selectedCategoryObj.id;
        });
      } else {
        cardsToFilter = [];
      }
    }
    
    // Sort cards by creation date (most recent first)
    const sortedCards = cardsToFilter.sort((a, b) => {
      // Try to use createdAt field first, then fall back to lastModified or id comparison
      const dateA = a.createdAt?.toDate?.() || a.lastModified?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || b.lastModified?.toDate?.() || new Date(0);
      return dateB - dateA; // Descending order (newest first)
    });
    
    setFilteredCards(sortedCards);
  }, [selectedCategory, cards, categories, templates]);

  const handleEdit = (card) => {
    setEditCard(card);
    setShowEditModal(true);
    // Reset upload states
    setNewImage(null);
    setNewVideo(null);
    setNewAudio(null);
    setRemoveImage(false);
    setRemoveVideo(false);
    setRemoveAudio(false);
    // Initialize text styles from card data or defaults
    setTextStyles({
      fontFamily: card.textStyles?.fontFamily || 'inherit',
      fontSize: card.textStyles?.fontSize || 14,
      color: card.textStyles?.color || '#333'
    });
    setShowCustomizer(false);
  };

  const handleShare = (cardId) => {
    setShareLink(`https://card.winccards.ai/card/${cardId}`);
    setShowShareModal(true);
  };

  const handleImageChange = (e) => setNewImage(e.target.files[0]);
  const handleVideoChange = (e) => setNewVideo(e.target.files[0]);
  const handleAudioChange = (audioFile) => setNewAudio(audioFile);
  const handleRemoveAudio = () => {
    setNewAudio(null);
    setRemoveAudio(true);
  };

  const handleSaveEdit = async (updatedCard) => {
    try {
      console.log('Original card data:', updatedCard);
      
      let updatedFields = {
        senderName: updatedCard.senderName || '',
        name: updatedCard.name || '',
        message: updatedCard.message || '',
        textStyles: textStyles,
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
      
      // Handle audio upload/removal
      if (newAudio) {
        const audioRef = ref(storage, `audio/${auth.currentUser.uid}/${Date.now()}/audio.wav`);
        await uploadBytes(audioRef, newAudio);
        updatedFields.audioUrl = await getDownloadURL(audioRef);
      } else if (removeAudio) {
        updatedFields.audioUrl = null;
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
      setNewAudio(null);
      setRemoveImage(false);
      setRemoveVideo(false);
      setRemoveAudio(false);
      
      alert('Card updated successfully!');
    } catch (error) {
      console.error('Error updating card:', error);
      alert('Failed to update card. Please try again.');
    }
  };

  const handleDelete = async (cardId) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      await deleteDoc(doc(db, 'cards', cardId));
      setCards(cards.filter(card => card.id !== cardId));
      setShowCardDetail(false);
    }
  };

  return (
    <div className="main-page-container">
      <div
        className="overview-header"
        style={{
          display: "flex",
          alignItems: "center",
          padding: "20px 24px 16px 24px",
          background: "#ffffff",
          borderBottom: "1px solid #f0f0f0",
          position: "sticky",
          top: 0,
          zIndex: 10,
          flexShrink: 0
        }}
      >
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: 24,
            color: "#715AFF",
            padding: "8px",
            marginRight: "12px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "40px",
            minHeight: "40px"
          }}
          aria-label="Back"
        >
          <IoIosArrowBack />
        </button>
        <h2 style={{
          margin: 0,
          fontWeight: 700,
          color: "#000",
          fontSize: "24px",
          lineHeight: "1.2"
        }}>
          My Cards
        </h2>
      </div>
      <CategoryFilter onSelectCategory={setSelectedCategory} selectedCategory={selectedCategory} categories={categories} />
      <div className="templates-grid">
        {filteredCards.map(card => (
          <div key={card.id} className="template-card card-hover-menu" style={{ position: 'relative', width: 168, height: 210, background: 'none', boxShadow: 'none', margin: 0, padding: 0 }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCard(card);
              setShowCardDetail(true);
            }}
          >
            <TemplateCard template={{ ThumbnailUrl: templateThumbnails[card.templateId] || '', Name: card.receiverName }} />
            {/* Card menu button and menu removed for minimal look */}
          </div>
        ))}
      </div>
      {/* Edit Modal */}
      {showEditModal && editCard && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header" style={{ flexShrink: 0 }}>
              <h3 style={{ margin: 0, color: '#715AFF', fontSize: '1.2em', fontWeight: 600 }}>
                Edit Card
              </h3>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>
                &times;
              </button>
            </div>
            <div style={{ 
              flex: 1, 
              overflowY: 'auto', 
              paddingRight: '4px', 
              marginBottom: '16px',
              scrollBehavior: 'smooth',
              maxHeight: 'calc(90vh - 140px)'
            }}>
              <div style={{ paddingBottom: '8px' }}>
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
                  style={{ 
                    marginBottom: 10, 
                    minHeight: 60,
                    fontFamily: textStyles.fontFamily,
                    fontSize: `${textStyles.fontSize}px`,
                    color: textStyles.color
                  }}
                  value={editCard.message}
                  onChange={e => setEditCard({ ...editCard, message: e.target.value })}
                  placeholder="Message"
                />
                
                {/* Text Customization */}
                <div style={{ marginBottom: '16px', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    alignItems: 'center',
                    marginBottom: '12px' 
                  }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <TextCustomizer
                        textStyles={textStyles}
                        onStyleChange={setTextStyles}
                        showCustomizer={false}
                        onToggleCustomizer={() => setShowCustomizer(!showCustomizer)}
                        showToggleButton={true}
                        showClearButton={true}
                      />
                    </div>
                  </div>
                  <TextCustomizer
                    textStyles={textStyles}
                    onStyleChange={setTextStyles}
                    showCustomizer={showCustomizer}
                    onToggleCustomizer={() => setShowCustomizer(!showCustomizer)}
                    showToggleButton={false}
                    showClearButton={false}
                  />
                </div>
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
                
                {/* Voice Recording */}
                <VoiceRecorder
                  audioFile={newAudio}
                  onAudioChange={handleAudioChange}
                  onRemoveAudio={handleRemoveAudio}
                  existingAudioUrl={editCard.audioUrl && !removeAudio ? editCard.audioUrl : null}
                />
              </div>
            </div>
            <div style={{ flexShrink: 0, paddingTop: '16px', borderTop: '1px solid #e9ecef' }}>
              <Button 
                onClick={() => handleSaveEdit(editCard)} 
                style={{ width: '100%', margin: 0 }}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Card Detail Modal */}
      {showCardDetail && selectedCard && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header">
              <h3 style={{ margin: 0, color: '#715AFF', fontSize: '1.2em', fontWeight: 600 }}>
                Card Details
              </h3>
              <button className="modal-close" onClick={() => setShowCardDetail(false)}>
                &times;
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 20px 0', minHeight: 0 }}>
              {templateThumbnails[selectedCard.templateId] && (
                <img 
                  src={templateThumbnails[selectedCard.templateId]} 
                  alt="Card Template" 
                  style={{ 
                    width: '200px', 
                    height: '280px', 
                    objectFit: 'cover', 
                    borderRadius: '12px', 
                    marginBottom: '20px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }} 
                />
              )}
              <div style={{ textAlign: 'left', background: '#f8f9fa', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                <div style={{ marginBottom: '12px', display: 'flex', gap: 4, alignItems: 'center' }}>
                  <strong style={{ color: '#715AFF' }}>From:</strong> <span style={{ color: '#111' }}>{selectedCard.senderName && selectedCard.senderName.trim() ? selectedCard.senderName : '—'}</span>
                </div>
                <div style={{ marginBottom: '12px', display: 'flex', gap: 4, alignItems: 'center' }}>
                  <strong style={{ color: '#715AFF' }}>To:</strong> <span style={{ color: '#111' }}>{(selectedCard.recipientName && selectedCard.recipientName.trim()) ? selectedCard.recipientName : (selectedCard.name && selectedCard.name.trim()) ? selectedCard.name : '—'}</span>
                </div>
                {selectedCard.message && (
                  <div>
                    <strong style={{ color: '#715AFF' }}>Message:</strong>
                    <p style={{ 
                      margin: '8px 0 0 0', 
                      lineHeight: '1.5', 
                      color: selectedCard.textStyles?.color || '#444', 
                      fontFamily: selectedCard.textStyles?.fontFamily || 'inherit',
                      fontSize: `${selectedCard.textStyles?.fontSize || 14}px`,
                      wordBreak: 'break-word', 
                      overflowWrap: 'anywhere' 
                    }}>
                      {selectedCard.message}
                    </p>
                  </div>
                )}
              </div>
              {selectedCard.videoUrl && (
                <div style={{ marginBottom: '16px' }}>
                  <video 
                    src={selectedCard.videoUrl} 
                    controls 
                    style={{ 
                      width: '100%', 
                      maxWidth: '300px', 
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }} 
                  />
                </div>
              )}
              {selectedCard.audioUrl && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ 
                    background: '#f8f9fa', 
                    borderRadius: '8px', 
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #715AFF 0%, #8B5CF6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      <IoMdVolumeHigh size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '500', color: '#333', fontSize: '14px' }}>
                        Voice Message
                      </div>
                      <audio 
                        src={selectedCard.audioUrl} 
                        controls 
                        style={{ 
                          width: '100%',
                          height: '32px',
                          marginTop: '4px'
                        }} 
                      />
                    </div>
                  </div>
                </div>
              )}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: 24 }}>
                <button
                  className="auth-btn"
                  style={{ 
                    background: '#715AFF', 
                    color: '#fff', 
                    borderRadius: '8px', 
                    padding: '10px 20px', 
                    fontWeight: 600, 
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onClick={() => {
                    setShowCardDetail(false);
                    handleEdit(selectedCard);
                  }}
                >
                  <BiEditAlt size={18} /> Edit
                </button>
                <button
                  className="auth-btn"
                  style={{ 
                    background: '#fff', 
                    color: '#715AFF', 
                    border: '2px solid #715AFF',
                    borderRadius: '8px', 
                    padding: '10px 20px', 
                    fontWeight: 600, 
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onClick={() => {
                    setShowCardDetail(false);
                    handleShare(selectedCard.id);
                  }}
                >
                  <FaRegShareFromSquare size={16} /> Share
                </button>
                <button
                  className="auth-btn"
                  style={{ 
                    background: '#fff', 
                    color: '#EF4444', 
                    border: '2px solid #EF4444',
                    borderRadius: '8px', 
                    padding: '10px 20px', 
                    fontWeight: 600, 
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                  onClick={() => handleDelete(selectedCard.id)}
                >
                  <MdOutlineDelete size={18} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Share Modal */}
      <ShareLinkModal open={showShareModal} onClose={() => setShowShareModal(false)} cardLink={shareLink} />
    </div>
  );
};

export default MyCardsPage; 
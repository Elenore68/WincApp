import React, { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebaseConfig';
import { storage } from '../firebaseConfig';
import Input from './Input';
import Button from './Button';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { FaImage, FaVideo } from 'react-icons/fa';
import { MdOutlineDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import '../Auth.css';
import { getAuth } from 'firebase/auth';

const auth = getAuth();

const CreateCardModal = ({ open, onClose, template, cardData }) => {
  const [senderName, setSenderName] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [message, setMessage] = useState('');
  const [recipientImage, setRecipientImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [existingRecipientImageUrl, setExistingRecipientImageUrl] = useState('');
  const [existingVideoUrl, setExistingVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Pre-fill fields if editing
  useEffect(() => {
    if (cardData && open) {
      setSenderName(cardData.senderName || '');
      setRecipientName(cardData.recipientName || '');
      setMessage(cardData.message || '');
      setExistingRecipientImageUrl(cardData.recipientImageUrl || '');
      setExistingVideoUrl(cardData.videoUrl || '');
      // Reset new file uploads when opening edit mode
      setRecipientImage(null);
      setVideo(null);
    } else if (open) {
      setSenderName('');
      setRecipientName('');
      setMessage('');
      setRecipientImage(null);
      setVideo(null);
      setExistingRecipientImageUrl('');
      setExistingVideoUrl('');
    }
  }, [cardData, open]);

  // useEffect(() => {
  //   if (templateId && open) {
  //     const fetchTemplate = async () => {
  //       const docRef = doc(db, "templates", templateId);
  //       const docSnap = await getDoc(docRef);
  //       if (docSnap.exists()) {
  //         setTemplate(docSnap.data());
  //       }
  //     };
  //     fetchTemplate();
  //   }
  // }, [templateId, open]);

  if (!open) return null;

  const handleRecipientImageChange = (e) => {
    if (e.target.files[0]) {
      setRecipientImage(e.target.files[0]);
    }
  };

  const handleVideoUpload = (e) => {
    if (e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };

  const removeRecipientImage = () => {
    setRecipientImage(null);
    setExistingRecipientImageUrl('');
  };

  const removeVideo = () => {
    setVideo(null);
    setExistingVideoUrl('');
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   let recipientImageUrl = '';
  //   let videoUrl = '';
  //   try {
  //     if (recipientImage) {
  //       const imageRef = ref(storage, `faces/${Date.now()}_${recipientImage.name}`);
  //       await uploadBytes(imageRef, recipientImage);
  //       recipientImageUrl = await getDownloadURL(imageRef);
  //     }
  //     if (video) {
  //       const videoRef = ref(storage, `videos/${Date.now()}_${video.name}`);
  //       await uploadBytes(videoRef, video);
  //       videoUrl = await getDownloadURL(videoRef);
  //     }
  //     const templateImageUrl = template?.thumbnailUrl || template?.imageUrl || '';
  //     const user = auth.currentUser;
  //     const cardRef = await addDoc(collection(db, 'cards'), {
  //       templateId,
  //       senderName,
  //       recipientName,
  //       message,
  //       recipientImageUrl,
  //       videoUrl,
  //       templateImageUrl,
  //       createdAt: new Date(),
  //       userId: user ? user.uid : null,
  //     });
  //     setLoading(false);
  //     onClose();
  //     navigate(`/overview/${cardRef.id}`);
  //   } catch (err) {
  //     setLoading(false);
  //     alert('Error creating card: ' + err.message);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate template exists
    if (!template || !template.id) {
      alert('Please select a template first');
      return;
    }
    
    setLoading(true);
    let recipientImageUrl = existingRecipientImageUrl;
    let videoUrl = existingVideoUrl;
    try {
      // Upload new recipient image if selected
      if (recipientImage) {
        const imageRef = ref(storage, `faces/${Date.now()}_${recipientImage.name}`);
        await uploadBytes(imageRef, recipientImage);
        recipientImageUrl = await getDownloadURL(imageRef);
      }

      // Upload new video if selected
      if (video) {
        const videoRef = ref(storage, `videos/${Date.now()}_${video.name}`);
        await uploadBytes(videoRef, video);
        videoUrl = await getDownloadURL(videoRef);
      }
      
      const user = auth.currentUser;
      const cardRef = await addDoc(collection(db, 'cards'), {
        templateId: template?.id,
        senderName,
        recipientName,
        message,
        recipientImageUrl,
        videoUrl,
        createdAt: new Date(),
        userId: user ? user.uid : null,
        isGuestCard: !user, // Mark as guest card if no user
      });
      
      setLoading(false);
      onClose();
      
      // Always go to overview page after card creation (simplified guest flow)
      navigate(`/overview/${cardRef.id}`);
    } catch (err) {
      console.error("❌ Failed to create card:", err);
      setLoading(false);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div className="modal-header" style={{ flexShrink: 0 }}>
          <h3 style={{ margin: 0, color: '#715AFF', fontSize: '1.2em', fontWeight: 600 }}>
            {cardData ? 'Edit Card' : 'Create Card'}
          </h3>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
          <form onSubmit={handleSubmit}>
              <Input
                label="Sender Name"
                id="senderName"
                type="text"
                placeholder=""
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
              />
              <Input
                label="Recipient"
                id="receiverName"
                type="text"
                placeholder="Enter recipient name"
                value={recipientName}
                onChange={e => setRecipientName(e.target.value)}
              />
              <div className="input-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  className="auth-input"
                  style={{
                    minHeight: 80,
                    resize: "vertical",
                    color: "#715AFF",
                    border: "1px solid #715AFF",
                  }}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              
              {/* Recipient Image Upload Section */}
              <div className="upload-section">
                <label style={{ display: 'block', marginBottom: 8, color: '#715AFF', fontWeight: 600, fontSize: '0.9em' }}>
                  <FaImage size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                  Recipient Image
                </label>
                {recipientImage ? (
                  <div className="upload-preview">
                    <div className="preview-content">
                      <img 
                        src={URL.createObjectURL(recipientImage)} 
                        alt="Recipient" 
                        className="preview-image"
                      />
                      <div className="preview-info">
                        <span className="file-name">{recipientImage.name}</span>
                        <span className="file-size">{(recipientImage.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    </div>
                    <div className="preview-actions">
                      <button
                        type="button"
                        className="delete-icon-btn"
                        onClick={removeRecipientImage}
                        title="Remove file"
                        style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onMouseEnter={e => e.currentTarget.querySelector('svg').style.color = '#b91c1c'}
                        onMouseLeave={e => e.currentTarget.querySelector('svg').style.color = '#EF4444'}
                      >
                        <MdOutlineDelete size={24} style={{ color: '#EF4444', display: 'block' }} />
                      </button>
                    </div>
                  </div>
                ) : existingRecipientImageUrl ? (
                  <div className="upload-preview">
                    <div className="preview-content">
                      <img 
                        src={existingRecipientImageUrl} 
                        alt="Recipient" 
                        className="preview-image"
                      />
                      <div className="preview-info">
                        <span className="file-name">Existing image</span>
                        <span className="file-size">From previous upload</span>
                      </div>
                    </div>
                    <div className="preview-actions">
                      <button
                        type="button"
                        className="delete-icon-btn"
                        onClick={removeRecipientImage}
                        title="Remove image"
                        style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onMouseEnter={e => e.currentTarget.querySelector('svg').style.color = '#b91c1c'}
                        onMouseLeave={e => e.currentTarget.querySelector('svg').style.color = '#EF4444'}
                      >
                        <MdOutlineDelete size={24} style={{ color: '#EF4444', display: 'block' }} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <Button type="button" className="upload-btn" onClick={() => document.getElementById('recipient-image-input').click()}>
                    <IoCloudUploadOutline size={22} style={{ marginRight: 8 }} />
                    Upload a Recipient image
                    <input
                      id="recipient-image-input"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleRecipientImageChange}
                    />
                  </Button>
                )}
              </div>

              {/* Video Upload Section */}
              <div className="upload-section">
                <label style={{ display: 'block', marginBottom: 8, color: '#715AFF', fontWeight: 600, fontSize: '0.9em' }}>
                  <FaVideo size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                  Video (Optional)
                </label>
                {video ? (
                  <div className="upload-preview">
                    <div className="preview-content">
                      <video 
                        src={URL.createObjectURL(video)} 
                        className="preview-video"
                        controls
                      />
                      <div className="preview-info">
                        <span className="file-name">{video.name}</span>
                        <span className="file-size">{(video.size / 1024 / 1024).toFixed(2)} MB</span>
                      </div>
                    </div>
                    <div className="preview-actions">
                      <button
                        type="button"
                        className="delete-icon-btn"
                        onClick={removeVideo}
                        title="Remove file"
                        style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onMouseEnter={e => e.currentTarget.querySelector('svg').style.color = '#b91c1c'}
                        onMouseLeave={e => e.currentTarget.querySelector('svg').style.color = '#EF4444'}
                      >
                        <MdOutlineDelete size={24} style={{ color: '#EF4444', display: 'block' }} />
                      </button>
                    </div>
                  </div>
                ) : existingVideoUrl ? (
                  <div className="upload-preview">
                    <div className="preview-content">
                      <video 
                        src={existingVideoUrl} 
                        className="preview-video"
                        controls
                      />
                      <div className="preview-info">
                        <span className="file-name">Existing video</span>
                        <span className="file-size">From previous upload</span>
                      </div>
                    </div>
                    <div className="preview-actions">
                      <button
                        type="button"
                        className="delete-icon-btn"
                        onClick={removeVideo}
                        title="Remove video"
                        style={{ background: 'none', border: 'none', padding: 0, margin: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onMouseEnter={e => e.currentTarget.querySelector('svg').style.color = '#b91c1c'}
                        onMouseLeave={e => e.currentTarget.querySelector('svg').style.color = '#EF4444'}
                      >
                        <MdOutlineDelete size={24} style={{ color: '#EF4444', display: 'block' }} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <Button type="button" className="upload-btn outline" onClick={() => document.getElementById('video-input').click()}>
                    <IoCloudUploadOutline size={22} style={{ marginRight: 8 }} />
                    Upload a video (optional)
                    <input
                      id="video-input"
                      type="file"
                      accept="video/*"
                      style={{ display: 'none' }}
                      onChange={handleVideoUpload}
                    />
                  </Button>
                )}
              </div>

              <Button type="submit" disabled={loading} style={{ marginTop: 16 }}>
                Next
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
};

export default CreateCardModal;

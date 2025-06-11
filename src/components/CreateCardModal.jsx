import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebaseConfig';
import { storage } from '../firebaseConfig';
import Input from './Input';
import Button from './Button';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import '../Auth.css';
import { getAuth } from 'firebase/auth';

const auth = getAuth();

const CreateCardModal = ({ open, onClose, templateId, cardData }) => {
  const [template, setTemplate] = useState(null);
  const [senderName, setSenderName] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [message, setMessage] = useState('');
  const [receiverImage, setReceiverImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Pre-fill fields if editing
  useEffect(() => {
    if (cardData && open) {
      setSenderName(cardData.senderName || '');
      setReceiverName(cardData.receiverName || '');
      setMessage(cardData.message || '');
      // Do not pre-fill receiverImage or video (file objects)
    } else if (open) {
      setSenderName('');
      setReceiverName('');
      setMessage('');
      setReceiverImage(null);
      setVideo(null);
    }
  }, [cardData, open]);

  useEffect(() => {
    if (templateId && open) {
      const fetchTemplate = async () => {
        const docRef = doc(db, 'templates', templateId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTemplate(docSnap.data());
        }
      };
      fetchTemplate();
    }
  }, [templateId, open]);

  if (!open) return null;

  const handleImageUpload = (e) => {
    if (e.target.files[0]) {
      setReceiverImage(e.target.files[0]);
    }
  };

  const handleVideoUpload = (e) => {
    if (e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let receiverImageUrl = '';
    let videoUrl = '';
    try {
      if (receiverImage) {
        const imageRef = ref(storage, `faces/${Date.now()}_${receiverImage.name}`);
        await uploadBytes(imageRef, receiverImage);
        receiverImageUrl = await getDownloadURL(imageRef);
      }
      if (video) {
        const videoRef = ref(storage, `videos/${Date.now()}_${video.name}`);
        await uploadBytes(videoRef, video);
        videoUrl = await getDownloadURL(videoRef);
      }
      const templateImageUrl = template?.thumbnailUrl || template?.imageUrl || '';
      const user = auth.currentUser;
      const cardRef = await addDoc(collection(db, 'cards'), {
        templateId,
        senderName,
        receiverName,
        message,
        receiverImageUrl,
        videoUrl,
        templateImageUrl,
        createdAt: new Date(),
        userId: user ? user.uid : null,
      });
      setLoading(false);
      onClose();
      navigate(`/overview/${cardRef.id}`);
    } catch (err) {
      setLoading(false);
      alert('Error creating card: ' + err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>&times;</button>
        {template && (
          <>
            <div className="modal-template-info">
              <b>the {template.name}</b>
              <p style={{ color: '#aaa', fontSize: '0.95em', margin: '8px 0 20px 0' }}>{template.description}</p>
            </div>
            <form onSubmit={handleSubmit}>
              <Input
                label="Sender Name"
                id="senderName"
                type="text"
                placeholder=""
                value={senderName}
                onChange={e => setSenderName(e.target.value)}
              />
              <Input
                label="Receiver Name"
                id="receiverName"
                type="text"
                placeholder=""
                value={receiverName}
                onChange={e => setReceiverName(e.target.value)}
              />
              <div className="input-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  className="auth-input"
                  style={{ minHeight: 80, resize: 'vertical', color: '#715AFF', border: '1px solid #715AFF' }}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
              </div>
              <Button type="button" className="upload-btn" onClick={() => document.getElementById('receiver-image-input').click()}>
                <IoCloudUploadOutline size={22} style={{ marginRight: 8 }} />
                Upload a Receiver image
                <input
                  id="receiver-image-input"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
              </Button>
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
              <Button type="submit" disabled={loading} style={{ marginTop: 16 }}>
                Next
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateCardModal; 
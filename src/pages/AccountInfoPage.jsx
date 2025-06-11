import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, updateProfile, updateEmail, deleteUser, onAuthStateChanged } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaTrash } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';
import Input from '../components/Input';
import Button from '../components/Button';

const AccountInfoPage = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) {
        navigate('/signin', { state: { redirectTo: '/account-info' } });
      } else {
        setUser(u);
        setName(u.displayName || '');
        setEmail(u.email || '');
        setPhotoURL(u.photoURL || '');
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      const file = e.target.files[0];
      const storage = getStorage();
      const storageRef = ref(storage, `profileImages/${user.uid}_${Date.now()}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      await updateProfile(user, { photoURL: url });
      setPhotoURL(url);
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (user.displayName !== name) {
        await updateProfile(user, { displayName: name });
      }
      if (user.email !== email) {
        await updateEmail(user, email);
      }
      alert('Account updated!');
    } catch (err) {
      alert('Error updating account: ' + err.message);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      try {
        await deleteUser(user);
        navigate('/');
      } catch (err) {
        alert('Error deleting account: ' + err.message);
      }
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #f9f9fe 0%, #e6e6fa 100%)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <div style={{ width: 350, margin: '40px auto 0 auto' }}>
        {/* Back Arrow */}
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 28,
            color: '#222',
            marginBottom: 10
          }}
          aria-label="Back"
        >
          <IoIosArrowBack />
        </button>
        {/* Profile Image Upload */}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: '#ddd',
            margin: '0 auto 30px auto',
            overflow: 'hidden',
            cursor: 'pointer',
            position: 'relative'
          }}
          onClick={() => document.getElementById('profile-image-input').click()}
          title="Click to change profile image"
        >
          {photoURL ? (
            <img src={photoURL} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : null}
          <input
            id="profile-image-input"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageChange}
            disabled={uploading}
          />
          {uploading && (
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
              background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 600, color: '#715AFF'
            }}>Uploading...</div>
          )}
        </div>
        <form onSubmit={handleSave}>
          <Input
            label="Name"
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            style={{ marginBottom: 18 }}
          />
          <Input
            label="Email"
            id="email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{ marginBottom: 28 }}
          />
          <Button type="submit" disabled={saving} style={{ width: '100%', background: '#715AFF', borderRadius: 12, fontWeight: 600, fontSize: 18 }}>
            Save changes
          </Button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button
            onClick={handleDelete}
            style={{
              background: 'none',
              border: 'none',
              color: '#F44',
              fontWeight: 600,
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              margin: '0 auto'
            }}
          >
            <FaTrash style={{ fontSize: 18 }} /> Delete account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountInfoPage; 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaInstagram, FaTiktok } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { MdLogout } from 'react-icons/md';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import Button from '../components/Button';
import '../Auth.css';
import Navbar from '../components/Navbar';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [showLangMenu, setShowLangMenu] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) {
        navigate('/signin', { state: { redirectTo: '/profile' } });
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <>
      <Navbar />
      <div style={{
        minHeight: '100vh',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ width: 350, margin: '40px auto 0 auto' }}>
          <div style={{ color: '#888', fontWeight: 600, fontSize: 18, marginBottom: 18 }}>Profile</div>
          {/* My Cards */}
          <div className="profile-section" style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: '18px 20px', marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => navigate('/my-cards')}>
            <span style={{ color: '#111' }}>My Cards</span>
            <span style={{ fontSize: 22, color: '#aaa' }}>&#8250;</span>
          </div>
          {/* Settings */}
          <div className="profile-section" style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: '18px 20px', marginBottom: 18 }}>
            <div style={{ fontWeight: 600, color: '#888', marginBottom: 8 }}>Settings</div>
            <div className="profile-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '8px 0' }} onClick={() => navigate('/account-info')}>
              <span style={{ color: '#111' }}>My Account Information</span> <span style={{ fontSize: 22, color: '#aaa' }}>&#8250;</span>
            </div>
            <div className="profile-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '8px 0' }} onClick={() => setShowLangMenu(!showLangMenu)}>
              <span style={{ color: '#111' }}>Language</span> <span style={{ fontSize: 22, color: '#aaa' }}>&#8250;</span>
            </div>
            {showLangMenu && (
              <div className="profile-lang-menu" style={{ marginTop: 8, background: '#f9f9fe', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', padding: '8px 0', position: 'relative', zIndex: 2 }}>
                <div style={{ padding: '8px 18px', cursor: 'pointer', color: '#111' }} onClick={() => setShowLangMenu(false)}>English</div>
                <div style={{ padding: '8px 18px', cursor: 'pointer', color: '#111' }} onClick={() => setShowLangMenu(false)}>العربية</div>
                {/* Add more languages here */}
              </div>
            )}
          </div>
          {/* Support */}
          <div className="profile-section" style={{ background: '#fff', borderRadius: 18, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', padding: '18px 20px', marginBottom: 18 }}>
            <div style={{ fontWeight: 600, color: '#888', marginBottom: 8 }}>Support</div>
            <div className="profile-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '8px 0' }} onClick={() => navigate('/help')}>
              <span style={{ color: '#111' }}>Help</span> <span style={{ fontSize: 22, color: '#aaa' }}>&#8250;</span>
            </div>
            <div className="profile-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '8px 0' }} onClick={() => navigate('/faqs')}>
              <span style={{ color: '#111' }}>FAQs</span> <span style={{ fontSize: 22, color: '#aaa' }}>&#8250;</span>
            </div>
          </div>
          {/* Contact Us */}
          <div style={{ margin: '30px 0 10px 0', fontWeight: 600, color: '#888' }}>Contact Us</div>
          <div style={{ display: 'flex', gap: 18, justifyContent: 'center', marginBottom: 18 }}>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer"><FaTiktok size={28} style={{ color: '#000' }} /></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram size={28} style={{ color: '#000' }} /></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaXTwitter size={28} style={{ color: '#000' }} /></a>
          </div>
          {/* Logout */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10, paddingBottom: 100 }}>
            <button 
              onClick={handleLogout} 
              style={{ 
                color: '#EF4444', 
                background: 'none', 
                border: 'none',
                fontWeight: 600, 
                fontSize: 18, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: 8,
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                margin: '0 auto'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <MdLogout size={20} /> Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage; 
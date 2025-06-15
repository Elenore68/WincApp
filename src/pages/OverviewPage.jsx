import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebaseConfig";
import Button from "../components/Button";
import PremiumModal from "../components/PremiumModal";
import TextCustomizer from "../components/TextCustomizer";
import "../Auth.css";
import { IoIosArrowBack } from "react-icons/io";

const OverviewPage = () => {
  const { cardId } = useParams();
  const [card, setCard] = useState(null);
  const [template, setTemplate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  
  // Text customization state
  const [textStyles, setTextStyles] = useState({
    fontFamily: 'inherit',
    fontSize: 14,
    color: '#333'
  });
  const [showCustomizer, setShowCustomizer] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCard = async () => {
      if (!cardId) return;
      try {
        const cardDoc = await getDoc(doc(db, "cards", cardId));
        if (cardDoc.exists()) {
          const cardData = { id: cardDoc.id, ...cardDoc.data() };
          setCard(cardData);
          
          // If the card has a templateId, fetch the template data
          if (cardData.templateId) {
            const templateDoc = await getDoc(doc(db, "templates", cardData.templateId));
            if (templateDoc.exists()) {
              setTemplate({ id: templateDoc.id, ...templateDoc.data() });
            }
          }
        } else {
          console.error("Card not found");
        }
      } catch (error) {
        console.error("❌ Failed to fetch card:", error);
      }
    };
    fetchCard();
  }, [cardId]);

  if (!card)
    return (
      <div className="overview-page-container">
        <div style={{ textAlign: "center", marginTop: 60 }}>Loading...</div>
      </div>
    );

  // Use the template's thumbnail or a placeholder
  const templateImage =
    template?.thumbnailUrl || template?.ThumbnailUrl ||
    "https://via.placeholder.com/300x400?text=Card+Cover";
  const recipientImage =
    card.recipientImageUrl || "https://via.placeholder.com/60x60?text=User";

  const handleShareClick = () => {
    const user = auth.currentUser;
    if (user) {
      // Authenticated user - go directly to checkout
      navigate('/checkout', {
        state: { 
          cardId, 
          templateImage: template?.ThumbnailUrl 
        }
      });
    } else {
      // Guest user - show premium modal
      setShowPremiumModal(true);
    }
  };

  const handleJoinNow = (action = 'signin') => {
    setShowPremiumModal(false);
    const targetPath = action === 'signup' ? '/signup' : '/signin';
    navigate(targetPath, {
      state: { 
        cardId, 
        templateImage: template?.ThumbnailUrl,
        returnToCheckout: true 
      },
    });
  };

  return (
    <div className="overview-page-container" style={{ 
      height: '100vh', 
      overflow: 'hidden', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
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
          onClick={() =>
            navigate("/", {
              state: {
                openEditModal: true,
                templateId: card.templateId,
                cardData: card,
              },
            })
          }
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            flex: 1
          }}
        >
          <h2 style={{ 
            margin: 0, 
            fontWeight: 700, 
            color: "#000",
            fontSize: "24px",
            lineHeight: "1.2"
          }}>
            Overview
          </h2>
          <span
            className="overview-sub"
            style={{ 
              color: "#666", 
              fontWeight: 400, 
              fontSize: "14px",
              marginTop: "2px"
            }}
          >
            {isOpen ? "Click X to close card" : "Click card to open"}
          </span>
        </div>
      </div>
      
      <div className="overview-content" style={{
        flex: 1,
        overflow: "auto",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}>
        {!isOpen ? (
          <div
            className="overview-cover"
            onClick={() => setIsOpen(true)}
            style={{
              width: 328,
              height: 583,
              maxWidth: "100%",
              maxHeight: "calc(100vh - 200px)",
              padding: 0,
              margin: 0,
              borderRadius: 20,
              overflow: "hidden",
              background: "#fff",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              cursor: "pointer"
            }}
          >
            <img
              src={templateImage}
              alt="Card Cover"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                margin: 0,
                padding: 0,
                borderRadius: 20,
              }}
            />
          </div>
        ) : (
          <div
            className="overview-book"
            style={{
              width: 328,
              height: 480,
              maxWidth: "100%",
              maxHeight: "calc(100vh - 200px)",
              overflow: "auto",
              background: "#fff",
              borderRadius: 20,
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
              padding: "20px",
              position: "relative"
            }}
          >
            <button 
              className="modal-close" 
              onClick={() => setIsOpen(false)}
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "rgba(0,0,0,0.1)",
                border: "none",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                fontSize: "20px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#666"
              }}
            >
              &times;
            </button>
            <div className="overview-book-header" style={{ marginBottom: "16px" }}>
              <img
                src={recipientImage}
                alt="Recipient"
                className="overview-avatar"
                style={{ width: "40px", height: "40px", borderRadius: "50%", marginRight: "12px" }}
              />
              <span className="overview-recipient" style={{ fontSize: "16px", fontWeight: "500" }}>
                To: {card.name || card.recipientName}
              </span>
            </div>
            {/* Simple message label */}
            <div style={{
              marginBottom: '12px',
              paddingBottom: '8px',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <span style={{ fontSize: '12px', color: '#888', fontWeight: '500' }}>
                Message
              </span>
            </div>

            <TextCustomizer
              textStyles={textStyles}
              onStyleChange={setTextStyles}
              showCustomizer={showCustomizer}
              onToggleCustomizer={() => setShowCustomizer(!showCustomizer)}
              showToggleButton={false}
              showClearButton={false}
            />

            <div className="overview-message" style={{ 
              width: '100%', 
              maxWidth: '100%',
              fontSize: `${textStyles.fontSize}px`,
              lineHeight: "1.5",
              color: textStyles.color,
              fontFamily: textStyles.fontFamily
            }}>
              {card.message}
            </div>
            {card.videoUrl && (
              <div className="overview-video" style={{ marginTop: "16px" }}>
                <video
                  width="100%"
                  controls
                  poster={templateImage}
                  style={{ borderRadius: 12, background: "#ccc" }}
                >
                  <source src={card.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
            
            <div style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px'
            }}>
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
        )}
      </div>
      
      <div style={{ 
        padding: "20px 24px 24px 24px",
        background: "#ffffff",
        borderTop: "1px solid #f0f0f0",
        flexShrink: 0
      }}>
        <Button className="overview-share-btn" onClick={handleShareClick}>
          Share
        </Button>
      </div>
      
      <PremiumModal
        open={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onJoin={handleJoinNow}
      />
    </div>
  );
};

export default OverviewPage;

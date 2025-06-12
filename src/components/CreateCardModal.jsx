import React, { useState, useEffect } from "react";
// import { doc, getDoc, collection, addDoc } from "firebase/firestore";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { db } from "../firebaseConfig";
// import { storage } from "../firebaseConfig";
import Input from "./Input";
import Button from "./Button";
import { IoCloudUploadOutline } from "react-icons/io5";
import { FaCheck, FaTimes, FaImage, FaVideo } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "../Auth.css";
// import { getAuth } from "firebase/auth";
import { createCard } from "../api/mainPage";
import { API } from "../api/endpoints";
import { getAuthenticatedUser } from "../api/AuthApi";

// const auth = getAuth();

const CreateCardModal = ({ open, onClose, template, cardData }) => {
  // const [template, setTemplate] = useState(null);
  const [senderName, setSenderName] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [message, setMessage] = useState("");
  const [recipientImage, setRecipientImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Pre-fill fields if editing
  useEffect(() => {
    if (cardData && open) {
      setSenderName(cardData.senderName || "");
      setRecipientName(cardData.recipientName || "");
      setMessage(cardData.message || "");
      // Do not pre-fill recipientImage or video (file objects)
    } else if (open) {
      setSenderName("");
      setRecipientName("");
      setMessage("");
      setRecipientImage(null);
      setVideo(null);
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
  };

  const removeVideo = () => {
    setVideo(null);
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
    setLoading(true);

    try {
      // 🔐 Check if user is authenticated
      const userCheck = await getAuthenticatedUser();

      if (userCheck.status !== 200) {
        setLoading(false);
        alert("🚫 Please sign in to create a card.");
        return;
      }

      // 🧠 Convert files to base64
      const toBase64 = (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
        });

      let recipientImageBase64 = "";
      let videoBase64 = "";

      if (recipientImage) {
        recipientImageBase64 = await toBase64(recipientImage);
      }

      if (video) {
        videoBase64 = await toBase64(video);
      }

      // 📨 Build payload
      const payload = {
        sender: senderName,
        recipient: recipientName,
        recipient_image: recipientImageBase64 || "",
        message,
        template_id: template.id,
        ...(videoBase64 && { video: videoBase64 }),
      };

      const created = await createCard(payload);

      setLoading(false);
      onClose();
      navigate(`/overview/${created.id}`);
    } catch (err) {
      console.error("❌ Failed to create card:", err);
      setLoading(false);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        {template && (
          <>
            <div className="modal-template-info">
              <b>the {template.name}</b>
              <p
                style={{
                  color: "#aaa",
                  fontSize: "0.95em",
                  margin: "8px 0 20px 0",
                }}
              >
                {template.description}
              </p>
            </div>
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
                label="Recipient Name"
                id="recipientName"
                type="text"
                placeholder="Enter recipient name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
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
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    color: "#715AFF",
                    fontWeight: 600,
                    fontSize: "0.9em",
                  }}
                >
                  <FaImage
                    size={16}
                    style={{ marginRight: 8, verticalAlign: "middle" }}
                  />
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
                        <span className="file-size">
                          {(recipientImage.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                    <div className="preview-actions">
                      <button
                        type="button"
                        className="delete-icon-btn"
                        onClick={removeRecipientImage}
                        title="Remove file"
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          margin: 0,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.querySelector("svg").style.color =
                            "#b91c1c")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.querySelector("svg").style.color =
                            "#EF4444")
                        }
                      >
                        <MdOutlineDelete
                          size={24}
                          style={{ color: "#EF4444", display: "block" }}
                        />
                      </button>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    className="upload-btn"
                    onClick={() =>
                      document.getElementById("recipient-image-input").click()
                    }
                  >
                    <IoCloudUploadOutline
                      size={22}
                      style={{ marginRight: 8 }}
                    />
                    Upload a Recipient image
                    <input
                      id="recipient-image-input"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleRecipientImageChange}
                    />
                  </Button>
                )}
              </div>

              {/* Video Upload Section */}
              <div className="upload-section">
                <label
                  style={{
                    display: "block",
                    marginBottom: 8,
                    color: "#715AFF",
                    fontWeight: 600,
                    fontSize: "0.9em",
                  }}
                >
                  <FaVideo
                    size={16}
                    style={{ marginRight: 8, verticalAlign: "middle" }}
                  />
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
                        <span className="file-size">
                          {(video.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                    <div className="preview-actions">
                      <button
                        type="button"
                        className="delete-icon-btn"
                        onClick={removeVideo}
                        title="Remove file"
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          margin: 0,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.querySelector("svg").style.color =
                            "#b91c1c")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.querySelector("svg").style.color =
                            "#EF4444")
                        }
                      >
                        <MdOutlineDelete
                          size={24}
                          style={{ color: "#EF4444", display: "block" }}
                        />
                      </button>
                    </div>
                  </div>
                ) : (
                  <Button
                    type="button"
                    className="upload-btn outline"
                    onClick={() =>
                      document.getElementById("video-input").click()
                    }
                  >
                    <IoCloudUploadOutline
                      size={22}
                      style={{ marginRight: 8 }}
                    />
                    Upload a video (optional)
                    <input
                      id="video-input"
                      type="file"
                      accept="video/*"
                      style={{ display: "none" }}
                      onChange={handleVideoUpload}
                    />
                  </Button>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                style={{ marginTop: 16 }}
              >
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

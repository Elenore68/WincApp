import React, { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import { MdOutlineDelete } from 'react-icons/md';
import { IoMdVolumeHigh } from 'react-icons/io';
import '../Auth.css';

const VoiceRecorder = ({ 
  audioFile, 
  onAudioChange, 
  onRemoveAudio, 
  existingAudioUrl = null,
  label = "Voice Recording (Optional)" 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  
  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);
  const chunksRef = useRef([]);

  // Initialize with existing audio
  useEffect(() => {
    if (existingAudioUrl && !audioFile && !audioBlob) {
      setAudioUrl(existingAudioUrl);
    }
  }, [existingAudioUrl, audioFile, audioBlob]);

  // Clean up URLs when component unmounts
  useEffect(() => {
    return () => {
      if (audioUrl && audioUrl.startsWith('blob:')) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Try to use the best available audio format
      let options = {};
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        options.mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        options.mimeType = 'audio/webm';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        options.mimeType = 'audio/mp4';
      }
      
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        // Use the actual MIME type from the MediaRecorder
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        
        // Create a File object for upload with appropriate extension
        const extension = mimeType.includes('webm') ? 'webm' : 'wav';
        const audioFile = new File([blob], `voice-recording-${Date.now()}.${extension}`, {
          type: mimeType
        });
        onAudioChange(audioFile);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };



  const removeAudio = () => {
    if (audioUrl && audioUrl.startsWith('blob:')) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    onRemoveAudio();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Get the current audio URL for playback
  const getCurrentAudioUrl = () => {
    if (audioFile) {
      return URL.createObjectURL(audioFile);
    }
    if (audioUrl) {
      return audioUrl;
    }
    if (existingAudioUrl) {
      return existingAudioUrl;
    }
    return null;
  };

  const currentAudioUrl = getCurrentAudioUrl();
  const hasAudio = audioFile || audioBlob || existingAudioUrl;

  return (
    <div className="upload-section">
      <label style={{ 
        display: 'block', 
        marginBottom: 12, 
        color: '#715AFF', 
        fontWeight: 600, 
        fontSize: '0.9em' 
      }}>
        <IoMdVolumeHigh size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
        {label}
      </label>

      {hasAudio ? (
        <div style={{
          background: '#fff',
          border: '1px solid #e9ecef',
          borderRadius: '12px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #715AFF 0%, #8B5CF6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            flexShrink: 0
          }}>
            <IoMdVolumeHigh size={20} />
          </div>
          
          <div style={{ flex: 1, minWidth: 0 }}>
            {currentAudioUrl ? (
              <audio
                key={currentAudioUrl}
                src={currentAudioUrl}
                controls
                preload="metadata"
                style={{ 
                  width: '100%',
                  height: '40px'
                }}
                onError={(e) => {
                  console.error('Audio playback error:', e);
                }}
              />
            ) : (
              <div style={{ 
                padding: '12px', 
                background: '#f8f9fa', 
                borderRadius: '8px', 
                fontSize: '14px', 
                color: '#666',
                textAlign: 'center'
              }}>
                Audio not available
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={removeAudio}
            title="Remove audio"
            style={{
              background: 'none',
              border: 'none',
              padding: '8px',
              cursor: 'pointer',
              borderRadius: '8px',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#fee'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <MdOutlineDelete size={20} style={{ color: '#EF4444' }} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            background: isRecording 
              ? 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)' 
              : 'linear-gradient(135deg, #715AFF 0%, #8B5CF6 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '16px 20px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: isRecording 
              ? '0 4px 12px rgba(239, 68, 68, 0.3)' 
              : '0 4px 12px rgba(113, 90, 255, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = isRecording 
              ? '0 6px 16px rgba(239, 68, 68, 0.4)' 
              : '0 6px 16px rgba(113, 90, 255, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = isRecording 
              ? '0 4px 12px rgba(239, 68, 68, 0.3)' 
              : '0 4px 12px rgba(113, 90, 255, 0.3)';
          }}
        >
          {isRecording ? (
            <>
              <FaStop size={16} />
              Stop Recording ({formatTime(recordingTime)})
            </>
          ) : (
            <>
              <FaMicrophone size={16} />
              Record Voice Message
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default VoiceRecorder; 
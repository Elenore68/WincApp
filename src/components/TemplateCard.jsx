import React from 'react';
import '../Auth.css';

const TemplateCard = ({ template, onClick }) => {
  return (
    <div
      className="template-card"
      onClick={onClick}
      style={{
        cursor: 'pointer',
        width: 168,
        height: 210,
        padding: 0,
        margin: 0,
        boxSizing: 'border-box',
        borderRadius: 15,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        background: '#fff'
      }}
    >
      <img
        src={template.ThumbnailUrl}
        alt={template.Name}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          margin: 0,
          padding: 0,
          borderRadius: 15
        }}
      />
    </div>
  );
};

export default TemplateCard;

import React from 'react';
import '../Auth.css';

const TextCustomizer = ({ 
  textStyles, 
  onStyleChange, 
  showCustomizer, 
  onToggleCustomizer,
  showToggleButton = true,
  showClearButton = true 
}) => {
  // Font options
  const fontOptions = [
    { name: 'Default', value: 'inherit' },
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Times', value: 'Times New Roman, serif' },
    { name: 'Helvetica', value: 'Helvetica, sans-serif' },
    { name: 'Georgia', value: 'Georgia, serif' },
    { name: 'Verdana', value: 'Verdana, sans-serif' },
    
    // Fancy & Decorative Fonts
    { name: 'Cursive', value: 'cursive' },
    { name: 'Fantasy', value: 'fantasy' },
    { name: 'Impact', value: 'Impact, Charcoal, sans-serif' },
    { name: 'Papyrus', value: 'Papyrus, cursive' },
    { name: 'Brush Script', value: 'Brush Script MT, cursive' },
    { name: 'Lucida Handwriting', value: 'Lucida Handwriting, cursive' },
    
    // Halloween & Spooky Fonts
    { name: 'Chiller', value: 'Chiller, fantasy' },
    { name: 'Creepster', value: 'Creepster, cursive' },
    { name: 'Halloween', value: 'Trattatello, fantasy' },
    { name: 'Gothic', value: 'Old English Text MT, serif' },
    { name: 'Spooky', value: 'Bradley Hand ITC, cursive' },
    
    // Additional Fancy Options
    { name: 'Monospace', value: 'Courier New, monospace' },
    { name: 'Comic Sans', value: 'Comic Sans MS, cursive' },
    { name: 'Trebuchet', value: 'Trebuchet MS, sans-serif' }
  ];

  const defaultStyles = {
    fontFamily: 'inherit',
    fontSize: 14,
    color: '#333'
  };

  const hasCustomizations = 
    textStyles.fontFamily !== defaultStyles.fontFamily || 
    textStyles.fontSize !== defaultStyles.fontSize || 
    textStyles.color !== defaultStyles.color;

  const handleReset = () => {
    onStyleChange(defaultStyles);
  };

  return (
    <>
      {/* Text customization controls */}
      {showCustomizer && (
        <div className="text-customizer-panel" style={{ marginBottom: '16px' }}>
          {/* All controls in horizontal layout */}
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            alignItems: 'end' 
          }}>
            {/* Font selector */}
            <div style={{ flex: '1' }}>
              <label className="text-customizer-label">
                FONT
              </label>
              <select
                value={textStyles.fontFamily}
                onChange={(e) => onStyleChange({...textStyles, fontFamily: e.target.value})}
                className="text-customizer-select"
              >
                {fontOptions.map(font => (
                  <option key={font.value} value={font.value}>{font.name}</option>
                ))}
              </select>
            </div>

            {/* Size control */}
            <div style={{ flex: '1' }}>
              <label className="text-customizer-label">
                SIZE: {textStyles.fontSize}PX
              </label>
              <input
                type="range"
                min="10"
                max="24"
                value={textStyles.fontSize}
                onChange={(e) => onStyleChange({...textStyles, fontSize: parseInt(e.target.value)})}
                className="text-customizer-slider"
              />
            </div>

            {/* Color control */}
            <div>
              <label className="text-customizer-label">
                COLOR
              </label>
              <input
                type="color"
                value={textStyles.color}
                onChange={(e) => onStyleChange({...textStyles, color: e.target.value})}
                className="text-customizer-color"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bottom buttons */}
      {showToggleButton && (
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}>
          {showClearButton && hasCustomizations && (
            <button
              onClick={handleReset}
              className="text-customizer-clear"
              style={{ position: 'static' }}
            >
              Clear All
            </button>
          )}
          <button
            onClick={onToggleCustomizer}
            className="text-customizer-main-button"
          >
            Customize Text
          </button>
        </div>
      )}
    </>
  );
};

export default TextCustomizer; 
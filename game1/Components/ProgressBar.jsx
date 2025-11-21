import React from 'react';

const ProgressBar = ({ current, max, label, color = '#4ecdc4' }) => {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className="progress-bar-container">
      {label && <div className="progress-label">{label}</div>}
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{
            width: `${percentage}%`,
            backgroundColor: color
          }}
        />
      </div>
      <div className="progress-text">{current} / {max}</div>
    </div>
  );
};

export default ProgressBar;


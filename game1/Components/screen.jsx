import React from 'react';

const StartScreen = () => {
  return (
    <div className="overlay">
      <div className="overlay-content">
        <h2 className="overlay-title">Welcome!</h2>
        <p className="overlay-text">Press SPACE to Start</p>
        <p className="overlay-text">SPACE/↑ to Jump</p>
        <p className="overlay-text">← → to Move Horizontally</p>
      </div>
    </div>
  );
};

export default StartScreen;
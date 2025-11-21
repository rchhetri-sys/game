import React from 'react';

const Player = ({ x, y, size }) => {
  return (
    <div 
      className="player"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${x}px`,
        top: `${y}px`
      }}
    >
      <div className="player-inner"></div>
    </div>
  );
};

export default Player;
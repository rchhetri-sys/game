import React from 'react';

const Obstacle = ({ x, gapY, width, gameHeight, gapSize }) => {
  return (
    <>
      {/* Top Obstacle */}
      <div 
        className="obstacle"
        style={{
          left: `${x}px`,
          top: 0,
          width: `${width}px`,
          height: `${gapY}px`
        }}
      >
        <div className="obstacle-inner obstacle-top"></div>
      </div>
      
      {/* Bottom Obstacle */}
      <div 
        className="obstacle"
        style={{
          left: `${x}px`,
          top: `${gapY + gapSize}px`,
          width: `${width}px`,
          height: `${gameHeight - (gapY + gapSize)}px`
        }}
      >
        <div className="obstacle-inner obstacle-bottom"></div>
      </div>
    </>
  );
};

export default Obstacle;
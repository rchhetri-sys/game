import React from 'react';

const Trail = ({ trail, playerSize }) => {
  return (
    <>
      {trail.map((point, index) => {
        const opacity = (index + 1) / trail.length * 0.4;
        const size = playerSize * (0.3 + (index / trail.length) * 0.7);
        return (
          <div
            key={point.id}
            className="trail-point"
            style={{
              left: `${point.x}px`,
              top: `${point.y}px`,
              width: `${size}px`,
              height: `${size}px`,
              opacity: opacity
            }}
          />
        );
      })}
    </>
  );
};

export default Trail;


import React, { useState, useEffect, useRef } from 'react';

const Clouds = ({ gameState, gameWidth, gameHeight }) => {
  const [clouds, setClouds] = useState([]);
  const cloudIdRef = useRef(0);

  useEffect(() => {
    if (gameState !== 'playing') {
      setClouds([]);
      return;
    }

    // Initialize clouds
    const initialClouds = [];
    for (let i = 0; i < 5; i++) {
      initialClouds.push({
        id: cloudIdRef.current++,
        x: Math.random() * gameWidth,
        y: Math.random() * (gameHeight * 0.4),
        size: 40 + Math.random() * 60,
        speed: 0.2 + Math.random() * 0.3,
        opacity: 0.3 + Math.random() * 0.3
      });
    }
    setClouds(initialClouds);

    const interval = setInterval(() => {
      setClouds(prev => {
        return prev.map(cloud => ({
          ...cloud,
          x: cloud.x - cloud.speed
        })).filter(cloud => cloud.x > -cloud.size * 2).map(cloud => {
          if (cloud.x < -cloud.size) {
            return {
              ...cloud,
              x: gameWidth + cloud.size,
              y: Math.random() * (gameHeight * 0.4)
            };
          }
          return cloud;
        });
      });
    }, 16);

    return () => clearInterval(interval);
  }, [gameState, gameWidth, gameHeight]);

  return (
    <>
      {clouds.map(cloud => (
        <div
          key={cloud.id}
          className="cloud"
          style={{
            left: `${cloud.x}px`,
            top: `${cloud.y}px`,
            width: `${cloud.size}px`,
            height: `${cloud.size * 0.6}px`,
            opacity: cloud.opacity
          }}
        />
      ))}
    </>
  );
};

export default Clouds;


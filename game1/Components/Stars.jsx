import React, { useState, useEffect } from 'react';

const Stars = ({ gameWidth, gameHeight, gameState }) => {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    if (gameState !== 'playing') {
      setStars([]);
      return;
    }

    // Generate stars
    const newStars = [];
    for (let i = 0; i < 30; i++) {
      newStars.push({
        id: i,
        x: Math.random() * gameWidth,
        y: Math.random() * (gameHeight * 0.3),
        size: 1 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.7,
        twinkleSpeed: 1000 + Math.random() * 2000
      });
    }
    setStars(newStars);

    // Twinkle animation
    const interval = setInterval(() => {
      setStars(prev => prev.map(star => ({
        ...star,
        opacity: 0.3 + (Math.sin(Date.now() / star.twinkleSpeed) + 1) * 0.35
      })));
    }, 50);

    return () => clearInterval(interval);
  }, [gameWidth, gameHeight, gameState]);

  return (
    <>
      {stars.map(star => (
        <div
          key={star.id}
          className="star"
          style={{
            left: `${star.x}px`,
            top: `${star.y}px`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity
          }}
        />
      ))}
    </>
  );
};

export default Stars;


import React, { useState, useEffect } from 'react';

const BackgroundElements = ({ gameWidth, gameHeight, gameState }) => {
  const [elements, setElements] = useState([]);

  useEffect(() => {
    if (gameState !== 'playing') {
      setElements([]);
      return;
    }

    // Create decorative elements
    const newElements = [];
    for (let i = 0; i < 8; i++) {
      newElements.push({
        id: i,
        x: Math.random() * gameWidth,
        y: Math.random() * gameHeight,
        type: Math.random() > 0.5 ? 'circle' : 'square',
        size: 3 + Math.random() * 5,
        opacity: 0.1 + Math.random() * 0.2,
        speed: 0.1 + Math.random() * 0.2
      });
    }
    setElements(newElements);

    const interval = setInterval(() => {
      setElements(prev => prev.map(el => ({
        ...el,
        y: (el.y + el.speed) % gameHeight
      })));
    }, 16);

    return () => clearInterval(interval);
  }, [gameWidth, gameHeight, gameState]);

  return (
    <>
      {elements.map(element => (
        <div
          key={element.id}
          className={`bg-element bg-element-${element.type}`}
          style={{
            left: `${element.x}px`,
            top: `${element.y}px`,
            width: `${element.size}px`,
            height: `${element.size}px`,
            opacity: element.opacity
          }}
        />
      ))}
    </>
  );
};

export default BackgroundElements;


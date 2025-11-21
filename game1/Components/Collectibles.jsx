import React, { useState, useEffect, useRef } from 'react';

const Collectibles = ({ gameState, gameWidth, gameHeight, onCollect }) => {
  const [collectibles, setCollectibles] = useState([]);
  const collectibleIdRef = useRef(0);

  useEffect(() => {
    if (gameState !== 'playing') {
      setCollectibles([]);
      return;
    }

    const spawnCollectible = () => {
      const newCollectible = {
        id: collectibleIdRef.current++,
        x: gameWidth + 50,
        y: 50 + Math.random() * (gameHeight - 150),
        type: Math.random() > 0.7 ? 'gold' : 'silver',
        rotation: 0
      };
      setCollectibles(prev => [...prev, newCollectible]);
    };

    // Spawn collectibles periodically
    const spawnInterval = setInterval(spawnCollectible, 3000 + Math.random() * 2000);

    // Update collectibles
    const updateInterval = setInterval(() => {
      setCollectibles(prev => {
        return prev.map(collectible => ({
          ...collectible,
          x: collectible.x - 2,
          rotation: collectible.rotation + 3
        })).filter(collectible => {
          if (collectible.x < -50) return false;
          return true;
        });
      });
    }, 16);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(updateInterval);
    };
  }, [gameState, gameWidth, gameHeight]);

  // Expose collectibles for collision checking
  useEffect(() => {
    if (gameState !== 'playing') {
      window.gameCollectibles = [];
      return;
    }
    window.gameCollectibles = collectibles;
  }, [collectibles, gameState]);

  return (
    <>
      {collectibles.map(collectible => (
        <div
          key={collectible.id}
          className={`collectible collectible-${collectible.type}`}
          style={{
            left: `${collectible.x}px`,
            top: `${collectible.y}px`,
            transform: `translate(-50%, -50%) rotate(${collectible.rotation}deg)`
          }}
        >
          <div className="collectible-inner">
            {collectible.type === 'gold' ? '⭐' : '✨'}
          </div>
        </div>
      ))}
    </>
  );
};

export default Collectibles;

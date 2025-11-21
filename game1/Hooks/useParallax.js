import { useState, useEffect, useRef } from 'react';

export const useParallax = (speed = 0.5, gameState = 'playing') => {
  const [offset, setOffset] = useState(0);
  const animationRef = useRef(null);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const animate = () => {
      setOffset(prev => (prev + speed) % 100);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState, speed]);

  return offset;
};


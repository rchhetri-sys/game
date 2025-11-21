import { useState, useEffect } from 'react';

export const useScreenShake = () => {
  const [shake, setShake] = useState({ x: 0, y: 0, intensity: 0 });

  const triggerShake = (intensity = 10, duration = 300) => {
    let elapsed = 0;
    const startTime = Date.now();
    
    const shakeInterval = setInterval(() => {
      elapsed = Date.now() - startTime;
      const progress = elapsed / duration;
      
      if (progress >= 1) {
        setShake({ x: 0, y: 0, intensity: 0 });
        clearInterval(shakeInterval);
        return;
      }

      const currentIntensity = intensity * (1 - progress);
      setShake({
        x: (Math.random() - 0.5) * currentIntensity,
        y: (Math.random() - 0.5) * currentIntensity,
        intensity: currentIntensity
      });
    }, 16);

    return () => clearInterval(shakeInterval);
  };

  return { shake, triggerShake };
};


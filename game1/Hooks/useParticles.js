import { useState, useEffect, useRef } from 'react';

const PARTICLE_LIFETIME = 1000; // 1 second

export const useParticles = () => {
  const [particles, setParticles] = useState([]);
  const particleIdRef = useRef(0);

  const addParticles = (x, y, count = 10, color = '#ffd700') => {
    const newParticles = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 3;
      newParticles.push({
        id: particleIdRef.current++,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 3 + Math.random() * 4,
        life: PARTICLE_LIFETIME,
        maxLife: PARTICLE_LIFETIME
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles(prev => {
        const updated = prev.map(p => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.1, // gravity
          life: p.life - 16
        })).filter(p => p.life > 0);
        return updated;
      });
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [particles.length]);

  return { particles, addParticles };
};


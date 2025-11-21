import { useState, useEffect, useRef } from 'react';

export const useTrail = (x, y, enabled = true, maxTrailLength = 8) => {
  const [trail, setTrail] = useState([]);
  const lastPositionRef = useRef({ x, y });
  const trailUpdateRef = useRef(0);

  useEffect(() => {
    if (!enabled) {
      setTrail([]);
      return;
    }

    const distance = Math.sqrt(
      Math.pow(x - lastPositionRef.current.x, 2) + 
      Math.pow(y - lastPositionRef.current.y, 2)
    );

    // Only add trail point if moved enough
    if (distance > 2) {
      trailUpdateRef.current++;
      setTrail(prev => {
        const newTrail = [...prev, { x, y, id: trailUpdateRef.current }];
        return newTrail.slice(-maxTrailLength);
      });
      lastPositionRef.current = { x, y };
    }
  }, [x, y, enabled, maxTrailLength]);

  return trail;
};


import { useState, useEffect, useRef } from 'react';

export const useAnimation = (initialValue = 0, duration = 300) => {
  const [value, setValue] = useState(initialValue);
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const startValueRef = useRef(initialValue);
  const targetValueRef = useRef(initialValue);

  const animateTo = (targetValue) => {
    startValueRef.current = value;
    targetValueRef.current = targetValue;
    startTimeRef.current = Date.now();

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out)
      const eased = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = startValueRef.current + 
        (targetValueRef.current - startValueRef.current) * eased;
      
      setValue(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return [value, animateTo];
};


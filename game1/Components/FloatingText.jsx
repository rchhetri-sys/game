import React, { useState, useEffect, useRef } from 'react';

export const useFloatingText = () => {
  const [texts, setTexts] = useState([]);
  const textIdRef = useRef(0);

  const addText = (x, y, text, color = '#ffd700', size = 24) => {
    const newText = {
      id: textIdRef.current++,
      x,
      y,
      text,
      color,
      size,
      opacity: 1,
      life: 1000
    };
    setTexts(prev => [...prev, newText]);
  };

  useEffect(() => {
    if (texts.length === 0) return;

    const interval = setInterval(() => {
      setTexts(prev => {
        return prev.map(text => ({
          ...text,
          y: text.y - 1,
          opacity: text.life / 1000,
          life: text.life - 16
        })).filter(text => text.life > 0);
      });
    }, 16);

    return () => clearInterval(interval);
  }, [texts.length]);

  return { texts, addText };
};

const FloatingText = ({ texts }) => {
  return (
    <>
      {texts.map(text => (
        <div
          key={text.id}
          className="floating-text"
          style={{
            left: `${text.x}px`,
            top: `${text.y}px`,
            color: text.color,
            fontSize: `${text.size}px`,
            opacity: text.opacity
          }}
        >
          {text.text}
        </div>
      ))}
    </>
  );
};

export default FloatingText;


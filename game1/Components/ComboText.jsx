import React, { useState, useEffect } from 'react';

const ComboText = ({ combos }) => {
  return (
    <>
      {combos.map(combo => (
        <div
          key={combo.id}
          className="combo-text"
          style={{
            left: `${combo.x}px`,
            top: `${combo.y}px`,
            fontSize: `${combo.size}px`,
            color: combo.color
          }}
        >
          {combo.text}
        </div>
      ))}
    </>
  );
};

export default ComboText;


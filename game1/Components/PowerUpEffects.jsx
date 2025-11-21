import React, { useState, useEffect } from 'react';

const PowerUpEffects = ({ activeEffects }) => {
  return (
    <>
      {activeEffects.map(effect => (
        <div
          key={effect.id}
          className={`power-up-effect power-up-${effect.type}`}
          style={{
            left: `${effect.x}px`,
            top: `${effect.y}px`
          }}
        >
          <div className="power-up-ring"></div>
        </div>
      ))}
    </>
  );
};

export default PowerUpEffects;

